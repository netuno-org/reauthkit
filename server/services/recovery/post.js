let response = _val.map();

const dbClient = _db.queryFirst(`
  select * 
  from client
  where recovery_key = ?
    and recovery_limit >= current_timestamp
`, _req.getString("key"));

if (dbClient != null) {
    _user.update(
        _val.map()
            .set("id", dbClient.getInt("client_user_id"))
            .set("pass", _req.getString("password"))
        , true
    );

    response.set("result", true);
    
    _out.json(response);
} else {
    _header.status(404);
    _out.json(_val.map().set("result", false).set("error", "user-not-found"));
}