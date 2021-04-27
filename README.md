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

> You'll need to configure an SMTP connection for the password recovery feature to function properly.

You'll also need to copy the sample service config file by running 

`cp website/src/common/sample_Config.js website/src/common/Config.js` 

and modifying to match your local environment configuration.

## Running

In the Netuno root directory run

`./netuno server app=react_auth`

and it should start both the backend and the frontend server.