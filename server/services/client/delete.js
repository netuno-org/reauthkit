
const dbClient = _db.queryFirst(`
    SELECT * FROM client WHERE client_user_id = ?::int
`, _val.list().add( _user.id ));

if (dbClient) {

    /**_db.execute(`
        DELETE FROM domain WHERE client_id = ?::int
    `, _val.list().add(dbClient.getInt("id")));*/

    _db.delete(
        "client",
        dbClient.getInt("id")
    );

    _user.remove(dbClient.getInt("client_user_id"));

    _out.json(_val.map().set("result", true));
} else {
    _out.output(404);
    _out.json(_val.map().set("result", false).set("error", "dont-exist"));
}

