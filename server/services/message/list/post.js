import {_db, _val, _out, _req} from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbProfileLogged = profile.getLogged();
const dbProfileFriend = profile.getByUID(_req.getString("with"));
const page = _req.getInt("page", 1);
const pageSize = _req.getInt("pageSize", 10);

if (page === 1) {
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
    profile.wsSendAsService(
      dbProfileFriend,
      _val.map()
        .set("method", "PUT")
        .set("service", "message/read")
        .set("data", _val.map().set("with", dbProfileLogged.getString("uid")))
        .set("content", _val.map().set("all", true).set("read_at", _db.timestamp()))
    );
  }
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
  .page(page, pageSize);

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
  _val.map()
    .set("items", messages.reversed())
    .set("page", page)
    .set("total", dbMessagesPage.getInt("total", 0))
);

