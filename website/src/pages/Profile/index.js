import React, { useState, useEffect, useRef } from 'react';
import { Layout, Typography, Form, Input, Button, notification } from 'antd';
import { PasswordInput } from "antd-password-input-strength";
import _service from '@netuno/service-client';

import './index.less';

const { Title } = Typography;
const { Content, Sider } = Layout;

export default function Profile(props) {

    const [loading, setLoading] = useState(false);
    const recoveryForm = useRef(null);

    useEffect(() => {
    });

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
                            label="Nova Palavra-passe"
                            name="password"
                            rules={[
                                { required: true, message: 'Insira a nova palavra-passe.' },
                                { type: 'string', message: 'Palavra-Passe deverá ter entre 8 a 25 caracteres.', min: 8, max: 25 },
                            ]}
                        >
                            <PasswordInput />
                        </Form.Item>
                        <Form.Item
                            label="Confirmar nova Palavra-passe"
                            name="password_confirm"
                            rules={[
                                { required: true, message: 'Insira a confirmação da nova palavra-passe.' },
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
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Redefinir Palavra-passe
                                </Button>
                        </Form.Item>

                    </Form>

                </div>
            </Content>
        </Layout>
    );

}