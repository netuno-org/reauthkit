import { _db, _val, _out, _req, _exec } from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const withUid = _req.getString("with");
const page = _req.getInt("page", 1);
const pageSize = _req.getInt("pageSize", 10);

const dbLoggedInProfile = profile.getLoggedIn();
const dbFriendProfile = withUid ? profile.getByUid(withUid) : null;

if (page === 1) {
  const totalMessagesMarkedAsRead = _db.execute(`
    UPDATE message SET read_at = CURRENT_TIMESTAMP
    WHERE read_at IS NULL AND from_profile_id = ?::int AND to_profile_id = ?::int
  `,
    dbFriendProfile.getInt("id"),
    dbLoggedInProfile.getInt("id")
  );

  if (totalMessagesMarkedAsRead > 0) {
    profile.wsSendService(
      dbLoggedInProfile,
      _val.map()
        .set("service", "message/unread/count")
        .set("content", _val.map().set("total", message.getUnreadTotal(dbLoggedInProfile)))
    );
    profile.wsSendService(
      dbLoggedInProfile,
      _val.map()
        .set("service", "friend/list")
    );
    profile.wsSendAsService(
      dbFriendProfile,
      _val.map()
        .set("method", "PUT")
        .set("service", "message/read")
        .set("data", _val.map().set("with", dbLoggedInProfile.getString("uid")))
        .set("content", _val.map().set("all", true).set("read_at", _db.timestamp()))
    );
  }
}

const dbMessagesPage = _db.form("message")
  .where(
    _db.where()
      .and(
        _db.where("from_profile_id").equal(dbLoggedInProfile.getInt("id"))
          .or("from_profile_id").equal(dbFriendProfile.getInt("id"))
      )
      .and(
        _db.where("to_profile_id").equal(dbLoggedInProfile.getInt("id"))
          .or("to_profile_id").equal(dbFriendProfile.getInt("id"))
      )
  ).order("sent_at", "desc")
  .page(page, pageSize);

const messages = _val.list();

for (const dbMessage of dbMessagesPage.getList("items")) {
  let dbProfileFrom = dbLoggedInProfile;
  let dbProfileTo = dbFriendProfile;
  if (dbMessage.getInt("from_profile_id") === dbFriendProfile.getInt("id")) {
    dbProfileFrom = dbFriendProfile;
    dbProfileTo = dbLoggedInProfile;
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
