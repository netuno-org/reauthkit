import {_db, _user, _ws} from "@netuno/server-types"

export default {
    getLogged: () => {
        return _db.form("people")
            .where(_db.where("people_user_id").equal(_user.id))
            .first()
    },
    getByUID: (uid) => {
        return _db.form("people")
            .where(_db.where("uid").equal(uid))
            .first()
    },
    wsSendService: (dbPeople, message) => {
        const dbSessions = _db.form("people_ws_session")
            .where(_db.where("people_id").equal(dbPeople.getInt("id")))
            .all()
        for (const dbSession of dbSessions) {
            _ws.sendService(dbSession.getString("session_id"), message)
        }
    },
    wsSendAsService: (dbPeople, message) => {
        const dbSessions = _db.form("people_ws_session")
            .where(_db.where("people_id").equal(dbPeople.getInt("id")))
            .all()
        for (const dbSession of dbSessions) {
            _ws.sendAsService(dbSession.getString("session_id"), message)
        }
    }
}
