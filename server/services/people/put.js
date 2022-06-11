
const name = _req.getString("name");
const username = _req.getString("username");
const email = _req.getString("email");
const password = _req.getString("password");

const dbPeople = _db.queryFirst(`
  SELECT * FROM people WHERE people_user_id = ?::int
`, _user.id());

const userData = _user.get(_user.id());
userData
  .set("name", name)
  .set("user", username)
  .set("mail", email);

if (password.length > 0) {
  userData.set("pass", password);
  _user.update(
    _user.id(),
    userData,
    true
  );
} else {
  _user.update(
    _user.id(),
    userData
  );
}

_db.update(
  "people",
  dbPeople.getInt("id"),
  _val.init()
    .set("name", name)
    .set("email", email)
);

_out.json(
  _val.map()
    .set("result", true)
);
