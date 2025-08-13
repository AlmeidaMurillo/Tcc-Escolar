import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/Scroll/ScrollToTop";
import Spinner from "./components/Spinner/Spinner";

const Inicial = lazy(() => import("./screens/telainicial/telainicial"));
const Registro = lazy(() => import("./screens/telaregistro/telaregistro"));
const Etapas = lazy(() => import("./screens/telaregistro/etapas"));
const Login = lazy(() => import("./screens/telalogin/telalogin"));
const Analise = lazy(() => import("./screens/telaregistro/analise"));
const Home = lazy(() => import("./screens/telahome/telahome"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Inicial />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/registro/etapas" element={<Etapas />} />
          <Route path="/login" element={<Login />} />
          <Route path="/analise" element={<Analise />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
