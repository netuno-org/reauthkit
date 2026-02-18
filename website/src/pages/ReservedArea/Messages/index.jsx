import React, {useState} from "react";

import {Row, Col, Typography, Input} from "antd";

import Chat from "./Chat";

import "./index.less";

const { Title } = Typography;

function Messages() {
    const [messageSubmitting, setMessageSubmitting] = useState(false);
    return (
        <section className="messages">
            <Title level={1}>Mensagens</Title>
            <div>
                <p>Troca de mensagens entre os utilizadores.</p>
            </div>
            <Row>
                <Col span={4}>
                    Amigos
                </Col>
                <Col span={20}>
                    <Chat />
                </Col>
            </Row>
        </section>
    );
}

export default Messages;