import React, { useState, useEffect } from 'react';
import { Navigate, Link } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, Checkbox, notification } from 'antd';
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';
import Config from '../../common/Config';
import withRouter from '../../common/withRouter';
import RecoverModal from './RecoverModal';

import {
  FaGoogle, FaWindows, FaFacebook, FaDiscord, FaGithub
} from "react-icons/fa";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoAction } from '../../redux/actions';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

function Login({loggedUserInfoAction}) {
  const servicePrefix = _service.config().prefix;
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (_auth.isLogged()) {
      window.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
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
        return data;
      },
      success: (data) => {
        loggedUserInfoAction(data.json.extra);
        setSubmitting(false);
      },
      fail: (data) => {
        setSubmitting(false);
        if (data.isJSON) {
          if (data.json['locked']) {
            api.error({
              message: 'Acesso Bloqueado',
              description:
                  'O seu login foi bloqueado devido as muitas tentativas, volte a tentar mais tarde ou contate o suporte.',
            });
            return;
          }
          if (data.json['custom-blocked']) {
            api.error({
              message: 'Login Bloqueado',
              description:
              'O login foi bloqueado, realize o processo de desbloqueamento ou contate o suporte.',
            });
            return;
          }
        }
        api.error({
          message: 'Login Inválido',
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
    return <Navigate to="/reserved-area" />;
  } else {
    return (
      <Layout>
        <Content className="login-container">
          <div className="content-title">
            <Title>Iniciar sessão.</Title>
          </div>
          {contextHolder}
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
                  { required: true, message: 'Insira o seu usuário.' },
                  { type: 'string', message: 'Usuário inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-z]+[a-z0-9]{1,24}$" }
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

const mapStateToProps = store => {
  return { };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loggedUserInfoAction
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
