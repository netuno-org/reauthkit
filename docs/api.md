# API and extension reference

This is a code-first reference for the routable scripts under `server/services` and the reusable exports under `server/core/lib`. The default base URL is `http://localhost:9000/services`.

Netuno maps a file named after an HTTP method to its directory path. For example, `server/services/profile/get.js` is `GET /profile`; the WebSocket endpoint dispatches its connect, message, and disconnect events to `POST`, `PUT`, and `DELETE /ws/private` respectively.

## User-facing feature and route map

| Website route | Access | Shipped feature |
| --- | --- | --- |
| `/` | Public | Redirects an authenticated visitor to `/dashboard`, otherwise to `/login`. |
| `/login` | Public | Password/JWT login, optional remembered username/password, ALTCHA, password-recovery dialog, and enabled social-provider links. |
| `/login/:provider` | Public | Completes a Netuno social-provider login callback; redirects to `/register` when the provider account has no local account yet. |
| `/register` | Public | Password or enabled social-provider registration, with ALTCHA when configured. |
| `/register/:provider` | Public | Completes social-provider registration and signs in the new account. |
| `/recovery` | Public | Accepts the recovery key from the URL fragment and sets a new password. |
| `/dashboard` | Authenticated | Reserved-area welcome screen with the profile name. |
| `/profile/edit` | Authenticated | Edits the current user's identity fields, password, and cropped avatar. |
| `/profile/preferences` | Authenticated | Toggles friend and message notification preferences. |
| `/profile/view` | Authenticated | Shows the logged-in profile with an edit action. |
| `/profile/:uid` | Authenticated | Shows another user's profile with friendship actions (add, accept, remove, cancel) and a message link. |
| `/friends` | Authenticated | Accepted friends plus received/sent requests; search, accept, refuse, cancel, remove, and open profile/messages. |
| `/people` | Authenticated | Paginated, searchable profile directory. |
| `/messages` | Authenticated | Conversation/friends tabs, presence, unread counts, paginated history, send/reply/edit/delete, reactions, and read marking over WebSocket service envelopes. |
| `/notifications` | Authenticated | Unread/all tabs, pagination, mark-read/mark-all-read, deletion, and navigation to the related profile. |
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
| `DELETE /friend` | Implemented | `uid` | Removes the friendship in both directions and the related `friend_*` notifications; sends notification refresh events; returns `{ "result": true, "status": "none" }` or 404 `user-not-found`. |
| `GET /friend/list` | Implemented | — | Returns `{ result, friends, received, sent }`. `friends` contains accepted friendships; `received` and `sent` contain pending requests. Each item has `uid`, `name`, `email`, `avatar` (Boolean), and `online`; accepted items have `accepted_on`, pending items `request_on`. |
| `POST /friend` | Implemented | `uid` | Sends a friend request, accepts an incoming request, or returns the existing state. Returns `{ result: true, status }` with `friend` or `pending_sent`; 400 `cannot-friend-self`; 404 `user-not-found`. Creates a `friend` notification. |
| `PUT /friend` | Implemented | `uid` | Accepts an incoming request, creates or updates the reciprocal friendship, and creates a `friend` notification for the requester. Returns `{ result: true, status: "friend" }` or 404 `user-not-found`. |
| `DELETE /message` | Implemented | `uid` | Soft-deletes a message sent by the logged-in profile (`deleted_at`, `active=false`); broadcasts `DELETE message`; returns `{ result: true, content }`; errors `message-not-found` and `unauthorized`. |
| `GET /message` | Placeholder | — | Empty extension point; single-message retrieval is not implemented. |
| `POST /message` | Implemented | `to`, `message`, optional `parent_uid` | Stores a message (optionally as a reply), sends `message/new` and unread-count events, and returns `{ result: true, content }`. |
| `PUT /message` | Implemented | `uid`, `message` | Edits a message sent by the logged-in profile within one hour; broadcasts `message/edit`; returns `{ result: true, content }`; errors `message-not-found`, `unauthorized`, and `edit-time-expired`. |
| `POST /message/list` | Implemented | `with`, optional `page` and `pageSize` | Marks incoming messages from `with` as read on page 1, then returns `{ items, page, total }` with the messages in chronological order. The default page size is 10. |
| `GET /message/read/mark` | Implemented | `from`, `uid` | Marks the message as read and broadcasts `message/read`; returns `{ result: true, from }`. The SQL predicate does not verify the recipient. |
| `GET /message/unread/count` | Implemented | — | Returns `{ total }` for the logged-in profile. Returns 0 when the `message` notification type is disabled in preferences. |
| `GET /message/chat/list` | Implemented | — | Returns a bare array (not wrapped in `result`) of conversations: `uid`, `name`, `avatar`, `online`, `latest_message`, and `unread_messages`, sorted by latest message. |
| `DELETE /message/chat` | Implemented | `partner_uid` | Deletes all messages between the logged-in profile and the partner, sends unread-count updates, and returns `{ result: true }` or `{ result: false, error: "user-not-found" }`. |
| `PUT /message/reaction` | Implemented | `uid`, optional `reaction` | Sets or clears a reaction on a message received by the logged-in profile; broadcasts `PUT message`; returns `{ result: true, content }`; errors `message-not-found` and `unauthorized`. |
| `DELETE /notification` | Implemented | `uid` | Soft-deletes (`active=false`) one notification owned by the logged-in profile; sends the unread count; returns `{ result: true, total }`; error `not-found`. |
| `POST /notification/list` | Implemented | optional `page`, `pageSize`, and `unread` | Returns `{ items, page, pageSize, total }` of active notifications, newest first; `unread=true` filters unread only. |
| `PUT /notification/read` | Implemented | optional `all` and `uid` | Marks all unread notifications read (`all=true`) or one notification by `uid`; sends the unread count; returns `{ result: true, total }`. |
| `GET /notification/settings` | Implemented | — | Returns `{ result: true, data: [{ id, code, name, enabled }] }` for all notification types; missing settings default to enabled. `not-logged` error when no profile exists. |
| `POST /notification/settings` | Implemented | `code`, optional `enabled` | Creates or updates the notification preference for a type; returns `{ result: true, code, enabled }`; errors `not-logged` and `type-not-found`. Also sends a `message/unread/count` refresh. |
| `GET /notification/unread/count` | Implemented | — | Returns `{ total }` for the logged-in profile. |
| `POST /notification/subscribe` | Implemented | `endpoint`, `keys.p256dh`, `keys.auth` | Stores a Web Push subscription; 404 `not-exist` when no profile is found; otherwise `{ result: true }`. |
| `GET /profile` | Implemented | optional `uid`; otherwise logged-in profile | Returns `{ result: true, data }` with `uid`, `name`, `username`, `email`, `avatar` (Boolean), `group`, and `friendship_status` when available (`self`, `friend`, `pending_sent`, `pending_received`, `none`); 404 `not-exist`. |
| `POST /profile` | Implemented | password flow: `name`, `username`, `email`, `password`, optional `altcha`; provider flow: `name`, `username`, `code`, `provider` | Registers a Netuno user in the `generic` group and creates the profile. Provider identity is resolved by Netuno's provider flow. Returns `{ result: true }`; 409 `invalid-provider-data`, `invalid-altcha-payload`, `email-already-exists`, or `user-already-exists`. |
| `PUT /profile` | Implemented | Multipart `name`, `username`, `email`, optional `password`, optional `avatar` | Updates the Netuno user and the `profile` record; a new avatar is resized to a 500×500 JPEG. Returns `{ result: true }`. |
| `DELETE /profile` | Disabled | — | Starts with an unconditional `_exec.stop()`. If that line is deliberately removed, it deletes the logged-in profile and Netuno user (200 or 404). |
| `GET /profile/avatar` | Implemented | required `uid` | Streams the stored avatar with no-cache headers; uses the JPEG content type when the stored extension is jpg/jpeg and PNG otherwise; empty 404 when the profile or avatar is absent. |
| `POST /profile/list` | Implemented | optional `page`, `pageSize`, and `search` | Returns `{ items, page, pageSize, total }` of active profiles excluding the logged-in profile; each item has `uid`, `name`, `username`, `email`, `avatar` (Boolean), `group`, and `online`. Search is case-insensitive over name, username, and email. The default page size is 12. |
| `OPTIONS /recovery` | Implemented | — | Returns `{ result: true }` for preflight/feature probing. |
| `POST /recovery` | Implemented | `email` | Creates a one-day recovery key and sends the recovery email; returns `{ result: true }`, 404 `not-exists`, or 409 `user-not-active`. The recovery URL is derived from the request `Origin` header. |
| `PUT /recovery` | Implemented | `key`, `password` | Changes the password when the key exists and has not expired; otherwise returns 404 `user-not-found`; returns `{ result: true }`. |

`POST /profile` also depends on Netuno's configured `generic` group. Provider registration obtains identity data from Netuno's provider flow rather than trusting an email sent by the browser. Profile listing is `POST /profile/list`; there is no `GET /profile/list` route.

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

| Service | Direction | Payload/result |
| --- | --- | --- |
| `friend/status/changed` | Server event | `content` contains `{ uid, online }`. |
| `message` (POST) | Client request/response | `data` contains `to`, `message`, and optional `parent_uid`; the response contains the formatted message in `content`. |
| `message` (PUT) | Client request/response | `data` contains `uid` and `message`; the response contains the formatted message in `content`. |
| `message` (DELETE) | Client request/response or server event | Request `data.uid`; event `data.with` identifies the other profile; `content` contains the formatted message. |
| `message` (PUT, reaction update) | Server event | `data.with` identifies the other profile; `content` contains the formatted message. |
| `message/list` (POST) | Client request/response | `data` contains `with`, `page`, and `pageSize`; `content` contains `{ items, page, total }`. |
| `message/new` (POST) | Server event | `data.with` identifies the other profile; `content` contains `uid`, `from`, `to`, `message`, `sent_at`, `read_at`, `deleted_at`, `active`, `edited_at`, `reaction`, and optionally `parent`. |
| `message/edit` (PUT) | Server event | `data.with` identifies the other profile; `content` contains the formatted message. |
| `message/read` (PUT) | Server event | `data.with` identifies the other profile; `content` contains `{ all: true, read_at }` or `{ uid, read_at }`. |
| `message/read/mark` (GET) | Client request/response | `data` contains `uid` and `from`. |
| `message/reaction` (PUT) | Client request/response | `data` contains `uid` and `reaction`; the response contains the formatted message in `content`. |
| `message/chat/list` (GET) | Client request/response or server refresh | `content` contains the bare conversation array. |
| `message/unread/count` | Server refresh | `content.total` contains the unread count. |
| `notification/unread/count` | Server refresh | `content.total` contains the unread count. |
| `notification/new` | Server event | `content` contains the notification data (`uid`, `title`, `content`, `sent_at`, `read_at`, `extra`, `type`). |

## Scheduled service

| Path | Status | Current behavior |
| --- | --- | --- |
| `/services/jobs/ws-sessions` | Implemented | Iterates over `profile_ws_session`, deletes records whose `_ws.session(id)` is absent, and returns `{ "result": true }`. The sample Quartz schedule invokes it every 15 minutes. |

## Server-core module API

These default-exported objects are reusable application extension APIs. Import them through the package aliases, for example `import profile from "#core/lib/profile.js"`.

| Module and function | Contract |
| --- | --- |
| `profile.getFullDataByUid(uid)` | Returns a Netuno value map containing `uid`, `name`, `username`, `email`, Boolean `avatar`, and `group`, or `null`. |
| `profile.getLoggedIn()` | Returns the database `profile` record linked to the current `_user.id`, or no record. |
| `profile.getByUid(uid)` | Returns the database `profile` record for the UID, or no record. |
| `profile.wsSendService(dbProfile, message)` | Sends a client-origin-style service envelope to every stored WebSocket session for the profile. |
| `profile.wsSendAsService(dbProfile, message)` | Sends a server-origin service envelope to every stored WebSocket session for the profile. |
| `friend.notifyAllWithStatusChanged(dbProfile, online)` | Notifies all stored friend sessions with `friend/status/changed`. |
| `message.getByUid(uid)` | Returns the database `message` record for the UID, or no record. |
| `message.getUnreadTotal(dbProfile)` | Returns the number of unread messages addressed to the profile, or 0 when the profile is absent or the `message` notification type is disabled. |
| `message.toData(dbProfileFrom, dbProfileTo, dbMessage)` | Converts a message record to the public message value map, including `uid`, `from`, `to`, `message`, `sent_at`, `read_at`, `deleted_at`, `active`, `edited_at`, `reaction`, and an optional `parent` object. |
| `notification.create(dbProfile, typeCode, title, content, extra)` | Stores a notification, sends Web Push to active subscriptions, deactivates subscriptions reported as expired, and emits unread-count and `notification/new` events. The requested notification type must exist and be active. |
| `notification.isEnabled(dbProfile, typeCode)` | Returns whether the profile has notifications enabled for the type. |
| `notification.getUnreadTotal(dbProfile)` | Returns the number of unread active notifications for the profile, excluding disabled types. |
| `notification.toData(dbNotification)` | Converts a notification record to the public notification value map. |

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

In development, `_service_config.js` calls `_service.allow()` for every service. The current explicit production allow-list contains `profile/avatar/get`, `profile/post`, `profile/options`, `recovery/post`, `recovery/put`, and `recovery/options`. This makes registration, avatar reads, and password recovery public. `profile/options` is allow-listed but no `profile/options` service file exists. The list omits `profile/get`; authenticated access to that route and the other application routes must be granted through Netuno group permissions. `ws/private*` is allowed only when `_auth.isJWT()` is true and is denied otherwise. Review and correct this allow-list and configure Netuno group permissions before production use.

## OpenAPI coverage

`server/services/_openapi.json` currently defines only `info` and `components.securitySchemes`; Netuno generates the paths from companion `*.in.json` and `*.out.*.json` files. Request schemas exist for `friend/{delete,post,put}`, `message/{delete,put}`, `message/reaction/put`, `notification/delete`, `profile/{get,post,put,delete}`, and `recovery/{post,put}`. Response schemas exist for the `profile` and `recovery` routes. The generated document is therefore still incomplete relative to the full route inventory above.

For every sample configuration path, see [Configuration reference](configuration.md).
