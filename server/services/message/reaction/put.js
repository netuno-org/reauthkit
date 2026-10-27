import { _db, _val, _out, _req, _exec } from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbLoggedInProfile = profile.getLoggedIn();
const messageUid = _req.getString("uid");
const reaction = _req.getString("reaction", "");

const dbMessage = message.getByUid(messageUid);

if (!dbMessage) {
  _out.json(_val.map().set("result", false).set("error", "message-not-found"));
  _exec.stop();
}

if (dbMessage.getInt("to_profile_id") !== dbLoggedInProfile.getInt("id")) {
  _out.json(_val.map().set("result", false).set("error", "unauthorized"));
  _exec.stop();
}

let cleanReaction = reaction ? reaction.replace(/\uFE0F/g, "") : "";

_db.form("message")
  .set("reaction", cleanReaction)
  .where(_db.where("id").equal(dbMessage.getInt("id")))
  .update();

const dbMessageUpdated = _db.form("message")
  .where(_db.where("id").equal(dbMessage.getInt("id")))
  .first();

const dbProfileFrom = _db.get("profile", dbMessage.getInt("from_profile_id"));

const formattedMessage = message.toData(dbProfileFrom, dbLoggedInProfile, dbMessageUpdated);

if (dbProfileFrom) {
  profile.wsSendAsService(
    dbProfileFrom,
    _val.map()
      .set("method", "PUT")
      .set("service", "message")
      .set(
        "data",
        _val.map()
          .set("with", dbLoggedInProfile.getString("uid"))
      )
      .set("content", formattedMessage)
  );
}

profile.wsSendAsService(
  dbLoggedInProfile,
  _val.map()
    .set("method", "PUT")
    .set("service", "message")
    .set(
      "data",
      _val.map()
        .set("with", dbProfileFrom ? dbProfileFrom.getString("uid") : "")
    )
    .set("content", formattedMessage)
);

_out.json(
  _val.map().set("result", true).set("content", formattedMessage)
);
