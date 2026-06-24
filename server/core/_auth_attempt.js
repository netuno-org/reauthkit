import {_auth, _user, _val, _req} from '@netuno/server-types'

const username = _req.getString('username')

const dbUser = _user.firstByUser(username) || _user.firstByMail(username)

// _log.info(_req.getString('my-parameter'))

if (dbUser && dbUser.getString('code') === 'blocked') {
  _auth.attemptRejectWithData(_val.map().set('custom-blocked', true))
}
