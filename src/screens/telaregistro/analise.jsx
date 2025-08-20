import styles from "./analise.module.css"
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Analise() {

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Dados Em Processo De Análise, Aguarde a Aprovação Para Iniciar Sessão";
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
                    <div className={styles.analysisCard} data-testid="analysis-status-card">

                        <div className={styles.iconWrapper}>
                            <div className={styles.iconCircle}>
                                <svg
                                    className={styles.clockIcon}
                                    data-testid="clock-icon"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                </svg>
                            </div>
                        </div>

                        <h1 className={styles.statusTitle} data-testid="status-title">
                            Análise em Andamento
                        </h1>

                        <div className={styles.statusMessage} data-testid="status-message">
                            <p>
                                O banco está analisando os dados fornecidos durante o processo de criação da sua conta.
                            </p>
                            <p>
                                Assim que a análise for concluída, você receberá um e-mail com as instruções para prosseguir.
                            </p>
                        </div>

                        <button
                            className={styles.backButton}
                            data-testid="button-back-home"
                            onClick={() => navigate("/")}
                        >
                            <i className="fas fa-arrow-left"></i>
                            Voltar Para o Início
                        </button>

                        <div className={styles.additionalInfo} data-testid="additional-info">
                            <svg className={styles.infoIcon} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Este processo pode levar algumas horas
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Analise;
