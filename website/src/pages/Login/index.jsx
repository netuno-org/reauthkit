import React, { useState, useEffect, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, Checkbox } from "antd";
import _auth from "@netuno/auth-client";
import _service from "@netuno/service-client";
import Config from "../../common/Config";
import RecoverModal from "./RecoverModal";

import {
  FaGoogle, FaWindows, FaFacebook, FaDiscord, FaGithub
} from "react-icons/fa";

import isNetworkError from "is-network-error";

import "altcha/i18n";

import globalNotification from "../../common/globalNotification.js";

import useProfile from "../../common/useProfile.js";

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

function Login() {
  const servicePrefix = _service.config().prefix;
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [altchaPayload, setAltchaPayload] = useState(null);
  const altcha = useRef(null);
  const profile = useProfile();

  useEffect(() => {
    if (_auth.isLogged()) {
      window.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
    if (Config.authAltcha() && altcha && altcha.current) {
      function altchaVerified(ev) {
        if (ev.detail.state === "verified") {
          setAltchaPayload(ev.detail.payload);
        }
      }
      altcha.current.addEventListener("statechange", altchaVerified, false);
      return () => {
        if (altcha.current != null) {
          altcha.current.removeEventListener("statechange", altchaVerified, false);
        }
      }
    }
  }, []);

  function onFinish(values) {
    setSubmitting(true);
    const { username, password, remember } = values;
    if (remember) {
      localStorage.setItem("login", JSON.stringify(values));
    } else {
      localStorage.removeItem("login");
    }
    _auth.login({
      username,
      password,
      data: (data) => {
        // data.myparameter = 'myvalue';
        if (Config.authAltcha()) {
          data.altcha = altchaPayload;
        }
        return data;
      },
      success: ({json}) => {
        profile.set(json.extra);
        setSubmitting(false);
      },
      fail: (data) => {
        setSubmitting(false);
        if (data.error && isNetworkError(data.error)) {
          globalNotification.error({
            title: 'Conexão',
            description: 'Há problemas de conexão com o servidor, tente novamente mais tarde.',
          });
          return;
        }
        if (data.isJSON) {
          if (data.json['locked']) {
            globalNotification.error({
              title: 'Acesso Bloqueado',
              description:
                  'O seu login foi bloqueado devido as muitas tentativas, volte a tentar mais tarde ou contate o suporte.',
            });
            return;
          }
          if (data.json['custom-blocked']) {
            globalNotification.error({
              title: 'Login Bloqueado',
              description:
              'O login foi bloqueado, realize o processo de desbloqueamento ou contate o suporte.',
            });
            return;
          }
        }
        globalNotification.error({
          title: 'Login Inválido',
          description:
          'Por favor verifique as credenciais inseridas.',
        });
      }
    });
  }

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  let initialValues = { remember: true };
  if (localStorage.getItem("login") != null) {
    initialValues = JSON.parse(localStorage.getItem("login"));
  }
  if (_auth.isLogged()) {
    return <Navigate to="/dashboard" />;
  } else {
    return (
      <Layout>
        <Content className="login-container">
          <div className="content-title">
            <Title>Iniciar sessão.</Title>
          </div>
          <div className="content-body">
            <p>Inicie sessão com os seus dados.</p>
            <Form
              layout="vertical"
              name="basic"
              initialValues={initialValues}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              { Config.authProviders().google &&
                <Form.Item>
                  <Button href={`${servicePrefix}/_auth_provider/login/google`} icon={<FaGoogle />}>Entrar com o Google</Button>
                </Form.Item> }
              { Config.authProviders().microsoft &&
                  <Form.Item>
                    <Button href={`${servicePrefix}/_auth_provider/login/microsoft`} icon={<FaWindows />}>Entrar com o Microsoft</Button>
                  </Form.Item> }
              { Config.authProviders().facebook &&
                  <Form.Item>
                    <Button href={`${servicePrefix}/_auth_provider/login/facebook`} icon={<FaFacebook />}>Entrar com o Facebook</Button>
                  </Form.Item> }
              { Config.authProviders().github &&
                <Form.Item>
                  <Button href={`${servicePrefix}/_auth_provider/login/github`} icon={<FaGithub />}>Entrar com o GitHub</Button>
                </Form.Item> }
              { Config.authProviders().discord &&
                <Form.Item>
                  <Button href={`${servicePrefix}/_auth_provider/login/discord`} icon={<FaDiscord />}>Entrar com o Discord</Button>
                </Form.Item> }

              <Form.Item
                label="Utilizador"
                name="username"
                rules={[
                  { required: true, message: 'Insira o seu usuário.' }
              ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Palavra-passe"
                name="password"
                rules={[{ required: true, message: 'Insira a palavra-passe.' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Relembrar</Checkbox>
              </Form.Item>

              { Config.authAltcha() && <Form.Item>
                <altcha-widget
                    ref={altcha}
                    challenge={_service.url('/_altcha')}
                    language="pt"
                    delay={1}
                    hideLogo={true}
                    hideFooter={true}
                ></altcha-widget>
              </Form.Item> }

              <Form.Item>
                <Button loading={submitting} type="primary" className="login-btn" htmlType="submit">
                  Iniciar Sessão
                </Button>
              </Form.Item>

              <Form.Item style={{ textAlign: 'center' }}>
                <Button type="link" onClick={() => setVisible(!visible)} >Esqueceu-se da palavra passe?</Button>
                {visible && <RecoverModal onClose={() => { setVisible(false) }} />}
              </Form.Item>

              <hr />
              <span><p>ou</p></span>
              <Link to="/register">
                <Button loading={submitting} type="default" className={"register-btn"}>
                  Criar Conta
                </Button>
              </Link>
            </Form>
          </div>

        </Content>
        <Sider width={'50%'}>
          <span className="helper" /><img alt="sider-login" src={"/images/sider-login.png"} />
        </Sider>
      </Layout>
    );
  }
}

export default Login;
