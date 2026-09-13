import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Card, Avatar, Button, Spin, Empty } from "antd";
import { UserOutlined, ArrowLeftOutlined, EditOutlined, MessageOutlined } from "@ant-design/icons";
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

  const targetUid = uid || myProfile.data?.uid;
  const isMyProfile = !uid || uid === myProfile.data?.uid;

  useEffect(() => {
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
  }, [targetUid]);

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
            {isMyProfile ? (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate("/profile/edit")}
              >
                Editar Perfil
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<MessageOutlined />}
                onClick={() => navigate("/messages")}
              >
                Enviar Mensagem
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProfileView;