import { _db, _val, _out, _req, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import notification from "#core/lib/notification.js";

const dbProfileLogged = profile.getLogged();

if (!dbProfileLogged) {
  _out.json(
    _val.map()
      .set("items", _val.list())
      .set("page", 1)
      .set("pageSize", 10)
      .set("total", 0)
  );
  _exec.stop();
}

const page = _req.getInt("page", 1);
const pageSize = _req.getInt("pageSize", 10);
const onlyUnread = _req.getBoolean("unread", false);
const profileId = dbProfileLogged.getInt("id");

let querySql = `
  SELECT id, uid, title, content, sent_at, read_at, extra, type_id
  FROM notification
  WHERE profile_id = ? AND active = true
`;

let countSql = `
  SELECT COUNT(id) AS total
  FROM notification
  WHERE profile_id = ? AND active = true
`;

if (onlyUnread) {
  querySql += ` AND read_at IS NULL `;
  countSql += ` AND read_at IS NULL `;
}

querySql += ` ORDER BY sent_at DESC LIMIT ? OFFSET ? `;

const dbTotal = _db.queryFirst(countSql, profileId);
const total = dbTotal ? dbTotal.getInt("total", 0) : 0;

const offset = (page - 1) * pageSize;
const dbNotifications = _db.query(querySql, profileId, pageSize, offset);

const items = _val.list();

if (dbNotifications) {
  for (const dbNotification of dbNotifications) {
    items.add(notification.toData(dbNotification));
  }
}

_out.json(
  _val.map()
    .set("items", items)
    .set("page", page)
    .set("pageSize", pageSize)
    .set("total", total)
);
