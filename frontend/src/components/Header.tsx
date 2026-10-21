import "./Header.css"

export default function Header() {
    return (
        <header className="header">
            <a className="header_logo" href="/" aria-label="Wings - Inicio">
                <img src="/logo.svg" alt="Logo Wings"/>
            </a>

            <nav className="header_nav" aria-label="Navegacao Principal">
                <a href="#inicio">Início</a>
                <a href="#ia">IA</a>
                <a href="#comunidade">Comunidade</a>
                <a href="#profissionais">Profissionais</a>
            </nav>

            <div className="header_actions">
                <a className="header_login" href="/login">
                    Entrar
                </a>

                <a className="header_signup" href="/">
                    Cadastre-se
                </a>
            </div>
        </header>
    )
}