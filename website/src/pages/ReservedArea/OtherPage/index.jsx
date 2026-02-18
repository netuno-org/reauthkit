import {Typography} from "antd";

import "./index.less";

const { Title } = Typography;

function OtherPage() {
    return (
        <section className="other-page">
            <Title level={1}>Outra Página</Title>
            <div>
                <p>Exemplo de uma outra página na área reservada.</p>
            </div>
        </section>
    );
}

export default OtherPage;