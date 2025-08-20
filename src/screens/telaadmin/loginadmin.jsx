import styles from "./loginadmin.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

function LoginAdmin() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Mercado Pago - Login Admin";
    }, []);

    const handleClicklogo = () => {
        if (window.location.pathname === "/") {
            window.location.reload();
        } else {
            navigate("/");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setLoading(true);

        const usuario = event.target.username.value;
        const senha = event.target.password.value;

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, senha }),
            });

            const data = await response.json();
            setLoading(false);

            if (!response.ok) {
                setErrorMessage(data.error || "Erro ao fazer login");
            } else {
                navigate("/admin/dashboardadmin");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            setLoading(false);
            setErrorMessage("Erro ao conectar com o servidor");
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

            <main className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <form className={styles.loginForm} data-testid="form-login" onSubmit={handleSubmit}>
                        <div className={styles.formHeader}>
                            <h1 className={styles.formTitle}>Acesso Administrativo</h1>
                            <p className={styles.formSubtitle}>Entre com suas credenciais para acessar o painel</p>
                        </div>

                        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                        <div className={styles.fieldGroup}>
                            <label htmlFor="username" className={styles.fieldLabel}>
                                Login
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={styles.inputField}
                                placeholder="Digite seu login"
                                required
                                data-testid="input-username"
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label htmlFor="password" className={styles.fieldLabel}>
                                Senha
                            </label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={styles.inputField}
                                    placeholder="Digite sua senha"
                                    required
                                    data-testid="input-password"
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={togglePasswordVisibility}
                                    data-testid="button-toggle-password"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitButton}
                            data-testid="button-submit"
                            disabled={loading}
                        >
                            {loading ? "Carregando..." : "Acessar"}
                        </button>
                    </form>

                    <div className={styles.securityNotice}>
                        <div className={styles.securityContent}>
                            <FaLock size={16} />
                            <span>Conexão segura e criptografada</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default LoginAdmin;
