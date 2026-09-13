import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card, Avatar, Button, Spin, Empty, Popconfirm } from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  EditOutlined,
  MessageOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import _service from "@netuno/service-client";

import useProfile from "../../../../common/useProfile.js";
import globalNotification from "../../../../common/globalNotification.js";
import "./index.less";

const { Title, Paragraph } = Typography;

function ProfileView() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const myProfile = useProfile();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const targetUid = uid || myProfile.data?.uid;
  const isMyProfile = !uid || uid === myProfile.data?.uid;

  const loadProfile = () => {
    if (!targetUid) return;

    setLoading(true);
    _service({
      method: "GET",
      url: `/profile?uid=${targetUid}`,
      success: (response) => {
        setLoading(false);
        if (response.json && response.json.result && response.json.data) {
          setProfileData(response.json.data);
        } else {
          setProfileData(null);
        }
      },
      fail: (e) => {
        setLoading(false);
        console.error("Erro ao carregar perfil:", e);
        globalNotification.serviceFail({
          title: "Perfil",
          description: "Não foi possível carregar os dados do perfil.",
        });
      },
    });
  };

  useEffect(() => {
    loadProfile();
  }, [targetUid]);

  const handleSendFriendRequest = () => {
    if (!profileData) return;
    setActionLoading(true);
    _service({
      method: "POST",
      url: "/friend",
      data: { uid: profileData.uid },
      success: (response) => {
        setActionLoading(false);
        if (response.json && response.json.result) {
          setProfileData((prev) => ({
            ...prev,
            friendship_status: response.json.status || "pending_sent"
          }));
          globalNotification.success({
            title: "Pedido de Amizade",
            description: "Pedido de amizade enviado com sucesso.",
          });
        }
      },
      fail: (e) => {
        setActionLoading(false);
        console.error("Erro ao enviar pedido de amizade:", e);
        globalNotification.serviceFail({
          title: "Amizade",
          description: "Não foi possível enviar o pedido de amizade.",
        });
      }
    });
  };

  const handleAcceptFriendRequest = () => {
    if (!profileData) return;
    setActionLoading(true);
    _service({
      method: "PUT",
      url: "/friend",
      data: { uid: profileData.uid },
      success: (response) => {
        setActionLoading(false);
        if (response.json && response.json.result) {
          setProfileData((prev) => ({
            ...prev,
            friendship_status: "friend"
          }));
          globalNotification.success({
            title: "Amizade",
            description: "Pedido de amizade aceite com sucesso.",
          });
        }
      },
      fail: (e) => {
        setActionLoading(false);
        console.error("Erro ao aceitar pedido de amizade:", e);
        globalNotification.serviceFail({
          title: "Amizade",
          description: "Não foi possível aceitar o pedido de amizade.",
        });
      }
    });
  };

  const handleRemoveFriend = () => {
    if (!profileData) return;
    setActionLoading(true);
    _service({
      method: "DELETE",
      url: "/friend",
      data: { uid: profileData.uid },
      success: (response) => {
        setActionLoading(false);
        if (response.json && response.json.result) {
          setProfileData((prev) => ({
            ...prev,
            friendship_status: "none"
          }));
          globalNotification.success({
            title: "Amizade",
            description: "Amigo removido com sucesso.",
          });
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

  const handleCancelFriendRequest = () => {
    if (!profileData) return;
    setActionLoading(true);
    _service({
      method: "DELETE",
      url: "/friend",
      data: { uid: profileData.uid },
      success: (response) => {
        setActionLoading(false);
        if (response.json && response.json.result) {
          setProfileData((prev) => ({
            ...prev,
            friendship_status: "none"
          }));
          globalNotification.success({
            title: "Pedido de Amizade",
            description: "Pedido de amizade cancelado.",
          });
        }
      },
      fail: (e) => {
        setActionLoading(false);
        console.error("Erro ao cancelar pedido de amizade:", e);
        globalNotification.serviceFail({
          title: "Amizade",
          description: "Não foi possível cancelar o pedido de amizade.",
        });
      }
    });
  };

  if (loading) {
    return (
      <div className="profile-view-page__loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-view-page">
        <div className="profile-view-page__back">
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </div>
        <Card className="profile-view-page__card">
          <Empty description="Utilizador não encontrado." />
        </Card>
      </div>
    );
  }

  const avatarUrl = profileData.avatar
    ? _service.url(`/profile/avatar?uid=${profileData.uid}&${new Date().getTime()}`)
    : "/images/profile-default.png";

  const renderActions = () => {
    if (isMyProfile || profileData.friendship_status === "self") {
      return (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate("/profile/edit")}
        >
          Editar Perfil
        </Button>
      );
    }

    if (profileData.friendship_status === "friend") {
      return (
        <div className="profile-view-page__action-group">
          <Button
            type="primary"
            icon={<MessageOutlined />}
            onClick={() => navigate("/messages")}
          >
            Mandar Mensagem
          </Button>
          <Popconfirm
            title="Remover Amizade"
            description="Tem a certeza que deseja remover este amigo?"
            okText="Remover"
            cancelText="Cancelar"
            okButtonProps={{ danger: true }}
            onConfirm={handleRemoveFriend}
          >
            <Button
              danger
              icon={<UserDeleteOutlined />}
              loading={actionLoading}
            >
              Remover Amigo
            </Button>
          </Popconfirm>
        </div>
      );
    }

    if (profileData.friendship_status === "pending_sent") {
      return (
        <div className="profile-view-page__action-group">
          <Button disabled icon={<ClockCircleOutlined />}>
            Pedido Enviado
          </Button>
          <Button
            danger
            type="text"
            onClick={handleCancelFriendRequest}
            loading={actionLoading}
          >
            Cancelar Pedido
          </Button>
        </div>
      );
    }

    if (profileData.friendship_status === "pending_received") {
      return (
        <div className="profile-view-page__action-group">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={handleAcceptFriendRequest}
            loading={actionLoading}
            className="profile-view-page__btn-accept"
          >
            Aceitar Pedido
          </Button>
          <Button
            danger
            onClick={handleCancelFriendRequest}
            loading={actionLoading}
          >
            Recusar
          </Button>
        </div>
      );
    }

    return (
      <Button
        type="primary"
        icon={<UserAddOutlined />}
        onClick={handleSendFriendRequest}
        loading={actionLoading}
      >
        Mandar Pedido de Amizade
      </Button>
    );
  };

  return (
    <div className="profile-view-page">
      <div className="profile-view-page__back">
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="go-back-btn">
          Voltar
        </Button>
      </div>

      <Card className="profile-view-page__card" variant="borderless">
        <div className="profile-view-page__header">
          <div className="profile-view-page__avatar-wrapper">
            <Avatar
              size={96}
              src={avatarUrl}
              icon={<UserOutlined />}
              className="profile-view-page__avatar"
            />
          </div>

          <div className="profile-view-page__info">
            <div className="profile-view-page__name-row">
              <Title level={3} className="profile-view-page__name">
                {profileData.name}
              </Title>
            </div>
            <Paragraph className="profile-view-page__username">
              @{profileData.username || profileData.user || "utilizador"}
            </Paragraph>
          </div>

          <div className="profile-view-page__actions">
            {renderActions()}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProfileView;