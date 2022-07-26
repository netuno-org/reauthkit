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

2. You'll need to configure an SMTP connection for the password recovery feature to function properly, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/services/sending-emails/)

3. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/database/psql/)

4. Locate and replace the word `JWTRandomSecureSecret` by a secret code, as random as possible, since this is what ensures the security of users' credentials. For example: `#J&Az+7(8d+k/9q]` . [Recommended Secure Code Generation tool.](https://passwordsgenerator.net/)

5. You'll also need to configure the website sample config file located in `website/src/config/`:

    1. Change the configurations inside `_development_config.json` and `_production_config.json` for development and production environments respectively.

    2. Inside the same folder run `cp _development_config.json config.json` to create the configuration file based on the development configuration.

    > To create a production ready build just run `bash build.sh` in `(app root directory)/website/` which will momentarily create a `config.json` based on the production configuration file and when it's finished it should revert back to the development configuration.

    > There's also a `build.bat` present in `(app root directory)/website/` for Microsoft Windows development environments.

6. To configure OpenAPI definition look at `openapi` settings, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/services/openapi/)

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

## Style

Indications for the general styling of the restricted website.

### Dark

Here's how the dark style can be applied.

Adjust the variables in `website/src/craco.config.js`:

```
  ...
  '@primary-color': '#1890ff',
  '@menu-bg': '#141414',
  '@layout-body-background': '#202020',
  '@layout-footer-background': '#303030',
  '@layout-header-background': '#141414',
  '@layout-trigger-color': '#eff8ff',
  ...
```

> [Full Ant.Design variables list.](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

In the `website/src/styles/variables.less` adjust the Ant.Design theme import, comment out the default theme (light) and uncomment the dark one:

```
//@import '~antd/lib/style/themes/default.less';
@import '~antd/lib/style/themes/dark.less';
```

In `website/src/App.js` look for the `Sider` component tag and remove the `theme="light"` attribute.

### Light

Here's how the clear style can be applied.

Adjust the variables in `website/src/craco.config.js`:

```
  ...
  '@primary-color': '#1890ff',
  '@menu-bg': '#ffffff',
  '@layout-body-background': '#ffffff', 
  '@layout-footer-background': '#eff8ff',
  '@layout-header-background': '#ffffff',
  '@layout-trigger-color': '#002140',
  ...
```

> [Full Ant.Design variables list.](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

In the `website/src/styles/variables.less` adjust the Ant.Design theme import, comment out the dark theme and uncomment the default (light):

```
@import '~antd/lib/style/themes/default.less'; 
//@import '~antd/lib/style/themes/dark.less';
```

In `website/src/App.js` look for the `Sider` component tag and add the `theme="light"` attribute.

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
