import config from '../config/config.json';
import _service from '@netuno/service-client';
import {notification} from 'antd';

_service.config({
    prefix: config.api.services
});

notification.config({
  placement: 'topRight',
  top: 100,
  duration: 3,
  rtl: false,
});
