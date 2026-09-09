import {_db, _val, _out, _req} from "@netuno/server-types";

import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbProfileFrom = profile.getLogged();
const dbProfileTo = profile.getByUID(_req.getString("to"));
const inputMessage = _req.getString("message");
const parentUid = _req.getString("parent_uid", "");

let parentId = 0;
if (parentUid !== "") {
  const dbParentMessage = _db.form("message")
    .where(_db.where("uid").equal(parentUid))
    .first();
  if (dbParentMessage) {
    parentId = dbParentMessage.getInt("id");
  }
}

const dbMessageInserted = _db.form("message")
  .set("from_profile_id", dbProfileFrom.getInt("id"))
  .set("to_profile_id", dbProfileTo.getInt("id"))
  .set("message", inputMessage)
  .set("parent_id", parentId)
  .set("sent_at", _db.timestamp())
  .insert();

const dbMessage = _db.form("message")
  .where(_db.where("id").equal(dbMessageInserted.getInt("id")))
  .first();

const formattedMessage = message.toData(dbProfileFrom, dbProfileTo, dbMessage);

profile.wsSendAsService(
  dbProfileTo,
  _val.map()
    .set("method", "POST")
    .set("service", "message/new")
    .set(
      "data",
      _val.map()
        .set("with", dbProfileFrom.getString("uid"))
    )
    .set(
      "content",
      formattedMessage
    )
);

_out.json(
  _val.map()
    .set("result", true)
    .set("content", formattedMessage)
);
