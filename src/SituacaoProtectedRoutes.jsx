import { Navigate } from "react-router-dom";

export const SituacaoProtectedRoutes = ({ children, situacaoPermitida }) => {
  const token = localStorage.getItem("usuarioToken");
  const situacao = localStorage.getItem("situacao");

  if (!token || situacao !== situacaoPermitida) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
