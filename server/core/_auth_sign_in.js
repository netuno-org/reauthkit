import {_val, _auth, _exec} from '@netuno/server-types';

import people from "#core/lib/people.js";

const data = people.getLoginData();

if (!data) {
  _auth.signInAbortWithData(
    _val.map()
      .set('error', 'invalid-user')
  );
  _exec.stop();
}

// _log.info(_req.getString('my-parameter'));

_auth.signInExtraData(data);
