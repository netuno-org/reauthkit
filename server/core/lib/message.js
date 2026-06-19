import {_db, _val} from "@netuno/server-types";

export default {
  getByUID: (uid) => {
    return _db.form("message")
      .where(_db.where("uid").equal(uid))
      .first();
  },
  getUnreadTotal: (dbProfile) => {
    const dbMessagesUnread = _db.queryFirst(`
      SELECT COUNT(id) AS total FROM message WHERE to_profile_id = ? AND read_on IS NULL
    `, dbProfile.getInt("id"))
    return dbMessagesUnread.getInt("total", 0)
  },
  toData: (dbProfileFrom, dbProfileTo, dbMessage) => {
    return _val.map()
      .set("uid", dbMessage.getString("uid"))
      .set("from", dbProfileFrom.getString("uid"))
      .set("to", dbProfileTo.getString("uid"))
      .set("message", dbMessage.getString("message"))
      .set("sent_on", dbMessage.getSQLTimestamp("sent_on"))
      .set("read_on", dbMessage.getSQLTimestamp("read_on"));
  }
}
