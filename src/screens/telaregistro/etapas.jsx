import { useState, useEffect, useCallback } from "react";
import styles from "./etapas.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";

function Etapas() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(null);
    const [phone, setPhone] = useState("");
    const [phoneValid, setPhoneValid] = useState(null);
    const [birthDate, setBirthDate] = useState("");
    const [ageValid, setAgeValid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkedEmail, setCheckedEmail] = useState(false);
    const [checkedPhone, setCheckedPhone] = useState(false);
    const [checkedBirth, setCheckedBirth] = useState(false);

    useEffect(() => { document.title = "Preencha os dados para criar sua conta"; }, []);

    useEffect(() => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(email ? regex.test(email) : null);
    }, [email]);

    useEffect(() => {
        const digits = phone.replace(/\D/g, "");
        setPhoneValid(phone ? digits.length === 11 : null);
    }, [phone]);

    useEffect(() => {
        if (!birthDate) return setAgeValid(null);
        const birth = new Date(birthDate), now = new Date();
        let age = now.getFullYear() - birth.getFullYear();
        const m = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        setAgeValid(age >= 16);
    }, [birthDate]);

    const nextStep = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            if (step === 1) {
                setCheckedEmail(true);
                if (emailValid) setStep(2);
            } else if (step === 2) {
                setCheckedPhone(true);
                if (phoneValid) setStep(3);
            }
            setLoading(false);
        }, 800);
    }, [step, emailValid, phoneValid]);

    const prevStep = () => step > 1 && setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setCheckedBirth(true);
            if (ageValid) {
                alert("Conta enviada para análise!");
                navigate("/analise");
            }
            setLoading(false);
        }, 800);
    };
    
    const handleEnterPress = useCallback((event) => {
        if (event.key === "Enter") {
            if (step < 3) {
                event.preventDefault();
                if (step === 1 && email) nextStep();
                else if (step === 2 && phone) nextStep();
            }
        }
    }, [step, email, phone, nextStep]);

    useEffect(() => {
        window.addEventListener("keydown", handleEnterPress);
        return () => {
            window.removeEventListener("keydown", handleEnterPress);
        };
    }, [handleEnterPress]);

    const handleClicklogo = () =>
        window.location.pathname === "/" ? window.location.reload() : navigate("/");

    return (
        <div className={styles.container}>
            {loading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loader}></div>
                </div>
            )}
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <nav className={styles.nav}>
                        <div className={styles.navLeft}>
                            <div className={styles.divlogo}>
                                <img src={logoheader} alt="" className={styles.logoheader} onClick={handleClicklogo} />
                                <img src={logoheadermobile} alt="" className={styles.logoheadermobile} onClick={handleClicklogo} />
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
            <main className={styles.mainFormContainer}>
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                    <h1 className={styles.title}>Preencha os dados para criar sua conta</h1>
                    <div className={styles.progressBar}>
                        {["E-mail", "Celular", "Nascimento"].map((label, i) => (
                            <div key={i} className={`
                                ${styles.progressStep}
                                ${step === i + 1 ? styles.progressStepActive : step > i + 1 ? styles.progressStepCompleted : ""}
                            `}>{label}</div>
                        ))}
                    </div>
                    {step === 1 && (
                        <>
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.trim())}
                                className={checkedEmail ? (emailValid ? styles.valid : styles.invalid) : ""}
                                placeholder="seu@email.com"
                                required
                                aria-invalid={checkedEmail && !emailValid}
                            />
                            <p className={styles.errorMessage}>
                                {checkedEmail && emailValid === false ? "E-mail inválido." : "\u00A0"}
                            </p>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <label htmlFor="phone">Celular (DDD + número)</label>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                className={checkedPhone ? (phoneValid ? styles.valid : styles.invalid) : ""}
                                placeholder="11999999999"
                                maxLength={11}
                                required
                                aria-invalid={checkedPhone && !phoneValid}
                            />
                            <p className={styles.errorMessage}>
                                {checkedPhone && phoneValid === false ? "DDD + 9 dígitos." : "\u00A0"}
                            </p>
                        </>
                    )}
                    {step === 3 && (
                        <>
                            <label htmlFor="birthDate">Data de Nascimento</label>
                            <input
                                id="birthDate"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className={checkedBirth ? (ageValid ? styles.valid : styles.invalid) : ""}
                                max={new Date().toISOString().split("T")[0]}
                                required
                                aria-invalid={checkedBirth && !ageValid}
                            />
                            <p className={styles.errorMessage}>
                                {checkedBirth && ageValid === false ? "Você precisa ter ≥ 16 anos." : "\u00A0"}
                            </p>
                        </>
                    )}
                    <div className={styles.buttons}>
                        {step > 1 && <button type="button" className={styles.buttonBack} onClick={prevStep} disabled={loading}>Voltar</button>}
                        {step < 3
                            ? <button type="button" onClick={nextStep} disabled={loading || (step === 1 ? !email : !phone)}>Próximo</button>
                            : <button type="submit" disabled={loading || !birthDate}>Finalizar</button>}
                    </div>
                </form>
            </main>
        </div>
    );
}

export default Etapas;
