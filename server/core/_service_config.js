
/**
 *  When service need public access...
 */
if (_env.is("dev")) {
    _service.allow()
}

/*
if (_service.path == 'samples/my-service') {
    _service.allow()
}
*/

if (_service.path == 'people/avatar/get'
   || _service.path == 'people/post'
   || _service.path == 'people/options'
   || _service.path == 'recovery/put'
   || _service.path == 'recovery/post'
   || _service.path == 'recovery/options') {
    _service.allow()
}

