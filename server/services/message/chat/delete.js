import message from "#core/lib/message.js";
import profile from "#core/lib/profile.js";
import { _db, _exec, _out, _req, _val } from "@netuno/server-types";

const partnerUid = _req.getString("partner_uid");

const dbLoggedInProfile = profile.getLoggedIn();

const dbPartner = _db.queryFirst(`
    SELECT id
    FROM profile
    WHERE uid = ${_db.param("uid")}
`, partnerUid)

if (!dbPartner) {
  _out.json(_val.map().set("result", false).set("error", "user-not-found"));
  _exec.stop();
}

const loggedProfileId = dbLoggedInProfile.getInt("id");
const partnedProfileId = dbPartner.getInt("id");

_db.execute(`
    DELETE FROM message
    WHERE (from_profile_id = ${_db.param("int")} AND to_profile_id = ${_db.param("int")})
    OR (to_profile_id = ${_db.param("int")} AND from_profile_id = ${_db.param("int")})
  `,
  partnedProfileId, loggedProfileId,
  partnedProfileId, loggedProfileId);

profile.wsSendService(
  dbPartner,
  _val.map()
    .set("service", "message/unread/count")
    .set("content", _val.map().set("total", message.getUnreadTotal(dbPartner)))
);

profile.wsSendService(
  dbLoggedInProfile,
  _val.map()
    .set("service", "message/unread/count")
    .set("content", _val.map().set("total", message.getUnreadTotal(dbLoggedInProfile)))
);

_out.json(
  _val.map().set("result", true)
);
