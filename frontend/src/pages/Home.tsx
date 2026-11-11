
import Header from "../components/Header";
import "./Home.css";

const beneficios = [
    {
        icone: "/message.png",
        titulo: "Escuta humanizada",
        descricao: "Respostas empáticas e focadas no seu ritmo, sem julgamentos.",
    },
    {
        icone: "/time.png",
        titulo: "Acesso 24/7",
        descricao: "Suporte e privacidade total a qualquer hora do dia ou da noite.",
    },
    {
        icone: "/people.png",
        titulo: "Ponte profissional",
        descricao: "O impulso inicial para te preparar para a terapia.",
    },
    {
        icone: "/gemini.png",
        titulo: "Google Gemini",
        descricao: "Tecnologia de ponta para conversas fluidas, rápidas e precisas.",
    },
];

export default function Home() {
    return (
        <main className="home-main">
            <Header />

            {/* Seção principal */}
            <section className="home-hero">
                <div className="hero-content">
                    <a
                        href="https://gemini.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="gemini-badge"
                    >
                        <span className="gemini-symbol">✦</span>
                        Funciona com o Google Gemini
                    </a>

                    <div className="hero-text">
                        <h1>
                            Crie <span>Asas</span> para voar e retome o controle
                            da sua <span>História.</span>
                        </h1>

                        <p>
                            O Wings é a sua ponte segura entre o que você sente
                            agora e a ajuda psicológica que você merece. Você
                            não precisa enfrentar seus desafios sozinho.
                        </p>
                    </div>

                    <div className="hero-buttons">
                        <a href="/login" className="button-primary">
                            Conheça nosso assistente
                        </a>

                        <a href="/profissionais" className="button-secondary">
                            Procure Ajuda
                        </a>
                    </div>
                </div>

                <div className="hero-image-container">
                    <img
                        src="/home.png"
                        alt="Duas pessoas de mãos dadas"
                        className="hero-image"
                    />

                    <div className="professionals-card">
                        <div className="rating-stars">★★★★★</div>
                        <strong>
                            50+ <span className="avatar-group">👥</span>
                        </strong>
                        <p>Profissionais qualificados disponíveis</p>
                    </div>

                    <div className="hero-tag community-tag">
                        <span>✓</span>
                        Comunidade Acolhedora
                    </div>

                    <div className="hero-tag training-tag">
                        <span>✓</span>
                        IA Treinada por Profissionais
                    </div>
                </div>
            </section>

            {/* Seção sobre a inteligência artificial */}
            <section className="home-ai-section">
                <div className="phone-container">
                    <img
                        src="/mobile-home.png"
                        alt="Prévia do aplicativo Wings em um celular"
                        className="phone-image"
                    />
                </div>

                <div className="ai-content">
                    <span className="section-eyebrow">
                        INTELIGÊNCIA ARTIFICIAL
                    </span>

                    <h2>Um apoio para recuperar sua autonomia.</h2>

                    <p className="ai-description">
                        Com inteligência artificial do Google Gemini, o
                        assistente do Wings acolhe o que você sente e ajuda a
                        organizar os próximos passos, no seu ritmo.
                    </p>

                    <div className="benefits-list">
                        {beneficios.map((beneficio) => (
                            <article
                                className="benefit-item"
                                key={beneficio.titulo}
                            >
                                <div className="benefit-icon">
                                    <img src={beneficio.icone} alt="" />
                                </div>

                                <div className="benefit-text">
                                    <h3>{beneficio.titulo}</h3>
                                    <p>{beneficio.descricao}</p>
                                </div>
                            </article>
                        ))}
                    </div>

                    <a href="/login" className="ai-button">
                        Conheça nosso assistente
                    </a>

                    <small className="ai-disclaimer">
                        A assistente não substitui atendimento profissional
                        ou serviços de emergência.
                    </small>
                </div>
            </section>
        </main>
    );
}
