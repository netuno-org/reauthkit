import _auth from "@netuno/auth-client";
import {Button, Typography} from "antd";
import {useNavigate, useLocation} from "react-router-dom";
import NotFound from "../NotFound/index.jsx";
import Dashboard from "./Dashboard/index.jsx";
import OtherPage from "./OtherPage/index.jsx";

import "./index.less";

const {Title} = Typography;

function ReservedArea() {
    const naviage = useNavigate();
    const location = useLocation();
    if (_auth.isLogged()) {
        if (location.pathname === "/dashboard") {
            return <Dashboard/>;
        }
        if (location.pathname === "/other-page") {
            return <OtherPage/>;
        }
        return <NotFound />;
    }
    return (
        <section className="reserved-area">
            <Title>Não Autorizado</Title>
            <p>
                É necessário realizar a autenticação para aceder a área reservada.
            </p>
            <Button type="primary" onClick={() => naviage("/login")}>
                Ir para o Login
            </Button>
        </section>
    );
}

export default ReservedArea;
