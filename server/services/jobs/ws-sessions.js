
import {_db, _ws, _out, _val} from "@netuno/server-types";

const dbWSSessions = _db.form("profile_ws_session")
  .all();

for (const dbWSSession of dbWSSessions) {
  const wsSession = _ws.session(dbWSSession.getString("session_id"));
  if (wsSession === null) {
    _db.form("profile_ws_session")
      .where(_db.where("id").equal(dbWSSession.getInt("id")))
      .delete();
  }
}

_out.json(
  _val.map()
    .set("result", true)
);
