import { _db, _val, _out, _req, _header, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";

const targetUID = _req.getString("uid", _req.getString("to", "")).trim();

const dbProfileFrom = profile.getLogged();

if (!dbProfileFrom) {
  _header.status(401);
  _out.json(_val.map().set("result", false).set("error", "unauthorized"));
  _exec.stop();
}

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

const toId = dbProfileTo.getInt("id");
const fromId = dbProfileFrom.getInt("id");
const toUID = dbProfileTo.getString("uid"); // não usar targetUID na query para evitar SQL injection
const fromUID = dbProfileFrom.getString("uid");

const dbNotification = _db.queryFirst(`
    SELECT id
    FROM notification
    WHERE 
        profile_id = ${toId}
        AND
        extra like '{"type":"friend_%","with":"${fromUID}"}'
    OR
        profile_id = ${fromId}
        AND
        extra like '{"type":"friend_%","with":"${toUID}"}'
  `);

if (dbNotification) {
  _db.delete("notification", dbNotification.getInt("id"));
}

_db.execute(
  "DELETE FROM friend WHERE (profile_id = ? AND friend_profile_id = ?) OR (profile_id = ? AND friend_profile_id = ?)",
  fromId, toId, toId, fromId
);

_out.json(_val.map().set("result", true).set("status", "none"));
