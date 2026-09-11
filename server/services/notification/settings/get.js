import { _val, _out, _db } from "@netuno/server-types";
import profile from "#core/lib/profile.js";

const dbProfile = profile.getLogged();

if (!dbProfile) {
  _out.json(_val.map().set("result", false).set("error", "not-logged"));
} else {
  let dbTypes = _db.query(`SELECT id, code, name FROM notification_type ORDER BY id ASC`);
  if (!dbTypes || dbTypes.size() === 0) {
    _db.form("notification_type")
      .set("code", "message")
      .set("name", "Mensagens")
      .set("active", true)
      .insert();
    dbTypes = _db.query(`SELECT id, code, name FROM notification_type ORDER BY id ASC`);
  }
  
  const dbSettings = _db.query(`
    SELECT type_id, active FROM notification_settings WHERE profile_id = ?
  `, dbProfile.getInt("id"));

  const settingsMap = new Map();
  for (const s of dbSettings) {
    settingsMap.set(s.getInt("type_id"), s.getBoolean("active", true));
  }

  const items = _val.list();
  for (const t of dbTypes) {
    const typeId = t.getInt("id");
    const code = t.getString("code");
    const name = t.getString("name");
    
    const enabled = settingsMap.has(typeId) ? settingsMap.get(typeId) : true;

    items.add(
      _val.map()
        .set("id", typeId)
        .set("code", code)
        .set("name", name)
        .set("enabled", enabled)
    );
  }

  _out.json(
    _val.map()
      .set("result", true)
      .set("data", items)
  );
}
