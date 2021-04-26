let response = _val.map();

const name = _req.getString("name");
const username = _req.getString("username");
const mail = _req.getString("mail");
const password = _req.getString("password");

const userEmailExists = _user.firstByMail(mail);
const usernameExists = _user.firstByUser(username);

if (userEmailExists || usernameExists) {
    _header.status(409);
    _out.json(_val.map().set("result", false).set("error", "already-exists"));
} else {
    const dbNetunoGroup = _group.firstByCode("client");

    const clientData = _val.map().set("name", name)
        .set("user", username)
        .set("pass", password)
        .set("mail", mail)
        .set("active", true)
        .set("group_id", dbNetunoGroup.getInt("id"));

    const user_id = _user.create(clientData);

    _db.insertIfNotExists(
        'client',
        _val.map().set("name", name)
            .set("email", mail)
            .set("client_user_id", user_id)
    );

    response.set("result", true);
    
    _out.json(response);
}
