import React, { useEffect, useRef, useState } from "react";
import { Spin } from "antd";
import _ws from "@netuno/ws-client";

import Message from "./Message/index.jsx";
import "./index.less";
import globalNotification from "../../../../../common/globalNotification.js";

function History({ friend, reload, onReply }) {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const refList = useRef(null);

  useEffect(() => {
    const listenerMessageRef = _ws.addListener({
      method: "POST",
      service: "message/list",
      start: () => {
        setLoading(true);
      },
      success: ({ content }) => {
        setMessages(content || []);
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: "Histórico de Mensagens",
          description: "Houve uma falha ao tentar atualizar o histórico de mensagens.",
        });
      },
      end: () => {
        setLoading(false);
      },
    });

    const listenerNewMessageRef = _ws.addListener({
      method: "POST",
      service: "message/new",
      success: ({ data, content }) => {
        if (data.with === friend.uid) {
          _ws.sendService({
            service: "message/read/mark",
            data: {
              uid: content.uid,
              from: friend.uid,
            },
            success: () => {
              setMessages((prev) => [...prev, content]);
            },
          });
        }
      },
    });

    const listenerMessageEditRef = _ws.addListener({
      method: "PUT",
      service: "message/edit",
      success: ({ data, content }) => {
        if (data.with === friend.uid || content.from === friend.uid || content.to === friend.uid) {
          setMessages((prev) =>
            prev.map((msg) => (msg.uid === content.uid ? { ...msg, ...content } : msg))
          );
        }
      },
    });

    const listenerMessageReactionRef = _ws.addListener({
      method: "PUT",
      service: "message",
      success: ({ data, content }) => {
        if (data.with === friend.uid || content.from === friend.uid || content.to === friend.uid) {
          setMessages((prev) =>
            prev.map((msg) => (msg.uid === content.uid ? { ...msg, ...content } : msg))
          );
        }
      },
    });

    const listenerMessageDeleteRef = _ws.addListener({
      method: "DELETE",
      service: "message",
      success: ({ data, content }) => {
        if (data.with === friend.uid || content.from === friend.uid || content.to === friend.uid) {
          setMessages((prev) =>
            prev.map((msg) => (msg.uid === content.uid ? { ...msg, ...content, active: false, deleted_at: content.deleted_at || new Date().toISOString() } : msg))
          );
        }
      },
    });

    onLoad();

    return () => {
      _ws.removeListener(listenerMessageRef);
      _ws.removeListener(listenerNewMessageRef);
      _ws.removeListener(listenerMessageEditRef);
      _ws.removeListener(listenerMessageReactionRef);
      _ws.removeListener(listenerMessageDeleteRef);
    };
  }, [friend]);

  useEffect(() => {
    if (refList.current) {
      refList.current.scrollTo({ top: refList.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

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
        with: friend.uid,
      },
    });
  };

  const handleEdit = (uid, messageText) => {
    _ws.sendService({
      method: "PUT",
      service: "message",
      data: {
        uid,
        message: messageText,
      },
      success: ({ content }) => {
        if (content) {
          setMessages((prev) =>
            prev.map((msg) => (msg.uid === uid ? { ...msg, ...content } : msg))
          );
        }
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: "Editar Mensagem",
          description: "Houve uma falha ao tentar editar a mensagem.",
        });
      },
    });
  };

  const handleDelete = (uid) => {
    _ws.sendService({
      method: "DELETE",
      service: "message",
      data: {
        uid,
      },
      success: ({ content }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.uid === uid
              ? { ...msg, ...(content || {}), active: false, deleted_at: (content && content.deleted_at) || new Date().toISOString() }
              : msg
          )
        );
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: "Eliminar Mensagem",
          description: "Houve uma falha ao tentar eliminar a mensagem.",
        });
      },
    });
  };

  const handleReact = (uid, reactionEmoji) => {
    _ws.sendService({
      method: "PUT",
      service: "message/reaction",
      data: {
        uid,
        reaction: reactionEmoji,
      },
      success: ({ content }) => {
        if (content) {
          setMessages((prev) =>
            prev.map((msg) => (msg.uid === uid ? { ...msg, ...content } : msg))
          );
        }
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: "Reagir à Mensagem",
          description: "Houve uma falha ao registar a reação.",
        });
      },
    });
  };

  return (
    <ul className="messages__chat__history" ref={refList}>
      {loading && (
        <li style={{ textAlign: "center", padding: "20px" }}>
          <Spin />
        </li>
      )}
      {!loading && messages.length === 0 && (
        <li className="messages__chat__history__empty">
          <span>Inicia a conversa com {friend.name}! 👋</span>
        </li>
      )}
      {messages.map((message) => (
        <Message
          key={message.uid}
          friend={friend}
          data={message}
          onReply={onReply}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReact={handleReact}
        />
      ))}
    </ul>
  );
}

export default History;