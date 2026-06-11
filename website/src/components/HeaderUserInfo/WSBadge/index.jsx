import React, {useEffect, useState} from "react";
import _ws from '@netuno/ws-client';
import useWS from "../../../common/useWS.js";

import "./index.less";

function WSBadge() {
  const [state, setState] = useState(0);
  const [messageUnreadTotal, setMessageUnreadTotal] = useState(0);
  const ws = useWS();
  useEffect(() => {
    setMessageUnreadTotal(0);
    if (!ws.data) {
      setState(0);
    }
    if (ws.data?.connected) {
      setState(1);
    } else if (ws.data?.connected == false) {
      setState(-1);
    }
  }, [ws.data]);
  useEffect(() => {
    if (state === 1) {
      const listenerMessageUnreadCount = _ws.addListener({
        method: "GET",
        service: "message/unread/count",
        success: (data) => {
          setMessageUnreadTotal(data.content.total);
        }
      });
      _ws.sendService({
        method: "GET",
        service: "message/unread/count"
      });
      const listenerNewMessage = _ws.addListener({
        method: "POST",
        service: "message/new",
        success: () => {
          setMessageUnreadTotal((prev) => prev + 1);
        }
      });
      const listenerMessageReadMark = _ws.addListener({
        service: "message/read/mark",
        success: () => {
          setMessageUnreadTotal((prev) => prev - 1);
        }
      });
      return () => {
        _ws.removeListener(listenerMessageUnreadCount);
        _ws.removeListener(listenerNewMessage);
        _ws.removeListener(listenerMessageReadMark);
      }
    }
  }, [state]);
  return (
    <div className="header__user-info__avatar__badge"
         style={{
           backgroundColor: (state === 0 && '#d87a16') || (state === 1 && '#49aa19') || (state === -1 && '#dc4446'),
           width: messageUnreadTotal > 99 ? '26px' : messageUnreadTotal > 10 ? '22px' : '16px',
           right: messageUnreadTotal > 99 ? '0' : messageUnreadTotal > 10 ? '2px' : '5px',
         }}
    >
      {messageUnreadTotal === 0 ? null : messageUnreadTotal > 99 ? '+99' : messageUnreadTotal}
    </div>
  );
}

export default WSBadge;
