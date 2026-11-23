import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuthModal } from "../hooks/use-auth-modal";
import { useAuth } from "../hooks/use-auth";
import SignOn from "./Sign-on";
import SignUp from "./Sign-up";
import "./AuthModal.css";

export default function AuthModal() {
    const { mode, openAuthModal, closeAuthModal } = useAuthModal();
    const { user } = useAuth();

    useEffect(() => {
        if (!mode) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") closeAuthModal();
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [mode, closeAuthModal]);

    useEffect(() => {
        if ((mode === "login" || mode === "signup") && user) {
            closeAuthModal();
        }
    }, [mode, user, closeAuthModal]);

    if (!mode) return null;

    return createPortal(
        <div className="auth-modal-overlay" onMouseDown={closeAuthModal}>
            <div
                className="auth-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Entrar ou criar conta"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    className="auth-modal-close"
                    onClick={closeAuthModal}
                    aria-label="Fechar"
                >
                    ×
                </button>

                {mode === "login" && <SignOn />}
                {mode === "signup" && <SignUp />}

                {mode === "professional" &&
                    (user ? (
                        <div className="auth-message">
                            <p>O cadastro profissional ainda não está disponível.</p>
                        </div>
                    ) : (
                        <div className="auth-message">
                            <p>Entre na sua conta para cadastrar seu perfil profissional.</p>
                            <button
                                type="button"
                                className="auth-submit"
                                onClick={() => openAuthModal("login")}
                            >
                                Entrar
                            </button>
                        </div>
                    ))}
            </div>
        </div>,
        document.body
    );
}
