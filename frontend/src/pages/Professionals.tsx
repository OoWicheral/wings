import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AppSidebar from "../components/AppSidebar";
import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../service/api";
import { getProfessionals } from "../service/community";
import { startProfessionalChat } from "../service/professional-chat";
import { avatarUrl } from "../utils/format";
import type { Professional } from "../type/Professional";

import "./Professionals.css";


const STATUS_LABEL: Record<string, string> = {
    ativo: "Registro ativo",
    pendente: "Registro pendente",
    suspenso: "Registro suspenso",
    inativo: "Registro inativo",
    cancelado: "Registro cancelado",
};

function readError(error: unknown, fallback: string) {
    if (error instanceof ApiError) {
        if (error.status === 401) {
            return "Sua sessão expirou. Entre novamente.";
        }

        const firstField = error.errors
            ? Object.values(error.errors)[0]?.[0]
            : undefined;

        return firstField ?? error.message ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
}

function IconSearch() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
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

function IconX() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function IconChat() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.8L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
        </svg>
    );
}

export default function Professionals() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    /* Lista e paginação */
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isFetching, setIsFetching] = useState(true);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [listError, setListError] = useState("");

    /* Busca (topo) */
    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    /* Filtro por região do CRP (sidebar) */
    const [regionOptions, setRegionOptions] = useState<string[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [regionQuery, setRegionQuery] = useState("");

    /* Abrir conversa */
    const [openingId, setOpeningId] = useState<number | null>(null);
    const [chatError, setChatError] = useState("");



    /* Debounce da busca: 350ms depois da última tecla. */
    useEffect(() => {
        const timer = window.setTimeout(() => {
            setActiveSearch(search.trim());
            setPage(1);
        }, 350);

        return () => window.clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        let cancelled = false;

        void (async () => {
            setIsFetching(true);
            setListError("");

            try {
                const res = await getProfessionals({
                    search: activeSearch || undefined,
                    region: selectedRegions.length
                        ? selectedRegions.join(",")
                        : undefined,
                    page,
                });

                if (cancelled) return;

                setProfessionals((prev) =>
                    page === 1 ? res.data : [...prev, ...res.data]
                );
                setLastPage(res.meta.last_page);
                setTotal(res.meta.total);

                if (selectedRegions.length === 0) {
                    setRegionOptions((prev) => {
                        const merged = new Set(prev);

                        res.data.forEach((professional) => {
                            if (professional.crpRegion) {
                                merged.add(professional.crpRegion);
                            }
                        });

                        return [...merged].sort();
                    });
                }
            } catch (error) {
                if (cancelled) return;

                setListError(
                    readError(error, "Não foi possível carregar os profissionais.")
                );
            } finally {
                if (!cancelled) {
                    setIsFetching(false);
                    setHasLoaded(true);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [authLoading, user, activeSearch, selectedRegions, page, navigate]);



    const availableRegions = useMemo(() => {
        const term = regionQuery.trim().toLowerCase();

        return regionOptions.filter(
            (region) =>
                !selectedRegions.includes(region) &&
                (!term || region.toLowerCase().includes(term))
        );
    }, [regionOptions, selectedRegions, regionQuery]);

    function addRegion(region: string) {
        setSelectedRegions((prev) =>
            prev.includes(region) ? prev : [...prev, region]
        );
        setPage(1);
    }

    function removeRegion(region: string) {
        setSelectedRegions((prev) => prev.filter((item) => item !== region));
        setPage(1);
    }



    async function handleOpenChat(professional: Professional) {
        if (openingId !== null) return;

        setOpeningId(professional.id);
        setChatError("");

        try {
            const chat = await startProfessionalChat(professional.id);
            navigate(`/chat-profissional/${chat.chat_id}`);
        } catch (error) {
            setChatError(
                readError(error, "Não foi possível abrir a conversa.")
            );
        } finally {
            setOpeningId(null);
        }
    }

    const hasFilters = activeSearch !== "" || selectedRegions.length > 0;

    return (
        <div className="pros-page">
            <AppSidebar active="profissionais">
                <div className="pros-filters">
                    <h2 className="pros-filters-title">Filtros</h2>

                    <label className="pros-filters-label" htmlFor="pros-region">
                        Região (CRP)
                    </label>

                    <div className="pros-region-search">
                        <IconSearch />
                        <input
                            id="pros-region"
                            type="search"
                            placeholder="Buscar região"
                            aria-label="Buscar região do CRP"
                            value={regionQuery}
                            onChange={(event) => setRegionQuery(event.target.value)}
                        />
                    </div>

                    <div className="pros-chips">
                        {selectedRegions.map((region) => (
                            <button
                                key={region}
                                type="button"
                                className="pros-chip pros-chip--selected"
                                onClick={() => removeRegion(region)}
                                aria-label={`Remover filtro ${region}`}
                            >
                                {region}
                                <IconX />
                            </button>
                        ))}

                        {availableRegions.map((region) => (
                            <button
                                key={region}
                                type="button"
                                className="pros-chip"
                                onClick={() => addRegion(region)}
                            >
                                {region}
                            </button>
                        ))}
                    </div>

                    {hasLoaded && regionOptions.length === 0 && (
                        <p className="pros-chips-empty">
                            Nenhuma região cadastrada.
                        </p>
                    )}
                </div>

                <Link to="/perfil" className="pros-user" aria-label="Abrir meu perfil">
                    <span className="pros-user-avatar">
                        <IconUser />
                    </span>
                    <span className="pros-user-name">
                        {user?.name ?? "Nome usuário"}
                    </span>
                </Link>
            </AppSidebar>

            <main className="pros-main">
                <header className="pros-header">
                    <div>
                        <h1 className="pros-title">Profissionais</h1>
                        <p className="pros-subtitle">
                            {total > 0
                                ? `${total} profissional${total > 1 ? "is" : ""} encontrado${total > 1 ? "s" : ""}`
                                : "Encontre apoio profissional"}
                        </p>
                    </div>

                    <div className="pros-search">
                        <IconSearch />
                        <input
                            type="search"
                            placeholder="Buscar"
                            aria-label="Buscar profissional por nome ou CRP"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </header>

                {chatError && (
                    <p className="pros-error" role="alert">
                        {chatError}
                    </p>
                )}

                {listError && (
                    <p className="pros-error" role="alert">
                        {listError}
                    </p>
                )}

                {!hasLoaded && isFetching && (
                    <p className="pros-feedback">Carregando profissionais…</p>
                )}

                {hasLoaded && professionals.length === 0 && (
                    <div className="pros-empty">
                        <h2>Nenhum profissional encontrado</h2>
                        <p>
                            {hasFilters
                                ? "Tente outro nome, CRP ou região."
                                : "Ainda não há profissionais cadastrados na plataforma."}
                        </p>
                    </div>
                )}

                {professionals.length > 0 && (
                    <div className="pros-grid">
                        {professionals.map((professional) => {
                            const avatar = avatarUrl(professional.avatar);
                            const status = professional.registerStatus ?? "";
                            const statusModifier = STATUS_LABEL[status]
                                ? status
                                : "neutro";

                            return (
                                <article key={professional.id} className="pros-card">
                                    <span className="pros-avatar">
                                        {avatar ? (
                                            <img src={avatar} alt="" />
                                        ) : (
                                            <IconUser />
                                        )}
                                    </span>

                                    <h2 className="pros-name">
                                        {professional.name ?? "Profissional"}
                                    </h2>

                                    <span className="pros-specialty">
                                        {professional.crpRegion &&
                                        professional.crpNumber
                                            ? `CRP ${professional.crpRegion}/${professional.crpNumber}`
                                            : "CRP não informado"}
                                    </span>

                                    {professional.bio && (
                                        <p className="pros-bio">
                                            {professional.bio}
                                        </p>
                                    )}

                                    <div className="pros-meta">
                                        <span className="pros-region">
                                            Região {professional.crpRegion ?? "—"}
                                        </span>

                                        {STATUS_LABEL[status] && (
                                            <span
                                                className={`pros-badge pros-badge--${statusModifier}`}
                                            >
                                                {STATUS_LABEL[status]}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        className="pros-chat"
                                        onClick={() =>
                                            void handleOpenChat(professional)
                                        }
                                        disabled={openingId !== null}
                                    >
                                        <IconChat />
                                        {openingId === professional.id
                                            ? "Abrindo..."
                                            : "Conversar"}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}

                {page < lastPage && (
                    <div className="pros-more">
                        <button
                            type="button"
                            className="pros-load-more"
                            onClick={() => setPage((value) => value + 1)}
                            disabled={isFetching}
                        >
                            {isFetching ? "Carregando..." : "Carregar mais"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
