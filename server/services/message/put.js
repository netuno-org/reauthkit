import {_db, _val, _out, _req, _exec} from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbProfileLogged = profile.getLogged();
const messageUid = _req.getString("uid");
const updatedContent = _req.getString("message");

if (!messageUid || !updatedContent || updatedContent.trim() === "") {
  _out.json(_val.map().set("result", false).set("error", "invalid_input"));
  _exec.stop();
}

const dbMessage = message.getByUID(messageUid);

if (!dbMessage) {
  _out.json(_val.map().set("result", false).set("error", "message_not_found"));
  _exec.stop();
}

if (dbMessage.getInt("from_profile_id") !== dbProfileLogged.getInt("id")) {
  _out.json(_val.map().set("result", false).set("error", "unauthorized"));
  _exec.stop();
}

const sentTime = dbMessage.getSQLTimestamp("sent_at").getTime();
const currentTime = new Date().getTime();
if (currentTime - sentTime > 3600000) {
  _out.json(_val.map().set("result", false).set("error", "edit_time_expired"));
  _exec.stop();
}

const dbProfileTo = _db.get("profile", dbMessage.getInt("to_profile_id"));

_db.form("message")
  .set("message", updatedContent)
  .set("edited_at", _db.timestamp())
  .where(_db.where("id").equal(dbMessage.getInt("id")))
  .update();

const dbMessageUpdated = _db.form("message")
  .where(_db.where("id").equal(dbMessage.getInt("id")))
  .first();

const formattedMessage = message.toData(dbProfileLogged, dbProfileTo, dbMessageUpdated);

if (dbProfileTo) {
  profile.wsSendAsService(
    dbProfileTo,
    _val.map()
      .set("method", "PUT")
      .set("service", "message/edit")
      .set(
        "data",
        _val.map()
          .set("with", dbProfileLogged.getString("uid"))
      )
      .set("content", formattedMessage)
  );
}

profile.wsSendAsService(
  dbProfileLogged,
  _val.map()
    .set("method", "PUT")
    .set("service", "message/edit")
    .set(
      "data",
      _val.map()
        .set("with", dbProfileTo ? dbProfileTo.getString("uid") : "")
    )
    .set("content", formattedMessage)
);

_out.json(
  _val.map().set("result", true).set("content", formattedMessage)
);
