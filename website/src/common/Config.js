import _service from '@netuno/service-client';
import {notification} from 'antd';

class Config {
  static init() {
    const { config } = window.reauthkit;
    _service.config({
      prefix: config.services.prefix
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

  static websocketURL() {
    const { config } = window.reauthkit;
    return config.websocket.url;
  }

  static websocketServicesPrefix() {
    const { config } = window.reauthkit;
    return config.websocket.servicesPrefix;
  }

  static authAltcha() {
    const { config } = window.reauthkit;
    return !!config.auth.altcha;
  }
}

export default Config;
