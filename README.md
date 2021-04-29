# Netuno React AUTH

A ready to use boilerplate solution for user registration, authentication, profile editing and reserved area using [Netuno](https://www.netuno.org/), [JWT](https://jwt.io/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Installation

#### Netuno

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

#### React AUTH

Clone this project to `(Netuno Root directory)/apps/react_auth/`.

Then install the NPM dependencies by running 

`npm install` 

in the `react_auth/website/` directory.

## Configuration

> The following process is oriented to Linux development environments with a few notes also destined to Microsoft Windows development environments.

1. Copy the app sample configuration file by running (in the app root directory):

    * `cp config/sample.json config/_development.json` (for a development environment)

    * `cp config/sample.json config/_production.json` (for a production environment)

    and adjust the `_development.json` and/or `_production_.json` file accordingly to your environment.

2. You'll need to configure an SMTP connection for the password recovery feature to function properly, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/services/sending-emails/)

3. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here.](https://doc.netuno.org/docs/en/academy/server/database/psql/)

4. Locate and replace the word `JWTRandomSecureSecret` by a secret code, as random as possible, since this is what ensures the security of users' credentials. For example: `#J&Az+7(8d+k/9q]` . [Recommended Secure Code Generation tool.](https://passwordsgenerator.net/)

5. You'll also need to configure the website sample config file located in `website/src/config/`:

    1. Change the configurations inside `_development_config.json` and `_production_config.json` for development and production environments respectively.

    2. Inside the same folder run `cp _development_config.json config.json` to create the configuration file based on the development configuration.

    > To create a production ready build just run `bash build.sh` in `(app root directory)/website/` which will momentarily create a `config.json` based on the production configuration file and when it's finished it should revert back to the development configuration.

    > There's also a `build.bat` present in `(app root directory)/website/` for Microsoft Windows development environments.

## Running

In the Netuno root directory run

`./netuno server app=react_auth`

and it should start both the backend and the frontend server.

## Screenshots

Some screenshots below.

### Desktop

##### Login
![Login](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/login.png)
##### Register
![Register](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/registration.png)
##### Reserved Area
![Reserved Area](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/reserved-area.png)
##### Edit Profile
![Edit Profile](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/desktop/edit-profile.png)

### Mobile

Login  |  Registration
:-------------------------:|:-------------------------:
![Login](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/login.png)  |  ![Register](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/registration.png)

Reserved Area  |  Edit Profile
:-------------------------:|:-------------------------:
![Reserved Area](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/reserved-area.png)  |  ![Edit Profile](https://raw.githubusercontent.com/netuno-org/react-auth/main/docs/prinstscreens/mobile/edit-profile.png)
