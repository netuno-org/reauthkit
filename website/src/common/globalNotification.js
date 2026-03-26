
let _api = null;

export default {
    api: (...args) => {
        if (args.length > 0) {
            _api = args[0];
        }
        return _api;
    },
    serviceFail({title, description}) {
        _api.error({title, description});
    },
    success({title, description}) {
        _api.success({title, description});
    },
    info({title, description}) {
        _api.info({title, description});
    },
    warning({title, description}) {
        _api.warning({title, description});
    },
    error({title, description}) {
        _api.error({title, description});
    }
};
