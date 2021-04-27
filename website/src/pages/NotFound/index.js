import React from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { Typography } from 'antd';

import './index.less';

const { Title } = Typography;

export default function NotFound(props) {

    return (
        <div className="notfound-wrapper">
            <div className="notfound-content">
                <div className="content-title">
                    <Title>404</Title>
                    <Title level={2}>Página não encontrada</Title>
                </div>
                <div className="content-body">
                    <Link className="go-back-btn" to="/"><ArrowLeftOutlined /> Voltar para o início</Link>
                </div>
            </div>
        </div>
    );
}