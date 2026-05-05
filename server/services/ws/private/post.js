import { _db, _ws } from "@netuno/server-types";

import profile from "#core/lib/profile.js";

const dbProfile = profile.getLogged();

_db.form("people_ws_session")
  .set("people_id", dbProfile.getInt("id"))
  .set("session_id", _ws.sessionId())
  .insert();
