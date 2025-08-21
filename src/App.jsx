import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import Spinner from "./components/Spinner/Spinner";


/* FAZER A RESPONSIVIDADE TOTAL DA TELA APROVAÇÕES ADMIN */
/* FAZER A TELA LOGS DO SISTEMA COM RESPONSIVIDADE TOTAL TAMBEM */
/* VERIFICAR A RESPONSIVIDADE DE TODAS AS TELAS DO SISTEMA */


//ROTAS USUÁRIO

const Inicial = lazy(() => import("./screens/telainicial/telainicial"));
const Registro = lazy(() => import("./screens/telaregistro/telaregistro"));
const Etapas = lazy(() => import("./screens/telaregistro/etapas"));
const Login = lazy(() => import("./screens/telalogin/telalogin"));
const Analise = lazy(() => import("./screens/telaregistro/analise"));
const Home = lazy(() => import("./screens/telahome/telahome"));


//ROTAS ADMIN

const LoginAdmin = lazy(() => import("./screens/telaadmin/loginadmin"));
const DashboardAdmin = lazy(() => import("./screens/telaadmin/dashboardadmin"));
const ClientesAdmin = lazy(() => import("./screens/telaadmin/clientesadmin"));
const AprovacoesAdmin = lazy(() => import("./screens/telaadmin/aprovacoesadmin"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Inicial />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/registro/etapas" element={<Etapas />} />
          <Route path="/registro/etapas/analise" element={<Analise />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/analise" element={<Analise />} />
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
