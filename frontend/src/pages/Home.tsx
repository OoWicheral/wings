import Header from "../components/Header";

import "./Home.css";

export default function Home() {
    return (
        <main className="home-main">
            <Header />
            
            <section className="home-hero">
                {/* Botão de Destaque da IA */}
                <div className="badge-container">

                    <a href="https://gemini.google.com">
                    <button className="gemini-badge">
                        <img alt="Imagem do Gemini" aria-hidden="true" className="gemini-img" src="https://www.gstatic.com/lamda/images/gemini_sparkle_aurora_33f86dc0c0257da337c63.svg"></img>
                        <span>Funciona com o Google Gemini</span>
                    </button>
                    </a>
                </div>

                {/* Título e Subtítulo */}
                <div className="hero-text-container">
                    <h1>
                        Crie <span className="span-home">Asas</span> para voar e retome o controle da sua <span className="span-home">História.</span>
                    </h1>
                    <p>
                        O Wings é a sua ponte segura entre o que você sente agora e a ajuda psicológica que você merece. Você não precisa enfrentar seus desafios sozinho.
                    </p>
                </div>

                {/* Caixa de Entrada / Prompt */}
                <div className="prompt-container">
                    <form action="" method="POST" className="prompt-form" onSubmit={(e) => e.preventDefault()}>
                        <fieldset className="prompt-fieldset">
                            <textarea
                                name="prompt"
                                id="prompt-ia"
                                placeholder="Como você está se sentindo hoje? Tente desabafar..."
                                rows={3}
                                required
                            ></textarea>

                            <div className="prompt-actions">
                                <button type="button" className="action-btn-left" aria-label="Anexar">
                                   <img src="/add.svg" alt="ícone de adicionar" />
                                </button>
                                <div className="action-btn-right-group">
                                    <button type="button" className="action-btn" aria-label="Microfone">
                                        <img src="/mic.svg" alt="ícone de microfone" />
                                    </button>
                                    <button type="submit" className="submit-btn" aria-label="Enviar">
                                        <img src="/arrow.svg" alt="ícone de seta" />
                                    </button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </section>

            <footer className="home-footer">
                O Wings é uma IA de apoio inicial e não substitui o acompanhamento psicológico. Em caso de crise, ligue 188 (CVV).
            </footer>
        </main>
    );
}