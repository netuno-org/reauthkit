![Logo](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/logo.svg)

# ReAuthKit

A ready to use boilerplate solution for user registration, authentication, profile editing and reserved area using [Netuno](https://www.netuno.org/), [JWT](https://jwt.io/), [ReactJS](https://reactjs.org/), [Redux](https://redux.js.org/) and [Ant Design](https://ant.design/).

![Billboard](https://raw.githubusercontent.com/netuno-org/reauthkit/main/docs/billboard.png)

## Installation

#### Netuno

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

#### ReAuthKit App

Clone this project to `(Netuno Root directory)/apps/reauthkit/`.

## Configuration

> The following process is oriented to Linux development environments with a few notes also destined to Microsoft Windows development environments.

1. Copy the app sample configuration file by running (in the app root directory):

    * `cp config/sample.json config/_development.json` (for a development environment)

    * `cp config/sample.json config/_production.json` (for a production environment)

    and adjust the `_development.json` and/or `_production_.json` file accordingly to your environment.

> You can change the application name by changing the folder name and the `name` configuration parameter.

2. According to your development environment, change the `.json` file in the `settings.api.endpoint` key to the correct address of Neptune services, example:

```
  ...
    "api": {
      "endpoint": "http://localhost:9000/services/"
    },
  ...

```

> Attention: The API Endpoint configuration is exported so that the website can access the service addresses, by defining the URL prefix in the service client.

3. You'll need to configure an SMTP connection for the password recovery feature to function properly, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/services/sending-emails/)

4. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/database/psql/)

5. Locate `auth` > `jwt` > `secret` and must set a secret code with 32 characters, as random as possible, since this is what ensures the security of users' credentials. [Recommended Secure Code Generation tool.](https://passwordsgenerator.net/)

6. To configure OpenAPI definition look at `openapi` settings, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/services/openapi/)

7. Install the front-end modules:

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

In the application configuration, in the `config/_production.json` file, disable the `commands`, set the value of all `enabled` commands to `false`, because in production we do not want NPM commands being executed together with Netuno.

Inside the website folder run:

```
npm install

```

To create the optimized production version of the website, simply run `bash build.sh` in the directory `(application root directory)/website/`. The `build.bat` file is also found in `(application root directory)/website/` intended for development environments on Microsoft Windows.

## Style

To customize the website in general, change the Ant.Design theme settings.

In the `website/src/App.jsx`  file, look for the `ConfigProvider` component and adapt the `theme` attribute values.

> See the [official Ant.Design documentation on theme customization](https://ant.design/docs/react/customize-theme).

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
