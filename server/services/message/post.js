import {_db, _val, _out, _req} from "@netuno/server-types";

import profile from "#core/lib/profile.js";

const dbProfileFrom = profile.getLogged();
const dbProfileTo = profile.getByUID(_req.getString("to"));
const inputMessage = _req.getString("message");

_db.form("message")
  .set("from_profile_id", dbProfileFrom.getInt("id"))
  .set("to_profile_id", dbProfileTo.getInt("id"))
  .set("message", inputMessage)
  .set("sent_on", _db.timestamp())
  .insert();

profile.wsSendService(
  dbProfileTo,
  _val.map()
    .set("service", "message/unread/count")
);

profile.wsSendService(
  dbProfileTo,
  _val.map()
    .set("method", "POST")
    .set("service", "message/list")
    .set(
      "data",
      _val.map()
        .set("with", dbProfileFrom.getString("uid"))
    )
);

_out.json(
  _val.map()
    .set("result", true)
);
