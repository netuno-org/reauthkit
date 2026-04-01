import React, {useEffect, useState} from "react";

import {Spin} from "antd";

import _ws from "@netuno/ws-client";

import Message from "./Message/index.jsx";

import "./index.less";

function History({friend, reload}) {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const listenerMessageRef = _ws.addListener({
            method: "POST",
            service: "message/list",
            success: (data) => {
                setLoading(false);
                setMessages(data.content);
            },
            fail: (error)=> {
                setLoading(false);
            }
        });
        onLoad();
        return () => {
            _ws.removeListener(listenerMessageRef);
        }
    }, [friend]);
    useEffect(() => {
        if (reload > 0) {
            onLoad();
        }
    }, [reload]);
    const onLoad = () => {
        _ws.sendService({
            method: "POST",
            service: "message/list",
            data: {
                with: friend.uid
            }
        });
    };
    return (
        <ul className="messages__chat__history">
            {loading && <li><Spin /></li>}
            { messages.map((message) => (
                <Message key={message.uid} friend={friend} data={message} />
            )) }
        </ul>
    );
}

export default History;