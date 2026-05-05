import { _db, _ws } from "@netuno/server-types";

_db.form("profile_ws_session")
  .where(_db.where("session_id").equal(_ws.sessionId()))
  .delete();
