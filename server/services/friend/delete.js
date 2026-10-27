import { _db, _val, _out, _req, _header, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";

const targetUid = _req.getString("uid");

const dbProfileFrom = profile.getLogged();
const dbProfileTo = profile.getByUid(targetUid);

if (!dbProfileTo) {
  _header.status(404);
  _out.json(_val.map().set("result", false).set("error", "user-not-found"));
  _exec.stop();
}

const toId = dbProfileTo.getInt("id");
const fromId = dbProfileFrom.getInt("id");
const toUid = dbProfileTo.getString("uid"); // não usar targetUid na query para evitar SQL injection
const fromUid = dbProfileFrom.getString("uid");

const dbToNotification = _db.queryFirst(`
    SELECT id
    FROM notification
    WHERE 
        profile_id = ${fromId}
        AND
        extra like '{"type":"friend_%","with":"${toUid}"}'
  `);

if (dbToNotification) {
  _db.delete("notification", dbToNotification.getInt("id"));
}

const dbFromNotification = _db.queryFirst(`
    SELECT id
    FROM notification
    WHERE 
        profile_id = ${toId}
        AND
        extra like '{"type":"friend_%","with":"${fromUid}"}'
  `);

if (dbFromNotification) {
  _db.delete("notification", dbFromNotification.getInt("id"));
}

_db.execute(
  "DELETE FROM friend WHERE (profile_id = ? AND friend_profile_id = ?) OR (profile_id = ? AND friend_profile_id = ?)",
  fromId, toId, toId, fromId
);

_out.json(_val.map().set("result", true).set("status", "none"));
