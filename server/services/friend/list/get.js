import {_db, _user, _val, _out} from '@netuno/server-types'

const dbFriends = _db.query(`
    SELECT friend.uid, people.name, people.avatar, msg.latest_message, msg.unread_messages
    FROM friend
        LEFT JOIN (
            SELECT to_people_id, from_people_id, (
                    SELECT sent_on
                    FROM message AS m
                    WHERE m.to_people_id = message.to_people_id
                      AND m.from_people_id = message.from_people_id
                    ORDER BY sent_on DESC
                    LIMIT 1
                ) AS latest_message, COUNT(id) AS unread_messages
            FROM message
            WHERE to_people_id = ?
                AND read_on IS NULL
            GROUP BY to_people_id, from_people_id
        ) AS msg ON msg.from_people_id = friend.friend_id
        INNER JOIN people ON friend.friend_id = people.id
    WHERE friend.people_id = ?
    ORDER BY msg.latest_message DESC NULLS LAST
`, _user.id, _user.id)

const friends = _val.list()

const dbCrowd = _db.form(`people`).all()

for (const dbPeople of dbCrowd) {
    friends.add(
        _val.map()
            .set("uid", dbPeople.getString("uid"))
            .set("name", dbPeople.getString("name"))
            .set("avatar", dbPeople.getString("avatar") !== '')
    )
}


_out.json(friends)
