import _auth from "@netuno/auth-client";
import {Navigate, useLocation} from "react-router-dom";
import NotFound from "../NotFound/index.jsx";
import Dashboard from "./Dashboard/index.jsx";
import OtherPage from "./OtherPage/index.jsx";

function ReservedArea() {
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
    return <Navigate to="/login"/>;
}

export default ReservedArea;
