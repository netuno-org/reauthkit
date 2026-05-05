import {_req, _val, _header, _exec, _out} from "@netuno/server-types";

import profile from "#core/lib/profile.js";

let profileUID = _req.getUID("uid");

if (!profileUID) {
  const dbProfile = profile.getLogged();
  profileUID = dbProfile.getUID("uid");
}

const fullData = profile.getFullDataByUID(profileUID);

if (!fullData) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "not-exist")
  );
  _exec.stop();
}

_out.json(
  _val.map()
    .set("result", true)
    .set("data", fullData)
);
