import { _db, _ws } from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import friend from "#core/lib/friend.js";

const dbProfile = profile.getLogged();

_db.form("profile_ws_session")
  .where(_db.where("session_id").equal(_ws.sessionId()))
  .delete();

friend.notifyAllWithStatusChanged(dbProfile, false)
