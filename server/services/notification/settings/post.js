import { _val, _out, _db, _req } from "@netuno/server-types";
import profile from "#core/lib/profile.js";
import message from "#core/lib/message.js";

const dbProfile = profile.getLogged();

if (!dbProfile) {
  _out.json(_val.map().set("result", false).set("error", "not-logged"));
} else {
  const typeCode = _req.getString("code");
  const enabled = _req.getBoolean("enabled", true);

  let dbType = _db.form("notification_type")
    .where(_db.where("code").equal(typeCode))
    .first();

  if (!dbType) {
    _db.form("notification_type")
      .set("code", typeCode)
      .set("name", typeCode === "message" ? "Mensagens" : typeCode)
      .set("active", true)
      .insert();

    dbType = _db.form("notification_type")
      .where(_db.where("code").equal(typeCode))
      .first();
  }

  if (!dbType) {
    _out.json(_val.map().set("result", false).set("error", "type-not-found"));
  } else {
    const typeId = dbType.getInt("id");
    const profileId = dbProfile.getInt("id");

    const existingSetting = _db.form("notification_settings")
      .where(
        _db.where("profile_id").equal(profileId)
          .and("type_id").equal(typeId)
      )
      .first();

    if (existingSetting) {
      _db.form("notification_settings")
        .where(_db.where("id").equal(existingSetting.getInt("id")))
        .set("active", enabled)
        .update();
    } else {
      _db.form("notification_settings")
        .set("profile_id", profileId)
        .set("type_id", typeId)
        .set("active", enabled)
        .insert();
    }

    profile.wsSendService(
      dbProfile,
      _val.map()
        .set("service", "message/unread/count")
        .set("content", _val.map().set("total", message.getUnreadTotal(dbProfile)))
    );

    _out.json(
      _val.map()
        .set("result", true)
        .set("code", typeCode)
        .set("enabled", enabled)
    );
  }
}
