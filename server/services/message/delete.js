import { _db, _val, _out, _req, _exec } from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const messageUid = _req.getString("uid");

const dbProfileLogged = profile.getLogged();

const dbMessage = message.getByUID(messageUid);

if (!dbMessage) {
  _out.json(_val.map().set("result", false).set("error", "message-not-found"));
  _exec.stop();
}

if (dbMessage.getInt("from_profile_id") !== dbProfileLogged.getInt("id")) {
  _out.json(_val.map().set("result", false).set("error", "unauthorized"));
  _exec.stop();
}

const dbProfileTo = _db.get("profile", dbMessage.getInt("to_profile_id"));

_db.form("message")
  .set("deleted_at", _db.timestamp())
  .set("active", false)
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
      .set("method", "DELETE")
      .set("service", "message")
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
    .set("method", "DELETE")
    .set("service", "message")
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
