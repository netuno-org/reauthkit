![Logo](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/logo.svg)

# ReAuthKit

A ready to use boilerplate solution for user registration, authentication, profile editing and reserved area using [Netuno](https://www.netuno.org/), [JWT](https://jwt.io/), [ReactJS](https://reactjs.org/), [Redux](https://redux.js.org/) and [Ant Design](https://ant.design/).

![Billboard](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/billboard.png)

## Installation

#### Netuno

[Follow the steps here](https://doc.netuno.org/docs/get-started/installation)

#### ReAuthKit App

Clone this project to `(Netuno Root directory)/apps/reauthkit/`.

## Configuration

For a description of every sample configuration key, see the [complete configuration reference](docs/configuration.md). For every local HTTP/WebSocket route, implementation status, server-core export, and lifecycle hook, see the [API and extension reference](docs/api.md).

> The following process is oriented to Linux and macOS development environments, with notes for Microsoft Windows where needed.

1. Copy the app sample configuration file by running (in the app root directory):

    * `cp config/sample.json config/_development.json` (for a development environment)

    * `cp config/sample.json config/_production.json` (for a production environment)

    and adjust `_development.json` and/or `_production.json` for your environment.

> You can change the application name by changing the folder name and the `name` configuration parameter.

2. In the selected configuration file, set `settings.website.services.prefix` and `settings.website.websocket` to the correct Netuno endpoints. For example:

```
  "settings": {
    "website": {
      "services": {
        "prefix": "http://localhost:9000/services"
      },
      "websocket": {
        "url": "ws://localhost:9000/ws/private/",
        "servicesPrefix": "/services"
      }
    }
  }

```

> Attention: The WebSocket and Services endpoints configuration is automatically exported to the website, which can use these addresses directly.

3. You'll need to configure an SMTP connection for the password recovery feature to function properly, [learn how to do it here.](https://doc.netuno.org/docs/academy/server/services/sending-emails/)

4. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here.](https://doc.netuno.org/docs/academy/server/database/psql)

5. Replace the sample value at `auth` > `jwt` > `secret` with a random secret of at least 16 characters; 32 or more is recommended. [Secure password generator.](https://www.lastpass.com/features/password-generator)

6. To configure OpenAPI definition look at `openapi` settings, [learn how to do it here.](https://doc.netuno.org/docs/academy/server/services/openapi)

7. Install the front-end modules using [Bun](https://bun.sh/):

    - Website:
    ```bash
    cd website
    bun install
    bun pm trust --all
    ```
   - Backoffice UI:
    ```bash
    cd ui
    bun install
    bun pm trust --all
    ```

## Running

In the Netuno root directory run

`./netuno server app=reauthkit`

and it should start both the back-end and the front-end server.

> The first run may take a while due to the installation of frontend dependencies.

By default, the Netuno back office will be available in:

- http://localhost:9000/

The OpenAPI will be in:

- http://localhost:9000/services/_openapi

And the front-end (restricted website) will start in:

- http://localhost:3000/

## Production

In production, change the Netuno environment to `production`, this is done in the main Netuno configuration file, `config.js` which is located at the root, like this:

```
config.env = 'production'
```

In `config/_production.json`, set `enabled` to `false` for every entry in `commands`, because the development watchers should not run with Netuno in production.

To install the website dependencies and create its optimized `website/dist` build, run `bash build.sh` from `(application root directory)/website/`. On Microsoft Windows, run `build.bat` from the same directory. These production scripts use npm.

## Style

To customize the website in general, change the Ant Design theme settings.

In the `website/src/App.jsx`  file, look for the `ConfigProvider` component and adapt the `theme` attribute values.

> See the [official Ant Design documentation on theme customization](https://ant.design/docs/react/customize-theme).

The LESS variable settings can be found here: `website/src/styles/variables.less`.

## Screenshots

Some screenshots below.

### Desktop

##### Login
![Login](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/login.png)
##### Register
![Register](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/registration.png)
##### Reserved Area
![Reserved Area](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/reserved-area.png)
##### Edit Profile
![Edit Profile](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/desktop/edit-profile.png)

### Mobile

Login  |  Registration
:-------------------------:|:-------------------------:
![Login](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/login.png)  |  ![Register](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/registration.png)

Reserved Area  |  Profile + Avatar 1
:-------------------------:|:-------------------------:
![Reserved Area](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/reserved-area.png)  |  ![Profile + Avatar 1](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-1.png)

Profile + Avatar 2 |  Profile Edit
:-------------------------:|:-------------------------:
![Profile + Avatar 2](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-2.png)  |  ![Profile Edit](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/prinstscreens/mobile/edit-profile-3.png)
