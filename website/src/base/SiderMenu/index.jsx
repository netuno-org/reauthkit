import _auth from "@netuno/auth-client";
import { MenuOutlined, DashboardOutlined, BlockOutlined, MessageOutlined, CloseOutlined } from "@ant-design/icons";
import { Menu, Layout, Drawer, Button, Grid, Tag } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "./index.less";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  {
    key: "dashboard",
    label: "Principal",
    icon: <DashboardOutlined />,
    link: "/dashboard"
  },
  {
    key: "messages",
    label: <><Tag color="#ff0000">3</Tag> Mensagens</>,
    icon: <MessageOutlined />,
    link: "/messages"
  },
  {
    key: "other-page",
    label: "Outra Página",
    icon: <BlockOutlined />,
    link: "/other-page"
  },
];

function SiderMenu({ collapsed, onCollapse }) {
  const [selectedMenuKeys, setSelectedMenuKeys] = useState(["dashboard"]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = screens.md === false;

  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const menuItem = menuItems.find((i) => location.pathname === i.link);
    if (menuItem) {
      setSelectedMenuKeys([menuItem.key]);
    } else {
      setSelectedMenuKeys([]);
    }
  }, [location]);

  function onMenuClick(e) {
    const menuItem = menuItems.find((i) => i.key === e.key);
    if (menuItem) {
      setSelectedMenuKeys([menuItem.key]);
      navigate(menuItem.link);
      if (isMobile) {
        setDrawerOpen(false);
      }
    }
  }

  if (!_auth.isLogged()) {
    return null;
  }

  const menuContent = (
    <Menu
      onClick={onMenuClick}
      selectedKeys={selectedMenuKeys}
      mode="inline"
      items={menuItems}
    />
  );

  if (isMobile) {
    return (
      <>
        {!drawerOpen && (
          <Button
            className="sider-menu__mobile-toggle"
            type="text"
            icon={<MenuOutlined style={{ fontSize: 20 }} />}
            onClick={() => setDrawerOpen(true)}
          />
        )}

        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={240}
          styles={{ body: { padding: 0 }, header: { display: "none" } }}
        >
          <div className="logo-container logo-container--drawer">
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={() => setDrawerOpen(false)}
              className="drawer-close-btn"
            />
            <img alt="logo" src="/images/logo.svg" />
          </div>
          {menuContent}
        </Drawer>
      </>
    );
  }

  return (
    <Sider
      className="sider-menu"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={<MenuOutlined />}
    >
      <div className="logo-container">
        <img alt="logo" src="/images/logo.svg" />
      </div>
      {menuContent}
    </Sider>
  );
}

export default SiderMenu;