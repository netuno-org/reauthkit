import _auth from "@netuno/auth-client";
import {MenuOutlined, DashboardOutlined, BlockOutlined} from "@ant-design/icons";
import {Menu, Layout} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";

import "./index.less";

const { Sider } = Layout;

const menuItems = [
    {
        key: "dashboard",
        label: "Principal",
        icon: <DashboardOutlined/>,
        link: "/dashboard"
    },
    {
        key: "other-page",
        label: "Outra Página",
        icon: <BlockOutlined />,
        link: "/other-page"
    },
];

function SiderMenu({collapsed, onCollapse}) {
    const [selectedMenuKeys, setSelectedMenuKeys] = useState(["dashboard"]);
    const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const menuItem = menuItems.find((i) => location.pathname === i.link);
        if (menuItem) {
            setSelectedMenuKeys([menuItem.key]);
        } else {
            setSelectedMenuKeys([]);
        }
    }, [location])
    function onMenuClick(e) {
        const menuItem = menuItems.find((i) => i.key === e.key);
        if (menuItem) {
            setSelectedMenuKeys([menuItem.key]);
            navigate(menuItem.link);
        }
    }
    return (
        <>
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
                    className="sider-menu"
                >
                    <div className="logo-container"><img alt="logo" src="/images/logo.svg" /></div>
                    <Menu
                        onClick={onMenuClick}
                        selectedKeys={selectedMenuKeys}
                        mode="inline"
                        items={menuItems}
                    />
                </Sider>
            }
        </>
    );
}

export default SiderMenu;