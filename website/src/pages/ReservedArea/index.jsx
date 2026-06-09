import React, {useEffect, useState} from "react";
import _auth from "@netuno/auth-client";
import {Button, Spin, Typography} from "antd";
import {useNavigate, useLocation, Link} from "react-router-dom";

import useProfile from "../../common/useProfile.js";
import useWS from "../../common/useWS.js";

import NotFound from "../NotFound";
import ProfileEdit from "./profile/Edit";
import ProfileView from "./profile/View";
import Dashboard from "./Dashboard";
import Messages from "./Messages";
import OtherPage from "./OtherPage";

import "./index.less";

const {Title} = Typography;

function ReservedArea() {
  const navigate = useNavigate();
  const location = useLocation();
  if (_auth.isLogged()) {
    const [loading, setLoading] = useState(true);
    const [wsConnecting, setWSConnecting] = useState(false);
    const profile = useProfile();
    const ws = useWS();

    useEffect(() => {
      if (profile.isUnloaded()) {
        ws.close();
        _auth.logout();
        navigate("/login");
        return;
      }
      if (profile.data == null) {
        profile.load((result) => {
          if (result) {
            ws.load((result) => {
              setLoading(false);
            });
            return;
          }
          navigate("/login");
        });
        return;
      }
      if (loading === true && !ws.isConnecting()) {
        ws.load((result) => {
          setLoading(false);
        });
        return;
      }
      setLoading(false);
    }, [profile.data]);
    if (loading) {
      return (
        <section className="reserved-area">
          <Spin spinning={loading}></Spin>
        </section>
      );
    }
    if (profile.data == null) {
      return null; // On logout reaches here.
    }
    if (location.pathname === "/profile/edit") {
      return <ProfileEdit/>;
    }
    if (location.pathname === "/profile/view") {
      return <ProfileView/>;
    }
    if (location.pathname === "/dashboard") {
      return <Dashboard/>;
    }
    if (location.pathname === "/messages") {
      return <Messages/>;
    }
    if (location.pathname === "/other-page") {
      return <OtherPage/>;
    }
    return <NotFound/>;
  }
  return (
    <section className="reserved-area">
      <Title>Não Autorizado</Title>
      <p>
        É necessário realizar a autenticação para aceder a área reservada.
      </p>
      <Button type="primary" onClick={() => navigate("/login")}>
        Ir para o Login
      </Button>
    </section>
  );
}

export default ReservedArea;
