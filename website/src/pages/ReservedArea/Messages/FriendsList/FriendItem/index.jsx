import React from "react";
import { Avatar, Badge, Button, Col, Popconfirm, Row } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import _service from "@netuno/service-client";

import "./index.less";
import { DeleteOutlined } from "@ant-design/icons";
import globalNotification from "../../../../../common/globalNotification";

dayjs.extend(utc);

function FriendItem({ activeTab, uid, name, avatar, online, latest_message, unread_messages, className, onClick }) {
  const handleDelete = (e, uid) => {
    e.stopPropagation();
    _service({
      method: "DELETE",
      url: `/message/chat?partner_uid=${uid}`,
      success: () => {
        globalNotification.success({
          title: "Conversas",
          description: "Conversa removida com sucesso.",
        });
      },
      fail: () => {
        globalNotification.serviceFail({
          title: "Conversas",
          description: "Não foi possível apagar a conversa.",
        });
      },
    });
  };

  return (
    <li onClick={onClick} className={`messages__friends-list__item ${className || ""}`}>
      <Row align="middle">
        <Col flex="46px" className="messages__friends-list__item__avatar">
          <Badge dot={online} color="#52c41a" offset={[-4, 32]}>
            <Avatar size={40} icon={<img src={
              avatar ? _service.url(`/profile/avatar?uid=${uid}&${new Date().getTime()}`) : "/images/profile-default.png"
            } />} />
          </Badge>
        </Col>
        <Col flex="auto" className="messages__friends-list__item__name">
          {name}
        </Col>
        <Col flex="50px" className="messages__friends-list__item__messages">
          {unread_messages > 0 && <>
            <div className="messages__friends-list__item__messages__latest">{dayjs.utc(latest_message).fromNow(true)}</div>
            <Badge color="green" count={unread_messages} />
          </>}
        </Col>
        <Col>
          {activeTab === "conversations" && (
            < Popconfirm
              title="Apagar conversa"
              description="Tens certeza que pretendes apagar essa conversa inteira?"
              okText="Sim"
              cancelText="Não"
              onConfirm={(e) => handleDelete(e, uid)}
              onPopupClick={(e) => e.stopPropagation()}
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                className="messages__friends-list__item__delete-btn "
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
          )}
        </Col>
      </Row>
    </li >
  );
}

export default FriendItem;
