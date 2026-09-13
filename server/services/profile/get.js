import {_db, _req, _val, _header, _exec, _out} from "@netuno/server-types";

import profile from "#core/lib/profile.js";

let profileUID = _req.getUID("uid");

if (!profileUID) {
  const dbProfile = profile.getLogged();
  profileUID = dbProfile.getUID("uid");
}

const fullData = profile.getFullDataByUID(profileUID);

if (!fullData) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "not-exist")
  );
  _exec.stop();
}

const dbProfileLogged = profile.getLogged();
if (dbProfileLogged) {
  const loggedId = dbProfileLogged.getInt("id");
  const targetProfile = profile.getByUID(profileUID);
  if (targetProfile) {
    const targetId = targetProfile.getInt("id");
    if (loggedId === targetId) {
      fullData.set("friendship_status", "self");
    } else {
      const dbFriend = _db.queryFirst(`
        SELECT id, profile_id, friend_profile_id, accepted_on
        FROM friend
        WHERE (profile_id = ? AND friend_profile_id = ?) OR (profile_id = ? AND friend_profile_id = ?)
      `, loggedId, targetId, targetId, loggedId);

      if (dbFriend) {
        if (dbFriend.getString("accepted_on", "") !== "") {
          fullData.set("friendship_status", "friend");
        } else if (dbFriend.getInt("profile_id") === loggedId) {
          fullData.set("friendship_status", "pending_sent");
        } else {
          fullData.set("friendship_status", "pending_received");
        }
      } else {
        fullData.set("friendship_status", "none");
      }
    }
  }
}

_out.json(
  _val.map()
    .set("result", true)
    .set("data", fullData)
);
