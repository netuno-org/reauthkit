import React, {useState} from "react";

import {Row, Col, Typography} from "antd";

import Chat from "./Chat";

import "./index.less";
import FriendsList from "./FriendsList/index.jsx";

const { Title } = Typography;

function Messages() {
    const [chatFriend, setChatFriend] = useState(null);
    const onFriendSelected = (friend) => {
        setChatFriend(friend);
    };
    return (
        <section className="messages">
            <Title level={2}>Mensagens</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <FriendsList selectedFriend={chatFriend} onFriendSelected={onFriendSelected} />
                </Col>
                <Col span={16}>
                    <Chat friend={chatFriend} />
                </Col>
            </Row>
        </section>
    );
}

export default Messages;