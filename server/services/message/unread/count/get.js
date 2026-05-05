import { _val, _out } from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbProfileLogged = profile.getLogged();

_out.json(
  _val.map()
    .set("total", message.getUnreadTotal(dbProfileLogged))
);
