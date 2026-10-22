import { _db, _val } from "@netuno/server-types";

_db.insertIfNotExists(
  "notification_type",
  _val.map().set("name", "Amigos").set("code", "friend").set("active", true)
);
