import React, {useEffect, useState} from "react";

import {Row, Col, Form, Input, Button, notification} from "antd";

import _ws from "@netuno/ws-client";

import History from "./History";

import "./index.less";
import globalNotification from "../../../../common/globalNotification.js";

const {TextArea} = Input;

function Chat({friend}) {
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [historyReload, setHistoryReload] = useState(0);
  const [form] = Form.useForm();
  useEffect(() => {
    setHistoryReload(0);
  }, [friend])
  const onFinish = ({message}) => {
    _ws.sendService({
      method: "POST",
      service: "message",
      data: {
        to: friend.uid,
        message
      },
      start: () => setMessageSubmitting(true),
      success: () => {
        form.resetFields([["message"]]);
        setHistoryReload(historyReload + 1);
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: 'Enviar Mensagem',
          description: 'Ocorreu um erro no envio da mensagem, por favor contacte-nos através do suporte ou tente novamente mais tarde.',
        })
      },
      end: () => setMessageSubmitting(false),
    });
  };
  if (friend == null) {
    return (<div/>);
  }
  return (
    <div className="messages__chat">
      <History friend={friend} reload={historyReload}/>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={20} align="tpp">
          <Col flex="auto">
            <Form.Item
              name="message"
              rules={[
                {required: true, message: 'Insira a mensagem.'},
              ]}
            >
              <TextArea placeholder="Mensagem" rows={3}/>
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item label={<>&nbsp;</>}>
              <Button type="primary" htmlType="submit" loading={messageSubmitting}>
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