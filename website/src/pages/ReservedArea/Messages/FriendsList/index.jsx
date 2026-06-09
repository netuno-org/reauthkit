import {useEffect, useState} from "react";
import {Spin} from "antd";
import _ws from "@netuno/ws-client";

import FriendItem from "./FriendItem";

import "./index.less";
import useWS from "../../../../common/useWS.js";

function FriendsList({onFriendSelected}) {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(null);
  const ws = useWS();
  useEffect(() => {
    const listenerList = _ws.addListener({
      service: "friend/list",
      success: (data) => {
        setList(data.content);
        setLoading(false);
      },
      fail: (error) => {
        setLoading(false);
      }
    });
    _ws.sendService({
      service: "friend/list"
    });
    const listenerStatusChanged = _ws.addListener({
      service: "friend/status/changed",
      success: (data) => {
        setList((prev) =>
          prev.map((item) => {
            if (item.uid === data.content.uid) {
              return {...item, ...data.content}
            }
            return item;
          })
        );
      }
    });
    return () => {
      _ws.removeListener(listenerList);
      _ws.removeListener(listenerStatusChanged);
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
