import {_db, _val} from "@netuno/server-types";

export default {
  getByUID: (uid) => {
    return _db.form("message")
      .where(_db.where("uid").equal(uid))
      .first();
  },
  getUnreadTotal: (dbProfile) => {
    if (!dbProfile) return 0;
    const dbDisabledSetting = _db.queryFirst(`
      SELECT ns.id FROM notification_settings ns
      INNER JOIN notification_type nt ON ns.type_id = nt.id
      WHERE ns.profile_id = ? AND nt.code = 'message' AND ns.active = false
    `, dbProfile.getInt("id"));
    if (dbDisabledSetting) {
      return 0;
    }
    const dbMessagesUnread = _db.queryFirst(`
      SELECT COUNT(id) AS total FROM message WHERE to_profile_id = ? AND read_at IS NULL
    `, dbProfile.getInt("id"));
    return dbMessagesUnread ? dbMessagesUnread.getInt("total", 0) : 0;
  },
  toData: (dbProfileFrom, dbProfileTo, dbMessage) => {
    const data = _val.map()
      .set("uid", dbMessage.getString("uid"))
      .set("from", dbProfileFrom.getString("uid"))
      .set("to", dbProfileTo.getString("uid"))
      .set("message", dbMessage.getString("message"))
      .set("sent_at", dbMessage.getSQLTimestamp("sent_at"))
      .set("read_at", dbMessage.getSQLTimestamp("read_at"))
      .set("deleted_at", dbMessage.getSQLTimestamp("deleted_at"))
      .set("active", dbMessage.getBoolean("active", true))
      .set("edited_at", dbMessage.getSQLTimestamp("edited_at"))
      .set("reaction", dbMessage.getString("reaction"));

    const parentId = dbMessage.getInt("parent_id", 0);
    if (parentId > 0) {
      const dbParentMessage = _db.form("message")
        .where(_db.where("id").equal(parentId))
        .first();
      if (dbParentMessage) {
        const parentFromId = dbParentMessage.getInt("from_profile_id", 0);
        const dbParentProfile = parentFromId > 0
          ? _db.form("profile").where(_db.where("id").equal(parentFromId)).first()
          : null;
        data.set("parent", _val.map()
          .set("uid", dbParentMessage.getString("uid"))
          .set("message", dbParentMessage.getString("message"))
          .set("from", dbParentProfile ? dbParentProfile.getString("name") : "")
        );
      }
    }
    return data;
  }
}
