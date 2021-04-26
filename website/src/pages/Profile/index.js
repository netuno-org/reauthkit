import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography, Form, Input, Button, notification, Spin } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _service from '@netuno/service-client';

import './index.less';

const { Title } = Typography;

export default function Profile(props) {

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [passwordRequired, setPasswordRequired] = useState(false);
    const profileForm = useRef(null);

    const location = useLocation();

    const layout = {
        wrapperCol: { xs: { span: 24 }, sm: { span: 24 }, md: { span: 24 }, lg: { span: 12 } }
    };

    useEffect(() => {
        if (profileForm.current)
            onFetchProfile();
    }, [location]);

    function onFetchProfile() {
        setLoading(true);
        _service({
            method: 'GET',
            url: 'client',
            success: (response) => {
                setLoading(false);
                if (response.json.result) {
                    profileForm.current.setFieldsValue({
                        name: response.json.data[0].name,
                        username: response.json.data[0].username,
                        mail: response.json.data[0].email
                    });
                } else {
                    notification["warning"]({
                        message: 'Ocorreu um erro a carregar os dados',
                        description: response.json.error,
                    });
                    setLoading(false);
                }
            },
            fail: () => {
                setLoading(false);
                notification["error"]({
                    message: 'Ocorreu um erro a carregar os dados',
                    description: 'Ocorreu um erro a carregar os dados, por favor tente novamente.',
                });
            }
        });
    }

    function onFinish(values) {
        setSubmitting(true);
        const { name, username, password, mail } = values;
        _service({
            method: 'PUT',
            url: 'client',
            data: {
                name,
                username,
                password,
                mail,
            },
            success: (response) => {
                if (response.json.result) {
                    notification["success"]({
                        message: 'Edição do Perfil',
                        description: 'Os dados do seu perfil foram alterados com sucesso.',
                    });
                    setSubmitting(false);
                    profileForm.current.setFieldsValue({
                        password: "",
                        password_confirm: ""
                    });
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
                    message: 'Erro na Edição do Perfil',
                    description: 'Ocorreu um erro na edição do seu perfil, por favor contacte-nos através do chat de suporte.',
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
                    <Button className="go-back-btn" type="link" onClick={() => props.history.goBack()}><ArrowLeftOutlined /> Voltar atrás</Button>
                </div>
                <div className="content-title">
                    <Title level={2}>Editar Perfil</Title>
                </div>
                <div className="content-body">
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
                                { type: 'string', message: 'Nome inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$" }
                            ]}
                        >
                            <Input disabled={submitting} maxLength={25} />
                        </Form.Item>
                        <Form.Item
                            label="Nome de utilizador"
                            name="username"
                            rules={[
                                { required: true, message: 'Insira o seu nome.' },
                                { type: 'string', message: 'Nome inválido, apenas letras minúsculas e maiúsculas.', pattern: "^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$" }
                            ]}
                        >
                            <Input disabled={submitting} maxLength={25} />
                        </Form.Item>
                        <Form.Item
                            label="E-mail"
                            name="mail"
                            rules={[
                                { type: 'email', message: 'O e-mail inserido não é válido.' },
                                { required: true, message: 'Insira o e-mail.' }
                            ]}
                        >
                            <Input disabled={submitting} maxLength={250} />
                        </Form.Item>
                        <Form.Item
                            label="Nova Palavra-passe"
                            name="password"
                            rules={[
                                { type: 'string', message: 'Palavra-Passe deverá ter entre 8 a 25 caracteres.', min: 8, max: 25 },
                            ]}
                        >
                            <PasswordInput />
                        </Form.Item>
                        <Form.Item
                            label="Confirmar nova Palavra-passe"
                            name="password_confirm"
                            rules={[
                                { required: passwordRequired, message: 'Insira a confirmação da nova palavra-passe.' },
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