import React from "react";
import {Avatar, Badge, Col, Row} from "antd";
import _service from "@netuno/service-client";

import "./index.less";

function FriendItem({ uid, name, avatar, onClick }) {
    return (
        <li onClick={onClick} className="messages__friends-list__item">
            <Row align="middle">
                <Col flex="50px" className="messages__friends-list__item__avatar">
                    <Avatar size={40} icon={<img src={
                        avatar ? _service.url(`/profile/avatar?uid=${uid}&${new Date().getTime()}`) : '/images/profile-default.png'
                    }/>} />
                    <div className="messages__friends-list__item__avatar__badge">
                        <Badge dot={true} color={'green'}></Badge>
                    </div>
                </Col>
                <Col flex="auto" className="messages__friends-list__item__name">
                    {name}
                </Col>
            </Row>
        </li>
    );
}

export default FriendItem;
