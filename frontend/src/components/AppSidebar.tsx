import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import "./AppSidebar.css";

/*
  Sidebar compartilhada das telas internas (Comunidade, Profissionais, Perfil).

  Observação: a sidebar do chat (Chat-ia.tsx) ainda tem a sua própria
  implementação, com busca e histórico de conversas. Ela pode ser migrada
  para este componente depois, sem pressa.
*/

type ActiveItem = "home" | "comunidade" | "profissionais" | "perfil";

interface AppSidebarProps {
    active?: ActiveItem;
    /* Conteúdo extra entre a navegação e o rodapé (ex.: filtros). */
    children?: ReactNode;
}

function IconPanel() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
        </svg>
    );
}

function IconEdit() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.4 2.6a2 2 0 0 1 2.8 2.8L12 14.6l-4 1 1-4Z" />
        </svg>
    );
}

function IconHome() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            <path d="M9 22V12h6v10" />
        </svg>
    );
}

function IconCommunity() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M12 4v16" />
            <path d="M4 12h16" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

export default function AppSidebar({ active, children }: AppSidebarProps) {
    const itemClass = (item: ActiveItem) =>
        `app-sidebar-item${active === item ? " app-sidebar-item--active" : ""}`;

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-top">
                <Link to="/" className="app-sidebar-logo" aria-label="Wings - Início">
                    <img src="/logo.svg" alt="" className="app-sidebar-logo-mark" />
                    <span className="app-sidebar-logo-text">WINGS</span>
                </Link>

                {/* [LIGAR] Recolher/expandir a sidebar */}
                <button type="button" className="app-sidebar-collapse" aria-label="Recolher menu">
                    <IconPanel />
                </button>
            </div>

            <nav className="app-sidebar-nav" aria-label="Menu principal">
                <Link to="/chat" className="app-sidebar-new">
                    <IconEdit />
                    <span className="app-sidebar-label">Nova Conversa</span>
                </Link>

                <Link to="/" className={itemClass("home")}>
                    <IconHome />
                    <span className="app-sidebar-label">Home</span>
                </Link>

                <Link to="/comunidade" className={itemClass("comunidade")}>
                    <IconCommunity />
                    <span className="app-sidebar-label">Comunidade</span>
                </Link>

                <Link to="/profissionais" className={itemClass("profissionais")}>
                    <IconPlus />
                    <span className="app-sidebar-label">Profissionais</span>
                </Link>

                <Link to="/perfil" className={itemClass("perfil")}>
                    <IconUser />
                    <span className="app-sidebar-label">Perfil</span>
                </Link>
            </nav>

            {children}
        </aside>
    );
}
