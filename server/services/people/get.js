const dbPeople = _db.queryFirst(`
  SELECT *
  FROM people
  WHERE people_user_id = ?::int
`, _user.id);

const data = _val.map()
      .set("name", dbPeople.getString("name"))
      .set("email", dbPeople.getString("email"))
      .set("username", _user.get(_user.id()).getString("user"));

_out.json(
  _val.map()
    .set("result", true)
    .set("data", data)
);
