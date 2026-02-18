import React, {useEffect, useState} from "react";
import {Badge} from "antd";

import _ws from '@netuno/ws-client';

function WSBadge({children}) {
    const [state, setState] = useState(0);
    useEffect(() => {
        const accessToken = JSON.parse(sessionStorage.getItem("_auth_token")).access_token;
        _ws.config({
            url: 'ws://localhost:9000/ws/private/?auth='+ accessToken,
            servicesPrefix: '/services',
            method: 'GET',
            autoReconnect: true,
            connect: (event) => {
                console.log('ws connect', event);
                setState(1);
            },
            close: (event) => {
                console.log('ws close', event);
                setState(-1);
            },
            error: (error) => {
                console.log('ws error', error);
                setState(-1);
            },
            message: (data, event) => {
                console.log('ws message', {data, event});
            }
        });
        _ws.connect();
    }, []);
    return (
        <Badge dot={true} color={(state === 0 && 'orange') || (state === 1 && 'green') || (state === -1 && 'red')}>{children}</Badge>
    );
}

export default WSBadge;
