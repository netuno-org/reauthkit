import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { Layout, Spin, Typography, Form, Input, Button, notification } from 'antd';
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

export default function Register(props) {
  const [toLogin, setToLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [logged, setLogged] = useState(false);
  const [providerData, setProviderData] = useState(null);
  const [loadingProviderData, setLoadingProviderData] = useState(true);
  const registerForm = useRef(null);
  const { provider } = useParams(null);

  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  useEffect(() => {
    window.scrollTo(0, 0);
    _service({
      method: 'POST',
      url: `_auth_provider/register/${provider}`,
      data: {
        code
      },
      success: async ({ json }) => {
        if (json) {
          if (json.exists) {
            notification["warning"]({
              message: 'Conta Já Existe',
              description: 'Já foi criada uma conta com este e-mail, efetue o login ou a recuperação do acesso.',
            });
            setToLogin(true);
          } else {
            setProviderData(json);
          }
        }
        setLoadingProviderData(false);
      },
      fail: (error) => {
        console.error(error);
        notification["error"]({
          message: 'Erro na Criação da Conta',
          description: 'Ocorreu um erro na criação da conta, por favor contacte-nos através do suporte.',
        });
        setLoadingProviderData(false);
      }
    });
  }, []);

  function onFinish(values) {
    setSubmitting(true);
    const { username, email, name } = values;
    _service({
      method: 'POST',
      url: 'people',
      data: {
        name,
        username,
        code: providerData.uid,
        provider
      },
      success: (response) => {
        if (response.json.result) {
          notification["success"]({
            message: 'Conta Criada',
            description: 'A conta foi criada com sucesso.',
          });
          setSubmitting(false);

          _service({
            method: 'POST',
            url: `_auth_provider/login/${provider}`,
            data: {
              uid: providerData.uid
            },
            success: async ({ json }) => {
              if (json) {
                if (json.token) {
                  const authConfig = await _auth.config();
                  authConfig.token.load(authConfig, json.token);
                  setLogged(true);
                } else {
                  notification["error"]({
                    message: 'Falha no Login',
                    description: 'Não foi possível logar automaticamente.',
                  });
                  setToLogin(true);
                }
              }
            },
            fail: (error) => {
              console.error(error);
              notification["error"]({
                message: 'Erro na Autenticação',
                description: 'Ocorreu um erro grave de autenticação, por favor contacte-nos através do chat de suporte.',
              });
            }
          });
        }
      },
      fail: (e) => {
        setSubmitting(false);
        if (e && e.status === 409 && e.json && e.json.error) {
          if (e.json.error === 'email-already-exists') {
            return notification["warning"]({
              message: 'E-mail Existente',
              description: 'Este e-mail já existe, faça a recuperação do acesso no ecrã de login ou escolha outro.',
            });
          }
          if (e.json.error === 'user-already-exists') {
            return notification["warning"]({
              message: 'Utilizador Existente',
              description: 'Este utilizador já existe, faça a recuperação do acesso no ecrã de login ou escolha outro.',
            });
          }
        }
        return notification["error"]({
          message: 'Erro na Criação de Conta',
          description: 'Não foi possível criar a conta, contacte-nos através do chat de suporte.',
        });
      }
    });
  }

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  if (loadingProviderData) {
    return (
      <div className="register-container">
        <Spin />
      </div>
    );
  }
  if (logged && _auth.isLogged()) {
    return <Navigate to="/reserved-area" />;
  }
  if (toLogin) {
    return <Navigate to="/login" />;
  }
  return (
    <Layout>
      <Content className="register-container">
        <div className="content-title">
          <Title>Criar conta.</Title>
        </div>
        <div className="content-body">
          <p>Crie uma conta para poder aceder à sua área reservada.</p>
          <Form
            ref={registerForm}
            layout="vertical"
            name="basic"
            initialValues={{ name: providerData.name, username: providerData.username, email: providerData.email }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
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
            >
              <Input disabled={true} maxLength={250} />
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
