import React from "react";
import {Avatar, Badge, Col, Row} from "antd";
import dayjs from "dayjs";
import _service from "@netuno/service-client";

import "./index.less";

function FriendItem({ uid, name, avatar, online, latest_message, unread_messages, className, onClick }) {
    return (
        <li onClick={onClick} className={`messages__friends-list__item ${className || ""}`}>
            <Row align="middle">
                <Col flex="46px" className="messages__friends-list__item__avatar">
                    <Badge dot={online} color="#52c41a" offset={[-4, 32]}>
                        <Avatar size={40} icon={<img src={
                            avatar ? _service.url(`/profile/avatar?uid=${uid}&${new Date().getTime()}`) : '/images/profile-default.png'
                        }/>} />
                    </Badge>
                </Col>
                <Col flex="auto" className="messages__friends-list__item__name">
                    {name}
                </Col>
                <Col flex="50px" className="messages__friends-list__item__messages">
                  {unread_messages > 0 && <>
                    <div className="messages__friends-list__item__messages__latest">{dayjs(latest_message).fromNow(true)}</div>
                    <Badge color="green" count={unread_messages} />
                  </>}
                </Col>
            </Row>
        </li>
    );
}

export default FriendItem;
