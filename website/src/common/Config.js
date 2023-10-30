import _service from '@netuno/service-client';
import {notification} from 'antd';

class Config {
  static init() {
    const { config } = window.reauthkit;
    _service.config({
      prefix: config.api.endpoint
    });
    notification.config({
      placement: 'topRight',
      top: 100,
      duration: 3,
      rtl: false,
    });
  }

  static authProviders() {
    const { config } = window.reauthkit;
    return config.auth.providers;
  }
}

export default Config;