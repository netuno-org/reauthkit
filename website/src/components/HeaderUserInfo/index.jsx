import React, {useState, useEffect} from 'react';

import {Spin, Avatar, Row, Col} from 'antd';

import _service from '@netuno/service-client';

import useProfile from "../../common/useProfile.js";

import WSBadge from "./WSBadge";

import './index.less';

function HeaderUserInfo() {
  const [loading, setLoading] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState('/images/profile-default.png');
  const profile = useProfile();
  useEffect(() => {
    if (profile.data == null) {
      setLoading(true);
    } else {
      setLoading(false);
      setAvatarImageURL(null);
      if (profile.data.avatar) {
        setTimeout(() => setAvatarImageURL(_service.url(`/profile/avatar?uid=${profile.data.uid}&${new Date().getTime()}`)), 250);
      }
    }
  }, [profile.data]);
  if (loading) {
    return (
      <div>
        <Spin/>
      </div>
    );
  }
  if (profile.data) {
    return (
      <div className="header__user-info">
        <Row>
          <Col flex="50px" className="header__user-info__avatar">
            {avatarImageURL && <Avatar size={40} icon={<img src={avatarImageURL}/>} />}
            <WSBadge/>
          </Col>
          <Col flex="auto" className="header__user-info__username">
            {profile.data.name}
          </Col>
        </Row>
      </div>
    );
  }
  return (
      <div></div>
  );
}

export default HeaderUserInfo;