import { _db, _val, _out, _req, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import notification from "#core/lib/notification.js";

const dbLoggedInProfile = profile.getLoggedIn();

const all = _req.getBoolean("all", false);
const uid = _req.getString("uid");

if (all) {
  _db.execute(`
    UPDATE notification SET read_at = CURRENT_TIMESTAMP
    WHERE profile_id = ?::int AND read_at IS NULL AND active = true
  `, dbLoggedInProfile.getInt("id"));
} else if (uid) {
  const dbNotification = _db.form("notification")
    .where(
      _db.where("uid").equal(uid)
        .and("profile_id").equal(dbLoggedInProfile.getInt("id"))
    )
    .first();

  if (dbNotification && !dbNotification.getString("read_at")) {
    _db.form("notification")
      .where(_db.where("id").equal(dbNotification.getInt("id")))
      .set("read_at", _db.timestamp())
      .update();
  }
}

const totalUnread = notification.getUnreadTotal(dbLoggedInProfile);

profile.wsSendService(
  dbLoggedInProfile,
  _val.map()
    .set("service", "notification/unread/count")
    .set("content", _val.map().set("total", totalUnread))
);

_out.json(
  _val.map()
    .set("result", true)
    .set("total", totalUnread)
);
