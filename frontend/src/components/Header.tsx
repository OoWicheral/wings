import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/use-auth.tsx"; // Ajuste o caminho do seu import
import "./Header.css";

export default function Header() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                {user ? (

                    <div className="header_profile_container" ref={dropdownRef}>

                        <button
                            className="header_avatar_btn"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Abrir menu de perfil"
                        >
                            <div className="popup-avatar">
                                <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                            </div>
                        </button>

                        {isOpen && (
                            <div className="user-popup">
                                <div className="popup-avatar">
                                    <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                                </div>

                                <div className="popup-info">
                                    <span className="popup-name">{user.name || "Usuário"}</span>
                                    <span className="popup-email">{user.email}</span>
                                </div>

                                <button className="popup-config-btn" aria-label="Configurações">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (

                    <>
                        <a className="header_login" href="/login">Entrar</a>
                        <a className="header_signup" href="/cadastro">Cadastre-se</a>
                    </>
                )}
            </div>
        </header>
    );
}