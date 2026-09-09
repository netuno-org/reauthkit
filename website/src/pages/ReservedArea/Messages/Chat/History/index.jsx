import React, { useEffect, useRef, useState } from "react";
import { Spin, Button } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import _ws from "@netuno/ws-client";

import Message from "./Message/index.jsx";
import "./index.less";
import globalNotification from "../../../../../common/globalNotification.js";

function History({ friend, newSentMessage, onReply }) {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const refList = useRef(null);
  const isInitialLoad = useRef(true);
  const previousScrollHeight = useRef(0);

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    setShowScrollBottom(false);
    isInitialLoad.current = true;

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
            prev.map((msg) =>
              msg.uid === content.uid
                ? {
                    ...msg,
                    ...content,
                    active: false,
                    deleted_at: content.deleted_at || new Date().toISOString(),
                  }
                : msg
            )
          );
        }
      },
    });

    loadMessages(1, true);

    return () => {
      _ws.removeListener(listenerNewMessageRef);
      _ws.removeListener(listenerMessageEditRef);
      _ws.removeListener(listenerMessageReactionRef);
      _ws.removeListener(listenerMessageDeleteRef);
    };
  }, [friend]);

  useEffect(() => {
    if (newSentMessage) {
      setMessages((prev) => {
        if (prev.some((m) => m.uid === newSentMessage.uid)) return prev;
        return [...prev, newSentMessage];
      });
    }
  }, [newSentMessage]);

  useEffect(() => {
    if (refList.current) {
      if (isInitialLoad.current) {
        refList.current.scrollTop = refList.current.scrollHeight;
        if (messages.length > 0) {
          isInitialLoad.current = false;
        }
      } else if (previousScrollHeight.current > 0) {
        const heightDifference = refList.current.scrollHeight - previousScrollHeight.current;
        refList.current.scrollTop = heightDifference;
        previousScrollHeight.current = 0;
      } else {
        refList.current.scrollTop = refList.current.scrollHeight;
      }
    }
  }, [messages]);

  const loadMessages = (targetPage, isReset = false) => {
    if (isReset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
      if (refList.current) {
        previousScrollHeight.current = refList.current.scrollHeight;
      }
    }

    _ws.sendService({
      method: "POST",
      service: "message/list",
      data: {
        with: friend.uid,
        page: targetPage,
        pageSize: 10,
      },
      success: ({ content }) => {
        const items = (content && content.items) || (Array.isArray(content) ? content : []);
        const total = content && content.total !== undefined ? content.total : 0;

        if (isReset) {
          setMessages(items);
          setPage(1);
          setHasMore(items.length >= 10 && (total === 0 || items.length < total));
        } else {
          setMessages((prev) => [...items, ...prev]);
          setPage(targetPage);
          setHasMore(items.length >= 10);
        }
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
        setLoadingMore(false);
      },
    });
  };

  const handleScroll = () => {
    if (!refList.current) return;

    const { scrollTop, scrollHeight, clientHeight } = refList.current;
    const isFarFromBottom = scrollHeight - scrollTop - clientHeight > 150;
    setShowScrollBottom(isFarFromBottom);

    if (loading || loadingMore || !hasMore) return;

    if (scrollTop <= 20) {
      loadMessages(page + 1, false);
    }
  };

  const scrollToBottom = () => {
    if (refList.current) {
      refList.current.scrollTo({ top: refList.current.scrollHeight, behavior: "smooth" });
    }
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
              ? {
                  ...msg,
                  ...(content || {}),
                  active: false,
                  deleted_at: (content && content.deleted_at) || new Date().toISOString(),
                }
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

  const scrollToMessage = (targetUid) => {
    if (!targetUid) return;
    const targetElement = document.getElementById(`msg-${targetUid}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      targetElement.classList.add("messages__message--highlight");
      setTimeout(() => {
        targetElement.classList.remove("messages__message--highlight");
      }, 3500);
      return;
    }

    if (!hasMore || loadingMore) return;

    fetchAndFindMessage(targetUid, page + 1);
  };

  const fetchAndFindMessage = (targetUid, nextPage) => {
    setLoadingMore(true);
    if (refList.current) {
      previousScrollHeight.current = refList.current.scrollHeight;
    }

    _ws.sendService({
      method: "POST",
      service: "message/list",
      data: {
        with: friend.uid,
        page: nextPage,
        pageSize: 10,
      },
      success: ({ content }) => {
        const items = (content && content.items) || (Array.isArray(content) ? content : []);
        setMessages((prev) => [...items, ...prev]);
        setPage(nextPage);
        const moreAvailable = items.length >= 10;
        setHasMore(moreAvailable);

        setTimeout(() => {
          const el = document.getElementById(`msg-${targetUid}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("messages__message--highlight");
            setTimeout(() => {
              el.classList.remove("messages__message--highlight");
            }, 3500);
          } else if (moreAvailable) {
            fetchAndFindMessage(targetUid, nextPage + 1);
          }
        }, 100);
      },
      fail: (error) => {
        console.error(error);
      },
      end: () => {
        setLoadingMore(false);
      },
    });
  };

  return (
    <div className="messages__chat__history-container">
      <ul className="messages__chat__history" ref={refList} onScroll={handleScroll}>
        {loadingMore && (
          <li style={{ textAlign: "center", padding: "8px" }}>
            <Spin size="small" />
          </li>
        )}
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
            onQuoteClick={scrollToMessage}
          />
        ))}
      </ul>

      {showScrollBottom && (
        <Button
          type="primary"
          shape="round"
          icon={<ArrowDownOutlined />}
          className="messages__chat__scroll-bottom-btn"
          onClick={scrollToBottom}
        >
          Mensagens mais recentes
        </Button>
      )}
    </div>
  );
}

export default History;