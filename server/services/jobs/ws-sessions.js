
import { _db, _ws, _out, _val } from "@netuno/server-types";

const dbWsSessions = _db.form("profile_ws_session")
  .all();

for (const dbWsSession of dbWsSessions) {
  const wsSession = _ws.session(dbWsSession.getString("session_id"));
  if (wsSession === null) {
    _db.form("profile_ws_session")
      .where(_db.where("id").equal(dbWsSession.getInt("id")))
      .delete();
  }
}

_out.json(
  _val.map()
    .set("result", true)
);
