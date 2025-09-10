import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./telainicial.module.css";
import logoheader from "../../images/logoheader.png";
import logoheadermobile from "../../images/logoheadermobile.png";

export default function Inicial() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Mercado Pago - A conta que mais rende do Brasil";
  }, []);

  useEffect(() => {
    localStorage.removeItem("usuarioCPF");
  }, []);

  const handleClicklogo = () => {
    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
        }
      });
    }, observerOptions);

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "Como abro a minha Conta Mercado Pago?",
      answer:
        "É muito simples! Baixe o app do Mercado Pago, cadastre-se com seus dados pessoais e pronto. Sua conta estará pronta para usar.",
    },
    {
      question: "Qual o valor de nota de uma Conta Mercado Pago?",
      answer:
        "Não há valor mínimo para abertura. Você pode começar a usar sua conta com qualquer valor.",
    },
    {
      question: "Quais são as taxas da Conta Mercado Pago?",
      answer:
        "A conta não tem taxa de manutenção. Transferências e saques são gratuitos. Confira nossa tabela completa de tarifas no app.",
    },
  ];

  const carouselImages = [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=600",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=600",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const total = carouselImages.length;
  const [direction, setDirection] = useState("right");

  function prevSlide() {
    setDirection("left");
    setCurrentSlide((currentSlide - 1 + total) % total);
  }

  function nextSlide() {
    setDirection("right");
    setCurrentSlide((currentSlide + 1) % total);
  }

  const prevIndex = (currentSlide - 1 + total) % total;
  const nextIndex = (currentSlide + 1) % total;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
    }, 3000);

    return () => clearInterval(interval);
  }, [total]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const popupRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <div className={styles.navRight}>
              <li className={styles.navItem} onClick={() => navigate("/login")}>
                <a>Iniciar Sessão</a>
              </li>
              <button
                className={styles.ctaButton}
                data-testid="button-criar-conta-header"
                onClick={() => navigate("/registro")}
              >
                Abrir Conta Grátis
              </button>
              <button
                className={styles.mobileMenuButton}
                aria-label="Abrir menu"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                ref={buttonRef}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {isMenuOpen && (
        <div className={styles.popupMenu} ref={popupRef}>
          <button
            className={styles.buttonpopup}
            onClick={() => navigate("/registro")}
          >
            Abrir Conta Grátis
          </button>
        </div>
      )}

      <section
        id="hero"
        className={`${styles.hero} ${isVisible.hero ? styles.fadeIn : ""}`}
        data-testid="section-hero"
      >
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle} data-testid="text-hero-title">
                A conta que mais
                <br />
                rende do Brasil
              </h1>
              <p
                className={styles.heroDescription}
                data-testid="text-hero-description"
              >
                Renda automática de até 100% do CDI. Transferências e saques
                grátis. Sem taxa de manutenção. Cartão sem anuidade.
              </p>
              <div className={styles.heroBadges}>
                <div className={styles.badge} data-testid="badge-cdi-pessoal">
                  Até 100% do CDI
                </div>
                <div className={styles.badge} data-testid="badge-cdi-empresas">
                  Até 100% do CDI para empresas
                </div>
              </div>
            </div>

            <div className={styles.heroImage}>
              <img
                src={carouselImages[prevIndex]}
                alt={`Slide ${prevIndex + 1}`}
                className={styles.sideImage}
                aria-hidden="true"
              />
              <div
                className={`${styles.centerImageWrapper} ${direction === "left" ? styles.slideLeft : styles.slideRight
                  }`}
              >
                <img
                  key={currentSlide}
                  src={carouselImages[currentSlide]}
                  alt={`Slide atual ${currentSlide + 1}`}
                  className={`${styles.centerImage} ${direction === "left"
                    ? styles.slideFromLeft
                    : styles.slideFromRight
                    }`}
                  data-testid="img-hero-carousel"
                />
                <button
                  className={`${styles.arrowButton} ${styles.leftArrow}`}
                  onClick={prevSlide}
                  aria-label="Slide anterior"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <button
                  className={`${styles.arrowButton} ${styles.rightArrow}`}
                  onClick={nextSlide}
                  aria-label="Próximo slide"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              <img
                src={carouselImages[nextIndex]}
                alt={`Slide ${nextIndex + 1}`}
                className={styles.sideImage}
                aria-hidden="true"
              />

              <div className={styles.indicators}>
                {carouselImages.map((_, index) => (
                  <span
                    key={index}
                    className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ""
                      }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir para o slide ${index + 1}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setCurrentSlide(index);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features1"
        className={`${styles.features} ${isVisible.features1 ? styles.fadeIn : ""
          }`}
        data-testid="section-features1"
      >
        <div className={styles.featuresContainer}>
          <div className={styles.featuresContent}>
            <div className={styles.featuresImage}>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"
                alt="Homem feliz com cartão"
                className={styles.circularImage}
                data-testid="img-features1-man"
              />
            </div>
            <div className={styles.featuresText}>
              <h2
                className={styles.featuresTitle}
                data-testid="text-features1-title"
              >
                A conta que mais rende do Brasil
              </h2>
              <p
                className={styles.featuresDescription}
                data-testid="text-features1-description"
              >
                Com o Mercado Pago, você tem uma conta digital completa, com
                rendimento automático de até 100% do CDI. Sem burocracias, sem
                taxas escondidas.
              </p>
              <button
                className={styles.featuresButton}
                data-testid="button-abrir-conta"
                onClick={() => navigate("/registro")}
              >
                Abrir Conta Grátis
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features2"
        className={`${styles.features} ${styles.featuresReverse} ${styles.featuresGray
          } ${isVisible.features2 ? styles.fadeIn : ""}`}
        data-testid="section-features2"
      >
        <div className={styles.featuresContainer}>
          <div className={styles.featuresContent}>
            <div className={styles.featuresImage}>
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=800"
                alt="Empreendedora com produtos"
                className={styles.circularImage}
                data-testid="img-features2-entrepreneur"
              />
            </div>
            <div className={styles.featuresText}>
              <h2
                className={styles.featuresTitle}
                data-testid="text-features2-title"
              >
                Conta Mercado creditada ao vender crédito e gestão para crescer
              </h2>
              <p
                className={styles.featuresDescription}
                data-testid="text-features2-description"
              >
                Receba suas vendas na hora, tenha controle total sobre seu
                dinheiro e faça seu negócio crescer com as ferramentas certas.
              </p>
              <button
                className={styles.featuresButton}
                data-testid="button-comecar-vender"
              >
                Começar a vender
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="app"
        className={`${styles.features} ${isVisible.app ? styles.fadeIn : ""}`}
        data-testid="section-mobile-app"
      >
        <div className={styles.featuresContainer}>
          <div className={styles.featuresContent}>
            <div className={styles.featuresText}>
              <h2 className={styles.featuresTitle} data-testid="text-app-title">
                Use o Mercado Pago como quiser, dentro de casa ou na conta
              </h2>
              <p
                className={styles.featuresDescription}
                data-testid="text-app-description"
              >
                Baixe o app e tenha o Mercado Pago sempre com você. Pague
                contas, faça transferências, acompanhe seus investimentos e
                muito mais, tudo na palma da sua mão.
              </p>
              <div className={styles.appButtons}>
                <button
                  className={styles.appButton}
                  data-testid="button-app-store"
                >
                  <i className="fab fa-apple"></i>
                  <div>
                    <div className={styles.appButtonSmall}>Download on the</div>
                    <div className={styles.appButtonLarge}>App Store</div>
                  </div>
                </button>
                <button
                  className={styles.appButton}
                  data-testid="button-google-play"
                >
                  <i className="fab fa-google-play"></i>
                  <div>
                    <div className={styles.appButtonSmall}>GET IT ON</div>
                    <div className={styles.appButtonLarge}>Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className={styles.featuresImage}>
              <div className={styles.phoneContainer}>
                <div className={styles.phone} data-testid="mockup-phone">
                  <div className={styles.phoneContent}>
                    <i className="fas fa-mobile-alt"></i>
                    <div className={styles.phoneText}>Mercado Pago</div>
                    <div className={styles.phoneSubtext}>Sua conta digital</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className={`${styles.faq} ${isVisible.faq ? styles.fadeIn : ""}`}
        data-testid="section-faq"
      >
        <div className={styles.faqContainer}>
          <h2 className={styles.faqTitle} data-testid="text-faq-title">
            Perguntas Frequentes
          </h2>
          <div className={styles.faqList}>
            {faqData.map((item, index) => (
              <div
                key={index}
                className={styles.faqItem}
                data-testid={`faq-item-${index}`}
              >
                <button
                  className={styles.faqButton}
                  onClick={() => toggleFaq(index)}
                  data-testid={`button-faq-${index}`}
                >
                  <span>{item.question}</span>
                  <i
                    className={`fas fa-chevron-down ${expandedFaq === index ? styles.expanded : ""
                      }`}
                  ></i>
                </button>
                {expandedFaq === index && (
                  <div
                    className={styles.faqAnswer}
                    data-testid={`text-faq-answer-${index}`}
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="cta"
        className={`${styles.cta} ${isVisible.cta ? styles.fadeIn : ""}`}
        data-testid="section-final-cta"
      >
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle} data-testid="text-cta-title">
            Em caso de dúvidas, estamos aqui!
          </h2>
          <p
            className={styles.ctaDescription}
            data-testid="text-cta-description"
          >
            Fale conosco pelo app, chat online ou telefone. Estamos sempre
            prontos para ajudar.
          </p>
          <button
            className={styles.ctaButtonfinal}
            data-testid="button-suporte-final"
          >
            Suporte Online
          </button>
          <h3 className={styles.ctaSubtitle} data-testid="text-cta-subtitle">
            Mercado Pago, você vai mais longe para ganhar
          </h3>
          <button
            className={styles.ctaButtonfinal}
            data-testid="button-criar-conta-final"
            onClick={() => navigate("/registro")}
          >
            Abrir Conta Grátis
          </button>
        </div>
      </section>
      <footer className={styles.footer} data-testid="footer">
        <div className={styles.divlogofinal}>
          <img src={logoheader} alt="logoheader" onClick={handleClicklogo} />
        </div>
        <div className={styles.footerContainer}>
          <div className={styles.footerContent}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>Informações</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#" data-testid="link-sobre-nos">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-trabalhe-conosco">
                    Trabalhe conosco
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-investidores">
                    Investidores
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-sustentabilidade">
                    Sustentabilidade
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>Produtos</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#" data-testid="link-conta-mp">
                    Conta Mercado Pago
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-cartao-credito">
                    Cartão de crédito
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-cartao-debito">
                    Cartão de débito
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-mercado-credito">
                    Mercado Crédito
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>Desenvolvedores</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#" data-testid="link-documentacao">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-sdks">
                    SDKs
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-plugins">
                    Plugins
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-status-api">
                    Status da API
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerTitle}>Suporte</h4>
              <ul className={styles.footerLinks}>
                <li>
                  <a href="#" data-testid="link-ajuda-footer">
                    Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-forum">
                    Fórum
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-status">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" data-testid="link-contato">
                    Contato
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <div
              className={styles.footerCopyright}
              data-testid="text-copyright"
            >
              © 2025 Mercado Pago. Todos os direitos reservados.
            </div>
            <div className={styles.footerSocial}>
              <a
                href="#"
                className={styles.socialLink}
                data-testid="link-facebook"
                onClick={() =>
                  window.open(
                    "https://www.facebook.com/MercadoPagoBrasil",
                    "_blank"
                  )
                }
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                data-testid="link-yt"
                onClick={() =>
                  window.open("https://www.youtube.com/@mercadopago", "_blank")
                }
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                data-testid="link-instagram"
                onClick={() =>
                  window.open(
                    "https://www.instagram.com/mercadopagobr",
                    "_blank"
                  )
                }
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className={styles.socialLink}
                data-testid="link-linkedin"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/showcase/mercado-pago",
                    "_blank"
                  )
                }
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
