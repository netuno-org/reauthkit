import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, notification } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';

import {
  FaGoogle, FaWindows, FaFacebook, FaDiscord, FaGithub
} from "react-icons/fa";

import Config from '../../common/Config';

import isNetworkError from "is-network-error";

const { Title } = Typography;
const { Content, Sider } = Layout;

import 'altcha';

import './index.less';

export default function Register(props) {
  const servicePrefix = _service.config().prefix;
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [altchaPayload, setAltchaPayload] = useState(null);
  const registerForm = useRef(null);
  const altcha = useRef(null);
  const { provider } = useParams(null);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    if (_auth.isLogged()) {
      window.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
    if (altcha && altcha.current) {
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
    const { username, password, email, name } = values;
    _service({
      method: 'POST',
      url: 'people',
      data: {
        name,
        username,
        password,
        email,
        altcha: altchaPayload
      },
      success: (response) => {
        if (response.json.result) {
          api.success({
            message: 'Conta Criada',
            description: 'A conta foi criada com sucesso, pode iniciar sessão.',
          });
          setSubmitting(false);
          setReady(true);
        }
      },
      fail: (e) => {
        setSubmitting(false);
        if (e.error && isNetworkError(e.error)) {
          return api.error({
            message: 'Conexão',
            description:
                'Há problemas de conexão com o servidor, tente novamente mais tarde.',
          });
        }
        if (e && e.status === 409 && e.json && e.json.error) {
          if (e.json.error === 'email-already-exists') {
            return api.warning({
              message: 'E-mail Existente',
              description: 'Este e-mail já existe, faça a recuperação do acesso no ecrã de login ou escolha outro.',
            });
          }
          if (e.json.error === 'user-already-exists') {
            return api.warning({
              message: 'Utilizador Existente',
              description: 'Este utilizador já existe, faça a recuperação do acesso no ecrã de login ou escolha outro.',
            });
          }
        }
        return api.error({
          message: 'Erro na Criação de Conta',
          description: 'Não foi possível criar a conta, contacte-nos através do chat de suporte.',
        });
      }
    });
  }

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  if (_auth.isLogged()) {
    return <Navigate to="/reserved-area" />;
  }
  if (ready) {
    return <Navigate to="/login" />;
  }
  return (
    <Layout>
      <Content className="register-container">
        {contextHolder}
        <div className="content-title">
          <Title>Criar conta.</Title>
        </div>
        <div className="content-body">
          <p>Crie uma conta para poder aceder à sua área reservada.</p>
          <Form
            ref={registerForm}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            { Config.authProviders().google &&
              <Form.Item>
                <Button href={`${servicePrefix}/_auth_provider/register/google`} icon={<FaGoogle />}>Registrar com o Google</Button>
              </Form.Item> }
            { Config.authProviders().microsoft &&
                <Form.Item>
                  <Button href={`${servicePrefix}/_auth_provider/login/microsoft`} icon={<FaWindows />}>Entrar com o Microsoft</Button>
                </Form.Item> }
            { Config.authProviders().facebook &&
                <Form.Item>
                  <Button href={`${servicePrefix}/_auth_provider/register/facebook`} icon={<FaFacebook />}>Registrar com o Facebook</Button>
                </Form.Item> }
            { Config.authProviders().github &&
              <Form.Item>
                <Button href={`${servicePrefix}/_auth_provider/register/github`} icon={<FaGithub />}>Registrar com o GitHub</Button>
              </Form.Item> }
            { Config.authProviders().discord &&
              <Form.Item>
                <Button href={`${servicePrefix}/_auth_provider/register/discord`} icon={<FaDiscord />}>Registrar com o Discord</Button>
              </Form.Item> }
            <Form.Item
              label="Nome"
              name="name"
              rules={[
                { required: true, message: 'Insira o seu nome.' },
                { type: 'string', message: 'Nome inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$" }
              ]}
            >
              <Input disabled={submitting} maxLength={250} />
            </Form.Item>
            <Form.Item
              label="Utilizador"
              name="username"
              rules={[
                { required: true, message: 'Insira o seu usuário.' },
                { type: 'string', message: 'Usuário inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-z]+[a-z0-9]{1,24}$" }
              ]}
            >
              <Input disabled={submitting} maxLength={25} />
            </Form.Item>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { type: 'email', message: 'O e-mail inserido não é válido.' },
                { required: true, message: 'Insira o e-mail.' }
              ]}
            >
              <Input disabled={submitting} maxLength={250} />
            </Form.Item>
            <Form.Item
              label="Palavra-passe"
              name="password"
              rules={[
                { required: true, message: 'Insira a palavra-passe.' },
                { type: 'string', message: 'Palavra-Passe deverá ter entre 8 a 25 caracteres.', min: 8, max: 25 },
              ]}
            >
              <PasswordInput disabled={submitting} maxLength={25} />
            </Form.Item>
            <Form.Item
              label="Confirmar a Palavra-passe"
              name="password_confirm"
              rules={[
                { required: true, message: 'Insira a confirmação da palavra-passe.' },
                { type: 'string', message: 'Palavra-Passe deverá ter entre 8 a 25 caracteres.', min: 8, max: 25 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('As palavras-passes não são iguais.');
                  },
                })
              ]}
            >
              <Input.Password disabled={submitting} maxLength={25} />
            </Form.Item>
            <Form.Item>
              <altcha-widget
                  ref={altcha}
                  challengeurl={_service.url('/_altcha')}
                  delay={1}
                  hidelogo={true}
                  hidefooter={true}
              ></altcha-widget>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Criar Conta
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
      <Sider width={'50%'}>
        <span className="helper" /><img alt="sider-register" src={"/images/sider-register.png"} />
      </Sider>
    </Layout>
  );
}
