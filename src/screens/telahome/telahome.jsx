import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  CreditCard,
  Eye,
  EyeOff,
  PlusCircle,
  Send,
  Smartphone,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal
} from "lucide-react";
import styles from "./telahome.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";

function Home() {
  const [showBalance, setShowBalance] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  const fetchUsuario = async () => {
    try {
      const token = localStorage.getItem("usuarioToken");
      if (!token) return;

      const res = await axios.get(
        "https://tcc-escolar-backend-production.up.railway.app/usuarios/meus-dados",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUsuario(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    document.title = "Home - Mercado Pago";
    fetchUsuario();
  }, []);

  const handlePixClick = () => {
    navigate("/transferencias");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

  const transactions = [
    { id: 1, type: "received", description: "Transferência recebida", from: "João Silva", amount: 1250.0, date: "Hoje, 14:30" },
    { id: 2, type: "sent", description: "PIX enviado", to: "Maria Santos", amount: -85.5, date: "Hoje, 10:15" },
    { id: 3, type: "card", description: "Compra no cartão", merchant: "Supermercado ABC", amount: -156.78, date: "Ontem, 18:45" },
    { id: 4, type: "investment", description: "Rendimento de investimento", product: "CDB Premium", amount: 45.3, date: "Ontem, 09:00" }
  ];

  const quickActions = [
    { icon: Send, label: "PIX", description: "Enviar ou receber", onClick: handlePixClick },
    { icon: CreditCard, label: "Em Breve", description: "Gerenciar cartões" },
    { icon: Smartphone, label: "Em Breve", description: "Celular" },
    { icon: TrendingUp, label: "Em Breve", description: "Fazer render" }
  ];

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
            <div className={styles.actions}>
              <button className={styles.iconBtn}><Bell className={styles.icon} /></button>
              <button className={styles.iconBtn}><MoreHorizontal className={styles.icon} /></button>
            </div>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.mainContent}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                  <h2 className={styles.cardTitle}>Saldo em conta</h2>
                  <button onClick={() => setShowBalance(!showBalance)} className={styles.toggleBtn}>
                    {showBalance ? <EyeOff className={styles.icon} /> : <Eye className={styles.icon} />}
                  </button>
                </div>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.balanceInfo}>
                  <div>
                    <p className={styles.balance}>
                      {showBalance
                        ? usuario != null
                          ? formatCurrency(usuario.saldo)
                          : "Carregando..."
                        : "R$ ••••••"}
                    </p>
                    <p className={styles.accountInfo}>
                      {usuario ? `${usuario.nome} • Ag: 1234 • CC: 12345-6` : "Carregando..."}
                    </p>
                  </div>
                  <div className={styles.balanceDetails}>
                    <div>
                      <p className={styles.detailLabel}>Disponível para saque</p>
                      <p className={styles.detailValue}>
                        {showBalance ? (usuario ? formatCurrency(usuario.saldo) : "Carregando...") : "R$ ••••••"}
                      </p>
                    </div>
                    <div>
                      <p className={styles.detailLabel}>Limite do cartão</p>
                      <p className={styles.detailValue}>{showBalance ? formatCurrency(5000) : "R$ ••••••"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}><h2 className={styles.cardTitle}>Ações rápidas</h2></div>
              <div className={styles.cardContent}>
                <div className={styles.quickActions}>
                  {quickActions.map((action, i) => (
                    <button key={i} className={styles.quickActionBtn} onClick={action.onClick}>
                      <action.icon className={styles.quickActionIcon} />
                      <div>
                        <p className={styles.quickActionLabel}>{action.label}</p>
                        <p className={styles.quickActionDesc}>{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeaderRow}>
                <h2 className={styles.cardTitle}>Últimas movimentações</h2>
                <button className={styles.linkBtn}>Ver todas</button>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.transactions}>
                  {transactions.map((t) => (
                    <div key={t.id} className={styles.transaction}>
                      <div className={styles.transactionLeft}>
                        <div className={`${styles.transactionIcon} ${styles[t.type]}`}>
                          {t.type === "received" && <ArrowDownLeft className={styles.icon} />}
                          {t.type === "sent" && <ArrowUpRight className={styles.icon} />}
                          {t.type === "card" && <CreditCard className={styles.icon} />}
                          {t.type === "investment" && <TrendingUp className={styles.icon} />}
                        </div>
                        <div>
                          <p className={styles.transactionDesc}>{t.description}</p>
                          <p className={styles.transactionSub}>{t.from || t.to || t.merchant || t.product} • {t.date}</p>
                        </div>
                      </div>
                      <p className={`${styles.transactionAmount} ${t.amount > 0 ? styles.positive : styles.negative}`}>
                        {t.amount > 0 ? "+" : "-"}{formatCurrency(Math.abs(t.amount))}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.sidebar}>
            <div className={styles.card}>
              <div className={styles.cardHeader}><h2 className={styles.cardTitle}>Meus cartões</h2></div>
              <div className={styles.cardContent}>
                <div className={styles.cardBox}>
                  <div>
                    <p>Cartão de Débito</p>
                    <p className={styles.cardNumber}>•••• •••• •••• 1234</p>
                  </div>
                  <CreditCard className={styles.icon} />
                </div>
                <p className={styles.cardHolder}>{usuario ? usuario.nome : "Carregando..."}</p>
                <button className={styles.fullBtn}><PlusCircle className={styles.smallIcon} /> Pedir novo cartão</button>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}><h2 className={styles.cardTitle}><TrendingUp className={styles.smallIcon} /> Investimentos</h2></div>
              <div className={styles.cardContent}>
                <div>
                  <div className={styles.sidebarRow}><span>Total investido</span><span>{showBalance ? (usuario ? formatCurrency(usuario.saldo) : "Carregando...") : "R$ ••••••"}</span></div>
                  <div className={styles.sidebarRow}><span>Rendimento mensal</span><span className={styles.positive}>{showBalance ? "+R$ 127,50" : "+R$ ••••••"}</span></div>
                  <div className={styles.sidebarRow}><span>CDI hoje</span><span>11,75%</span></div>
                </div>
                <button className={styles.fullBtn}>Ver portfólio</button>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}><h2 className={styles.cardTitle}>Meta financeira</h2></div>
              <div className={styles.cardContent}>
                <div>
                  <div className={styles.sidebarRow}><span>Viagem de férias</span><span>67%</span></div>
                  <div className={styles.progressBar}><div style={{ width: "67%" }}></div></div>
                  <div className={styles.sidebarRow}><span>Valor acumulado</span><span>{formatCurrency(3350)}</span></div>
                </div>
                <button className={styles.fullBtn}>Editar meta</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
