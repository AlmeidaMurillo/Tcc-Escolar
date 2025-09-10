import styles from "./telalogin.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroCpf, setErroCpf] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const inputCpfRef = useRef(null);
  const inputSenhaRef = useRef(null);

  const handleLogin = useCallback(async () => {
    setErroCpf("");
    setErroSenha("");
    if (!cpf.trim()) {
      setErroCpf("Campo CPF é obrigatório");
      return;
    }
    if (!senha.trim()) {
      setErroSenha("Campo senha é obrigatório");
      return;
    }
    try {
      const response = await fetch("https://tcc-escolar-backend-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error === "CPF não encontrado") setErroCpf("CPF não encontrado");
        else if (data.error === "Senha incorreta") setErroSenha("Senha incorreta");
        else setErroSenha(data.error || "Erro no login");
        return;
      }
      localStorage.setItem("usuarioToken", data.token);
      localStorage.setItem("usuarioCPF", cpf);
      localStorage.setItem("situacao", data.situacao);
      if (data.situacao === "aprovado") navigate("/home");
      else if (data.situacao === "analise") navigate("/login/analise");
      else if (data.situacao === "rejeitado") navigate("/login/reprovado");
      else if (data.situacao === "bloqueado") navigate("/login/bloqueada");
    } catch {
      setErroSenha("Erro ao conectar com o servidor");
    }
  }, [cpf, senha, navigate]);

  const handleKeyDownCpf = (e) => {
    if (e.key === "Enter") {
      if (!cpf.trim()) setErroCpf("Campo CPF é obrigatório");
      else {
        setErroCpf("");
        inputSenhaRef.current.focus();
      }
    }
  };

  const handleKeyDownSenha = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleClickCriarConta = () => navigate("/registro");
  const handleClickLogo = () => (window.location.pathname === "/" ? window.location.reload() : navigate("/"));

  useEffect(() => {
    document.title = "Digite seu CPF e Senha para iniciar sessão";
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <nav className={styles.nav}>
            <div className={styles.navLeft}>
              <div className={styles.divlogo}>
                <img src={logoheader} alt="logoheader" className={styles.logoheader} onClick={handleClickLogo} />
                <img src={logoheadermobile} alt="logoheadermobile" className={styles.logoheadermobile} onClick={handleClickLogo} />
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.left}>
          <h1>Digite seu CPF e Senha para iniciar sessão</h1>
        </div>
        <div className={styles.right}>
          <div className={styles.formBox}>
            <label>CPF</label>
            <input
              ref={inputCpfRef}
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
              maxLength={11}
              onKeyDown={handleKeyDownCpf}
            />
            {erroCpf && <span className={styles.error}>{erroCpf}</span>}

            <label>Senha</label>
            <div className={styles.senhaContainer}>
              <input
                ref={inputSenhaRef}
                type={mostrarSenha ? "text" : "password"}
                className={styles.inputSenha}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                onKeyDown={handleKeyDownSenha}
              />
              <span className={styles.olho} onClick={() => setMostrarSenha(!mostrarSenha)}>
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {erroSenha && <span className={styles.error}>{erroSenha}</span>}

            <div className={styles.actionRow}>
              <button className={styles.btnAcessar} onClick={handleLogin}>Acessar</button>
              <button className={styles.criarConta} onClick={handleClickCriarConta}>Criar conta</button>
            </div>
          </div>
          <a className={styles.help} onClick={() => navigate("/login/recuperarsenha")}>Recuperar Senha ?</a>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <a href="#">Como cuidamos da sua privacidade</a> - Copyright © 1999-2025 Ebazar.com.br LTDA.
        </div>
        <div className={styles.footerRight}>
          Protegido por reCAPTCHA - <a href="#">Privacidade</a> - <a href="#">Condições</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
