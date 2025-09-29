import { Navigate } from "react-router-dom";

export const SituacaoProtectedRoutes = ({ children, situacaoPermitida }) => {
  const situacao = localStorage.getItem("situacao");
  const token = localStorage.getItem("usuarioToken");

  if (situacaoPermitida === "aprovado") {
    if (!token) return <Navigate to="/login" replace />;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() > payload.exp * 1000) {
        localStorage.removeItem("usuarioToken");
        return <Navigate to="/login" replace />;
      }
    } catch {
      localStorage.removeItem("usuarioToken");
      return <Navigate to="/login" replace />;
    }
  }

  if (situacao !== situacaoPermitida) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
