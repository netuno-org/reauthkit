import {peopleLoadAction} from "../redux/actions/index.js";
import {useDispatch, useSelector} from "react-redux";
import _service from "@netuno/service-client";
import globalNotification from "./globalNotification.js";
import _auth from "@netuno/auth-client";

function usePeople() {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.people.data);
    const load = (onFinish) => {
        _service({
            method: 'GET',
            url: 'people',
            success: (response) => {
                if (response.json.result) {
                    dispatch(peopleLoadAction(response.json.data));
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
            dispatch(peopleLoadAction(data));
        },
        load,
        unload: () => {
            dispatch(peopleLoadAction(null));
        },
        reload: () => {
            dispatch(peopleLoadAction(null));
            load();
        }
    };
}

export default usePeople;
