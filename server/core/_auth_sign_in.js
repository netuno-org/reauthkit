import {_val, _auth, _exec} from "@netuno/server-types";

import profile from "#core/lib/profile.js";

const onAbort = () => {
  _auth.signInAbortWithData(
      _val.map()
          .set('result', false)
          .set('error', 'invalid-user')
  );
  _exec.stop();
};

const dbProfile = profile.getLogged();

if (!dbProfile) {
  onAbort();
}

const fullData = profile.getFullDataByUID(dbProfile.getUID("uid"));

if (!fullData) {
  onAbort();
}

// _log.info(_req.getString('my-parameter'));

_auth.signInExtraData(fullData);
