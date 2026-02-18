import React, {useState} from "react";

import {Row, Col, Form, Input, Button} from "antd";

import "./index.less";

const {TextArea} = Input;

function Chat() {
    const [submitting, setSubmitting] = useState(false);
    return (
        <div className="messages__chat">
            Mensagem
            <Form layout="vertical" onSubmit={e => {}}>
                <Row gutter={20}>
                    <Col span={16}>
                        <Form.Item
                            label="Mensagem"
                            name="message"
                            rules={[
                                { required: true, message: 'Insira a mensagem.' },
                            ]}
                        >
                            <TextArea rows={3} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label={<>&nbsp;</>}>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                Enviar
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default Chat;