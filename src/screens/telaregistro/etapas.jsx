import styles from "./etapas.module.css"
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


function Etapas() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        celular: '',
        identidade: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dados enviados:', formData);
        // Aqui você pode enviar os dados para o backend
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
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Adicione seu e-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Digite seu e-mail"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="celular">Adicione o seu celular</label>
                        <input
                            type="tel"
                            id="celular"
                            name="celular"
                            placeholder="Digite seu número com DDD"
                            value={formData.celular}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="identidade">Valide sua identidade</label>
                        <input
                            type="text"
                            id="identidade"
                            name="identidade"
                            placeholder="Digite o número do seu documento"
                            value={formData.identidade}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="button">Adicionar</button>
                </form>
            </main>
        </div>
    );
}

export default Etapas;
