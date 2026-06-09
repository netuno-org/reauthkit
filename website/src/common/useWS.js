import {wsLoadAction} from "../redux/actions/index.js";
import {useDispatch, useSelector} from "react-redux";
import _ws from "@netuno/ws-client";
import _auth from "@netuno/auth-client";
import Config from "./Config.js";
import {useEffect, useState} from "react";

function useWS() {
  const dispatch = useDispatch();
  const baseData = useSelector((state) => state.ws.data);
  const [data, setData] = useState(baseData);
  const [connecting, setConnecting] = useState(false);
  useEffect(()=>{
    setData(baseData);
  }, [baseData]);
  const load = (onFinish) => {
    _ws.config({
      url: Config.websocketURL() + '?auth='+ _auth.accessToken(),
      servicesPrefix: Config.websocketServicesPrefix(),
      method: 'GET',
      autoReconnect: true,
      connect: (event) => {
        console.log('ws connect', event);
        setConnecting(false);
        dispatch(wsLoadAction({connected: true}));
        onFinish && onFinish(true);
      },
      close: (event) => {
        console.log('ws close', event);
        setConnecting(false);
        dispatch(wsLoadAction({connected: false}));
        onFinish && onFinish(false);
      },
      error: (error) => {
        console.log('ws error', error);
        setConnecting(false);
        dispatch(wsLoadAction({connected: false}));
        onFinish && onFinish(false);
      },
      message: (data, event) => {
        console.log('ws message', {data, event});
      }
    });
    _ws.connect();
    setConnecting(true);
  };
  return {
    isConnecting: ()=> connecting,
    data,
    load,
    close: ()=> _ws.close()
  }
}

export default useWS;