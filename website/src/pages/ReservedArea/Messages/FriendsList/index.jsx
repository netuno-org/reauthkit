import {useEffect, useState} from "react";
import {Spin} from "antd";
import _ws from "@netuno/ws-client";

import FriendItem from "./FriendItem";

import "./index.less";
import useWS from "../../../../common/useWS.js";
import globalNotification from "../../../../common/globalNotification.js";

function FriendsList({onFriendSelected}) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(null);
  const ws = useWS();
  useEffect(() => {
    const listenerList = _ws.addListener({
      service: "friend/list",
      start: () => {
        setLoading(true);
      },
      success: (data) => {
        setList(data.content);
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: "Lista de Amigos",
          description: "Houve uma falha ao tentar atualizar a listagem de amigos.",
        });
      },
      end: ()=> {
        setLoading(false);
      }
    });
    _ws.sendService({
      service: "friend/list"
    });
    const listenerStatusChanged = _ws.addListener({
      service: "friend/status/changed",
      success: ({content}) => {
        setList((prev) =>
          prev.map((item) => {
            if (item.uid === content.uid) {
              return {...item, ...content}
            }
            return item;
          })
        );
      }
    });
    const listenerNewMessage = _ws.addListener({
      method: "POST",
      service: "message/new",
      success: ({data}) => {
        setList((prev) =>
          prev.map((item) => {
            if (item.uid === data.with) {
              return {...item, unread_messages: item.unread_messages + 1}
            }
            return item;
          })
        );
      }
    });
    const listenerMessageReadMark = _ws.addListener({
      service: "message/read/mark",
      success: ({data}) => {
        setList((prev) =>
          prev.map((item) => {
            if (item.uid === data.from) {
              return {...item, unread_messages: item.unread_messages - 1}
            }
            return item;
          })
        );
      }
    });
    return () => {
      _ws.removeListener(listenerList);
      _ws.removeListener(listenerStatusChanged);
      _ws.removeListener(listenerNewMessage);
      _ws.removeListener(listenerMessageReadMark);
    }
  }, [ws.data]);
  return (
    <div className="messages__friends-list">
      {loading && <Spin/>}
      {list && <ul>
        {list.map((item) => (
          <FriendItem
            key={item.uid + ":" + item.online}
            {...item}
            onClick={() => onFriendSelected && onFriendSelected(item)}
          />
        ))}
      </ul>}
    </div>
  );
}

export default FriendsList;
