import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";
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
  const [step, setStep] = useState("buscar");
  const [transferValue, setTransferValue] = useState("");
  const [motivo, setMotivo] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [comprovante, setComprovante] = useState(null);
  const dropdownRef = useRef();

  const token = localStorage.getItem("usuarioToken");

  const getPlaceholder = () => {
    switch (tipo) {
      case "Email":
        return "nome@exemplo.com";
      case "Telefone":
        return "(00) 00000-0000";
      case "CPF":
        return "000.000.000-00";
      default:
        return "";
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
      const { data } = await axios.get(
        "https://tcc-escolar-backend-production.up.railway.app/usuarios/buscar",
        {
          params: { tipo, valor },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data) {
        setUsuario(data);
        setModalOpen(true);
      } else {
        setErro("Nenhum usuário encontrado com esses dados.");
      }
    } catch (err) {
      setErro("Erro ao buscar usuário.", err);
    } finally {
      setLoading(false);
    }
  };


  const realizarPix = async () => {
    if (!transferValue || parseFloat(transferValue) < 0.01) {
      alert("Informe um valor maior que R$ 0,01")
      return
    }

    try {
      await axios.post(
        "https://tcc-escolar-backend-production.up.railway.app/pix",
        {
          tipo,
          dado: valor,
          valor: parseFloat(transferValue),
          motivo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const novoComprovante = {
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        telefone: usuario.telefone,
        valor: parseFloat(transferValue),
        motivo,
        dataHora: new Date().toLocaleString("pt-BR"),
      }

      setComprovante(novoComprovante)
      setStep("sucesso")
      setSaldo((prev) => prev - parseFloat(transferValue))
    } catch (err) {
      console.error("Erro ao fazer Pix:", err)
      alert(
        err.response?.data?.error ||
        "Erro ao realizar transferência, tente novamente."
      )
    }
  }

  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const token = localStorage.getItem("usuarioToken");
        const { data } = await axios.get(
          "https://tcc-escolar-backend-production.up.railway.app/usuarios/meus-dados",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSaldo(data.saldo);
      } catch (err) {
        console.error("Erro ao buscar saldo do usuário:", err);
      }
    };
    fetchSaldo();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <nav className={styles.nav}>
            <div className={styles.navLeft}>
              <div className={styles.divlogo}>
                <img
                  src={logoheader}
                  alt="logoheader"
                  className={styles.logoheader}
                  onClick={() => (window.location.href = "/home")}
                />
                <img
                  src={logoheadermobile}
                  alt="logoheadermobile"
                  className={styles.logoheadermobile}
                  onClick={() => (window.location.href = "/home")}
                />
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className={styles.mainContent}>
        {step === "buscar" && (
          <>
            <div
              className={styles.backArrow}
              onClick={() => window.history.back()}
            >
              ← Voltar
            </div>
            <h2>Para quem você quer transferir?</h2>
            <p>Escolha o tipo de dado e preencha o campo.</p>

            <div className={styles.inputGroup}>
              <div className={styles.customSelect} ref={dropdownRef}>
                <div className={styles.selected} onClick={() => setOpen(!open)}>
                  {tipo}{" "}
                  <span className={`${styles.arrow} ${open ? styles.up : ""}`}>
                    ▾
                  </span>
                </div>
                {open && (
                  <div className={styles.options}>
                    {tipos.map((t) => (
                      <div
                        key={t}
                        className={styles.option}
                        onClick={() => {
                          setTipo(t);
                          setOpen(false);
                        }}
                      >
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

            <button
              className={styles.buttonBuscar}
              disabled={!valor || loading}
              onClick={buscarConta}
            >
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
                    <button
                      className={styles.buttonCancelar}
                      onClick={() => setModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className={styles.buttonConfirmar}
                      onClick={() => {
                        setStep("valor");
                        setModalOpen(false);
                      }}
                    >
                      Confirmar Conta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {step === "valor" && usuario && (
          <div className={styles.valorContent}>
            <h2 className={styles.tituloTransferencia}>
              Quanto você quer transferir?
            </h2>
            <div className={styles.card}>
              <div className={styles.userInfo}>
                <span className={styles.avatar}>{usuario.nome[0]}</span>
                <div>
                  <p className={styles.userName}>{usuario.nome}</p>
                  <p className={styles.userCpf}>CPF: {usuario.cpf}</p>
                </div>
              </div>
              <div className={styles.inputValor}>
                <span>R$</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={transferValue}
                  onChange={(e) => setTransferValue(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <p className={styles.alert}>{formatCurrency(saldo)} Disponíveis</p>
              <input
                type="text"
                placeholder="Motivo (opcional)"
                maxLength={140}
                className={styles.textInput}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              <div className={styles.modalButtons}>
                <button
                  className={styles.buttonCancelar}
                  onClick={() => setStep("buscar")}
                >
                  Voltar
                </button>
                <button
                  className={styles.buttonConfirmar}
                  onClick={realizarPix}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {step === "sucesso" && comprovante && (
          <div className={styles.sucessoContent}>
            <div className={styles.sucessoBox}>
              <CheckCircle className={styles.sucessoIcon} size={80} />
              <h2>Pix feito com sucesso!</h2>
            </div>

            <div className={styles.comprovante}>
              <h3>Comprovante Pix</h3>
              <p><b>Nome:</b> {comprovante.nome}</p>
              <p><b>CPF:</b> {comprovante.cpf}</p>
              <p><b>Email:</b> {comprovante.email}</p>
              <p><b>Telefone:</b> {comprovante.telefone}</p>
              <p><b>Valor:</b> {formatCurrency(comprovante.valor)}</p>
              {comprovante.motivo && <p><b>Motivo:</b> {comprovante.motivo}</p>}
              <p><b>Data:</b> {comprovante.dataHora}</p>
              <button
                className={styles.buttonConfirmar}
                onClick={() => {
                  setStep("buscar");
                  setValor("");
                  setUsuario(null);
                  setTransferValue("");
                  setMotivo("");
                  setComprovante(null);
                }}
              >
                Nova Transferência
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Transferencias;
