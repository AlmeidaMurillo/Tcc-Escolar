    import React from "react";
    import { Navigate } from "react-router-dom";

    const ProtectedRoutesAdmin = ({ children }) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin/loginadmin" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp * 1000;
        if (Date.now() > exp) {
        localStorage.removeItem("adminToken");
        return <Navigate to="/admin/loginadmin" replace />;
        }
    } catch {
        localStorage.removeItem("adminToken");
        return <Navigate to="/admin/loginadmin" replace />;
    }

    return children;
    };

    export default ProtectedRoutesAdmin;
