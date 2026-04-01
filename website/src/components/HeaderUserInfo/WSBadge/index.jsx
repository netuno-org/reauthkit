import React, {useEffect, useState} from "react";
import {Badge} from "antd";

import _ws from '@netuno/ws-client';

import Config from "../../../common/Config.js";

import "./index.less";

function WSBadge() {
    const [state, setState] = useState(0);
    const [messageUnreadTotal, setMessageUnreadTotal] = useState(0);
    useEffect(() => {
        const accessToken = JSON.parse(sessionStorage.getItem("_auth_token")).access_token;
        _ws.config({
            url: Config.websocketURL() + '?auth='+ accessToken,
            servicesPrefix: Config.websocketServicesPrefix(),
            method: 'GET',
            autoReconnect: true,
            connect: (event) => {
                console.log('ws connect', event);
                setState(1);
            },
            close: (event) => {
                console.log('ws close', event);
                setMessageUnreadTotal(0);
                setState(-1);
            },
            error: (error) => {
                console.log('ws error', error);
                setMessageUnreadTotal(0);
                setState(-1);
            },
            message: (data, event) => {
                console.log('ws message', {data, event});
            }
        });
        _ws.connect();
    }, []);
    useEffect(() => {
        if (state === 1) {
            const listenerMessageUnreadCountRef = _ws.addListener({
                method: "GET",
                service: "message/unread/count",
                success: (data) => {
                    setMessageUnreadTotal(data.content.total);
                }
            });
            _ws.sendService({
                method: "GET",
                service: "message/unread/count"
            });
            return () => {
                _ws.removeListener(listenerMessageUnreadCountRef);
            }
        }
    }, [state]);
    return (
        <div className="header__user-info__avatar__badge"
            style={{
                backgroundColor: (state === 0 && '#d87a16') || (state === 1 && '#49aa19') || (state === -1 && '#dc4446'),
                width: messageUnreadTotal > 99 ? '26px' : messageUnreadTotal > 10 ? '22px' : '16px',
                right: messageUnreadTotal > 99 ? '0' : messageUnreadTotal > 10 ? '2px' : '5px',
            }}
        >
            {messageUnreadTotal === 0 ? null : messageUnreadTotal > 99 ? '+99' : messageUnreadTotal}
        </div>
    );
}

export default WSBadge;
