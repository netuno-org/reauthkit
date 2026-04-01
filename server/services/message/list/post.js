import {_db, _val, _out, _req, _ws, _exec } from "@netuno/server-types";

import people from "#core/lib/people.js";

const dbPeopleLogged = people.getLogged()
const dbPeopleFriend = people.getByUID(_req.getString("with"))

const dbMessagesPage = _db.form("message")
    .where(
        _db.where()
            .and(
                _db.where("from_people_id").equal(dbPeopleLogged.getInt("id"))
                    .or("from_people_id").equal(dbPeopleFriend.getInt("id"))
            )
            .and(
                _db.where("to_people_id").equal(dbPeopleLogged.getInt("id"))
                    .or("to_people_id").equal(dbPeopleFriend.getInt("id"))
            )
    ).order("sent_on", "desc")
    .debug(true)
    .page(1, 10)

const messages = _val.list()

for (const dbMessage of dbMessagesPage.getList("items")) {
    let dbPeopleFrom = dbPeopleLogged;
    let dbPeopleTo = dbPeopleFriend;
    if (dbMessage.getInt("from_people_id") === dbPeopleFriend.getInt("id")) {
        dbPeopleFrom = dbPeopleFriend;
        dbPeopleTo = dbPeopleLogged;
    }
    messages.add(
        _val.map()
            .set("uid", dbMessage.getString("uid"))
            .set("from", dbPeopleFrom.getString("uid"))
            .set("to", dbPeopleTo.getString("uid"))
            .set("message", dbMessage.getString("message"))
            .set("sent_on", dbMessage.getSQLTimestamp("sent_on"))
            .set("read_on", dbMessage.getSQLTimestamp("read_on"))
    )
}

_out.json(
    messages
)
