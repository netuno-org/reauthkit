import {_db, _val, _out, _req} from "@netuno/server-types";

import people from "#core/lib/people.js";
import message from "#core/lib/message.js";

const dbPeopleFrom = people.getLogged()
const dbPeopleTo = people.getByUID(_req.getString("to"))
const inputMessage = _req.getString("message")

_db.form("message")
    .set("from_people_id", dbPeopleFrom.getInt("id"))
    .set("to_people_id", dbPeopleTo.getInt("id"))
    .set("message", inputMessage)
    .set("sent_on", _db.timestamp())
    .insert()

people.wsSendService(
    dbPeopleTo,
    _val.map()
        .set("service", "message/unread/count")
)

people.wsSendService(
    dbPeopleTo,
    _val.map()
        .set("method", "POST")
        .set("service", "message/list")
        .set(
            "data",
            _val.map()
                .set("with", dbPeopleFrom.getString("uid"))
        )
)

_out.json(
    _val.map()
        .set("result", true)
)
