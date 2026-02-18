import {Typography} from "antd";

import "./index.less";

const { Title } = Typography;

function ProfileView() {
    return (
        <section class={"other-page"}>
            <Title level={1}>Ver Perfil</Title>
            <div>
                <p>Aqui é o perfil de algum utilizador.</p>
            </div>
        </section>
    );
}

export default ProfileView;