
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import "./Header.css";

export default function Header() {
    const { user } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const initial = user?.name
        ? user.name.charAt(0).toUpperCase()
        : "U";

    return (
        <header className="header">
            <Link className="header-logo" to="/" aria-label="Wings - Início">
                <p className="header-txt">WINGS</p>
            </Link>

            <nav className="header-nav" aria-label="Navegação principal">
                <a href="#ia">Inteligência Artificial</a>
                <a href="#sobre">Sobre</a>
                <a href="#comunidade">Comunidade</a>
                <a href="#profissionais">Profissionais</a>
            </nav>

            <div className="header-actions">
                {user ? (
                    <div
                        className="header-profile-container"
                        ref={dropdownRef}
                    >
                        <button
                            type="button"
                            className="header-avatar-btn"
                            onClick={() => setIsOpen((prev) => !prev)}
                            aria-label="Abrir menu de perfil"
                            aria-expanded={isOpen}
                        >
                            <span className="popup-avatar">
                                {initial}
                            </span>
                        </button>

                        {isOpen && (
                            <div className="user-popup">
                                <div className="popup-user-info">
                                    <span className="popup-avatar">
                                        {initial}
                                    </span>

                                    <div className="popup-info">
                                        <span className="popup-name">
                                            {user.name || "Usuário"}
                                        </span>

                                        <span className="popup-email">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>

                                <div className="popup-divider" />

                                <Link
                                    to="/configuracoes"
                                    className="popup-config-btn"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Configurações
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link className="header-login" to="/login">
                            Entrar
                        </Link>

                        <Link className="header-signup" to="/cadastro">
                            Experimente
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}
