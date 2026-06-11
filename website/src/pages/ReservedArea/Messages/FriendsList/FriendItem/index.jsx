import React from "react";
import {Avatar, Badge, Col, Row} from "antd";
import dayjs from "dayjs";
import _service from "@netuno/service-client";

import "./index.less";

function FriendItem({ uid, name, avatar, online, latest_message, unread_messages, onClick }) {
    return (
        <li onClick={onClick} className="messages__friends-list__item">
            <Row align="middle">
                <Col flex="50px" className="messages__friends-list__item__avatar">
                    <Avatar size={40} icon={<img src={
                        avatar ? _service.url(`/profile/avatar?uid=${uid}&${new Date().getTime()}`) : '/images/profile-default.png'
                    }/>} />
                    { online && <div className="messages__friends-list__item__avatar__badge">
                        <Badge dot={true} color="green"></Badge>
                    </div> }
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
