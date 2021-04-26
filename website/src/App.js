import React, { useEffect, useState } from "react";
import { Switch, Route, useLocation, Link, Redirect } from "react-router-dom";

import { ConfigProvider, Layout, Menu, Button } from 'antd';
import { PieChartOutlined, UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import antLocale_ptPT from 'antd/lib/locale/pt_PT';

import classNames from 'classnames';

import _auth from '@netuno/auth-client';
import './common/Config';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ReservedArea from './pages/ReservedArea';
import RecoveryPage from './pages/Recovery';

import './styles/App.less';

const { Header, Content, Sider, Footer } = Layout;
const { SubMenu } = Menu;

export default function App(props) {

  const location = useLocation();

  const [headerButtonMode, setHeaderButtonMode] = useState('login');
  const [collapsed, setCollapsed] = useState(false);
  const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);

  useEffect(() => {
    setHeaderButtonMode(location.pathname);
  }, [location]);

  function onLogout() {
    _auth.logout();
  }

  function onCollapse() {
    setCollapsed(!collapsed)
  }

  return (
    <ConfigProvider locale={antLocale_ptPT}>
      <Layout className={'page'}>
        {_auth.isLogged() &&
          <Sider
            onBreakpoint={mobile => {
              setSideMenuMobileMode(mobile)
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
            <Menu defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1" icon={<PieChartOutlined />}>
                <Link to="/reserved-area">Área Reservada</Link>
              </Menu.Item>
            </Menu>
          </Sider>
        }
        <Layout>
          <Header className={classNames({ 'auth ': _auth.isLogged() }) + classNames({ 'collapsed ': collapsed })}>
            {!_auth.isLogged() &&
              <Link to="/" className="logo-container"><img alt="logo" src="/images/logo.png" /></Link>
            }
            <Menu mode="horizontal">
              {headerButtonMode === '/login' ?
                <Link to="/register">
                  <Button type="primary">Criar conta</Button>
                </Link>
                : headerButtonMode === '/register' ?
                  <Link to="/login">
                    <Button type="primary">Iniciar sessão</Button>
                  </Link>
                  : _auth.isLogged() &&
                  <SubMenu key={"profile"} className="profile-menu" icon={<UserOutlined />}>
                    <Menu.Item key="1">
                      <Link to="/login">
                        <Button type="link" onClick={onLogout} danger>
                          <LogoutOutlined /> Terminar Sessão
                        </Button>
                      </Link>
                    </Menu.Item>
                  </SubMenu>
              }
            </Menu>
          </Header>
          <Content className={classNames({ 'auth ': _auth.isLogged() })}>
            <Switch>
              <Route exact path="/">
                {_auth.isLogged() ?
                  <Redirect to="/reserved-area" />
                  :
                  <Redirect to="/login" />
                }
              </Route>
              <Route path="/reserved-area" component={ReservedArea} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/recovery" component={RecoveryPage} />
            </Switch>
          </Content>
          {!_auth.isLogged() &&
            <Footer>© sitana.pt 2021</Footer>
          }
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}