/* FAZER A RESPONSIVIDADE TOTAL DA TELA APROVAÇÕES ADMIN */
/* FAZER A TELA LOGS DO SISTEMA COM RESPONSIVIDADE TOTAL TAMBEM */
/* VERIFICAR A RESPONSIVIDADE DE TODAS AS TELAS DO SISTEMA */

/* COLOCAR PARA QUANDO APROVAR USUARIO, MEXER NA TELA CLIENTES PARA OS USUARIOS APARECEREM LA */

import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import Spinner from "./components/Spinner/Spinner";
import ProtectedRoute from "./ProtectedRoutes";

//ROTAS USUÁRIO
const Inicial = lazy(() => import("./screens/telainicial/telainicial"));
const Registro = lazy(() => import("./screens/telaregistro/telaregistro"));
const Etapas = lazy(() => import("./screens/telaregistro/etapas"));
const Login = lazy(() => import("./screens/telalogin/telalogin"));
const RecuperarSenha = lazy(() => import("./screens/telalogin/recuperarsenha"));
const Analise = lazy(() => import("./screens/telassituacoes/analise"));
const Reprovado = lazy(() => import("./screens/telassituacoes/reprovado"));
const Bloqueada = lazy(() => import("./screens/telassituacoes/bloqueada"));
const Home = lazy(() => import("./screens/telahome/telahome"));

//ROTAS ADMIN
const LoginAdmin = lazy(() => import("./screens/telaadmin/loginadmin"));
const DashboardAdmin = lazy(() => import("./screens/telaadmin/dashboardadmin"));
const ClientesAdmin = lazy(() => import("./screens/telaadmin/clientesadmin"));
const AprovacoesAdmin = lazy(() => import("./screens/telaadmin/aprovacoesadmin"));

function App() {

  useEffect(() => {
    localStorage.removeItem("usuarioCPF");
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Inicial />} />
          <Route path="/registro" element={<Registro />} />
          <Route
            path="/registro/etapas"
            element={
              <ProtectedRoute>
                <Etapas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registro/etapas/analise"
            element={
              <ProtectedRoute>
                <Analise />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/login/recuperarsenha" element={<RecuperarSenha />} />
          <Route path="/login/analise" element={<Analise />} />
          <Route path="/login/reprovado" element={<Reprovado />} />
          <Route path="/login/bloqueada" element={<Bloqueada />} />
          <Route path="/home" element={<Home />} />

          <Route path="/admin/loginadmin" element={<LoginAdmin />} />
          <Route path="/admin/dashboardadmin" element={<DashboardAdmin />} />
          <Route path="/admin/clientesadmin" element={<ClientesAdmin />} />
          <Route path="/admin/aprovacoesadmin" element={<AprovacoesAdmin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

