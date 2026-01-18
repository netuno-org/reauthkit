import _auth from "@netuno/auth-client";
import {MenuOutlined, PieChartOutlined} from "@ant-design/icons";
import {Menu, Layout, theme} from "antd";
import React, {useState} from "react";

import "./index.less";

const { Sider } = Layout;

function SiderMenu({collapsed, onCollapse}) {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);
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
                    style={{ background: colorBgContainer }}
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
        </>
    );
}

export default SiderMenu;