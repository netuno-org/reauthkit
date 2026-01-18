import _auth from "@netuno/auth-client";
import {MenuOutlined, PieChartOutlined} from "@ant-design/icons";
import {Menu, Layout, theme} from "antd";
import React, {useState} from "react";

import "./index.less";

const { Sider } = Layout;

function SiderMenu({collapsed, onCollapse}) {
    const [sideMenuMobileMode, setSideMenuMobileMode] = useState(false);
    function onMenuClick(e) {

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
                    <div className="logo-container"><img alt="logo" src="/images/logo.png" /></div>
                    <Menu
                        onClick={onMenuClick}
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={[
                            {
                                key: "main",
                                label: "Principal",
                                icon: <PieChartOutlined/>
                            }
                        ]}
                    />
                </Sider>
            }
        </>
    );
}

export default SiderMenu;