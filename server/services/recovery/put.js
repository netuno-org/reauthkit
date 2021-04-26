const mail = _req.getString("mail");
const dbClient = _db.findFirst(
    "client",
    _val.map()
        .set(
            "where",
            _val.map()
                .set("email", mail)
        )
);

if (dbClient != null && dbClient.getBoolean("active")) {
    const recoveryKey = _crypto.sha512(_uid.generate());
    const recoveryLimit = _time.localDateTime().plusDays(1);
    _db.update(
        "client",
        dbClient.getInt("id"),
        _val.map()
            .set("recovery_key", recoveryKey)
            .set("recovery_limit", _db.timestamp(recoveryLimit))
    );
    dbClient.set("recovery_key", recoveryKey);
    dbClient.set("recovery_link", `${_header.getString("Origin")}/recovery#${recoveryKey}`);

    const smtp = _smtp.init();
    smtp.to = dbClient.getString("email");
    smtp.subject = `REACT-AUTH - Recuperação de password`;
    smtp.text = `
    Caro ${dbClient.getString("name")},

    Para fazer a recuperação da password clique neste link: ${dbClient.getString("recovery_link")}
    Obrigado,
    www.tarsiu.com
    `;
    smtp.html = _template.getOutput(
        "recovery-mail", dbClient
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


} else if (dbClient != null && !dbClient.getBoolean("active")) {
    _header.status(409);
    _out.json(
        _val.map()
            .set("result", false)
            .set("message", "O seu utilizador ainda não foi ativado.")
    );
} else {
    _header.status(404);
    _out.json(
        _val.map()
            .set("result", false)
            .set("message", "O email que introduziu não existe.")
    );
}

