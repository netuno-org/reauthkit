import { _val, _out, _exec } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import notification from "#core/lib/notification.js";

const dbLoggedInProfile = profile.getLoggedIn();

_out.json(
  _val.map()
    .set("total", notification.getUnreadTotal(dbLoggedInProfile))
);
