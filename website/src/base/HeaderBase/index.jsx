import classNames from "classnames";
import _auth from "@netuno/auth-client";
import {Link} from "react-router-dom";
import {Button, Layout, Menu} from "antd";
import HeaderUserInfo from "../../components/HeaderUserInfo/index.jsx";
import {EditOutlined, LogoutOutlined} from "@ant-design/icons";
import React from "react";

import "./index.less";

const { Header } = Layout;

function HeaderBase({ collapsed, headerButtonMode }) {
    function onLogout() {
        _auth.logout();
    }
    return (
        <Header className={'header-base ' + classNames({ 'auth ': _auth.isLogged() }) + classNames({ 'collapsed ': collapsed })}>
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
    );
}

export default HeaderBase;