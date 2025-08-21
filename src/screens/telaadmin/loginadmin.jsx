import styles from "./telalogin.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroCpf, setErroCpf] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  useEffect(() => {
    document.title = "Digite seu CPF ou CNPJ e Senha para iniciar sessão";
  }, []);

  const handleClickCriarConta = () => {
    navigate("/registro");
  };

  const handleClicklogo = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  const handleLogin = async () => {
    setErroCpf("");
    setErroSenha("");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error === "CPF não encontrado") {
          setErroCpf("CPF não encontrado");
        } else if (data.error === "Senha incorreta") {
          setErroSenha("Senha incorreta");
        }
        return;
      }

      if (data.situacao === "aprovado") {
        navigate("/home");
      } else if (data.situacao === "analise") {
        navigate("/login/analise");
      }
    } catch (err) {
      console.error("Erro ao logar:", err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header} data-testid="header-navigation">
        <div className={styles.headerContainer}>
          <nav className={styles.nav}>
            <div className={styles.navLeft}>
              <div className={styles.divlogo}>
                <img
                  src={logoheader}
                  alt="logoheader"
                  className={styles.logoheader}
                  onClick={handleClicklogo}
                />
                <img
                  src={logoheadermobile}
                  alt="logoheadermobile"
                  className={styles.logoheadermobile}
                  onClick={handleClicklogo}
                />
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.left}>
          <h1>Digite seu CPF ou CNPJ e Senha para iniciar sessão</h1>
        </div>
        <div className={styles.right}>
          <div className={styles.formBox}>
            <label>CPF ou CNPJ</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            {erroCpf && <span className={styles.error}>{erroCpf}</span>}

            <label>Senha</label>
            <div className={styles.senhaContainer}>
              <input
                type={mostrarSenha ? "text" : "password"}
                className={styles.inputSenha}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <span
                className={styles.olho}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {erroSenha && <span className={styles.error}>{erroSenha}</span>}

            <div className={styles.actionRow}>
              <button className={styles.btnAcessar} onClick={handleLogin}>
                Acessar
              </button>
              <button
                className={styles.criarConta}
                onClick={handleClickCriarConta}
              >
                Criar conta
              </button>
            </div>
          </div>
          <a href="#" className={styles.help}>
            Preciso de ajuda
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <a href="#">Como cuidamos da sua privacidade</a> - Copyright ©
          1999-2025 Ebazar.com.br LTDA.
        </div>
        <div className={styles.footerRight}>
          Protegido por reCAPTCHA - <a href="#">Privacidade</a> -{" "}
          <a href="#">Condições</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
