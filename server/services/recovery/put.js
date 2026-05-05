import {_req, _db, _user, _header, _val, _out} from "@netuno/server-types";

const dbProfile = _db.queryFirst(`
  SELECT * 
  FROM profile
  WHERE recovery_key = ?
    AND recovery_limit >= CURRENT_TIMESTAMP
`, _req.getString("key"));

if (dbProfile != null) {
  const userData = _user.get(dbProfile.getInt("profile_user_id"))
    .set("no_pass", false)
    .set("pass", _req.getString("password"));
  _user.update(userData, true);
  _out.json(
    _val.map()
      .set("result", true)
  );
} else {
  _header.status(404);
  _out.json(
    _val.map()
      .set("error", "user-not-found")
  );
}
