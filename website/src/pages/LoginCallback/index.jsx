import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { Spin } from 'antd';
import _auth from '@netuno/auth-client';
import _service from '@netuno/service-client';

import globalNotification from "../../common/globalNotification.js";

import usePeople from "../../common/usePeople.js";

import './index.less';

export default function LoginCallback(props) {
  const [logged, setLogged] = useState(false);
  const [register, setRegister] = useState(false);
  const { provider } = useParams(null);
  const people = usePeople();

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
            people.set(json.token.extra);
            setLogged(true);
          } else if (json.provider && json.provider.new) {
            globalNotification.warning({
              title: 'Criar Nova Conta',
              description: 'Não tem a sua conta criada ainda, avance com a criação da conta.',
            });
            setRegister(true);
          }
        }
      },
      fail: (error) => {
        console.error(error);
        globalNotification.serviceFail({
          title: 'Erro no Callback da Autenticação',
          description: 'Ocorreu um erro na edição do seu perfil, por favor contacte-nos através do suporte ou tente novamente mais tarde.',
        });
      }
    });
  }, []);
  if (register) {
    return <Navigate to={`/register`} />;
  }
  if (logged && _auth.isLogged()) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div className="login-callback">
      <Spin />
    </div>
  );
}