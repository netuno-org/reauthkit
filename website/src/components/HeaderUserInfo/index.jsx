import React, {useState, useEffect} from 'react';

import { Spin, notification } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoAction } from '../../redux/actions';

import _service from '@netuno/service-client';
import _auth from '@netuno/auth-client';

import './index.less';

function HeaderUserInfo({loggedUserInfo, loggedUserInfoReload, loggedUserInfoAction}) {
  const [loading, setLoading] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState('/images/profile-default.png');
  useEffect(() => {
    setLoading(true);
    _service({
      method: 'GET',
      url: 'people',
      success: (response) => {
        setLoading(false);
        if (response.json.result) {
          loggedUserInfoAction(response.json.data);
        } else {
          notification["warning"]({
            message: 'Dados do Utilizador',
            description: response.json.error,
          });
          setLoading(false);
        }
      },
      fail: (e) => {
        console.error('Dados do Utilizador', e);
        setLoading(false);
        notification["error"]({
          message: 'Dados do Utilizador',
          description: 'Ocorreu um erro a carregar os dados, por favor tente novamente.',
        });
        _auth.logout();
      }
    });
  }, [loggedUserInfoReload]);
  useEffect(() => {
    if (loggedUserInfo && loggedUserInfo.avatar) {
      setAvatarImageURL(null);
      setTimeout(() => setAvatarImageURL(`${_service.config().prefix}/people/avatar?uid=${loggedUserInfo.uid}&${new Date().getTime()}`), 250);
    }
  }, [loggedUserInfo]);
  if (loading) {
    return (
      <div className="dashboard-layout-content">
        <Spin/>
      </div>
    );
  }
  if (loggedUserInfo) {
    return (
      <div className="header__user-info">
        {avatarImageURL && <img src={avatarImageURL}/>}
        <span>{loggedUserInfo.name}</span>
      </div>
    );
  }
  return null;
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
