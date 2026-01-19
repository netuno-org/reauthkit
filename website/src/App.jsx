import React, { useEffect, useState } from "react";
import { Routes as Switch, Route, useLocation, useNavigate, Navigate } from "react-router-dom";

import {ConfigProvider, Layout, theme} from 'antd';
import antLocale_ptPT from 'antd/lib/locale/pt_PT';

import { Provider } from 'react-redux';
import { Store } from './redux/store';

import classNames from 'classnames';

import _auth from '@netuno/auth-client';
import './common/Config';

import HeaderBase from './base/HeaderBase';
import SiderMenu from "./base/SiderMenu";
import FooterBase from "./base/FooterBase";

import LoginPage from './pages/Login';
import Register from './pages/Register';
import LoginCallback from './pages/LoginCallback';
import RegisterCallback from './pages/RegisterCallback';
import Recovery from './pages/Recovery';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Dashboard from './pages/reserved-area/Dashboard';

import './styles/App.less';

const { Content, Sider, Footer } = Layout;

const NavWithAuthCheck = () => {
  if (_auth.isLogged()) {
    return (
      <Navigate to="/reserved-area" />
    );
  }
  return(
    <Navigate to="/login" />
  );
};

export default function App(props) {
  const [headerButtonMode, setHeaderButtonMode] = useState('login');
  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    _auth.config({
      onLogout: () => {
        navigate('/login');
      }
    });
  }, []);

  useEffect(() => {
    setHeaderButtonMode(location.pathname);
  }, [location]);

  function onCollapse() {
    setCollapsed(!collapsed);
  }

  return (
    <ConfigProvider
      locale={antLocale_ptPT}
      theme={{
        token: {
          colorPrimary: '#1178FF',
          fontSize: 16,
          borderRadius: 20,
          primaryColor: '#1890ff',
          colorBgBase: '#eff8ff',
          colorBgLayout: '#ffffff',
          colorBgMask: 'rgba(0, 33, 64, 0.75)'
        },
        components: {
          Layout: {
            headerBg: '#f0f2f5',
            triggerBg: '#f0f2f5',
            triggerColor: null,
            siderBg: '#f0f2f5',
          },
          Menu: {
            colorBgElevated: '#f0f2f5',
            itemBg: '#f0f2f5',
            itemColor: null,
            itemSelectedColor: null,
          }
        },
      }}
    >
      <Provider store={Store}>
        <Layout className={'page ' + classNames({ 'auth ': _auth.isLogged() }) + classNames({ 'collapsed ': collapsed })}>
          <SiderMenu collapsed={collapsed} onCollapse={onCollapse} />
          <Layout>
            <HeaderBase collapsed={collapsed} headerButtonMode={headerButtonMode} />
            <Content className={classNames({ 'auth ': _auth.isLogged() })}>
              <Switch>
                <Route exact path="/" element={<NavWithAuthCheck/>}/>
                <Route path="/login/:provider" element={<LoginCallback/>} />
                <Route path="/register/:provider" element={<RegisterCallback/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/recovery" element={<Recovery/>} />
                <Route path="*" element={<NotFound/>} />
              </Switch>
            </Content>
            <FooterBase />
          </Layout>
        </Layout>
      </Provider>
    </ConfigProvider>
  );
}
