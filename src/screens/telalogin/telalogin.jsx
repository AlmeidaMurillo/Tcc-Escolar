import styles from "./telalogin.module.css"
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

    const navigate = useNavigate();
    const [mostrarSenha, setMostrarSenha] = useState(false);

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
                        <input type="text" />

                        <label>Senha</label>
                        <div className={styles.senhaContainer}>
                            <input
                                type={mostrarSenha ? "text" : "password"}
                                className={styles.inputSenha}
                            />
                            <span
                                className={styles.olho}
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className={styles.actionRow}>
                            <button className={styles.btnAcessar}>Acessar</button>
                            <button
                                className={styles.criarConta}
                                onClick={handleClickCriarConta}
                            >
                                Criar conta
                            </button>
                        </div>
                    </div>
                    <a href="#" className={styles.help}>Preciso de ajuda</a>
                </div>
            </div>
            <footer className={styles.footer}>
                <div className={styles.footerLeft}>
                    <a href="#">Como cuidamos da sua privacidade</a> - Copyright © 1999-2025 Ebazar.com.br LTDA.
                </div>
                <div className={styles.footerRight}>
                    Protegido por reCAPTCHA - <a href="#">Privacidade</a> - <a href="#">Condições</a>
                </div>
            </footer>
        </div>
    );
}

export default Login;
