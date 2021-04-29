import config from '../config/config.json';
import _service from '@netuno/service-client';

_service.config({
    prefix: config.api.services
});