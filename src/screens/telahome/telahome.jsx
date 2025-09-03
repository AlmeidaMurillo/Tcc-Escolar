import styles from "./telahome.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  const handleClicklogo = () => {
    if (window.location.pathname === "/") window.location.reload();
    else navigate("/");
  };

  useEffect(() => {
    document.title = "Tela Home - Bem vindo ao Mercado Pago";
  }, []);

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
    </div>
  );
}

export default Home;
