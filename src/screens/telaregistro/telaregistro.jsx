import styles from "./telaregistro.module.css"
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Registro() {

    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedValue = inputValue.trim();

        if (trimmedValue === "") {
            setErrorMessage("É necessário inserir um CPF ou CNPJ para continuar.");
            return;
        }

        if (/\D/.test(trimmedValue)) {
            setErrorMessage("Só é permitido inserir números.");
            return;
        }

        const onlyNumbers = trimmedValue.replace(/\D/g, "");

        if (onlyNumbers.length !== 11 && onlyNumbers.length !== 14) {
            setErrorMessage("O número deve ter 11 ou 14 caracteres.");
            return;
        }
        setErrorMessage("");
        navigate("/registro/etapas")
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
            <main className={styles.mainFormContainer}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Digite seu CPF ou CNPJ</h1>
                    <p className={styles.subtitle}>
                        Use o CPF para criar sua conta pessoal ou o CNPJ para uma conta negócio.
                    </p>
                    <input
                        type="text"
                        placeholder="CPF ou CNPJ"
                        className={`${styles.input} ${errorMessage ? styles.inputError : ""}`}
                        value={inputValue}
                        onChange={handleChange}
                        maxLength={20}
                    />
                    <small className={`${styles.info} ${errorMessage ? styles.errorMessage : ""}`}>
                        {errorMessage || "Digite o número sem pontos, espaços ou traços."}
                    </small>
                    <button type="submit" className={styles.button}>
                        Continuar
                    </button>
                </form>
            </main>
        </div>
    );
}

export default Registro;
