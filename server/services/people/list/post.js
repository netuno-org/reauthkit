import { _db, _val, _out, _req, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";

const dbProfileLogged = profile.getLogged();

if (!dbProfileLogged) {
  _out.json(
    _val.map()
      .set("items", _val.list())
      .set("page", 1)
      .set("pageSize", 12)
      .set("total", 0)
  );
  _exec.stop();
}

const page = _req.getInt("page", 1);
const pageSize = _req.getInt("pageSize", 12);
const search = _req.getString("search", "").trim();
const loggedProfileId = dbProfileLogged.getInt("id");

let querySql = `
  SELECT profile.id, profile.uid, profile.name, profile.avatar, profile.email,
         netuno_user.user, netuno_group.code AS "group",
         (SELECT COUNT(id) FROM profile_ws_session WHERE profile_id = profile.id) AS "sessions"
  FROM profile
  INNER JOIN netuno_user ON profile.profile_user_id = netuno_user.id
  INNER JOIN netuno_group ON netuno_user.group_id = netuno_group.id
  WHERE profile.active = true AND profile.id != ?
`;

let countSql = `
  SELECT COUNT(profile.id) AS total
  FROM profile
  INNER JOIN netuno_user ON profile.profile_user_id = netuno_user.id
  WHERE profile.active = true AND profile.id != ?
`;

let params = [loggedProfileId];
let countParams = [loggedProfileId];

if (search !== "") {
  const searchPattern = `%${search.toLowerCase()}%`;
  querySql += ` AND (LOWER(profile.name) LIKE ? OR LOWER(netuno_user.user) LIKE ? OR LOWER(profile.email) LIKE ?) `;
  countSql += ` AND (LOWER(profile.name) LIKE ? OR LOWER(netuno_user.user) LIKE ? OR LOWER(profile.email) LIKE ?) `;
  params.push(searchPattern, searchPattern, searchPattern);
  countParams.push(searchPattern, searchPattern, searchPattern);
}

querySql += ` ORDER BY profile.name ASC LIMIT ? OFFSET ? `;
const offset = (page - 1) * pageSize;
params.push(pageSize, offset);

const dbTotal = _db.queryFirst(countSql, ...countParams);
const total = dbTotal ? dbTotal.getInt("total", 0) : 0;

const dbPeople = _db.query(querySql, ...params);
const items = _val.list();

if (dbPeople) {
  for (const person of dbPeople) {
    items.add(
      _val.map()
        .set("uid", person.getString("uid"))
        .set("name", person.getString("name"))
        .set("username", person.getString("user"))
        .set("email", person.getString("email"))
        .set("avatar", person.getString("avatar") !== "")
        .set("group", person.getString("group"))
        .set("online", person.getInt("sessions") > 0)
    );
  }
}

_out.json(
  _val.map()
    .set("items", items)
    .set("page", page)
    .set("pageSize", pageSize)
    .set("total", total)
);
