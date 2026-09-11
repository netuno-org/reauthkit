import React, { useEffect, useState } from "react";
import { Typography, Tabs, Badge, Button, Avatar, Popconfirm, Pagination, Spin, Empty } from "antd";
import { MessageOutlined, BellOutlined, CheckOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import _service from "@netuno/service-client";
import _ws from "@netuno/ws-client";

import globalNotification from "../../../common/globalNotification.js";
import useWS from "../../../common/useWS.js";
import "./index.less";

const { Text, Paragraph } = Typography;

function formatTimeAgo(sentAt) {
  if (!sentAt) return "";
  const moment = dayjs(sentAt);
  const diffSec = dayjs().diff(moment, "second");
  if (diffSec < 60) return "Há Alguns Segundos";
  const diffMin = dayjs().diff(moment, "minute");
  if (diffMin < 60) return `Há ${diffMin} ${diffMin === 1 ? "Minuto" : "Minutos"}`;
  const diffHour = dayjs().diff(moment, "hour");
  if (diffHour < 24) return `Há ${diffHour} ${diffHour === 1 ? "Hora" : "Horas"}`;
  return moment.format("DD/MM/YYYY HH:mm");
}

function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
    });
  };

  const loadNotifications = (tab = activeTab, currentPage = page, currentPageSize = pageSize) => {
    setLoading(true);
    _service({
      method: "POST",
      url: "/notification/list",
      data: {
        page: currentPage,
        pageSize: currentPageSize,
        unread: tab === "unread",
      },
      success: (response) => {
        setLoading(false);
        if (response.json) {
          setNotifications(response.json.items || []);
          setTotal(response.json.total || 0);
          setPage(response.json.page || currentPage);
          setPageSize(response.json.pageSize || currentPageSize);
        }
      },
      fail: () => {
        setLoading(false);
        globalNotification.serviceFail({
          title: "Notificações",
          description: "Ocorreu um erro ao carregar as notificações.",
        });
      },
    });
  };

  useEffect(() => {
    fetchUnreadCount();
    loadNotifications("all", 1, pageSize);

    const unreadCountListener = _ws.addListener({
      service: "notification/unread/count",
      success: (response) => {
        if (response?.content?.total !== undefined) {
          setUnreadCount(response.content.total);
        } else if (response?.total !== undefined) {
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
        loadNotifications(activeTab, 1, pageSize);
      },
    });

    return () => {
      _ws.removeListener(unreadCountListener);
      _ws.removeListener(newNotificationListener);
    };
  }, [ws.data]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
    loadNotifications(key, 1, pageSize);
  };

  const handleItemClick = (item) => {
    if (!item.read_at) {
      _service({
        method: "PUT",
        url: "/notification/read",
        data: { uid: item.uid },
        success: () => {
          setNotifications((prev) =>
            prev.map((n) => (n.uid === item.uid ? { ...n, read_at: new Date().toISOString() } : n))
          );
          fetchUnreadCount();
        },
      });
    }

    if (item.extra) {
      try {
        const extraObj = typeof item.extra === "string" ? JSON.parse(item.extra) : item.extra;
        if (extraObj.type === "message") {
          navigate("/messages");
        }
      } catch (e) {}
    }
  };

  const handleMarkAllAsRead = () => {
    _service({
      method: "PUT",
      url: "/notification/read",
      data: { all: true },
      success: () => {
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((item) => ({ ...item, read_at: new Date().toISOString() }))
        );
        globalNotification.success({
          title: "Notificações",
          description: "Todas as notificações foram marcadas como lidas.",
        });
        if (activeTab === "unread") {
          loadNotifications("unread", 1, pageSize);
        }
      },
      fail: () => {
        globalNotification.serviceFail({
          title: "Notificações",
          description: "Não foi possível marcar todas as notificações como lidas.",
        });
      },
    });
  };

  const handleDelete = (e, uid) => {
    e.stopPropagation();
    _service({
      method: "DELETE",
      url: `/notification?uid=${uid}`,
      success: () => {
        globalNotification.success({
          title: "Notificações",
          description: "Notificação removida com sucesso.",
        });
        fetchUnreadCount();
        loadNotifications(activeTab, page, pageSize);
      },
      fail: () => {
        globalNotification.serviceFail({
          title: "Notificações",
          description: "Não foi possível eliminar a notificação.",
        });
      },
    });
  };

  const handlePageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
    loadNotifications(activeTab, newPage, newPageSize);
  };

  const tabItems = [
    {
      key: "all",
      label: "Todas",
    },
    {
      key: "unread",
      label: (
        <span className="notifications-tab-unread">
          Não Lidas{" "}
          <Badge
            count={unreadCount}
            overflowCount={99}
            color="green"
            className="notifications-tab-badge"
          />
        </span>
      ),
    },
  ];

  return (
    <div className="notifications-page">
      <div className="notifications-page__top">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          className="notifications-page__tabs"
          tabBarExtraContent={
            unreadCount > 0 ? (
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={handleMarkAllAsRead}
                className="notifications-page__mark-all-btn"
              >
                Marcar todas como lidas
              </Button>
            ) : null
          }
        />
      </div>

      <div className="notifications-page__content">
        {loading && notifications.length === 0 ? (
          <div className="notifications-page__loading">
            <Spin size="large" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="notifications-page__empty">
            <Empty description="Não há notificações neste momento." />
          </div>
        ) : (
          <div className="notifications-page__list-wrapper">
            {notifications.map((item) => {
              const isUnread = !item.read_at;
                let avatarUrl = "/images/profile-default.png";
                let senderUid = null;
                if (item.extra) {
                  try {
                    const extraObj = typeof item.extra === "string" ? JSON.parse(item.extra) : item.extra;
                    if (extraObj.with) {
                      senderUid = extraObj.with;
                      avatarUrl = _service.url(`/profile/avatar?uid=${senderUid}&${new Date().getTime()}`);
                    }
                  } catch (e) {}
                }

                return (
                  <div
                    key={item.uid}
                    className={`notifications-item ${isUnread ? "notifications-item--unread" : ""}`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="notifications-item__left">
                      <div className="notifications-item__avatar-wrapper">
                        <Avatar
                          size={44}
                          src={avatarUrl}
                          icon={<UserOutlined />}
                          className="notifications-item__avatar"
                        />
                        <div className="notifications-item__avatar-badge">
                          <MessageOutlined />
                        </div>
                      </div>

                      <div className="notifications-item__text">
                        <div className="notifications-item__title">{item.title}</div>
                        <div className="notifications-item__content">{item.content}</div>
                      </div>
                    </div>

                    <div className="notifications-item__right">
                      <span className="notifications-item__time">
                        {formatTimeAgo(item.sent_at)}
                      </span>
                      <div className="notifications-item__indicators">
                        {isUnread && <span className="notifications-item__green-dot" />}
                        <Popconfirm
                          title="Eliminar notificação"
                          description="Tens a certeza que pretendes eliminar?"
                          okText="Sim"
                          cancelText="Não"
                          onConfirm={(e) => handleDelete(e, item.uid)}
                          onPopupClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            className="notifications-item__delete-btn"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                );
              })}

            {total > 0 && (
              <div className="notifications-page__pagination">
                <Pagination
                  current={page}
                  pageSize={pageSize}
                  total={total}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
