import {profileLoadAction} from "../redux/actions/index.js";
import {useDispatch, useSelector} from "react-redux";
import _service from "@netuno/service-client";
import globalNotification from "./globalNotification.js";
import _auth from "@netuno/auth-client";
import {useEffect, useState} from "react";

let unloaded = false;

function useProfile() {
  const dispatch = useDispatch();
  const baseData = useSelector((state) => state.profile.data);
  const [data, setData] = useState(baseData);
  useEffect(()=>{
    setData(baseData);
  }, [baseData]);
  const load = (onFinish) => {
    unloaded = false;
    _service({
      method: 'GET',
      url: 'profile',
      success: (response) => {
        if (response.json.result) {
          dispatch(profileLoadAction(response.json.data));
          onFinish && onFinish(true);
        } else {
          globalNotification.warning({
            title: 'Dados do Utilizador',
            description: response.json.error,
          });
          onFinish && onFinish(false);
          _auth.logout();
        }
      },
      fail: (e) => {
        console.error('Dados do Utilizador', e);
        globalNotification.serviceFail({
          title: 'Dados do Utilizador',
          description: 'Ocorreu um erro a carregar os dados, por favor tente novamente mais tarde.',
        });
        _auth.logout();
        onFinish && onFinish(false);
      }
    });
  };
  return {
    data,
    set: (data) => {
      dispatch(profileLoadAction(data));
    },
    load,
    unload: () => {
      unloaded = true;
      dispatch(profileLoadAction(null));
    },
    isUnloaded: ()=> unloaded,
    reload: () => {
      dispatch(profileLoadAction(null));
      load();
    },
    reset: () => {
      unloaded = false;
      dispatch(profileLoadAction(null));
    }
  };
}

export default useProfile;
