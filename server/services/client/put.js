
const mail = _req.getString("mail");
const nif = _req.getString("nif");

const dbClient = _db.queryFirst(`
    SELECT * FROM client WHERE client_user_id = ?::int
`, _val.list().add( _user.id() ));

_db.update(
    "client",
    dbClient.getInt("id"),
    _val.init()
        .set("mail", mail)
        .set("nif", nif)
);

_out.json( _val.map().set("result", true) );