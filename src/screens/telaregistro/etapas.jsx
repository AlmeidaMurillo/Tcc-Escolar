import { useState, useEffect, useCallback } from "react";
import styles from "./etapas.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const forbiddenWords = ["racista", "idiota", "burro", "imbecil", "palavrão1", "palavrão2"];

function Etapas() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [nameValid, setNameValid] = useState(null);
  const [checkedName, setCheckedName] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(null);
  const [checkedPassword, setCheckedPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(null);
  const [checkedEmail, setCheckedEmail] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(null);
  const [checkedPhone, setCheckedPhone] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [ageValid, setAgeValid] = useState(null);
  const [checkedBirth, setCheckedBirth] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValidName = useCallback((value) => {
    if (!value) return false;
    const n = value.trim().toLowerCase();
    if (n.length < 2) return false;
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(n)) return false;
    for (let word of forbiddenWords) {
      if (n.includes(word)) return false;
    }
    return true;
  }, []);

  const isValidPassword = useCallback((value) => {
    if (!value) return false;
    if (value.length < 6) return false;
    if (!/[A-Za-z]/.test(value)) return false;
    if (!/\d/.test(value)) return false;
    return true;
  }, []);

  useEffect(() => {
    const cpf = localStorage.getItem("usuarioCPF");
    if (!cpf) navigate("/registro");
  }, [navigate]);

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
    const [year, month, day] = birthDate.split("-").map(Number);
    const birth = new Date(year, month - 1, day);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    setAgeValid(age >= 16);
  }, [birthDate]);

  const nextStep = useCallback(async () => {
    setLoading(true);
    setTimeout(async () => {
      if (step === 1) {
        setCheckedName(true);
        if (isValidName(name)) {
          try {
            const res = await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/check-nome/${encodeURIComponent(name)}`);
            const data = await res.json();
            if (data.exists) {
              setNameValid(false);
              setLoading(false);
              return;
            }
            setNameValid(true);
            setStep(2);
          } catch (err) {
            console.error(err);
          }
        } else {
          setNameValid(false);
        }
      } else if (step === 2) {
        setCheckedPassword(true);
        if (isValidPassword(password)) {
          setPasswordValid(true);
          setStep(3);
        } else {
          setPasswordValid(false);
        }
      } else if (step === 3) {
        setCheckedEmail(true);
        if (emailValid) {
          try {
            const res = await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/check-email/${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.exists) {
              setEmailExists(true);
              setLoading(false);
              return;
            }
            setEmailExists(false);
            setStep(4);
          } catch (err) {
            console.error(err);
          }
        }
      } else if (step === 4) {
        setCheckedPhone(true);
        if (phoneValid) {
          try {
            const res = await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/check-telefone/${encodeURIComponent(phone)}`);
            const data = await res.json();
            if (data.exists) {
              setPhoneExists(true);
              setLoading(false);
              return;
            }
            setPhoneExists(false);
            setStep(5);
          } catch (err) {
            console.error(err);
          }
        }
      }
      setLoading(false);
    }, 800);
  }, [step, name, password, email, phone, emailValid, phoneValid, isValidName, isValidPassword]);

  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      setCheckedBirth(true);
      if (ageValid) {
        try {
          const cpf = localStorage.getItem("usuarioCPF");
          if (!cpf) throw new Error("CPF não encontrado");
          await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cpf,  
              nome: name,
              email,
              senha: password,
              telefone: phone,
              data_nascimento: birthDate
            }),
          });
          alert("Conta criada e enviada para análise!");
          navigate("/registro/etapas/analise");
        } catch (err) {
          console.error("Erro ao salvar dados:", err);
          alert("Erro ao salvar dados. Tente novamente.");
        }
      }
      setLoading(false);
    }, 800);
  };

  const handleEnterPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        if (step < 5) {
          event.preventDefault();
          if (step === 1 && name) nextStep();
          else if (step === 2 && password) nextStep();
          else if (step === 3 && email) nextStep();
          else if (step === 4 && phone) nextStep();
        }
      }
    },
    [step, name, password, email, phone, nextStep]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEnterPress);
    return () => window.removeEventListener("keydown", handleEnterPress);
  }, [handleEnterPress]);

  const today = (() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  })();

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
            {["Nome", "Senha", "E-mail", "Celular", "Nascimento"].map((label, i) => (
              <div
                key={i}
                className={`${styles.progressStep} ${step === i + 1 ? styles.progressStepActive : step > i + 1 ? styles.progressStepCompleted : ""}`}
              >
                {label}
              </div>
            ))}
          </div>
          {step === 1 && (
            <>
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={checkedName ? (nameValid ? styles.valid : styles.invalid) : ""}
                placeholder="Seu nome completo"
                required
                aria-invalid={checkedName && !nameValid}
              />
            </>
          )}
          {step === 2 && (
            <>
              <label htmlFor="password">Senha</label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={checkedPassword ? (passwordValid ? styles.valid : styles.invalid) : ""}
                  placeholder="Mínimo 6 caracteres, incluindo letras e números"
                  required
                  aria-invalid={checkedPassword && !passwordValid}
                />
                <span className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className={checkedEmail ? (emailValid && !emailExists ? styles.valid : styles.invalid) : ""}
                placeholder="seu@email.com"
                required
                aria-invalid={checkedEmail && (!emailValid || emailExists)}
              />
            </>
          )}
          {step === 4 && (
            <>
              <label htmlFor="phone">Celular (DDD + número)</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className={checkedPhone ? (phoneValid && !phoneExists ? styles.valid : styles.invalid) : ""}
                placeholder="11999999999"
                maxLength={11}
                required
                aria-invalid={checkedPhone && (!phoneValid || phoneExists)}
              />
            </>
          )}
          {step === 5 && (
            <>
              <label htmlFor="birthDate">Data de Nascimento</label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={checkedBirth ? (ageValid ? styles.valid : styles.invalid) : ""}
                max={today}
                required
                aria-invalid={checkedBirth && !ageValid}
              />
            </>
          )}
          <div className={styles.buttons}>
            {step > 1 && (
              <button type="button" className={styles.buttonBack} onClick={prevStep} disabled={loading}>
                Voltar
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading || (step === 1 ? !name : step === 2 ? !password : step === 3 ? !email : !phone)}
              >
                Próximo
              </button>
            ) : (
              <button type="submit" disabled={loading || !birthDate}>
                Finalizar
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default Etapas;
