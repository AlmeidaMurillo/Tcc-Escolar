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
  const [nameErrors, setNameErrors] = useState([]);
  const [password, setPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErrors, setEmailErrors] = useState([]);
  const [phone, setPhone] = useState("");
  const [phoneErrors, setPhoneErrors] = useState([]);
  const [birthDate, setBirthDate] = useState("");
  const [birthErrors, setBirthErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const isValidName = (value) => {
    const erros = [];
    if (!value.trim()) erros.push("O nome é obrigatório.");
    if (value.trim().length < 2) erros.push("O nome deve ter pelo menos 2 caracteres.");
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) erros.push("O nome não pode conter números ou símbolos.");
    for (let word of forbiddenWords) {
      if (value.toLowerCase().includes(word)) erros.push("O nome contém palavras proibidas.");
    }
    return erros;
  };

  const isValidPassword = (value) => {
    const erros = [];
    if (!value) {
      erros.push("A senha é obrigatória.");
      return erros;
    }

    const regex = new RegExp(
      String.raw`^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~/-]).{8,}$`
    );

    if (!regex.test(value)) {
      erros.push("A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula, 1 número e 1 caractere especial.");
    }

    return erros;
  };

  const isValidEmail = (value) => {
    const erros = [];
    if (!value.trim()) erros.push("O e-mail é obrigatório.");
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !regex.test(value)) erros.push("Digite um e-mail válido.");
    return erros;
  };

  const isValidPhone = (value) => {
    const erros = [];
    if (!value.trim()) erros.push("O celular é obrigatório.");
    if (value.replace(/\D/g, "").length !== 11) erros.push("O celular deve ter 11 dígitos.");
    return erros;
  };

  const isValidBirth = (value) => {
    const erros = [];
    if (!value) {
      erros.push("A data de nascimento é obrigatória.");
      return erros;
    }
    const [year, month, day] = value.split("-").map(Number);
    const birth = new Date(year, month - 1, day);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    if (age < 16) erros.push("Você precisa ter pelo menos 16 anos.");
    return erros;
  };

  useEffect(() => {
    const cpf = localStorage.getItem("usuarioCPF");
    if (!cpf) navigate("/registro");
  }, [navigate]);

  const nextStep = useCallback(async () => {
    setLoading(true);
    setTimeout(async () => {
      if (step === 1) {
        const erros = isValidName(name);
        try {
          if (erros.length === 0) {
            const res = await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/check-nome/${encodeURIComponent(name)}`);
            const data = await res.json();
            if (data.exists) erros.push("Este nome já está em uso.");
          }
        } catch {
          console.log("Erro ao verificar nome");
        }
        setNameErrors(erros);
        if (erros.length === 0) setStep(2);
      } else if (step === 2) {
        const erros = isValidPassword(password);
        setPasswordErrors(erros);
        if (erros.length === 0) setStep(3);
      } else if (step === 3) {
        const erros = isValidEmail(email);
        try {
          if (erros.length === 0) {
            const res = await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/check-email/${encodeURIComponent(email)}`);
            const data = await res.json();
            if (data.exists) erros.push("Este e-mail já está em uso.");
          }
        } catch {
          console.log("Erro ao verificar e-mail");
        }
        setEmailErrors(erros);
        if (erros.length === 0) setStep(4);
      } else if (step === 4) {
        const erros = isValidPhone(phone);
        try {
          if (erros.length === 0) {
            const res = await fetch(`https://tcc-escolar-backend-production.up.railway.app/usuarios/check-telefone/${encodeURIComponent(phone)}`);
            const data = await res.json();
            if (data.exists) erros.push("Este número já está em uso.");
          }
        } catch {
          console.log("Erro ao verificar telefone");
        }
        setPhoneErrors(erros);
        if (erros.length === 0) setStep(5);
      }
      setLoading(false);
    }, 600);
  }, [step, name, password, email, phone]);

  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    const erros = isValidBirth(birthDate);
    setBirthErrors(erros);
    if (erros.length > 0) return;
    setLoading(true);
    try {
      const cpf = localStorage.getItem("usuarioCPF");
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
      console.log(err);
      alert("Erro ao salvar dados. Tente novamente.");
    }
    setLoading(false);
  }, [birthDate, name, email, password, phone, navigate]);

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  const handleClicklogo = () =>
    window.location.pathname === "/" ? window.location.reload() : navigate("/");

  const handleEnterPress = useCallback((event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (step < 5) {
        nextStep();
      } else {
        handleSubmit(event);
      }
    }
  }, [step, nextStep, handleSubmit]);


  useEffect(() => {
    window.addEventListener("keydown", handleEnterPress);
    return () => window.removeEventListener("keydown", handleEnterPress);
  }, [handleEnterPress]);

  return (
    <div className={styles.container}>
      {loading && <div className={styles.loadingOverlay}><div className={styles.loader}></div></div>}
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
              <div key={i} className={`${styles.progressStep} ${step === i + 1 ? styles.progressStepActive : step > i + 1 ? styles.progressStepCompleted : ""}`}>{label}</div>
            ))}
          </div>

          {step === 1 && (
            <>
              <label htmlFor="name">Nome</label>
              <input id="name" type="text" value={name} onChange={(e) => { setName(e.target.value); setNameErrors([]); }} placeholder="Seu nome completo" />
              {nameErrors.length > 0 && (
                <div className={styles.errorMessage}>{nameErrors.map((err, i) => <div key={i}>{err}</div>)}</div>
              )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordErrors([]);
                  }}
                  placeholder="Mínimo 8 caracteres, incluindo 1 maiúscula, 1 número e 1 especial"
                />
                <span
                  className={styles.eyeIcon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordErrors.length > 0 && (
                <div className={styles.errorMessage}>
                  {passwordErrors.map((err, i) => (
                    <div key={i}>{err}</div>
                  ))}
                </div>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailErrors([]); }} placeholder="seu@email.com" />
              {emailErrors.length > 0 && (
                <div className={styles.errorMessage}>{emailErrors.map((err, i) => <div key={i}>{err}</div>)}</div>
              )}
            </>
          )}

          {step === 4 && (
            <>
              <label htmlFor="phone">Celular (DDD + número)</label>
              <input id="phone" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setPhoneErrors([]); }} placeholder="11999999999" maxLength={11} />
              {phoneErrors.length > 0 && (
                <div className={styles.errorMessage}>{phoneErrors.map((err, i) => <div key={i}>{err}</div>)}</div>
              )}
            </>
          )}

          {step === 5 && (
            <>
              <label htmlFor="birthDate">Data de Nascimento</label>
              <input id="birthDate" type="date" value={birthDate} onChange={(e) => { setBirthDate(e.target.value); setBirthErrors([]); }} max={today} />
              {birthErrors.length > 0 && (
                <div className={styles.errorMessage}>{birthErrors.map((err, i) => <div key={i}>{err}</div>)}</div>
              )}
            </>
          )}

          <div className={styles.buttons}>
            {step > 1 && <button type="button" className={styles.buttonBack} onClick={prevStep} disabled={loading}>Voltar</button>}
            {step < 5 ? (
              <button type="button" onClick={nextStep} disabled={loading}>Próximo</button>
            ) : (
              <button type="submit" disabled={loading}>Finalizar</button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

export default Etapas;
