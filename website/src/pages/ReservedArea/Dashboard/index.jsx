import React from 'react';

import { Typography } from 'antd';

import useProfile from "../../../common/useProfile.js";

import './index.less';

const { Title } = Typography;

function Dashboard() {
  const profile = useProfile();
  return (
    <div className="dashboard-layout-content">
      <Title level={2}>Olá {profile.data.name}!</Title>
      <Title level={3} style={{ marginTop: 0 }}>Bem-vindo(a) à sua Área Reservada!</Title>
      <img alt="reserved-area" src={"/images/reserved-area.png"} />
    </div>
  );
}

export default Dashboard;

