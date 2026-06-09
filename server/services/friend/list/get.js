import {_db, _user, _val, _out} from "@netuno/server-types";

import profile from "#core/lib/profile.js";

const dbProfile = profile.getLogged();

const dbFriends = _db.query(`
    SELECT profile.uid, profile.name, profile.avatar, msg.latest_message, msg.unread_messages,
        (SELECT COUNT(id) FROM profile_ws_session WHERE profile_id = profile.id) AS "sessions"
    FROM friend
        LEFT JOIN (
            SELECT to_profile_id, from_profile_id, (
                    SELECT sent_on
                    FROM message AS m
                    WHERE m.to_profile_id = message.to_profile_id
                      AND m.from_profile_id = message.from_profile_id
                    ORDER BY sent_on DESC
                    LIMIT 1
                ) AS latest_message, COUNT(id) AS unread_messages
            FROM message
            WHERE to_profile_id = ?
                AND read_on IS NULL
            GROUP BY to_profile_id, from_profile_id
        ) AS msg ON msg.from_profile_id = friend.profile_id
        INNER JOIN profile ON friend.friend_profile_id = profile.id
    WHERE friend.profile_id = ?
    ORDER BY msg.latest_message DESC NULLS LAST
`, dbProfile.getInt("id"), dbProfile.getInt("id"));

const friends = _val.list();

for (const dbFriend of dbFriends) {
  friends.add(
    _val.map()
      .set("uid", dbFriend.getString("uid"))
      .set("name", dbFriend.getString("name"))
      .set("avatar", dbFriend.getString("avatar") !== '')
      .set("online", dbFriend.getInt("sessions") > 0)
      .set("latest_message", dbFriend.getSQLTimestamp("latest_message"))
      .set("unread_messages", dbFriend.getInt("unread_messages"))
  );
}

_out.json(friends);
