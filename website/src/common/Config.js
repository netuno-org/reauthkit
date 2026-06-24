import _service from '@netuno/service-client';
import {notification} from 'antd';
import _auth from "@netuno/auth-client";

class Config {
  static init() {
    const { config } = window.reauthkit;
    _service.config({
      prefix: config.services.prefix
    });
    _auth.config({
      storage: 'local'
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

  static push() {
    const { config } = window.reauthkit;
    if ("serviceWorker" in navigator) {
      send().catch(err => console.error(err));
    }

    async function send() {
      navigator.serviceWorker.register("/push-worker.js", {
        scope: "/"
      }).then((registration) => {
        registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(config.push.key)
        }).then((subscription) => {
          _service({
            method: "POST",
            url: "notification/subscribe",
            data: subscription,
          })
        });
      });
    }

    function urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
  }
}

export default Config;
