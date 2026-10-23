import _auth from "@netuno/auth-client";
import { Layout } from "antd";

const { Footer } = Layout;

function FooterBase() {
    return (
        <>
            {!_auth.isLogged() &&
                <Footer>© netuno.org {new Date().getFullYear()}</Footer>
            }
        </>
    );
}

export default FooterBase;