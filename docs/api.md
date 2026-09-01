# API and extension reference

This is a code-first reference for the routable scripts under `server/services` and the reusable exports under `server/core/lib`. The default base URL is `http://localhost:9000/services`.

Netuno maps a file named after an HTTP method to its directory path. For example, `server/services/profile/get.js` is `GET /profile`; the WebSocket endpoint dispatches its connect, message, and disconnect events to `POST`, `PUT`, and `DELETE /ws/private` respectively.

## User-facing feature and route map

| Website route | Access | Shipped feature |
| --- | --- | --- |
| `/` | Public | Redirects an authenticated visitor to `/dashboard`, otherwise to `/login`. |
| `/login` | Public | Password/JWT login, optional remembered username/password, ALTCHA, password-recovery dialog, and enabled social-provider links. |
| `/login/:provider` | Public | Completes a Netuno social-provider login callback. |
| `/register` | Public | Password or enabled social-provider registration, with ALTCHA when configured. |
| `/register/:provider` | Public | Completes social-provider registration and signs in the new account. |
| `/recovery` | Public | Accepts the recovery key from the URL fragment and sets a new password. |
| `/dashboard` | Authenticated | Reserved-area welcome screen. |
| `/profile/edit` | Authenticated | Edits the current user's identity fields, password, and cropped avatar; the server defect noted below currently affects profile persistence. |
| `/profile/view` | Authenticated | Placeholder profile-view screen; it does not load another user's data. |
| `/messages` | Authenticated | Friend presence, unread counts, ten-message conversation history, message sending, and read marking over WebSocket service envelopes. |
| `/other-page` | Authenticated | Placeholder reserved-area page for extension. |
| Any unmatched route | Public shell | Displays the not-found page. |

Entering the reserved area loads the profile, opens the authenticated WebSocket, and attempts to register a Web Push subscription. The separate `ui` bundle injects a sample React/Ant Design counter button into the Netuno backoffice dashboard; it is demonstration UI, not an application-management feature.

## Implementation status

- **Implemented** means the script executes application logic.
- **Disabled** means logic exists but is unreachable in the repository as shipped.
- **Placeholder** means the routable file is empty and currently produces no application response.
- Access is controlled centrally by `server/core/_service_config.js`, not declared in each handler. In development that hook calls `_service.allow()` for every service. See [Access-control caveats](#access-control-caveats) before deploying.

## HTTP services

All paths below are relative to `/services`.

| Method and path | Status | Input | Current behavior |
| --- | --- | --- | --- |
| `DELETE /friend` | Placeholder | — | Empty extension point; friend removal is not implemented. |
| `GET /friend/list` | Implemented | — | Returns the logged-in profile's friends with `uid`, `name`, avatar availability, online state, latest unread-message timestamp, and unread count. |
| `POST /friend` | Placeholder | — | Empty extension point; adding a friend is not implemented. |
| `PUT /friend` | Placeholder | — | Empty extension point; friend updates are not implemented. |
| `DELETE /message` | Placeholder | — | Empty extension point; message deletion is not implemented. |
| `GET /message` | Placeholder | — | Empty extension point; single-message retrieval is not implemented. |
| `POST /message` | Implemented | `to` profile UID, `message` string | Stores a message, notifies the recipient through `POST message/new`, and returns `{ "result": true }`. |
| `PUT /message` | Placeholder | — | Empty extension point; message updates are not implemented. |
| `POST /message/list` | Implemented | `with` profile UID | Marks incoming messages from that profile as read, refreshes unread/friend data when necessary, and returns the latest 10 messages in chronological order. |
| `GET /message/read/mark` | Implemented | `from` profile UID, `uid` message UID | Marks the matching unread message as read and returns `{ "result": true, "from": UID }`. The source does not verify the recipient in its SQL predicate. |
| `GET /message/unread/count` | Implemented | — | Returns `{ "total": number }` for the logged-in profile. |
| `POST /notification/subscribe` | Implemented | `endpoint`, `keys.p256dh`, `keys.auth` | Stores a Web Push subscription for the logged-in profile. Returns 404 `not-exist` if no profile is found, otherwise `{ "result": true }`. |
| `GET /profile` | Implemented | Optional `uid`; otherwise logged-in profile | Returns `{ "result": true, "data": { uid, name, username, email, avatar, group } }`, or 404 `not-exist`. |
| `POST /profile` | Implemented | `name`, `username`; password flow: `email`, `password`, optional `altcha`; provider flow: `code`, `provider` | Registers a generic user/profile. Returns 409 for invalid provider data, invalid ALTCHA, or existing email/username. |
| `PUT /profile` | Implemented with defect | Multipart `name`, `username`, `email`, optional `password`, optional `avatar` | Updates the Netuno user and responds `{ "result": true }`. The shipped source writes profile data to form `people` although the schema and all other code use `profile`; profile fields/avatar therefore require this defect to be corrected before relying on the endpoint. |
| `DELETE /profile` | Disabled | — | The script begins with unconditional `_exec.stop()`. If that line is deliberately removed, the remaining sample deletes the logged-in profile and Netuno user, returning 200 or 404. |
| `GET /profile/avatar` | Implemented | Required `uid` query value | Streams the stored JPEG/PNG avatar with no-cache headers; returns an empty 404 when the profile is absent. |
| `GET /profile/list` | Placeholder | — | Empty extension point; profile listing is not implemented. |
| `OPTIONS /recovery` | Implemented | — | Returns `{ "result": true }` for preflight/feature probing. |
| `POST /recovery` | Implemented | `email` | Creates a one-day recovery key and sends an email. Returns 409 `user-not-active`, 404 `not-exists`, or `{ "result": true }`. The recovery URL is derived from the request `Origin` header. |
| `PUT /recovery` | Implemented | `key`, `password` | Changes the password when the key exists and has not expired; otherwise returns 404 `user-not-found`. |

`POST /profile` also depends on Netuno's configured `generic` group. Provider registration obtains identity data from Netuno's provider flow rather than trusting an email sent by the browser.

## WebSocket lifecycle service

The configured public socket is `/ws/private`; `ws.endpoints[].service` dispatches it to `/services/ws/private`.

| Method and service | Status | Current behavior |
| --- | --- | --- |
| `POST /ws/private` | Implemented | On connection, stores the current socket session for the logged-in profile and sends `friend/status/changed` with `online: true` to friend sessions. |
| `PUT /ws/private` | Placeholder | Empty extension point for an incoming raw WebSocket message. Application requests normally use the WebSocket client's service envelope instead. |
| `GET /ws/private` | Placeholder | Empty extension point for a connection/read event if supplied by the runtime. |
| `DELETE /ws/private` | Implemented | On disconnect, deletes the socket session and sends `friend/status/changed` with `online: false` to friend sessions. |

The website sends the JWT as `?auth=<access-token>`. `server/core/_service_config.js` allows the socket service only when `_auth.isJWT()` is true.

### Service messages used by the website

| Method and service | Direction | Payload/result |
| --- | --- | --- |
| `GET friend/list` | Client request/response | Response `content` is the friend list described above. |
| `GET message/unread/count` | Client request/response or server refresh | Response `content.total` is the unread count. |
| `POST message` | Client request/response | Request `data` contains `to` and `message`. |
| `POST message/list` | Client request/response | Request `data.with` is a profile UID; `content` is the 10-message history. |
| `GET message/read/mark` | Client request/response | Request `data` contains `uid` and `from`. |
| `POST message/new` | Server event | `data.with` identifies the other profile; `content` contains `uid`, `from`, `to`, `message`, `sent_at`, and `read_at`. |
| `GET friend/status/changed` | Server event | `content` contains profile `uid` and Boolean `online`. |

## Scheduled service

| Path | Status | Current behavior |
| --- | --- | --- |
| `/services/jobs/ws-sessions` | Implemented | Iterates over `profile_ws_session`, deletes records whose `_ws.session(id)` is absent, and returns `{ "result": true }`. The sample Quartz schedule invokes it every 15 minutes. |

## Server-core module API

These default-exported objects are reusable application extension APIs. Import them through the package aliases, for example `import profile from "#core/lib/profile.js"`.

| Module and function | Contract |
| --- | --- |
| `profile.getFullDataByUID(uid)` | Returns a Netuno value map containing `uid`, `name`, `username`, `email`, Boolean `avatar`, and `group`, or `null`. |
| `profile.getLogged()` | Returns the database `profile` record linked to the current `_user.id`, or no record. |
| `profile.getByUID(uid)` | Returns the database `profile` record for the UID, or no record. |
| `profile.wsSendService(dbProfile, message)` | Sends a client-origin-style service envelope to every stored WebSocket session for the profile. |
| `profile.wsSendAsService(dbProfile, message)` | Sends a server-origin service envelope to every stored WebSocket session for the profile. |
| `friend.notifyAllWithStatusChanged(dbProfile, online)` | Notifies all stored friend sessions with `friend/status/changed`. |
| `message.getByUID(uid)` | Returns the database `message` record for the UID, or no record. |
| `message.getUnreadTotal(dbProfile)` | Returns the number of unread messages addressed to the profile. |
| `message.toData(dbProfileFrom, dbProfileTo, dbMessage)` | Converts a message record to the public message value map. |
| `notification.create(dbProfile, typeCode, title, content, extra)` | Stores a notification, sends Web Push to active subscriptions, and deactivates subscriptions reported as expired. The requested notification type must exist and be active. |

## Core lifecycle extension points

Netuno discovers the following files by name. Empty files are intentional hooks available for application-specific behavior.

| Hook | Shipped behavior |
| --- | --- |
| `_config.js` | Sets language/login development behavior, response caching, and generates the browser's `reauthkit.js` configuration. |
| `_init.js` | Contains only a commented Firebase-listener example. |
| `_auth_attempt.js` | Rejects authentication with `custom-blocked: true` when the matched Netuno user's code is `blocked`. |
| `_auth_sign_in.js` | Aborts sign-in when no application profile exists and adds full profile data to a successful sign-in response. |
| `_request_start.js` | Enables `_request_end` execution. |
| `_request_url.js` | Leaves the requested URL unchanged and contains a commented CORS example. |
| `_request_error.js` | Writes `### SERVER ERROR ###` if the output remains open. |
| `_request_end.js`, `_request_close.js` | Empty request lifecycle extension points. |
| `_service_config.js` | Applies service-access decisions described below. |
| `_service_start.js`, `_service_end.js` | Empty service lifecycle extension points. |
| `_service_error.js` | Contains only a commented fatal-log example. |

## Access-control caveats

The current production allow-list in `_service_config.js` names `people/avatar/get`, `people/post`, and `people/options`, but the implemented routes are under `profile`, not `people`; it also omits `profile/get`. As shipped, only `recovery/{post,put,options}` is explicitly public, and `ws/private*` is allowed only for JWT requests. Development calls `_service.allow()` globally. Review and correct this allow-list and configure Netuno group permissions before production use.

The companion OpenAPI schemas cover only `profile/{get,post,put,delete}` and `recovery/{post,put}`. The table above is therefore the complete source-derived route inventory; the generated OpenAPI document is currently incomplete.

For every sample configuration path, see [Configuration reference](configuration.md).
