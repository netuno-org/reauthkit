import {_db, _user, _val, _out} from "@netuno/server-types";

const dbFriends = _db.query(`
    SELECT friend.uid, profile.name, profile.avatar, msg.latest_message, msg.unread_messages
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
`, _user.id, _user.id);

const friends = _val.list();

const dbProfiles = _db.form(`profile`).all();

for (const dbProfile of dbProfiles) {
  friends.add(
    _val.map()
      .set("uid", dbProfile.getString("uid"))
      .set("name", dbProfile.getString("name"))
      .set("avatar", dbProfile.getString("avatar") !== '')
  );
}

_out.json(friends);
