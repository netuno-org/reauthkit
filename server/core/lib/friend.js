import {_db, _val, _ws} from "@netuno/server-types";

export default {
  notifyAllWithStatusChanged: (dbProfile, online)=> {
    const dbFriendSessions = _db.form("profile")
      .link("profile_ws_session")
      .join(
        _db.oneToMany("friend", "friend_profile_id",
          _db.where("profile_id").equals(dbProfile.getInt("id")))
      ).get("profile_ws_session.session_id")
      .distinct(true)
      .all();

    for (const dbFriendSession of dbFriendSessions) {
      _ws.sendAsService(
        dbFriendSession.getString("session_id"),
        _val.map()
          .set("service", "/friend/status/changed")
          .set(
            "content",
            _val.map()
              .set("uid", dbProfile.getString("uid"))
              .set("online", online)
          )
      );
    }
  }
};
