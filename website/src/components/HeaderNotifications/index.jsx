import React, { useEffect, useState } from "react";
import { Badge, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import _ws from "@netuno/ws-client";
import _service from "@netuno/service-client";

import useWS from "../../common/useWS.js";
import "./index.less";

function HeaderNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const ws = useWS();

  const fetchUnreadCount = () => {
    _service({
      method: "GET",
      url: "/notification/unread/count",
      success: (response) => {
        if (response.json && response.json.total !== undefined) {
          setUnreadCount(response.json.total);
        }
      },
      fail: (e) => {
        console.error("Erro ao obter contagem de notificações não lidas:", e);
      },
    });
  };

  useEffect(() => {
    fetchUnreadCount();

    const unreadCountListener = _ws.addListener({
      service: "notification/unread/count",
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

    const newNotificationListener = _ws.addListener({
      service: "notification/new",
      success: () => {
        fetchUnreadCount();
      },
    });

    return () => {
      _ws.removeListener(unreadCountListener);
      _ws.removeListener(newNotificationListener);
    };
  }, [ws.data]);

  const handleClick = () => {
    navigate("/notifications");
  };

  return (
    <div className="header-notifications" onClick={handleClick}>
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
          icon={<BellOutlined style={{ fontSize: "20px", color: "#1890ff" }} />}
          className="header-notifications__btn"
        />
      </Badge>
    </div>
  );
}

export default HeaderNotifications;
