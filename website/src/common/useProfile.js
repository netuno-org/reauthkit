import {profileLoadAction} from "../redux/actions/index.js";
import {useDispatch, useSelector} from "react-redux";
import _service from "@netuno/service-client";
import globalNotification from "./globalNotification.js";
import _auth from "@netuno/auth-client";

function useProfile() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.profile.data);
    const load = (onFinish) => {
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
            dispatch(profileLoadAction(null));
        },
        reload: () => {
            dispatch(profileLoadAction(null));
            load();
        }
    };
}

export default useProfile;
