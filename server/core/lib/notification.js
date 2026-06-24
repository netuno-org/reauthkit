import {_db, _push, _val} from "@netuno/server-types";

export default {
  create: (dbProfile, typeCode, title, content, extra) => {
    const dbType = _db.form("notification_type")
      .where(
        _db.where("active").equal(true)
          .and("code").equal(typeCode)
      ).first();

    const dbSubscriptions = _db.form("notification_subscription")
      .where(
        _db.where("active").equal(true)
          .and("profile_id").equal(dbProfile.getInt("id"))
      ).all();

    const dbNotificationInsert = _db.form("notification")
      .set("profile_id", dbProfile.getInt("id"))
      .set("type_id", dbType.getInt("id"))
      .set("title", title)
      .set("content", content)
      .set("sent_at", _db.timestamp());
    if (extra) {
      dbNotificationInsert.set("extra", extra);
    }
    dbNotificationInsert.debug(true);
    dbNotificationInsert.insert();

    const push = _push.init();
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
      if (state.expired()) {
        _db.form("notification_subscription")
          .where(_db.where("id").equal(dbSubscription.getInt("id")))
          .set("active", false)
          .update();
      }
    }
  }
};