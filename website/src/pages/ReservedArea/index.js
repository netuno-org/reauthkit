import React from 'react';
import { Navigate } from "react-router-dom";

import { Typography, Spin } from 'antd';

import { connect } from 'react-redux';

import _auth from '@netuno/auth-client';

import './index.less';

const { Title } = Typography;

function ReservedArea({loggedUserInfo}) {
  if (_auth.isLogged()) {
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
  } else {
    return <Navigate to="/login" />;
  }
}

const mapStateToProps = store => {
  const { loggedUserInfo } = store.loggedUserInfoState;
  return {
    loggedUserInfo
  };
};

export default connect(mapStateToProps, {})(ReservedArea);

