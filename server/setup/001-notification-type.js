import { _db, _val } from "@netuno/server-types";

_db.insertIfNotExists(
  "notification_type",
  _val.map().set("code", "message"),
  _val.map().set("name", "Mensagens").set("code", "message").set("active", true)
);
