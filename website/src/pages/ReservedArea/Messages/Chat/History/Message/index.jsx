import React from "react";

import {Avatar, Col, Row, Card, Button, Popover} from "antd";
import _service from "@netuno/service-client";

import "./index.less";

function Message({friend, data}) {

    if (friend.uid === data.from) {
        return (
            <li className="messages__chat__history__message">
                <Card style={{ width: "70%" }}>
                    <Row align="middle">
                        <Col flex="50px">
                            <Avatar size={40} icon={<img src={
                                friend.avatar ? _service.url(`/people/avatar?uid=${friend.uid}&${new Date().getTime()}`) : '/images/profile-default.png'
                            }/>} />
                        </Col>
                        <Col flex="auto">
                            {friend.name}
                        </Col>
                    </Row>
                    <blockquote style={{margin: "10px 0 0 0"}}>{data.message}</blockquote>
                    {/*
                    <span>{data.sent_on}</span>
                    &middot; <span>{data.read_on}</span>
                    */}
                </Card>
            </li>
        );
    }
    return (
        <li className="messages__chat__history__message">
            <Card className="messages__chat__history__message__user" style={{ width: "70%", marginLeft: "auto", textAlign: "right" }}>
                <blockquote style={{margin: "0"}}>{data.message}</blockquote>
                {/*
                <span>{data.sent_on}</span>
                &middot; <span>{data.read_on}</span>
                */}
            </Card>
        </li>
    )
}

export default Message;