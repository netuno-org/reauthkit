const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1890ff',
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
