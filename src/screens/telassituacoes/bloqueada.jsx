import styles from "./bloqueada.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Bloqueada() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Conta Bancária Bloqueada";
  }, []);

  const handleClicklogo = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
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
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.analysisCard} data-testid="status-card">
            <div className={styles.iconWrapper}>
              <div className={styles.iconCircle} style={{ backgroundColor: "#FF4D4F" }}>
                <svg
                  className={styles.clockIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"></circle>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="#fff" strokeWidth="2" />
                  <line x1="9" y1="9" x2="15" y2="15" stroke="#fff" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <h1 className={styles.statusTitle} data-testid="status-title">
              Conta Bloqueada
            </h1>
            <div className={styles.statusMessage} data-testid="status-message">
              <p>Sua conta bancária foi bloqueada devido a irregularidades.</p>
              <p>Entre em contato com o suporte para mais informações e desbloqueio.</p>
            </div>
            <button
              className={styles.backButton}
              data-testid="button-back-home"
              onClick={() => navigate("/")}
              style={{ backgroundColor: "#FF4D4F", color: "#fff" }}
            >
              <i className="fas fa-arrow-left"></i> Voltar Para o Início
            </button>
            <div className={styles.additionalInfo} data-testid="additional-info">
              <svg className={styles.infoIcon} fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Entre em contato com o suporte do banco para mais detalhes
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Bloqueada;
