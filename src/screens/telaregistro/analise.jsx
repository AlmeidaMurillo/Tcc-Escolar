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
        </div>
    );
}

export default Analise;
