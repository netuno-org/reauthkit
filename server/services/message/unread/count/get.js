import { _val, _out } from "@netuno/server-types";

import people from "#core/lib/people.js";
import message from "#core/lib/message.js";

const dbPeopleLogged = people.getLogged()

_out.json(
    _val.map()
        .set("total", message.getUnreadTotal(dbPeopleLogged))
)