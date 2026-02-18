import classNames from "classnames";
import _auth from "@netuno/auth-client";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {Button, Layout, Menu} from "antd";
import HeaderUserInfo from "../../components/HeaderUserInfo/index.jsx";
import {EditOutlined, LogoutOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";

import "./index.less";

const { Header } = Layout;

function HeaderBase({ collapsed, headerButtonMode }) {
    const [menuKeysSelected, setMenuKeysSelected] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (location.pathname === '/profile/edit') {
            setMenuKeysSelected(['profileEdit']);
        } else {
            setMenuKeysSelected([]);
        }
    }, [location]);
    function onUserMenuClick({key}) {
        if (key === "profileEdit") {
            navigate("/profile/edit");
        } else if (key === "logout") {
            _auth.logout();
        }
    }
    return (
        <Header className={'header-base ' + classNames({ 'auth ': _auth.isLogged() }) + classNames({ 'collapsed ': collapsed })}>
            {!_auth.isLogged() &&
                <Link to="/" className="logo-container"><img alt="logo" src="/images/logo.svg" /></Link>
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
                        onClick={onUserMenuClick}
                        selectedKeys={menuKeysSelected}
                        items={[
                            {
                                key: "profile",
                                label: <HeaderUserInfo />,
                                className: "profile-menu",
                                popupClassName: "profile-menu-popup",
                                children: [
                                    {
                                        key: "profileEdit",
                                        icon: <EditOutlined />,
                                        label: 'Editar Perfil'
                                    },
                                    {
                                        key: "logout",
                                        icon: <LogoutOutlined />,
                                        danger: true,
                                        label: 'Terminar Sessão'
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