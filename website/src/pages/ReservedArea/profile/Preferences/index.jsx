import React, { useEffect, useState } from "react";
import { Typography, Switch, Card, Spin, Row, Col } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import _service from "@netuno/service-client";

import globalNotification from "../../../../common/globalNotification.js";
import "./index.less";

const { Title } = Typography;

function Preferences() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [messageNotifications, setMessageNotifications] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    setLoading(true);
    _service({
      method: "GET",
      url: "notification/settings",
      success: (response) => {
        setLoading(false);
        if (response.json && response.json.result && response.json.data) {
          const messageSetting = response.json.data.find((item) => item.code === "message");
          if (messageSetting) {
            setMessageNotifications(messageSetting.enabled);
          }
        }
      },
      fail: () => {
        setLoading(false);
      },
    });
  };

  const handleToggle = (checked) => {
    setMessageNotifications(checked);
    setUpdating(true);
    _service({
      method: "POST",
      url: "notification/settings",
      data: {
        code: "message",
        enabled: checked,
      },
      success: (response) => {
        setUpdating(false);
        if (response.json && response.json.result) {
          globalNotification.success({
            title: "Preferências",
            description: "Preferências atualizadas com sucesso.",
          });
        }
      },
      fail: () => {
        setUpdating(false);
        setMessageNotifications(!checked);
        globalNotification.serviceFail({
          title: "Preferências",
          description: "Ocorreu um erro ao atualizar as preferências.",
        });
      },
    });
  };

  if (loading) {
    return (
      <div className="content-body--centered" style={{ padding: "40px", textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="preferences-page">
      <div className="preferences-page__title">
        <Title level={2}>Preferências de Notificação</Title>
      </div>

      <div className="preferences-page__body">
        <Card className="preferences-page__card" variant="borderless">
          <div className="preferences-page__section-header">
            <MessageOutlined className="preferences-page__icon" />
            <span className="preferences-page__section-title">Mensagens</span>
          </div>

          <div className="preferences-page__divider" />

          <Row align="middle" justify="space-between" className="preferences-page__row">
            <Col xs={18} sm={20}>
              <div className="preferences-page__item-title">Mensagem</div>
              <div className="preferences-page__item-desc">
                Recebe quando alguém envia uma mensagem privada para você.
              </div>
            </Col>
            <Col xs={6} sm={4} style={{ textAlign: "right" }}>
              <Switch
                checked={messageNotifications}
                onChange={handleToggle}
                loading={updating}
              />
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}

export default Preferences;
