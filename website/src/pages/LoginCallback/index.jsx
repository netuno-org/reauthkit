import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { Spin, Typography, notification } from 'antd';
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';

import './index.less';

const { Title } = Typography;

export default function LoginCallback(props) {
  const [logged, setLogged] = useState(false);
  const [register, setRegister] = useState(false);
  const { provider } = useParams(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    _service({
      method: 'POST',
      url: `_auth_provider/login/${provider}`,
      data: {
        code
      },
      success: async ({ json }) => {
        if (json) {
          if (json.token) {
            const authConfig = await _auth.config();
            authConfig.token.load(authConfig, json.token);
            setLogged(true);
          } else if (json.provider && json.provider.new) {
            notification["warning"]({
              message: 'Criar Nova Conta',
              description: 'Não tem a sua conta criada ainda, avance com a criação da conta.',
            });
            setRegister(true);
          }
        }
      },
      fail: (error) => {
        console.error(error);
        notification["error"]({
          message: 'Erro no Callback da Autenticação',
          description: 'Ocorreu um erro na edição do seu perfil, por favor contacte-nos através do chat de suporte.',
        });
      }
    });
  }, []);
  if (register) {
    return <Navigate to={`/register`} />;
  }
  if (logged && _auth.isLogged()) {
    return <Navigate to="/reserved-area" />;
  }
  return (
    <div className="login-callback">
      <Spin />
    </div>
  );
}