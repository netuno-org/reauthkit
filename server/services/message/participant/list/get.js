import { _db, _user, _val, _out } from "@netuno/server-types";

import profile from "#core/lib/profile.js";

const dbProfile = profile.getLoggedIn();

const dbParticipants = _db.query(`
SELECT 
    p.uid, 
    p.name, 
    p.avatar,
    c.latest_message_moment, 
    c.unread_messages_count,
    (SELECT COUNT(id) FROM profile_ws_session WHERE profile_id = p.id) AS active_ws_sessions
FROM profile AS p
INNER JOIN (
    SELECT 
        raw_msg.peer_profile_id,
        MAX(raw_msg.sent_at) AS latest_message_moment,
        COUNT(CASE WHEN raw_msg.to_profile_id = ? AND raw_msg.read_at IS NULL THEN 1 END) AS unread_messages_count
    FROM (
        SELECT 
            to_profile_id,
            read_at,
            sent_at,
            CASE WHEN from_profile_id = ? THEN to_profile_id ELSE from_profile_id END AS peer_profile_id
        FROM message
        WHERE to_profile_id = ? OR from_profile_id = ?
    ) AS raw_msg
    GROUP BY raw_msg.peer_profile_id
) AS c ON p.id = c.peer_profile_id
ORDER BY c.latest_message_moment DESC NULLS LAST;

`,
  dbProfile.getInt("id"),
  dbProfile.getInt("id"),
  dbProfile.getInt("id"),
  dbProfile.getInt("id"));

const participants = _val.list();

for (const dbParticipant of dbParticipants) {
  participants.add(
    _val.map()
      .set("uid", dbParticipant.getString("uid"))
      .set("name", dbParticipant.getString("name"))
      .set("avatar", dbParticipant.getString("avatar") !== "")
      .set("online", dbParticipant.getInt("active_ws_sessions") > 0)
      .set("latest_message", dbParticipant.getSQLTimestamp("latest_message_moment"))
      .set("unread_messages", dbParticipant.getInt("unread_messages_count", 0))
  );
}

_out.json(participants);
