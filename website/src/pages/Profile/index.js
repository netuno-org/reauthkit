import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography, Form, Input, Button, Divider, notification, Spin } from 'antd';
import { PasswordInput } from "antd-password-input-strength";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loggedUserInfoReloadAction } from '../../redux/actions';

import _service from '@netuno/service-client';

import Avatar from './Avatar';

import './index.less';

const { Title } = Typography;

function Profile({loggedUserInfo, loggedUserInfoReloadAction, history}) {

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [avatarImageURL, setAvatarImageURL] = useState('/images/profile-default.png');
  const profileAvatar = useRef(null);
  const profileForm = useRef(null);
  const location = useLocation();

  const layout = {
    wrapperCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 24 }, lg: { span: 12 } }
  };

  useEffect(() => {
    if (loggedUserInfo) {
      if (profileForm.current) {
        profileForm.current.setFieldsValue({
          name: loggedUserInfo?.name,
          username: loggedUserInfo?.username,
          email: loggedUserInfo?.email
        });
      }
      console.log('loggedUserInfo.avatar', loggedUserInfo.avatar)
      if (loggedUserInfo.avatar) {
        setAvatarImageURL(`${_service.config().prefix}/people/avatar?uid=${loggedUserInfo.uid}`);
      }
    }
  }, [location, loggedUserInfo]);

  function onFinish(values) {
    setSubmitting(true);
    const { name, username, password, email } = values;
    _service({
      method: 'PUT',
      url: 'people',
      data: {
        name,
        username,
        password,
        email,
        avatar: profileAvatar?.current?.getImage()
      },
      success: (response) => {
        if (response.json.result) {
          notification["success"]({
            message: 'Edi????o do Perfil',
            description: 'Os dados do seu perfil foram alterados com sucesso.',
          });
          setSubmitting(false);
          profileForm.current.setFieldsValue({
            password: "",
            password_confirm: ""
          });
          loggedUserInfoReloadAction();
        } else {
          notification["warning"]({
            message: 'Utilizador existente',
            description: response.json.error,
          });
          setSubmitting(false);
          profileForm.current.setFieldsValue({
            password: "",
            password_confirm: ""
          });
        }
      },
      fail: () => {
        setSubmitting(false);
        notification["error"]({
          message: 'Erro na Edi????o do Perfil',
          description: 'Ocorreu um erro na edi????o do seu perfil, por favor contacte-nos atrav??s do chat de suporte.',
        });
      }
    });
  }

  function onValuesChange(changedValues, allValues) {
    if (allValues.password && allValues.password.length > 0) {
      setPasswordRequired(true);
    } else {
      setPasswordRequired(false);
    }
  };

  function onFinishFailed(errorInfo) {
    console.log('Failed:', errorInfo);
  }

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="content-title">
          <Title level={2}><Spin /> a carregar...</Title>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="content-title">
          <Button className="go-back-btn" type="link" onClick={() => history.goBack()}><ArrowLeftOutlined /> Voltar atr??s</Button>
        </div>
        <div className="content-title">
          <Title level={2}>Editar Perfil</Title>
        </div>
        <div className="content-body">
          <Avatar ref={profileAvatar} currentImage={avatarImageURL}/>
          <Divider orientation="left" plain>Informa????es Gerais</Divider>
          <Form
            {...layout}
            onValuesChange={onValuesChange}
            ref={profileForm}
            layout="vertical"
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Nome"
              name="name"
              rules={[
                { required: true, message: 'Insira o seu nome.' },
                { type: 'string', message: 'Nome inv??lido, apenas letras min??sculas e mai??sculas.', pattern: "^[a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ,.'-]+$" }
              ]}
            >
              <Input disabled={submitting} maxLength={25} />
            </Form.Item>
            <Form.Item
              label="Nome de utilizador"
              name="username"
              rules={[
                { required: true, message: 'Insira o seu nome.' },
                { type: 'string', message: 'Nome inv??lido, apenas letras min??sculas e mai??sculas.', pattern: "^[a-zA-Z??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ,.'-]+$" }
              ]}
            >
              <Input disabled={submitting} maxLength={25} />
            </Form.Item>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                { type: 'email', message: 'O e-mail inserido n??o ?? v??lido.' },
                { required: true, message: 'Insira o e-mail.' }
              ]}
            >
              <Input disabled={submitting} maxLength={250} />
            </Form.Item>
            <Form.Item
              label="Nova Palavra-passe"
              name="password"
              rules={[
                { type: 'string', message: 'Palavra-Passe dever?? ter entre 8 a 25 caracteres.', min: 8, max: 25 },
              ]}
            >
              <PasswordInput />
            </Form.Item>
            <Form.Item
              label="Confirmar nova Palavra-passe"
              name="password_confirm"
              rules={[
                { required: passwordRequired, message: 'Insira a confirma????o da nova palavra-passe.' },
                { type: 'string', message: 'Palavra-Passe dever?? ter entre 8 a 25 caracteres.', min: 8, max: 25 },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('As palavras-passes n??o s??o iguais.');
                  },
                })
              ]}
            >
              <Input.Password maxLength={25} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Atualizar Perfil
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => {
  const { loggedUserInfo } = store.loggedUserInfoState;
  return {
    loggedUserInfo
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  loggedUserInfoReloadAction
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
