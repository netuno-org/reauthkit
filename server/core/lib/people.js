import {_db, _group, _user, _val, _ws} from "@netuno/server-types";

export default {
    getLoginData: () => {
        const dbPeople = _db.queryFirst(`
          SELECT *
          FROM people
          WHERE people_user_id = ${_db.param("int")}
        `, _user.id);
        if (dbPeople) {
            return _val.map()
                .set("uid", dbPeople.getString("uid"))
                .set("name", dbPeople.getString("name"))
                .set("email", dbPeople.getString("email"))
                .set("username", _user.get(_user.id()).getString("user"))
                .set("avatar", dbPeople.getString("avatar") !== '')
                .set("group", _group.code());
        }
        return null;
    },
    getLogged: () => {
        return _db.form("people")
            .where(_db.where("people_user_id").equal(_user.id))
            .first();
    },
    getByUID: (uid) => {
        return _db.form("people")
            .where(_db.where("uid").equal(uid))
            .first();
    },
    wsSendService: (dbPeople, message) => {
        const dbSessions = _db.form("people_ws_session")
            .where(_db.where("people_id").equal(dbPeople.getInt("id")))
            .all();
        for (const dbSession of dbSessions) {
            _ws.sendService(dbSession.getString("session_id"), message);
        }
    },
    wsSendAsService: (dbPeople, message) => {
        const dbSessions = _db.form("people_ws_session")
            .where(_db.where("people_id").equal(dbPeople.getInt("id")))
            .all();
        for (const dbSession of dbSessions) {
            _ws.sendAsService(dbSession.getString("session_id"), message);
        }
    }
}
