import { _db, _val, _out, _req, _header, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import notification from "#core/lib/notification.js";

const dbProfileFrom = profile.getLogged();

if (!dbProfileFrom) {
  _header.status(401);
  _out.json(_val.map().set("result", false).set("error", "unauthorized"));
  _exec.stop();
}

const targetUID = _req.getString("uid", _req.getString("to", "")).trim();

if (!targetUID) {
  _header.status(400);
  _out.json(_val.map().set("result", false).set("error", "missing-uid"));
  _exec.stop();
}

const dbProfileTo = profile.getByUID(targetUID);

if (!dbProfileTo) {
  _header.status(404);
  _out.json(_val.map().set("result", false).set("error", "user-not-found"));
  _exec.stop();
}

const fromId = dbProfileFrom.getInt("id");
const toId = dbProfileTo.getInt("id");

_db.execute(
  "UPDATE friend SET accepted_on = ? WHERE profile_id = ? AND friend_profile_id = ?",
  _db.timestamp(), toId, fromId
);

const reciprocal = _db.queryFirst("SELECT id FROM friend WHERE profile_id = ? AND friend_profile_id = ?", fromId, toId);
if (!reciprocal) {
  _db.form("friend")
    .set("profile_id", fromId)
    .set("friend_profile_id", toId)
    .set("request_on", _db.timestamp())
    .set("accepted_on", _db.timestamp())
    .insert();
} else {
  _db.execute("UPDATE friend SET accepted_on = ? WHERE id = ?", _db.timestamp(), reciprocal.getInt("id"));
}

notification.create(
  dbProfileTo,
  "friend",
  dbProfileFrom.getString("name"),
  "Aceitou o seu pedido de amizade.",
  _val.map()
    .set("with", dbProfileFrom.getString("uid"))
    .set("type", "friend_accepted")
    .toJSON()
);

_out.json(_val.map().set("result", true).set("status", "friend"));
