import {_req, _val, _db, _crypto, _time, _uid, _smtp, _template, _header, _out, _storage} from "@netuno/server-types";

const email = _req.getString("email");

const dbProfile = _db.form("profile")
  .where(_db.where("email").equal(email))
  .first();

if (dbProfile != null && dbProfile.getBoolean("active")) {
  const recoveryKey = _crypto.sha512(_uid.generate());
  const recoveryLimit = _time.localDateTime().plusDays(1);
  _db.update(
    "profile",
    dbProfile.getInt("id"),
    _val.map()
      .set("recovery_key", recoveryKey)
      .set("recovery_limit", _db.timestamp(recoveryLimit))
  );
  dbProfile.set("recovery_key", recoveryKey);
  dbProfile.set("recovery_link", `${_header.getString("Origin")}/recovery#${recoveryKey}`);

  const smtp = _smtp.init();
  smtp.to = dbProfile.getString("email");
  smtp.subject = `ReAuthKit - Recuperação de password`;
  smtp.text = `
    Caro ${dbProfile.getString("name")},

    Para fazer a recuperação da password clique neste link: ${dbProfile.getString("recovery_link")}
    Obrigado,
    netuno.org
  `;
  smtp.html = _template.getOutput(
    "recovery-mail", dbProfile
  );
  smtp.attachment(
    "logo.png",
    "image/png",
    _storage.filesystem("server", "images", "mail-logo.png").file(),
    "logo"
  );
  smtp.send();
  _out.json(
    _val.map().set("result", true)
  );
} else if (dbProfile != null && !dbProfile.getBoolean("active")) {
  _header.status(409);
  _out.json(
    _val.map()
      .set("error", "user-not-active")
  );
} else {
  _header.status(404);
  _out.json(
    _val.map()
      .set("error", "not-exists")
  );
}
