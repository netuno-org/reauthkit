import { _req, _db, _out, _val } from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbLoggedInProfile = profile.getLoggedIn();
const dbProfileFrom = profile.getByUid(_req.getString("from"));
const dbMessage = message.getByUid(_req.getString("uid"));

if (dbMessage && dbProfileFrom) {
  const updatedCount = _db.execute(`
    UPDATE message SET read_at = CURRENT_TIMESTAMP
    WHERE read_at IS NULL AND id = ?::int AND from_profile_id = ?::int
  `, dbMessage.getInt("id"), dbProfileFrom.getInt("id"));

  if (updatedCount > 0) {
    profile.wsSendService(
      dbLoggedInProfile,
      _val.map()
        .set("service", "message/unread/count")
        .set("content", _val.map().set("total", message.getUnreadTotal(dbLoggedInProfile)))
    );
    profile.wsSendService(
      dbLoggedInProfile,
      _val.map()
        .set("service", "message/participant/list")
    );
    profile.wsSendAsService(
      dbProfileFrom,
      _val.map()
        .set("method", "PUT")
        .set("service", "message/read")
        .set("data", _val.map().set("with", dbLoggedInProfile.getString("uid")))
        .set("content", _val.map().set("uid", dbMessage.getString("uid")).set("read_at", _db.timestamp()))
    );
  }
}

_out.json(
  _val.map()
    .set("result", true)
    .set("from", dbProfileFrom ? dbProfileFrom.getString("uid") : "")
);
