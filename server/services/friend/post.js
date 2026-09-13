import { _db, _val, _out, _req, _header, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import notification from "#core/lib/notification.js";

const dbProfileFrom = profile.getLogged();

if (!dbProfileFrom) {
  _header.status(401);
  _out.json(_val.map().set("result", false).set("error", "unauthorized"));
  _exec.stop();
}

const targetUID = _req.getString("to", _req.getString("uid", "")).trim();

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

if (fromId === toId) {
  _header.status(400);
  _out.json(_val.map().set("result", false).set("error", "cannot-friend-self"));
  _exec.stop();
}

const existingFriend = _db.queryFirst(`
  SELECT id, profile_id, friend_profile_id, accepted_on
  FROM friend
  WHERE (profile_id = ? AND friend_profile_id = ?) OR (profile_id = ? AND friend_profile_id = ?)
`, fromId, toId, toId, fromId);

if (existingFriend) {
  if (existingFriend.getString("accepted_on", "") !== "") {
    _out.json(_val.map().set("result", true).set("status", "friend"));
    _exec.stop();
  }
  if (existingFriend.getInt("profile_id") === fromId) {
    _out.json(_val.map().set("result", true).set("status", "pending_sent"));
    _exec.stop();
  }
  _db.execute("UPDATE friend SET accepted_on = ? WHERE id = ?", _db.timestamp(), existingFriend.getInt("id"));
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
  _out.json(_val.map().set("result", true).set("status", "friend"));
  _exec.stop();
}

_db.form("friend")
  .set("profile_id", fromId)
  .set("friend_profile_id", toId)
  .set("request_on", _db.timestamp())
  .insert();

notification.create(
  dbProfileTo,
  "friend",
  dbProfileFrom.getString("name"),
  "Enviou-lhe um pedido de amizade.",
  _val.map()
    .set("with", dbProfileFrom.getString("uid"))
    .set("type", "friend_request")
    .toJSON()
);

_out.json(_val.map().set("result", true).set("status", "pending_sent"));
