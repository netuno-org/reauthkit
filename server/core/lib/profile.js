import {_db, _user, _val, _ws} from "@netuno/server-types";

export default {
  getFullDataByUID: (uid) => {
    const dbProfile = _db.queryFirst(`
      SELECT profile.uid,
         profile.name,
         netuno_user.user,
         profile.email,
         profile.avatar,
         netuno_group.code AS "group"
      FROM profile
        INNER JOIN netuno_user ON profile.profile_user_id = netuno_user.id
        INNER JOIN netuno_group ON netuno_user.group_id = netuno_group.id
      WHERE profile.uid = ${_db.param("uid")}
    `, uid);
    if (dbProfile) {
      return _val.map()
        .set("uid", dbProfile.getString("uid"))
        .set("name", dbProfile.getString("name"))
        .set("username", dbProfile.getString("user"))
        .set("email", dbProfile.getString("email"))
        .set("avatar", dbProfile.getString("avatar") !== '')
        .set("group", dbProfile.getString("group"));
    }
    return null;
  },
  getLogged: () => {
    return _db.form("profile")
      .where(_db.where("profile_user_id").equal(_user.id))
      .first();
  },
  getByUID: (uid) => {
    return _db.form("profile")
      .where(_db.where("uid").equal(uid))
      .first();
  },
  wsSendService: (dbProfile, message) => {
    const dbSessions = _db.form("profile_ws_session")
      .where(_db.where("profile_id").equal(dbProfile.getInt("id")))
      .all();
    for (const dbSession of dbSessions) {
      _ws.sendService(dbSession.getString("session_id"), message);
    }
  },
  wsSendAsService: (dbProfile, message) => {
    const dbSessions = _db.form("profile_ws_session")
      .where(_db.where("profile_id").equal(dbProfile.getInt("id")))
      .all();
    for (const dbSession of dbSessions) {
      _ws.sendAsService(dbSession.getString("session_id"), message);
    }
  }
}
