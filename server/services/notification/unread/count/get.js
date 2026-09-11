import { _val, _out } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import notification from "#core/lib/notification.js";

const dbProfileLogged = profile.getLogged();

if (!dbProfileLogged) {
  _out.json(_val.map().set("total", 0));
} else {
  _out.json(
    _val.map()
      .set("total", notification.getUnreadTotal(dbProfileLogged))
  );
}
