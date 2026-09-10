import React, { useEffect, useState } from "react";
import { Badge, Button } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import _ws from "@netuno/ws-client";
import _service from "@netuno/service-client";

import useWS from "../../common/useWS.js";

import "./index.less";

function HeaderMessages() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const ws = useWS();

  const fetchUnreadCount = () => {
    _service({
      method: "GET",
      url: "/message/unread/count",
      success: (response) => {
        if (response.json && response.json.total !== undefined) {
          setUnreadCount(response.json.total);
        }
      },
      fail: (e) => {
        console.error("Erro ao obter contagem de mensagens não lidas:", e);
      },
    });
  };

  useEffect(() => {
    fetchUnreadCount();

    const unreadCountListener = _ws.addListener({
      service: "message/unread/count",
      success: (response) => {
        if (response && response.content && response.content.total !== undefined) {
          setUnreadCount(response.content.total);
        } else if (response && response.total !== undefined) {
          setUnreadCount(response.total);
        } else {
          fetchUnreadCount();
        }
      },
    });

    return () => {
      _ws.removeListener(unreadCountListener);
    };
  }, [ws.data]);

  const handleClick = () => {
    navigate("/messages");
  };

  return (
    <div className="header-messages" onClick={handleClick}>
      <Badge
        count={unreadCount}
        overflowCount={99}
        size="small"
        offset={[-2, 6]}
        color="green"
      >
        <Button
          type="text"
          shape="circle"
          icon={<MessageOutlined style={{ fontSize: "20px", color: "#1890ff" }} />}
          className="header-messages__btn"
        />
      </Badge>
    </div>
  );
}

export default HeaderMessages;
