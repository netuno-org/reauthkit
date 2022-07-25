const dbPeople = _db.queryFirst(`
  SELECT *
  FROM people
  WHERE people_user_id = ?::int
`, _user.id);

if (!dbPeople) {
  _header.status(404)
  _exec.stop()
}

const data = _val.map()
      .set("uid", dbPeople.getString("uid"))
      .set("name", dbPeople.getString("name"))
      .set("email", dbPeople.getString("email"))
      .set("username", _user.get(_user.id()).getString("user"))
      .set("avatar", dbPeople.getString("avatar") != '')

_out.json(
  _val.map()
    .set("result", true)
    .set("data", data)
);
