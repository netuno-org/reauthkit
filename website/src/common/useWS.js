import {wsLoadAction} from "../redux/actions/index.js";
import {useDispatch, useSelector} from "react-redux";
import _ws from "@netuno/ws-client";
import _auth from "@netuno/auth-client";
import Config from "./Config.js";

function useWS() {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.ws.data);
  const load = (onFinish) => {
    _ws.config({
      url: Config.websocketURL() + '?auth='+ _auth.accessToken(),
      servicesPrefix: Config.websocketServicesPrefix(),
      method: 'GET',
      autoReconnect: true,
      connect: (event) => {
        console.log('ws connect', event);
        dispatch(wsLoadAction({connected: true}));
        onFinish && onFinish(true);
      },
      close: (event) => {
        console.log('ws close', event);
        dispatch(wsLoadAction({connected: false}));
        onFinish && onFinish(false);
      },
      error: (error) => {
        console.log('ws error', error);
        dispatch(wsLoadAction({connected: false}));
        onFinish && onFinish(false);
      },
      message: (data, event) => {
        console.log('ws message', {data, event});
      }
    });
    _ws.connect();
  };
  return {
    data,
    load
  }
}

export default useWS;