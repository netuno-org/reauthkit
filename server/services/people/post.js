const name = _req.getString("name");
const username = _req.getString("username");
const email = _req.getString("email");
const password = _req.getString("password");

const userEmailExists = _user.firstByMail(email);
const usernameExists = _user.firstByUser(username);

if (userEmailExists || usernameExists) {
  _header.status(409);
  _out.json(
    _val.map()
      .set("error", `${userEmailExists ? 'email' : 'user'}-already-exists`)
  );
} else {
  const dbNetunoGroup = _group.firstByCode("people");

  const userData = _val.map()
        .set("name", name)
        .set("user", username)
        .set("pass", password)
        .set("mail", email)
        .set("active", true)
        .set("group_id", dbNetunoGroup.getInt("id"));

  const user_id = _user.create(userData);

  _db.insertIfNotExists(
    'people',
    _val.map()
      .set("name", name)
      .set("email", email)
      .set("people_user_id", user_id)
  );
  
  _out.json(
    _val.map()
      .set("result", true)
  );
}
