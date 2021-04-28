# Netuno React AUTH

A ready to use solution for user registration, authentication, profile editing and reserved area using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Installation

#### Netuno

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

#### React AUTH

Clone this project to `(Netuno Root directory)/apps/react_auth/`.

Then install the NPM dependencies by running 

`npm install` 

in the `react_auth/website/` directory.

## Configuration

Copy the app sample configuration file by running (in the app root directory) 

`cp config/sample.json config/_development.json` 

and adjust the `_development.json` file accordingly to your local environment.

> Locate and replace the word `JWTRandomSecureSecret` by a secret code, as random as possible, since this is what ensures the security of users' credentials. For example: `#J&Az+7(8d+k/9q]` . [Secure Code Generation.](https://passwordsgenerator.net/)

> You'll need to configure an SMTP connection for the password recovery feature to function properly.

You'll also need to copy the sample service config file by running 

`cp website/src/common/sample_Config.js website/src/common/Config.js` 

and modifying to match your local environment configuration.

## Running

In the Netuno root directory run

`./netuno server app=react_auth`

and it should start both the backend and the frontend server.

## Print Screen

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
