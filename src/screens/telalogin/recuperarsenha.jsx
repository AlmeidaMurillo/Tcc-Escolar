import styles from "./recuperarsenha.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

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
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const TEMPO_CODIGO = 30;
  const API_BASE = "https://tcc-escolar-backend-production.up.railway.app";

  useEffect(() => {
    document.title = "Recuperar Senha";
  }, []);

  useEffect(() => {
    if (tempoRestante <= 0) return;
    const timer = setInterval(() => setTempoRestante(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [tempoRestante]);

  const enviarCodigo = async () => {
    if (!email.includes("@")) {
      setErro("Digite um email válido");
      setMsg("");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/recuperar-senha/enviar-codigo`, { email });
      const { situacao, message } = res.data;

      if (situacao === "rejeitado") return navigate("/login/reprovado");
      if (situacao === "bloqueado") return navigate("/login/bloqueada");
      if (situacao === "analise") return navigate("/login/analise");

      if (situacao === "aprovado") {
        setErro("");
        setMsg(message);
        setEtapa("codigo");
        setTempoRestante(TEMPO_CODIGO);
      }
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao enviar código");
      setMsg("");
    }
  };

  const validarCodigo = async () => {
    try {
      const res = await axios.post(`${API_BASE}/recuperar-senha/validar-codigo`, { email, codigo });
      setErro("");
      setMsg(res.data.message);
      setEtapa("novaSenha");
    } catch (err) {
      setErro(err.response?.data?.error || "Código inválido");
      setMsg("");
    }
  };

  const senhaValida = (senha) => {
    const regex = new RegExp(String.raw`^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~/-]).{8,}$`);
    return regex.test(senha);
  };

  const redefinirSenha = async () => {
    if (!senhaValida(novaSenha)) {
      setErro("A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial.");
      setMsg("");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      setMsg("");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/recuperar-senha/redefinir`, { email, novaSenha });
      setErro("");
      setMsg(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErro(err.response?.data?.error || "Erro ao redefinir senha");
      setMsg("");
    }
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
        <div className={styles.left}><h1>Recupere sua senha</h1></div>
        <div className={styles.right}>
          <div className={styles.formBox}>

            {(erro || msg) && (
              <div className={`${styles.alert} ${erro ? styles.errorAlert : styles.successAlert}`}>
                {erro ? "❌ " : "✅ "} {erro || msg}
              </div>
            )}

            {etapa === "email" && (
              <>
                <label>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyPress={handleKeyPress} />
                <button className={styles.btnAcessar} onClick={enviarCodigo}>Enviar código</button>
              </>
            )}

            {etapa === "codigo" && (
              <>
                <label>Código recebido</label>
                <input type="text" value={codigo} onChange={e => setCodigo(e.target.value)} onKeyPress={handleKeyPress} />
                <button className={styles.btnAcessar} onClick={validarCodigo}>Validar código</button>

                <div className={styles.barraContainer}>
                  <button
                    className={styles.criarConta}
                    onClick={enviarCodigo}
                    disabled={tempoRestante > 0}
                    style={{ cursor: tempoRestante > 0 ? "not-allowed" : "pointer", opacity: tempoRestante > 0 ? 0.6 : 1 }}
                  >
                    Reenviar código {tempoRestante > 0 && `(${tempoRestante}s)`}
                  </button>
                  {tempoRestante > 0 && (
                    <div className={styles.barraProgresso}>
                      <div className={styles.barraAtiva} style={{ width: `${barraProgresso}%` }} />
                    </div>
                  )}
                </div>
              </>
            )}

            {etapa === "novaSenha" && (
              <>
                <label>Nova senha</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <label>Confirmar nova senha</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  >
                    {mostrarConfirmarSenha ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <button className={styles.btnAcessar} onClick={redefinirSenha}>Redefinir senha</button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenha;
