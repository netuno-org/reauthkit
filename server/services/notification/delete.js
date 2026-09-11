import { _db, _val, _out, _req, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import notification from "#core/lib/notification.js";

const dbProfileLogged = profile.getLogged();

if (!dbProfileLogged) {
  _out.json(_val.map().set("result", false).set("error", "not-logged"));
  _exec.stop();
}

const uid = _req.getString("uid");

if (!uid) {
  _out.json(_val.map().set("result", false).set("error", "missing-uid"));
  _exec.stop();
}

const dbNotification = _db.form("notification")
  .where(
    _db.where("uid").equal(uid)
      .and("profile_id").equal(dbProfileLogged.getInt("id"))
  )
  .first();

if (!dbNotification) {
  _out.json(_val.map().set("result", false).set("error", "not-found"));
  _exec.stop();
}

_db.form("notification")
  .where(_db.where("id").equal(dbNotification.getInt("id")))
  .set("active", false)
  .update();

const totalUnread = notification.getUnreadTotal(dbProfileLogged);

profile.wsSendService(
  dbProfileLogged,
  _val.map()
    .set("service", "notification/unread/count")
    .set("content", _val.map().set("total", totalUnread))
);

_out.json(
  _val.map()
    .set("result", true)
    .set("total", totalUnread)
);
