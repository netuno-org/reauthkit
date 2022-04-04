const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
                '@layout-body-background': '#ffffff',
                '@layout-footer-background': '#EFF8FF',
                '@layout-header-background': '#ffffff',
                '@layout-trigger-color': '#002140',
                '@layout-zero-trigger-height': '64px',
                '@layout-zero-trigger-width': '70px'
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
/*

 "@animated-burgers/burger-slip": "^1.1.2",
    "@ant-design/icons": "^4.7.0",
    "@netuno/service-client": "^1.0.10",
    "@testing-library/jest-dom": "^5.14.1",
    "@testing-library/react": "^12.0.0",
    "@testing-library/user-event": "^13.2.1",
    "antd": "^4.18.7",
    "classnames": "^2.3.1",
    "craco-less": "^2.0.0",
    "react-dom": "^17.0.2",
    "react-ga": "^3.3.0",
    "react-icons": "^4.3.1",
    "react-map-gl": "^7.0.9",
    "react-router-dom": "^6.2.1",
    "react-scripts": "5.0.0",
    "react-scroll-parallax": "^3.0.3",
    "sal.js": "^0.8.5",
    "sprintf-js": "^1.1.2",
    "web-vitals": "^2.1.0"
*/