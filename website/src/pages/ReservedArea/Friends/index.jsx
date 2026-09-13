import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Tabs, Input, Card, Avatar, Badge, Button, Spin, Empty, Popconfirm, Row, Col } from "antd";
import {
  UserOutlined,
  MessageOutlined,
  UserDeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  SmileOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import _service from "@netuno/service-client";
import globalNotification from "../../../common/globalNotification.js";
import "./index.less";

const { Title, Paragraph, Text } = Typography;

function Friends() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("friends");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [searchFriend, setSearchFriend] = useState("");

  const loadData = useCallback(() => {
    setLoading(true);
    _service({
      method: "GET",
      url: "/friend/requests",
      success: (response) => {
        setLoading(false);
        if (response.json && response.json.result) {
          setFriends(response.json.friends || []);
          setReceived(response.json.received || []);
          setSent(response.json.sent || []);
        } else {
          setFriends([]);
          setReceived([]);
          setSent([]);
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
    loadData();
  }, [loadData]);

  const handleAcceptRequest = (person) => {
    setActionLoading(true);
    _service({
      method: "PUT",
      url: "/friend",
      data: { uid: person.uid },
      success: (response) => {
        setActionLoading(false);
        if (response.json && response.json.result) {
          globalNotification.success({
            title: "Amizade",
            description: `Aceitou o pedido de amizade de ${person.name}.`,
          });
          loadData();
        }
      },
      fail: (e) => {
        setActionLoading(false);
        console.error("Erro ao aceitar pedido:", e);
        globalNotification.serviceFail({
          title: "Amizade",
          description: "Não foi possível aceitar o pedido de amizade.",
        });
      }
    });
  };

  const handleRefuseOrCancelRequest = (person, type = "cancel") => {
    setActionLoading(true);
    _service({
      method: "DELETE",
      url: "/friend",
      data: { uid: person.uid },
      success: (response) => {
        setActionLoading(false);
        if (response.json && response.json.result) {
          globalNotification.success({
            title: "Amizade",
            description: type === "refuse"
              ? `Recusou o pedido de ${person.name}.`
              : "Pedido cancelado.",
          });
          loadData();
        }
      },
      fail: (e) => {
        setActionLoading(false);
        console.error("Erro ao processar pedido:", e);
        globalNotification.serviceFail({
          title: "Amizade",
          description: "Não foi possível processar o pedido.",
        });
      }
    });
  };

  const handleRemoveFriend = (person) => {
    setActionLoading(true);
    _service({
      method: "DELETE",
      url: "/friend",
      data: { uid: person.uid },
      success: (response) => {
        setActionLoading(false);
        if (response.json && response.json.result) {
          globalNotification.success({
            title: "Amizade",
            description: `${person.name} foi removido dos seus amigos.`,
          });
          loadData();
        }
      },
      fail: (e) => {
        setActionLoading(false);
        console.error("Erro ao remover amigo:", e);
        globalNotification.serviceFail({
          title: "Amizade",
          description: "Não foi possível remover o amigo.",
        });
      }
    });
  };

  const filteredFriends = friends.filter((f) => {
    if (!searchFriend.trim()) return true;
    const q = searchFriend.toLowerCase();
    return (f.name && f.name.toLowerCase().includes(q)) || (f.email && f.email.toLowerCase().includes(q));
  });

  const tabItems = [
    {
      key: "friends",
      label: (
        <span>
          Meus Amigos
          <Badge
            count={friends.length}
            style={{ marginLeft: 8, backgroundColor: activeTab === "friends" ? "#1890ff" : "#d9d9d9" }}
          />
        </span>
      ),
      children: (
        <div className="friends-page__tab-content">
          <div className="friends-page__filter-card">
            <Input
              placeholder="Buscar amigos por nome ou email..."
              prefix={<SearchOutlined style={{ color: "#8c8c8c" }} />}
              allowClear
              value={searchFriend}
              onChange={(e) => setSearchFriend(e.target.value)}
              className="friends-page__search-input"
            />
          </div>

          {filteredFriends.length === 0 ? (
            <Card className="friends-page__empty-card">
              <Empty description={searchFriend ? "Nenhum amigo encontrado na busca." : "Ainda não tem amigos adicionados."} />
            </Card>
          ) : (
            <div className="friends-page__list">
              {filteredFriends.map((person) => {
                const avatarUrl = person.avatar
                  ? _service.url(`/profile/avatar?uid=${person.uid}&${new Date().getTime()}`)
                  : "/images/profile-default.png";

                return (
                  <Card
                    key={person.uid}
                    className="friends-page__card"
                    hoverable
                    onClick={() => navigate(`/profile/${person.uid}`)}
                  >
                    <div className="friends-page__card-inner">
                      <div className="friends-page__card-avatar">
                        <Badge
                          dot={person.online}
                          color="#52c41a"
                          offset={[-6, 62]}
                          style={{ width: 12, height: 12, borderRadius: "50%", boxShadow: "0 0 0 2px #fff" }}
                        >
                          <Avatar
                            size={72}
                            src={avatarUrl}
                            icon={<UserOutlined />}
                            className="friends-page__avatar-img"
                          />
                        </Badge>
                      </div>

                      <div className="friends-page__card-details">
                        <div className="friends-page__name-text">{person.name}</div>
                        {person.email && (
                          <div className="friends-page__email-text">{person.email}</div>
                        )}
                      </div>

                      <div className="friends-page__card-actions" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="primary"
                          icon={<MessageOutlined />}
                          onClick={() => navigate("/messages")}
                          className="friends-page__action-btn"
                        >
                          Mensagem
                        </Button>
                        <Popconfirm
                          title="Remover Amizade"
                          description={`Tem a certeza que deseja remover ${person.name}?`}
                          okText="Remover"
                          cancelText="Cancelar"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => handleRemoveFriend(person)}
                        >
                          <Button
                            danger
                            icon={<UserDeleteOutlined />}
                            loading={actionLoading}
                            className="friends-page__action-btn"
                          >
                            Remover
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )
    },
    {
      key: "received",
      label: (
        <span>
          Pedidos Recebidos
          <Badge
            count={received.length}
            style={{ marginLeft: 8, backgroundColor: received.length > 0 ? "#52c41a" : "#d9d9d9" }}
          />
        </span>
      ),
      children: (
        <div className="friends-page__tab-content">
          {received.length === 0 ? (
            <Card className="friends-page__empty-card">
              <Empty description="Não tem nenhum pedido de amizade pendente." />
            </Card>
          ) : (
            <div className="friends-page__list">
              {received.map((person) => {
                const avatarUrl = person.avatar
                  ? _service.url(`/profile/avatar?uid=${person.uid}&${new Date().getTime()}`)
                  : "/images/profile-default.png";

                return (
                  <Card
                    key={person.uid}
                    className="friends-page__card"
                    hoverable
                    onClick={() => navigate(`/profile/${person.uid}`)}
                  >
                    <div className="friends-page__card-inner">
                      <div className="friends-page__card-avatar">
                        <Avatar
                          size={72}
                          src={avatarUrl}
                          icon={<UserOutlined />}
                          className="friends-page__avatar-img"
                        />
                      </div>

                      <div className="friends-page__card-details">
                        <div className="friends-page__name-text">{person.name}</div>
                        {person.email && (
                          <div className="friends-page__email-text">{person.email}</div>
                        )}
                        {person.request_on && (
                          <div className="friends-page__date-text">
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            Enviado {dayjs(person.request_on).fromNow()}
                          </div>
                        )}
                      </div>

                      <div className="friends-page__card-actions" onClick={(e) => e.stopPropagation()}>
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          loading={actionLoading}
                          onClick={() => handleAcceptRequest(person)}
                          className="friends-page__action-btn friends-page__action-btn--accept"
                        >
                          Aceitar
                        </Button>
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          loading={actionLoading}
                          onClick={() => handleRefuseOrCancelRequest(person, "refuse")}
                          className="friends-page__action-btn"
                        >
                          Recusar
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )
    },
    {
      key: "sent",
      label: (
        <span>
          Pedidos Enviados
          <Badge
            count={sent.length}
            style={{ marginLeft: 8, backgroundColor: sent.length > 0 ? "#52c41a" : "#d9d9d9" }}
          />
        </span>
      ),
      children: (
        <div className="friends-page__tab-content">
          {sent.length === 0 ? (
            <Card className="friends-page__empty-card">
              <Empty description="Nenhum pedido de amizade enviado pendente." />
            </Card>
          ) : (
            <div className="friends-page__list">
              {sent.map((person) => {
                const avatarUrl = person.avatar
                  ? _service.url(`/profile/avatar?uid=${person.uid}&${new Date().getTime()}`)
                  : "/images/profile-default.png";

                return (
                  <Card
                    key={person.uid}
                    className="friends-page__card"
                    hoverable
                    onClick={() => navigate(`/profile/${person.uid}`)}
                  >
                    <div className="friends-page__card-inner">
                      <div className="friends-page__card-avatar">
                        <Avatar
                          size={72}
                          src={avatarUrl}
                          icon={<UserOutlined />}
                          className="friends-page__avatar-img"
                        />
                      </div>

                      <div className="friends-page__card-details">
                        <div className="friends-page__name-text">{person.name}</div>
                        {person.email && (
                          <div className="friends-page__email-text">{person.email}</div>
                        )}
                        {person.request_on && (
                          <div className="friends-page__date-text">
                            <ClockCircleOutlined style={{ marginRight: 4 }} />
                            Aguardando resposta ({dayjs(person.request_on).fromNow()})
                          </div>
                        )}
                      </div>

                      <div className="friends-page__card-actions" onClick={(e) => e.stopPropagation()}>
                        <Button
                          danger
                          type="text"
                          loading={actionLoading}
                          onClick={() => handleRefuseOrCancelRequest(person, "cancel")}
                          className="friends-page__action-btn"
                        >
                          Cancelar Pedido
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="friends-page">
      <div className="friends-page__header">
        <Title level={2} className="friends-page__title">Amigos</Title>
        <Paragraph className="friends-page__subtitle">
          Gira os seus amigos e pedidos de amizade.
        </Paragraph>
      </div>

      <div className="friends-page__content">
        {loading ? (
          <div className="friends-page__loading">
            <Spin size="large" />
          </div>
        ) : (
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="friends-page__tabs"
          />
        )}
      </div>
    </div>
  );
}

export default Friends;
