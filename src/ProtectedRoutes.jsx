import { Navigate } from "react-router-dom";

export const EtapasProtectedRoutes = ({ children }) => {
  const cpf = localStorage.getItem("usuarioCPF");
  if (!cpf) {
    return <Navigate to="/registro" replace />;
  }
  return children;
};

export const AuthProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem("usuarioToken");
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

  return children;
};
