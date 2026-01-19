import React from 'react';

import { Typography, Spin } from 'antd';

import { connect } from 'react-redux';

import './index.less';

const { Title } = Typography;

function Dashboard({loggedUserInfo}) {
  let content = null;
  if (!loggedUserInfo) {
    content = <Spin/>;
  } else {
    content = (
      <>
        <Title level={2}>Olá {loggedUserInfo.name}!</Title>
        <Title level={3} style={{ marginTop: 0 }}>Bem-vindo(a) à sua Área Reservada!</Title>
        <img alt="reserved-area" src={"/images/reserved-area.png"} />
      </>
    );
  }
  return (
    <div className="dashboard-layout-content">
      {content}
    </div>
  );
}

const mapStateToProps = store => {
  const { loggedUserInfo } = store.loggedUserInfoState;
  return {
    loggedUserInfo
  };
};

export default connect(mapStateToProps, {})(Dashboard);

