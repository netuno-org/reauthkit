import React, { useEffect, useState } from "react";
import { Routes as Switch, Route, useLocation, useNavigate, Link, Navigate } from "react-router-dom";

import { ConfigProvider, Layout, Menu, Button } from 'antd';
import { PieChartOutlined, LogoutOutlined, MenuOutlined, EditOutlined } from '@ant-design/icons';
import antLocale_ptPT from 'antd/lib/locale/pt_PT';

import { Provider } from 'react-redux';
import { Store } from './redux/store';

import classNames from 'classnames';

import _auth from '@netuno/auth-client';
import './common/Config';

import HeaderUserInfo from './components/HeaderUserInfo';

import LoginPage from './pages/Login';
import Register from './pages/Register';
import ReservedArea from './pages/ReservedArea';
import LoginCallback from './pages/LoginCallback';
import RegisterCallback from './pages/RegisterCallback';
import Recovery from './pages/Recovery';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import './styles/App.less';

const { Header, Content, Sider, Footer } = Layout;

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
  const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);

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

  function onLogout() {
    _auth.logout();
  }

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
          colorBgMask: '#002140'
        }
      }}
    >
      <Provider store={Store}>
        <Layout className={'page ' + classNames({ 'auth ': _auth.isLogged() }) + classNames({ 'collapsed ': collapsed })}>
          {_auth.isLogged() &&
           <Sider
             onBreakpoint={mobile => {
               setSideMenuMobileMode(mobile);
             }}
             collapsedWidth={sideMenuMobileMode ? '0' : '80'}
             breakpoint={"md"}
             collapsible
             collapsed={collapsed}
             onCollapse={onCollapse}
             trigger={<MenuOutlined />}
             theme="light"
           >
             <div className="logo-container"><img alt="logo" src="/images/logo.png" /></div>
             <Menu
              defaultSelectedKeys={['1']}
              mode="inline"
              items={[
                {
                  key: "1",
                  label: "Área Reservada",
                  icon: <PieChartOutlined/>,
                  className: "menu-item-reserved"
                }
              ]}
            />
           </Sider>
          }
          <Layout>
            <Header className={classNames({ 'auth ': _auth.isLogged() }) + classNames({ 'collapsed ': collapsed })}>
              {!_auth.isLogged() &&
               <Link to="/" className="logo-container"><img alt="logo" src="/images/logo.png" /></Link>
              }
              {headerButtonMode === '/login' ?
               <Link to="/register">
                 <Button type="primary">Criar conta</Button>
               </Link>
               : headerButtonMode === '/register' ?
               <Link to="/login">
                 <Button type="primary">Iniciar sessão</Button>
               </Link>
               : _auth.isLogged() &&
               <Menu
                  mode="horizontal"
                  items={[
                    {
                      key: "profile",
                      label: <HeaderUserInfo />,
                      className: "profile-menu",
                      popupClassName: "profile-menu-popup",
                      children: [
                        {
                            key: "1",
                            label: (
                                <Link to="/profile">
                                <EditOutlined />&nbsp;&nbsp;&nbsp;Editar Perfil
                                </Link>
                            )
                        },
                        {
                            key: "2",
                            label: (
                                <Button type="link" onClick={onLogout} danger>
                                <LogoutOutlined /> Terminar Sessão
                                </Button>
                            )
                        }
                      ]
                    }
                  ]}
               />
              }
            </Header>
            <Content className={classNames({ 'auth ': _auth.isLogged() })}>
              <Switch>
                <Route exact path="/" element={<NavWithAuthCheck/>}/>
                <Route path="/login/:provider" element={<LoginCallback/>} />
                <Route path="/register/:provider" element={<RegisterCallback/>} />
                <Route path="/reserved-area" element={<ReservedArea/>} />
                <Route path="/profile" element={<Profile/>} />
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/recovery" element={<Recovery/>} />
                <Route path="*" element={<NotFound/>} />
              </Switch>
            </Content>
            {!_auth.isLogged() &&
             <Footer>© netuno.org {new Date().getFullYear()}</Footer>
            }
          </Layout>
        </Layout>
      </Provider>
    </ConfigProvider>
  );
}
