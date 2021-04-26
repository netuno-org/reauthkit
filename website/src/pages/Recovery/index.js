import React, { useState, useEffect, useRef } from 'react';
import { Redirect, useLocation } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, notification } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _service from '@netuno/service-client';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

export default function Recovery(props) {

    const [ready, setReady] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [hash, setHash] = useState(false);
    const recoveryForm = useRef(null);

    const location = useLocation();

    useEffect(() => {
        setHash(location.hash.substring(1))
    }, [location]);

    function onFinish(values) {
        setSubmitting(true);
        const { password } = values;
        _service({
            method: 'POST',
            url: 'recovery',
            data: {
                password,
                key: hash
            },
            success: (response) => {
                if (response.json.result) {
                    notification["success"]({
                        message: 'Alteração de Palavra-Passe',
                        description: 'A sua palavra-passe foi alterada com sucesso.',
                    });
                    setSubmitting(false);
                    setReady(true);
                }
            },
            fail: () => {
                setSubmitting(false);
                notification["error"]({
                    message: 'Erro na alteração de Palavra-Passe',
                    description: 'Não foi possível alterar a sua palavra-passe, por favor contacte-nos através do chat de suporte.',
                });
            }
        });
    }

    function onFinishFailed(errorInfo) {
        console.log('Failed:', errorInfo);
    }

    if (ready) {
        return <Redirect to="/login" />;
    } else if (window.location.hash && window.location.hash !== "") {
        return (
            <Layout>
                <Content className="recovery-container">
                    <div className="content-title">
                        <Title>Recuperar Acesso</Title>
                    </div>
                    <div className="content-body">
                        <p>Alteração da palavra-passe da sua conta.</p>
                        <Form
                            ref={recoveryForm}
                            layout="vertical"
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
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
                                <Button type="primary" htmlType="submit" loading={submitting}>
                                    Redefinir Palavra-passe
                                </Button>
                            </Form.Item>

                        </Form>

                    </div>
                </Content>
                <Sider width={'50%'}>
                    <span class="helper" /><img alt="sider-recovery" src={"/images/sider-recovery.png"} />
                </Sider>
            </Layout>
        );
    }
    /* else {
        return <NotFoundPage />;
    } */

}