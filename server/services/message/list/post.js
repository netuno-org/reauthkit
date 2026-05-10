import {_db, _val, _out, _req} from "@netuno/server-types";

import profile from "#core/lib/profile.js";

const dbProfileLogged = profile.getLogged();
const dbProfileFriend = profile.getByUID(_req.getString("with"));

const dbMessagesPage = _db.form("message")
  .where(
    _db.where()
      .and(
        _db.where("from_profile_id").equal(dbProfileLogged.getInt("id"))
          .or("from_profile_id").equal(dbProfileFriend.getInt("id"))
      )
      .and(
        _db.where("to_profile_id").equal(dbProfileLogged.getInt("id"))
          .or("to_profile_id").equal(dbProfileFriend.getInt("id"))
      )
  ).order("sent_on", "desc")
  .debug(true)
  .page(1, 10);

const messages = _val.list();

for (const dbMessage of dbMessagesPage.getList("items")) {
    let dbProfileFrom = dbProfileLogged;
    let dbProfileTo = dbProfileFriend;
    if (dbMessage.getInt("from_profile_id") === dbProfileFriend.getInt("id")) {
      dbProfileFrom = dbProfileFriend;
      dbProfileTo = dbProfileLogged;
    }
    messages.add(
      _val.map()
        .set("uid", dbMessage.getString("uid"))
        .set("from", dbProfileFrom.getString("uid"))
        .set("to", dbProfileTo.getString("uid"))
        .set("message", dbMessage.getString("message"))
        .set("sent_on", dbMessage.getSQLTimestamp("sent_on"))
        .set("read_on", dbMessage.getSQLTimestamp("read_on"))
    );
}

_out.json(
  messages.reversed()
);
