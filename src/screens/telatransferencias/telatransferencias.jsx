import { useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./telatransferencias.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";

function Transferencias() {
  const tipos = ["Email", "Telefone", "CPF"];
  const [tipo, setTipo] = useState("Email");
  const [valor, setValor] = useState("");
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const dropdownRef = useRef();

  const token = localStorage.getItem("usuarioToken");

  const getPlaceholder = () => {
    switch (tipo) {
      case "Email": return "nome@exemplo.com";
      case "Telefone": return "(00) 00000-0000";
      case "CPF": return "000.000.000-00";
      default: return "";
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buscarConta = async () => {
    if (!valor) return;
    setLoading(true);
    setErro("");
    setUsuario(null);

    try {
      const { data } = await axios.get("https://tcc-escolar-backend-production.up.railway.app/usuarios/buscar", {
        params: { tipo, valor },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data) {
        setUsuario(data);
        setModalOpen(true);
      } else {
        setErro("Nenhum usuário encontrado com esses dados.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setErro("Nenhum usuário encontrado com esses dados.");
      } else if (err.response && err.response.status === 401) {
        setErro("Token inválido. Faça login novamente.");
      } else {
        setErro("Erro ao buscar usuário.");
      }
    } finally {
      setLoading(false);
    }
  };

  const realizarPix = () => {
    alert(`PIX realizado para ${usuario.nome} com sucesso!`);
    setModalOpen(false);
    setValor("");
    setUsuario(null);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <nav className={styles.nav}>
            <div className={styles.navLeft}>
              <div className={styles.divlogo}>
                <img src={logoheader} alt="logoheader" className={styles.logoheader} onClick={() => window.location.href = "/home"} />
                <img src={logoheadermobile} alt="logoheadermobile" className={styles.logoheadermobile} onClick={() => window.location.href = "/home"} />
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.backArrow} onClick={() => window.history.back()}>
          ← Voltar
        </div>

        <h2>Para quem você quer transferir?</h2>
        <p>Escolha o tipo de dado e preencha o campo.</p>

        <div className={styles.inputGroup}>
          <div className={styles.customSelect} ref={dropdownRef}>
            <div className={styles.selected} onClick={() => setOpen(!open)}>
              {tipo} <span className={`${styles.arrow} ${open ? styles.up : ""}`}>▾</span>
            </div>
            {open && (
              <div className={styles.options}>
                {tipos.map((t) => (
                  <div key={t} className={styles.option} onClick={() => { setTipo(t); setOpen(false); }}>
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input 
            type="text" 
            value={valor} 
            onChange={(e) => setValor(e.target.value)}
            placeholder={getPlaceholder()}
            className={styles.textInput}
          />
        </div>

        <button className={styles.buttonBuscar} disabled={!valor || loading} onClick={buscarConta}>
          {loading ? "Buscando..." : "Buscar conta"}
        </button>

        {erro && <p className={styles.errorMessage}>{erro}</p>}

        {modalOpen && usuario && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Confirme a transferência</h3>
              <p><b>Nome:</b> {usuario.nome}</p>
              <p><b>Email:</b> {usuario.email}</p>
              <p><b>Telefone:</b> {usuario.telefone}</p>
              <p><b>CPF:</b> {usuario.cpf}</p>

              <div className={styles.modalButtons}>
                <button className={styles.buttonCancelar} onClick={() => setModalOpen(false)}>Cancelar</button>
                <button className={styles.buttonConfirmar} onClick={realizarPix}>Confirmar Conta</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Transferencias;
