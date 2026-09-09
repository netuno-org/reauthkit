import React, { useEffect, useState } from "react";
import { Form, Input, Button, Popover } from "antd";
import { SendOutlined, SmileOutlined, CloseOutlined, RollbackOutlined } from "@ant-design/icons";
import _ws from "@netuno/ws-client";

import History from "./History";
import "./index.less";
import globalNotification from "../../../../common/globalNotification.js";

const { TextArea } = Input;

const QUICK_EMOJIS = ["😀", "😂", "❤️", "👍", "🔥", "🎉", "😮", "🙏", "💯", "👋", "🥳", "✨"];

function Chat({ friend }) {
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [emojiPopoverOpen, setEmojiPopoverOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [newSentMessage, setNewSentMessage] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setReplyingTo(null);
    setMessageText("");
    setNewSentMessage(null);
    form.resetFields();
  }, [friend]);

  const onFinish = ({ message }) => {
    if (!message || message.trim() === "") return;

    _ws.sendService({
      method: "POST",
      service: "message",
      data: {
        to: friend.uid,
        message: message.trim(),
        ...(replyingTo ? { parent_uid: replyingTo.uid } : {}),
      },
      start: () => setMessageSubmitting(true),
      success: (response) => {
        form.resetFields(["message"]);
        setMessageText("");
        setReplyingTo(null);
        const payload = response?.content?.content || response?.content || response?.data;
        if (payload && payload.uid) {
          setNewSentMessage(payload);
        }
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: "Enviar Mensagem",
          description: "Ocorreu um erro no envio da mensagem, por favor tente novamente mais tarde.",
        });
      },
      end: () => setMessageSubmitting(false),
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.submit();
    }
  };

  const handleEmojiInsert = (emoji) => {
    const currentVal = form.getFieldValue("message") || "";
    const updatedVal = currentVal + emoji;
    form.setFieldsValue({ message: updatedVal });
    setMessageText(updatedVal);
    setEmojiPopoverOpen(false);
  };

  if (friend == null) {
    return (
      <div className="messages__chat-empty">
        <p>Seleciona um contacto para iniciar a conversa.</p>
      </div>
    );
  }

  const emojiPickerContent = (
    <div className="messages__input-emoji-grid">
      {QUICK_EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="messages__input-emoji-btn"
          onClick={() => handleEmojiInsert(emoji)}
        >
          {emoji}
        </button>
      ))}
    </div>
  );

  return (
    <div className="messages__chat">
      <div className="messages__chat__header">
        <span className="messages__chat__header__name">{friend.name}</span>
        {friend.online && <span className="messages__chat__header__status">Online</span>}
      </div>

      <History friend={friend} newSentMessage={newSentMessage} onReply={(msg) => setReplyingTo(msg)} />

      {replyingTo && (
        <div className="messages__chat__reply-bar">
          <div className="messages__chat__reply-bar__content">
            <RollbackOutlined style={{ marginRight: 6 }} />
            <span>
              A responder a <strong>{replyingTo.from === friend.uid ? friend.name : "você"}</strong>:{" "}
              <em>{replyingTo.message}</em>
            </span>
          </div>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => setReplyingTo(null)}
          />
        </div>
      )}

      <Form form={form} layout="vertical" onFinish={onFinish} className="messages__chat__form">
        <div className="messages__chat__input-wrapper">
          <div className="messages__chat__input-box">
            <div className="messages__chat__input-box__left">
              <Popover
                content={emojiPickerContent}
                trigger="click"
                open={emojiPopoverOpen}
                onOpenChange={setEmojiPopoverOpen}
                placement="topLeft"
              >
                <Button
                  type="text"
                  className="messages__chat__emoji-btn"
                  icon={<SmileOutlined style={{ fontSize: 20, color: "#8c8c8c" }} />}
                />
              </Popover>
            </div>

            <div className="messages__chat__input-box__main">
              <Form.Item
                name="message"
                rules={[{ required: true, message: "Insira a mensagem." }]}
                style={{ marginBottom: 0 }}
              >
                <TextArea
                  placeholder="Escreve uma mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="messages__chat__textarea"
                />
              </Form.Item>
            </div>

            <div className="messages__chat__input-box__counter">
              <span className="char-count">{messageText.length}</span>
            </div>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={messageSubmitting}
            icon={<SendOutlined />}
            className="messages__chat__send-btn"
          >
            Enviar
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Chat;