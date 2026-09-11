import {_db, _push, _val} from "@netuno/server-types";
import profile from "#core/lib/profile.js";

const notification = {
  create: (dbProfile, typeCode, title, content, extra) => {
    try {
      let dbType = _db.queryFirst("SELECT id, code, name FROM notification_type WHERE code = ? AND active = true", typeCode);
      if (!dbType) {
        _db.insertIfNotExists(
          "notification_type",
          _val.map().set("code", typeCode),
          _val.map().set("name", typeCode === "message" ? "Mensagens" : typeCode).set("code", typeCode).set("active", true)
        );
        dbType = _db.queryFirst("SELECT id, code, name FROM notification_type WHERE code = ?", typeCode);
      }

      if (dbType) {
        const dbSetting = _db.queryFirst(
          "SELECT id, active FROM notification_settings WHERE profile_id = ? AND type_id = ?",
          dbProfile.getInt("id"), dbType.getInt("id")
        );
        if (dbSetting && dbSetting.getBoolean("active", true) === false) {
          return;
        }
      }

      const typeId = dbType ? dbType.getInt("id") : 0;
      const dbNotificationInsert = _db.form("notification")
        .set("profile_id", dbProfile.getInt("id"))
        .set("type_id", typeId)
        .set("title", title)
        .set("content", content)
        .set("sent_at", _db.timestamp());
      if (extra) {
        dbNotificationInsert.set("extra", extra);
      }
      const insertResult = dbNotificationInsert.insert();
      const notificationId = insertResult ? (typeof insertResult.getInt === "function" ? insertResult.getInt("id", 0) : insertResult) : 0;

      const dbNotification = notificationId > 0
        ? _db.queryFirst("SELECT id, uid, title, content, sent_at, read_at, extra, type_id FROM notification WHERE id = ?", notificationId)
        : null;

      try {
        const dbSubscriptions = _db.query(
          "SELECT id, endpoint, p256dh, auth FROM notification_subscription WHERE active = true AND profile_id = ?",
          dbProfile.getInt("id")
        );
        const push = _push.init();
        if (push && dbSubscriptions) {
          for (const dbSubscription of dbSubscriptions) {
            const state = push.send(
              _val.map()
                .set("title", title)
                .set("body", content)
                .set(
                  "data",
                  _val.map()
                    .set("type", typeCode)
                    .set("extra", extra)
                ).toJSON(),
              dbSubscription.getString("endpoint"),
              dbSubscription.getString("p256dh"),
              dbSubscription.getString("auth")
            );
            if (state && state.expired()) {
              _db.execute("UPDATE notification_subscription SET active = false WHERE id = ?", dbSubscription.getInt("id"));
            }
          }
        }
      } catch (e) {
      }

      const totalUnread = notification.getUnreadTotal(dbProfile);
      profile.wsSendService(
        dbProfile,
        _val.map()
          .set("service", "notification/unread/count")
          .set("content", _val.map().set("total", totalUnread))
      );

      if (dbNotification) {
        profile.wsSendService(
          dbProfile,
          _val.map()
            .set("service", "notification/new")
            .set("content", notification.toData(dbNotification))
        );
      }
    } catch (err) {
      console.error("Error creating notification:", err);
    }
  },
  isEnabled: (dbProfile, typeCode) => {
    if (!dbProfile) return true;
    const dbType = _db.queryFirst("SELECT id FROM notification_type WHERE code = ? AND active = true", typeCode);
    if (!dbType) return true;

    const dbSetting = _db.queryFirst(
      "SELECT id, active FROM notification_settings WHERE profile_id = ? AND type_id = ?",
      dbProfile.getInt("id"), dbType.getInt("id")
    );

    if (dbSetting && dbSetting.getBoolean("active", true) === false) {
      return false;
    }
    return true;
  },
  getUnreadTotal: (dbProfile) => {
    if (!dbProfile) return 0;
    const dbUnread = _db.queryFirst(`
      SELECT COUNT(n.id) AS total
      FROM notification n
      LEFT JOIN notification_type nt ON n.type_id = nt.id
      LEFT JOIN notification_settings ns ON ns.type_id = nt.id AND ns.profile_id = n.profile_id
      WHERE n.profile_id = ?
        AND n.read_at IS NULL
        AND n.active = true
        AND (ns.id IS NULL OR ns.active = true)
    `, dbProfile.getInt("id"));
    return dbUnread ? dbUnread.getInt("total", 0) : 0;
  },
  toData: (dbNotification) => {
    if (!dbNotification) return null;
    const data = _val.map()
      .set("uid", dbNotification.getString("uid", ""))
      .set("title", dbNotification.getString("title", ""))
      .set("content", dbNotification.getString("content", ""))
      .set("sent_at", dbNotification.getSQLTimestamp("sent_at"))
      .set("read_at", dbNotification.getSQLTimestamp("read_at"))
      .set("extra", dbNotification.getString("extra", ""));
    const typeId = dbNotification.getInt("type_id", 0);
    if (typeId > 0) {
      const dbType = _db.queryFirst("SELECT code, name FROM notification_type WHERE id = ?", typeId);
      if (dbType) {
        data.set("type", _val.map()
          .set("code", dbType.getString("code", ""))
          .set("name", dbType.getString("name", ""))
        );
      }
    }
    return data;
  }
};

export default notification;