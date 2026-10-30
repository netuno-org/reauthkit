import { useEffect, useState } from "react";
import { Spin, Tabs } from "antd";
import _ws from "@netuno/ws-client";

import FriendItem from "./FriendItem";

import "./index.less";
import useWS from "../../../../common/useWS.js";
import globalNotification from "../../../../common/globalNotification.js";
import _service from "@netuno/service-client";

function FriendsList({ selectedFriend, onFriendSelected }) {
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);
  const [conversations, setConverstations] = useState(null);
  const [friends, setFriends] = useState(null);
  const ws = useWS();

  useEffect(() => {
    _service({
      method: "GET",
      url: "/friend/list",
      success: (response) => {
        setLoading(false);
        if (response.json && response.json.result) {
          setFriends(response.json.friends || []);
        } else {
          setFriends([]);
        }
      },
      fail: (e) => {
        setLoading(false);
        console.error("Erro ao carregar dados de amigos:", e);
        globalNotification.serviceFail({
          title: "Amigos",
          description: "Não foi possível carregar a lista de amigos.",
        });
      }
    });
  }, []);

  useEffect(() => {
    const listenerList = _ws.addListener({
      service: "message/participant/list",
      start: () => {
        setLoading(true);
      },
      success: (data) => {
        setConverstations(data.content || []);
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: "Lista de Amigos",
          description: "Houve uma falha ao tentar atualizar a listagem de amigos.",
        });
      },
      end: () => {
        setLoading(false);
      },
    });

    _ws.sendService({
      service: "message/participant/list",
    });

    const listenerStatusChanged = _ws.addListener({
      service: "friend/status/changed",
      success: ({ content }) => {
        setConverstations((prev) =>
          prev.map((item) => {
            if (item.uid === content.uid) {
              return { ...item, ...content };
            }
            return item;
          })
        );
      },
    });

    const listenerNewMessage = _ws.addListener({
      method: "POST",
      service: "message/new",
      success: ({ data }) => {
        setConverstations((prev) =>
          prev.map((item) => {
            if (item.uid === data.with) {
              return { ...item, unread_messages: (item.unread_messages || 0) + 1 };
            }
            return item;
          })
        );
      },
    });

    const listenerMessageReadMark = _ws.addListener({
      service: "message/read/mark",
      success: ({ data }) => {
        setConverstations((prev) =>
          prev.map((item) => {
            if (item.uid === data.from) {
              return { ...item, unread_messages: Math.max(0, (item.unread_messages || 0) - 1) };
            }
            return item;
          })
        );
      },
    });

    return () => {
      _ws.removeListener(listenerList);
      _ws.removeListener(listenerStatusChanged);
      _ws.removeListener(listenerNewMessage);
      _ws.removeListener(listenerMessageReadMark);
    };
  }, [ws.data]);

  const tabItems = [
    {
      key: "conversations",
      label: "Conversas",
      children: (
        <div className="messages__friends-list">
          {loading && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          )}
          {
            !loading && (!conversations || conversations.length === 0) && (
              <div style={{ padding: "20px", textAlign: "center", color: "#8c8c8c" }}>
                Nenhuma conversa ainda.
              </div>
            )
          }
          {
            conversations && conversations.length > 0 && (
              <ul>
                {conversations.map((item) => (
                  <FriendItem
                    key={item.uid}
                    {...item}
                    className={selectedFriend && selectedFriend.uid === item.uid ? "active" : ""}
                    onClick={() => onFriendSelected && onFriendSelected(item)}
                  />
                ))}
              </ul>
            )
          }
        </div>
      )
    },
    {
      key: "friends",
      label: "Amigos",
      children: (
        <div className="messages__friends-list">
          {loading && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin />
            </div>
          )}
          {
            !loading && (!friends || friends.length === 0) && (
              <div style={{ padding: "20px", textAlign: "center", color: "#8c8c8c" }}>
                Nenhum amigo encontrado.
              </div>
            )
          }
          {
            friends && friends.length > 0 && (
              <ul>
                {friends.map((item) => (
                  <FriendItem
                    key={item.uid}
                    {...item}
                    className={selectedFriend && selectedFriend.uid === item.uid ? "active" : ""}
                    onClick={() => onFriendSelected && onFriendSelected(item)}
                  />
                ))}
              </ul>
            )
          }
        </div>
      )
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      items={tabItems}
      className="friends-page__tabs"
    />
  );
}

export default FriendsList;
