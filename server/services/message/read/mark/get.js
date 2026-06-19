import {_req, _db, _out, _val} from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbProfileFrom = profile.getByUID(_req.getString("from"));

const dbMessage = message.getByUID(_req.getString("uid"));

_db.execute(`
  UPDATE message SET read_at = CURRENT_TIMESTAMP
  WHERE read_at IS NULL AND id = ?::int AND from_profile_id = ?::int
`, dbMessage.getInt("id"), dbProfileFrom.getInt("id"));

_out.json(
  _val.map()
    .set("result", true)
    .set("from", dbProfileFrom.getString("uid"))
);

