import {_db} from "@netuno/server-types";

export default {
    getUnreadTotal: (dbPeople) => {
        const dbMessagesUnread = _db.queryFirst(`
            SELECT COUNT(id) AS total FROM message WHERE to_people_id = ? AND read_on IS NULL
        `, dbPeople.getInt("id"))
        return dbMessagesUnread.getInt("total", 0)
    }
}
