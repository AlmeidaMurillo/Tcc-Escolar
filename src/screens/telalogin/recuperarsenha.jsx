import styles from "./recuperarsenha.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function RecuperarSenha() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [tempoRestante, setTempoRestante] = useState(0);
  const codigoGerado = "123456";
  const TEMPO_CODIGO = 30;

  useEffect(() => {
    document.title = "Recuperar Senha";
  }, []);

  useEffect(() => {
    if (tempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTempoRestante(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [tempoRestante]);

  const enviarCodigo = () => {
    if (!email.includes("@")) {
      setErro("Digite um email válido");
      setMsg("");
      return;
    }
    setErro("");
    setMsg(`Código enviado para ${email}!`);
    setEtapa("codigo");
    setTempoRestante(TEMPO_CODIGO);
  };

  const validarCodigo = () => {
    if (codigo !== codigoGerado) {
      setErro("Código inválido");
      setMsg("");
      return;
    }
    setErro("");
    setMsg("Código validado com sucesso!");
    setEtapa("novaSenha");
  };

  const redefinirSenha = () => {
    if (novaSenha.length < 4) {
      setErro("A senha deve ter pelo menos 4 caracteres");
      setMsg("");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      setMsg("");
      return;
    }
    setErro("");
    setMsg("Senha redefinida com sucesso!");
    setTimeout(() => navigate("/login"), 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (etapa === "email") enviarCodigo();
      if (etapa === "codigo") validarCodigo();
      if (etapa === "novaSenha") redefinirSenha();
    }
  };

  const handleClicklogo = () => {
    if (window.location.pathname === "/") window.location.reload();
    else navigate("/");
  };

  const barraProgresso = (tempoRestante / TEMPO_CODIGO) * 100;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <nav className={styles.nav}>
            <div className={styles.navLeft}>
              <div className={styles.divlogo}>
                <img src={logoheader} alt="logoheader" className={styles.logoheader} onClick={handleClicklogo} />
                <img src={logoheadermobile} alt="logoheadermobile" className={styles.logoheadermobile} onClick={handleClicklogo} />
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.left}>
          <h1>Recupere sua senha</h1>
        </div>

        <div className={styles.right}>
          <div className={styles.formBox}>

            {(erro || msg) && (
              <div
                className={`${styles.alert} ${erro ? styles.errorAlert : styles.successAlert}`}
              >
                {erro ? "❌ " : "✅ "} {erro || msg}
              </div>
            )}

            {etapa === "email" && (
              <>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className={styles.btnAcessar} onClick={enviarCodigo}>
                  Enviar código
                </button>
              </>
            )}

            {etapa === "codigo" && (
              <>
                <label>Código recebido</label>
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button className={styles.btnAcessar} onClick={validarCodigo}>
                  Validar código
                </button>

                <div className={styles.barraContainer}>
                  <button
                    className={styles.criarConta}
                    onClick={enviarCodigo}
                    disabled={tempoRestante > 0}
                    style={{
                      cursor: tempoRestante > 0 ? "not-allowed" : "pointer",
                      opacity: tempoRestante > 0 ? 0.6 : 1
                    }}
                  >
                    Reenviar código {tempoRestante > 0 && `(${tempoRestante}s)`}
                  </button>

                  {tempoRestante > 0 && (
                    <div className={styles.barraProgresso}>
                      <div
                        className={styles.barraAtiva}
                        style={{ width: `${barraProgresso}%` }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {etapa === "novaSenha" && (
              <>
                <label>Nova senha</label>
                <input
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  onKeyPress={handleKeyPress}
                />

                <label>Confirmar nova senha</label>
                <input
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  onKeyPress={handleKeyPress}
                />

                <button className={styles.btnAcessar} onClick={redefinirSenha}>
                  Redefinir senha
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;
