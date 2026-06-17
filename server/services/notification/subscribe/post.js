
import {_req, _db, _val, _out, _header, _exec} from "@netuno/server-types";

import profile from "#core/lib/profile.js";

const dbProfile = profile.getLogged();

if (!dbProfile) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "not-exist")
  );
  _exec.stop();
}

const endpoint = _req.getString("endpoint");
const keys = _req.getValues("keys");
const p256dh = keys.getString("p256dh");
const auth = keys.getString("auth");

_db.store(
  "notification_subscription",
  _val.map()
    .set("profile_id", dbProfile.getInt("id"))
    .set("endpoint", endpoint)
    .set("p256dh", p256dh)
    .set("auth", auth)
)

_out.json(
  _val.map()
    .set("result", true)
)
