import { _db, _val } from "@netuno/server-types";

_db.insertIfNotExists(
  "notification_type",
  _val.map()
    .set("code", "message")
    .set("name", "Mensagens")
    .set("active", true)
);

_db.insertIfNotExists(
  "notification_type",
  _val.map()
    .set("code", "friend")
    .set("name", "Amigos")
    .set("active", true)
);
