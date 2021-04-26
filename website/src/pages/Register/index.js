import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, notification } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

export default function Register(props) {

    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const registerForm = useRef(null);

    useEffect(() => {
        if (_auth.isLogged()) {
            window.scrollTo(0, 0)
        }
        window.scrollTo(0, 0)
    });

    function onFinish(values) {
        setLoading(true);
        const { username, password, mail, name } = values;
        _service({
            method: 'POST',
            url: 'client',
            data: {
                name,
                username,
                password,
                mail
            },
            success: (response) => {
                if (response.json.result) {
                    notification["success"]({
                        message: 'Conta Criada',
                        description: 'A conta foi criada com sucesso, pode iniciar sessão.',
                    });
                    setLoading(false);
                    setReady(true);
                } else {
                    notification["warning"]({
                        message: 'Utilizador existente',
                        description: response.json.error,
                    });
                    setLoading(false);
                }
            },
            fail: () => {
                setLoading(false);
                notification["error"]({
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
        return <Redirect to="/reserved-area" />;
    }
    else if (ready) {
        return <Redirect to="/login" />;
    } else {
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
                            initialValues={{ remember: true }}
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
                                <Input disabled={loading} maxLength={25} />
                            </Form.Item>
                            <Form.Item
                                label="Nome de Utilizador"
                                name="username"
                                rules={[
                                    { required: true, message: 'Insira o seu nome de utilizador.' },
                                    { type: 'string', message: 'Utilizador inválido, apenas letras minúsculas e números.', pattern: '^[a-z0-9]{1,25}$' }
                                ]}
                            >
                                <Input disabled={loading} maxLength={25} />
                            </Form.Item>
                            <Form.Item
                                label="E-mail"
                                name="mail"
                                rules={[
                                    { type: 'email', message: 'O e-mail inserido não é válido.' },
                                    { required: true, message: 'Insira o e-mail.' }
                                ]}
                            >
                                <Input disabled={loading} maxLength={250} />
                            </Form.Item>
                            <Form.Item
                                label="Palavra-passe"
                                name="password"
                                rules={[
                                    { required: true, message: 'Insira a palavra-passe.' },
                                    { type: 'string', message: 'Palavra-Passe deverá ter entre 8 a 25 caracteres.', min: 8, max: 25 },
                                ]}
                            >
                                <PasswordInput disabled={loading} maxLength={25} />
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
                                <Input.Password disabled={loading} maxLength={25} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Criar Conta
                                    </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
                <Sider width={'50%'}>
                    <span class="helper" /><img alt="sider-register" src={"/images/sider-register.png"} />
                </Sider>
            </Layout>
        );
    }

}