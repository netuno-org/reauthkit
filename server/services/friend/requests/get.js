import { _db, _val, _out, _header, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";

const dbProfile = profile.getLogged();

if (!dbProfile) {
  _header.status(401);
  _out.json(_val.map().set("result", false).set("error", "unauthorized"));
  _exec.stop();
}

const loggedId = dbProfile.getInt("id");

const dbFriends = _db.query(`
  SELECT profile.uid, profile.name, profile.email, profile.avatar,
         friend.accepted_on,
         (SELECT COUNT(id) FROM profile_ws_session WHERE profile_id = profile.id) AS "sessions"
  FROM friend
  INNER JOIN profile ON friend.friend_profile_id = profile.id
  WHERE friend.profile_id = ? AND friend.accepted_on IS NOT NULL
  ORDER BY profile.name ASC
`, loggedId);

const friendsList = _val.list();
if (dbFriends) {
  for (const f of dbFriends) {
    friendsList.add(
      _val.map()
        .set("uid", f.getString("uid"))
        .set("name", f.getString("name"))
        .set("email", f.getString("email"))
        .set("avatar", f.getString("avatar") !== "")
        .set("online", f.getInt("sessions") > 0)
        .set("accepted_on", f.getSQLTimestamp("accepted_on"))
    );
  }
}

const dbReceived = _db.query(`
  SELECT profile.uid, profile.name, profile.email, profile.avatar,
         friend.request_on,
         (SELECT COUNT(id) FROM profile_ws_session WHERE profile_id = profile.id) AS "sessions"
  FROM friend
  INNER JOIN profile ON friend.profile_id = profile.id
  WHERE friend.friend_profile_id = ? AND friend.accepted_on IS NULL
  ORDER BY friend.request_on DESC
`, loggedId);

const receivedList = _val.list();
if (dbReceived) {
  for (const r of dbReceived) {
    receivedList.add(
      _val.map()
        .set("uid", r.getString("uid"))
        .set("name", r.getString("name"))
        .set("email", r.getString("email"))
        .set("avatar", r.getString("avatar") !== "")
        .set("online", r.getInt("sessions") > 0)
        .set("request_on", r.getSQLTimestamp("request_on"))
    );
  }
}

const dbSent = _db.query(`
  SELECT profile.uid, profile.name, profile.email, profile.avatar,
         friend.request_on,
         (SELECT COUNT(id) FROM profile_ws_session WHERE profile_id = profile.id) AS "sessions"
  FROM friend
  INNER JOIN profile ON friend.friend_profile_id = profile.id
  WHERE friend.profile_id = ? AND friend.accepted_on IS NULL
  ORDER BY friend.request_on DESC
`, loggedId);

const sentList = _val.list();
if (dbSent) {
  for (const s of dbSent) {
    sentList.add(
      _val.map()
        .set("uid", s.getString("uid"))
        .set("name", s.getString("name"))
        .set("email", s.getString("email"))
        .set("avatar", s.getString("avatar") !== "")
        .set("online", s.getInt("sessions") > 0)
        .set("request_on", s.getSQLTimestamp("request_on"))
    );
  }
}

_out.json(
  _val.map()
    .set("result", true)
    .set("friends", friendsList)
    .set("received", receivedList)
    .set("sent", sentList)
);
