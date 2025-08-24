import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const cpf = localStorage.getItem("usuarioCPF");

  if (!cpf) {
    return <Navigate to="/registro" replace />;
  }

  return children;
};

export default ProtectedRoutes;
