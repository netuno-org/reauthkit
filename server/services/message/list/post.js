import {_db, _val, _out, _req} from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbProfileLogged = profile.getLogged();
const dbProfileFriend = profile.getByUID(_req.getString("with"));

const totalMessagesMarkedAsRead = _db.execute(`
  UPDATE message SET read_at = CURRENT_TIMESTAMP
  WHERE read_at IS NULL AND from_profile_id = ?::int AND to_profile_id = ?::int
`, dbProfileFriend.getInt("id"), dbProfileLogged.getInt("id"));

if (totalMessagesMarkedAsRead > 0) {
  profile.wsSendService(
    dbProfileLogged,
    _val.map()
      .set("service", "message/unread/count")
  );
  profile.wsSendService(
    dbProfileLogged,
    _val.map()
      .set("service", "friend/list")
  );
}

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
  ).order("sent_at", "desc")
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
      message.toData(dbProfileFrom, dbProfileTo, dbMessage)
    );
}

_out.json(
  messages.reversed()
);
