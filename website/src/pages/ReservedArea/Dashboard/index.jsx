import React from 'react';

import { Typography } from 'antd';

import usePeople from "../../../common/usePeople.js";

import './index.less';

const { Title } = Typography;

function Dashboard() {
  const people = usePeople();
  return (
    <div className="dashboard-layout-content">
      <Title level={2}>Olá {people.data.name}!</Title>
      <Title level={3} style={{ marginTop: 0 }}>Bem-vindo(a) à sua Área Reservada!</Title>
      <img alt="reserved-area" src={"/images/reserved-area.png"} />
    </div>
  );
}

export default Dashboard;

