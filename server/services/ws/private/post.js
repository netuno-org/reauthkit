import { _db, _ws } from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import friend from "#core/lib/friend.js";

const dbProfile = profile.getLogged();

_db.form("profile_ws_session")
  .set("profile_id", dbProfile.getInt("id"))
  .set("session_id", _ws.sessionId())
  .insert();

friend.notifyAllWithStatusChanged(dbProfile, true)
