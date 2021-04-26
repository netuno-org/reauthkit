const user = _db.queryFirst(`
    SELECT * FROM client
    WHERE client.client_user_id = ?::int
`, _val.list().add(_user.id));

const userData = _val.map()
    .set("name", user.getString("name"))
    .set("email", user.getString("email"))
    .set("username", _user.get(_user.id()).getString("user"));

_out.json(_val.map().set("result", true).set("data", _val.list().add(userData)));