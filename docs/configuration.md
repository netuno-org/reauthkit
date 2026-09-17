# Configuration reference

This reference covers every configurable path in `config/sample.json`. Copy that file to `config/_development.json` or `config/_production.json`, then replace the sample credentials and URLs. Paths containing `[]` apply to every item in an array.

## Application and setup

| Path | Sample | Purpose |
| --- | --- | --- |
| `name` | `reauthkit` | Netuno application name. Keep it aligned with the application folder name. |
| `language` | `pt_PT` | Default application language code. |
| `locale` | `pt_PT` | Default locale used for regional formatting. |
| `setup.enabled` | `true` | Enables the application setup phase. |
| `setup.schema.execution` | `true` | Runs schema setup scripts. |
| `setup.schema.auto_create` | `true` | Allows missing schema structures to be created automatically. |
| `setup.scripts.execution` | `true` | Runs the remaining setup scripts. |

## Website settings

| Path | Sample | Purpose |
| --- | --- | --- |
| `settings.website.services.prefix` | `http://localhost:9000/services` | Base URL used by the website service client. |
| `settings.website.websocket.url` | `ws://localhost:9000/ws/private/` | WebSocket URL used by the website. The client appends the access token as the `auth` query parameter. |
| `settings.website.websocket.servicesPrefix` | `/services` | Prefix used when the WebSocket client invokes a Netuno service. |
| `settings.public` | `{}` | Empty extension object for settings that an application chooses to expose publicly. ReAuthKit does not read it. |

At startup, `server/core/_config.js` writes `website/public/reauthkit.js` in development or `website/dist/reauthkit.js` in production. Besides the service and WebSocket values above, that browser file contains generated `push.key`, `auth.altcha`, and `auth.providers.{facebook,google,microsoft,github,discord}` values obtained from Netuno; they are not additional keys in `sample.json`.

## Scheduled job

| Path | Sample | Purpose |
| --- | --- | --- |
| `cron.jobs[].name` | `ws-sessions` | Job identifier. |
| `cron.jobs[].config` | `0 0/15 * * * ?` | Quartz cron expression; the sample runs every 15 minutes. |
| `cron.jobs[].url` | `/services/jobs/ws-sessions` | Service executed by the scheduler. It removes database records for WebSocket sessions that no longer exist. |

## SMTP

| Path | Sample | Purpose |
| --- | --- | --- |
| `smtp.default.enabled` | `true` | Enables the default SMTP connection. |
| `smtp.default.host` | `example.org` | SMTP server hostname. |
| `smtp.default.port` | `465` | SMTP server port. |
| `smtp.default.ssl` | `true` | Enables an SSL connection. |
| `smtp.default.from` | `noreply@example.org` | Default sender address. |
| `smtp.default.username` | `noreply@example.org` | SMTP login name. |
| `smtp.default.password` | sample only | SMTP password. Replace it and do not commit a real secret. |

Password recovery uses this default connection and the `server/templates/recovery-mail.html` template.

## Development commands

Each object in `commands[]` describes a process Netuno starts with the application.

| Path | Sample values | Purpose |
| --- | --- | --- |
| `commands[].path` | `ui`, `website` | Working directory relative to the application root. |
| `commands[].command` | `bun run watch`, `bun run dev` | Long-running development command. |
| `commands[].install` | `bun install` | Dependency installation command. |
| `commands[].enabled` | `true` | Enables the command. Disable every watcher in production. |

The website package exposes `dev`, `build`, `lint`, and `preview`; the backoffice UI exposes `dev`, `build`, `watch`, `lint`, and `preview` through Bun/npm.

## Database

| Path | Sample | Purpose |
| --- | --- | --- |
| `db.default.engine` | `pg` | Database engine; this application schema targets PostgreSQL. |
| `db.default.host` | `localhost` | Database hostname. |
| `db.default.port` | `5432` | Database port. |
| `db.default.name` | `reauthkit` | Database name. |
| `db.default.username` | `postgres` | Database login name. |
| `db.default.password` | sample only | Database password. Replace it and do not commit a real secret. |

## Authentication

| Path | Sample | Purpose |
| --- | --- | --- |
| `auth.attempts.enabled` | `true` | Enables failed sign-in attempt limiting. |
| `auth.attempts.interval` | `60` | Failure-count interval in minutes. |
| `auth.attempts.maxFails` | `5` | Maximum consecutive failures in the interval. |
| `auth.altcha.enabled` | `true` | Enables ALTCHA protection for public authentication flows. Registration verifies the `altcha` payload when this is enabled. |
| `auth.altcha.admin.enabled` | `true` | Enables ALTCHA in Netuno's administration sign-in. |
| `auth.jwt.enabled` | `true` | Enables JWT authentication. |
| `auth.jwt.secret` | sample only | Secret used to sign JWTs. Replace it with a random secret of at least 16 characters; 32 or more is recommended. |
| `auth.jwt.expires.access` | `1440` | Access-token lifetime in minutes. |
| `auth.jwt.expires.refresh` | `1440` | Refresh-token lifetime in minutes. |

The website also uses Netuno's platform-provided `/_auth`, `/_auth_provider`, and `/_altcha` services. Those routes are not implemented by files in this repository.

## WebSocket endpoint

Each `ws.endpoints[]` object registers one Netuno WebSocket endpoint.

| Path | Sample | Purpose |
| --- | --- | --- |
| `ws.endpoints[].name` | `user` | Endpoint identifier. |
| `ws.endpoints[].enabled` | `true` | Enables the endpoint. |
| `ws.endpoints[].sendTimeout` | `10000` | Send timeout in milliseconds. |
| `ws.endpoints[].idleTimeout` | `0` | Idle timeout in milliseconds; `0` disables it. |
| `ws.endpoints[].maxText` | `15000` | Maximum text-message size in bytes. |
| `ws.endpoints[].public` | `/ws/private` | Public WebSocket URL path. |
| `ws.endpoints[].path` | `/` | Internal endpoint path. |
| `ws.endpoints[].service` | `/services/ws/private` | Service dispatch target for connect, message, and disconnect methods. |

## CORS

| Path | Sample | Purpose |
| --- | --- | --- |
| `cors[].enabled` | `true` | Enables this CORS rule. |
| `cors[].origins[]` | `*` | Allowed origin pattern. Replace the wildcard with trusted origins in production. |

## OpenAPI

| Path | Sample | Purpose |
| --- | --- | --- |
| `openapi.host` | `http://localhost:9000` | Host used in the generated API definition. |
| `openapi.basePath` | `/services` | Common service base path. |
| `openapi.schemes[]` | `http` | Allowed schemes in the generated definition. |
| `openapi.servers[].url` | `http://localhost:9000/services` | OpenAPI server URL. |
| `openapi.servers[].description` | `Local Development` | Human-readable server label. |

## Extension container

| Path | Sample | Purpose |
| --- | --- | --- |
| `remote` | `{}` | Empty extension object for named remote-service connections. ReAuthKit does not define one in the sample. |

The complete local HTTP/WebSocket surface is documented in [API and extension reference](api.md).
