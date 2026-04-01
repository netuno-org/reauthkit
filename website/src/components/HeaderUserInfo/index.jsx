import React, {useState, useEffect} from 'react';

import {Spin, Avatar, Row, Col} from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoAction } from '../../redux/actions';

import _service from '@netuno/service-client';
import _auth from '@netuno/auth-client';

import globalNotification from "../../common/globalNotification.js";

import WSBadge from "./WSBadge";

import './index.less';

function HeaderUserInfo({loggedUserInfo, loggedUserInfoReload, loggedUserInfoAction}) {
  const [loading, setLoading] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState('/images/profile-default.png');
  useEffect(() => {
    if (!loggedUserInfoReload && !!loggedUserInfo) {
      return;
    }
    setLoading(true);
    _service({
      method: 'GET',
      url: 'people',
      success: (response) => {
        setLoading(false);
        if (response.json.result) {
          loggedUserInfoAction(response.json.data);
        } else {
          globalNotification.warning({
            title: 'Dados do Utilizador',
            description: response.json.error,
          });
          setLoading(false);
        }
      },
      fail: (e) => {
        console.error('Dados do Utilizador', e);
        setLoading(false);
        globalNotification.serviceFail({
          title: 'Dados do Utilizador',
          description: 'Ocorreu um erro a carregar os dados, por favor tente novamente mais tarde.',
        });
        _auth.logout();
      }
    });
  }, [loggedUserInfoReload]);
  useEffect(() => {
    if (loggedUserInfo && loggedUserInfo.avatar) {
      setAvatarImageURL(null);
      setTimeout(() => setAvatarImageURL(_service.url(`/people/avatar?uid=${loggedUserInfo.uid}&${new Date().getTime()}`)), 250);
    }
  }, [loggedUserInfo]);
  if (loading) {
    return (
      <div>
        <Spin/>
      </div>
    );
  }
  if (loggedUserInfo) {
    return (
      <div className="header__user-info">
        <Row>
          <Col flex="50px" className="header__user-info__avatar">
            {avatarImageURL && <Avatar size={40} icon={<img src={avatarImageURL}/>} />}
            <WSBadge/>
          </Col>
          <Col flex="auto" className="header__user-info__username">
            {loggedUserInfo.name}
          </Col>
        </Row>
      </div>
    );
  }
  return (
      <div></div>
  );
}

const mapStateToProps = store => {
  const { loggedUserInfo, loggedUserInfoReload } = store.loggedUserInfoState;
  return {
    loggedUserInfo, loggedUserInfoReload
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loggedUserInfoAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUserInfo);
