const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        lessOptions: {
            modifyVars: {
                '@layout-body-background': '#ffffff',
                '@layout-footer-background': '#EFF8FF',
                '@layout-header-background': '#ffffff',
                '@layout-trigger-color': '#002140',
                '@layout-zero-trigger-height': '64px',
                '@layout-zero-trigger-width': '70px'
            },
            javascriptEnabled: true
        },
    }),
);