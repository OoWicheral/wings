import Header from "../components/Header";
import "./Home.css";

export default function Home() {

    return (
        <main>
            <Header/>
            <section>
                <div>
                    <button>
                        <img src="" alt="" />
                        <p>Funciona com o Google Gemini</p>
                    </button>
                </div>

                <div>
                    <h1>Crie <span className="span-home"> Asas</span> para voar e 
                        retome o controle da sua <span className="span-home">História.</span>
                        </h1>
                    <p>O Wings é a sua ponte segura entre o que você sente agora e a ajuda psicológica que você merece. Você não precisa enfrentar seus desafios sozinho.</p>
                </div>

                <div>
                    <form action="" method="POST">
                        <fieldset>

                            <textarea
                                name="prompt"
                                id="prompt-ia"
                                placeholder="Como você está se sentindo hoje? Tente desabafar..."
                                rows={4}
                                required
                             ></textarea>

                             <button type="submit"></button>


                        </fieldset>
                    </form>

                
                </div>
            </section>

            <footer>O Wings é uma IA de apoio inicial e não substitui o acompanhamento psicológico. Em caso de crise, ligue 188 (CVV).</footer>
        </main>
    )
}