import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../service/api";
import { createProfile, getProfile, getUser, updateProfile } from "../service/profile";
import { avatarUrl, formatDate, formatMonthYear, formatPhone } from "../utils/format";
import type { Profile as UserProfile } from "../type/Profile";
import type { User } from "../type/User";

import "./Profile.css";

type PageStatus = "loading" | "ready" | "empty" | "error";

/* =========================================================
   ÍCONES(SUBSTITUIVEL)
   ========================================================= */

function IconArrowLeft() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
        </svg>
    );
}

function IconPencil() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
    );
}

function IconUser() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

function IconIdCard() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="11" r="2.2" />
            <path d="M6 16a3.2 3.2 0 0 1 6 0" />
            <path d="M15 10h3" />
            <path d="M15 14h3" />
        </svg>
    );
}

function IconShield() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}

function IconMail() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

function IconPhone() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
        </svg>
    );
}

function IconCalendar() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4" />
            <path d="M8 3v4" />
            <path d="M3 11h18" />
        </svg>
    );
}


function ProfileTopbar() {
    return (
        <header className="profile-topbar">
            <Link to="/" className="profile-brand" aria-label="Wings - Início">
                <img src="/logo.svg" alt="" className="profile-brand-mark" />
                <span className="profile-brand-text">WINGS</span>
            </Link>

            <Link to="/chat" className="profile-back-link">
                <IconArrowLeft />
                Voltar ao assistente
            </Link>
        </header>
    );
}

interface PageStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    isBusy?: boolean;
}

function PageState({ title, description, actionLabel, onAction, isBusy }: PageStateProps) {
    return (
        <main className="profile-page">
            <ProfileTopbar />

            <div className="profile-content">
                <section className="profile-card profile-state">
                    <h1 className="profile-state-title">{title}</h1>
                    <p className="profile-note">{description}</p>

                    {actionLabel && onAction && (
                        <button
                            type="button"
                            className="profile-edit-button"
                            onClick={onAction}
                            disabled={isBusy}
                        >
                            {isBusy ? "Aguarde..." : actionLabel}
                        </button>
                    )}
                </section>
            </div>
        </main>
    );
}



export default function Profile() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    // Dados remotos
    const [status, setStatus] = useState<PageStatus>("loading");
    const [userData, setUserData] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    // reloadToken força o efeito a rodar de novo (botão "Tentar novamente")
    const [reloadToken, setReloadToken] = useState(0);
    const [isCreating, setIsCreating] = useState(false);

    // Modo de edição
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ nameProfile: "", bio: "" });
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        // Sem id não dá para montar /api/user/{id}.
        if (!user.id) {
            setErrorMessage(
                "Sua sessão não trouxe um identificador válido. Saia e entre novamente."
            );
            setStatus("error");
            return;
        }

        let cancelled = false;
        setStatus("loading");

        void (async () => {
            try {
                const [userResponse, profileResponse] = await Promise.all([
                    getUser(user.id),
                    // 404 aqui não é erro: significa que o perfil ainda não existe.
                    getProfile(user.id).catch((error: unknown) => {
                        if (error instanceof ApiError && error.status === 404) {
                            return null;
                        }
                        throw error;
                    }),
                ]);

                if (cancelled) return;

                setUserData(userResponse);

                if (!profileResponse) {
                    setStatus("empty");
                    return;
                }

                setProfile(profileResponse);
                setStatus("ready");
            } catch (error) {
                if (cancelled) return;

                if (error instanceof ApiError && error.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }

                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar o perfil."
                );
                setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user, authLoading, navigate, reloadToken]);

    async function handleCreateProfile() {
        if (!user?.id) return;

        setIsCreating(true);
        setErrorMessage("");

        try {
            const created = await createProfile(user.id, {
                nameProfile: user.name.slice(0, 20),
                bio: null,
            });

            setProfile(created);
            setStatus("ready");
        } catch (error) {
            // 400 = perfil já existe (duas requisições simultâneas).
            if (error instanceof ApiError && error.status === 400) {
                setReloadToken((token) => token + 1);
                return;
            }

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível criar o perfil."
            );
        } finally {
            setIsCreating(false);
        }
    }

    function startEditing() {
        if (!profile) return;

        setForm({
            nameProfile: profile.nameProfile ?? "",
            bio: profile.bio ?? "",
        });
        setSaveError("");
        setIsEditing(true);
    }

    function cancelEditing() {
        setSaveError("");
        setIsEditing(false);
    }

    function handleFormChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!user?.id) return;

        const nameProfile = form.nameProfile.trim();

        if (!nameProfile) {
            setSaveError("O nome do perfil é obrigatório.");
            return;
        }

        setIsSaving(true);
        setSaveError("");

        try {
            const updated = await updateProfile(user.id, {
                nameProfile,
                bio: form.bio.trim() || null,
            });

            // A resposta do PATCH é a fonte da verdade.
            setProfile(updated);
            setIsEditing(false);
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                navigate("/login", { replace: true });
                return;
            }

            if (error instanceof ApiError && error.errors) {
                const firstField = Object.values(error.errors)[0];
                setSaveError(firstField?.[0] ?? error.message);
            } else {
                setSaveError(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível salvar as alterações."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    if (authLoading || status === "loading") {
        return (
            <PageState
                title="Carregando seu perfil"
                description="Só um instante enquanto buscamos seus dados."
            />
        );
    }

    if (!user) {
        return null;
    }

    if (status === "error") {
        return (
            <PageState
                title="Não foi possível carregar seu perfil"
                description={
                    errorMessage || "Tente novamente em alguns instantes."
                }
                actionLabel="Tentar novamente"
                onAction={() => setReloadToken((token) => token + 1)}
            />
        );
    }

    if (status === "empty" || !profile) {
        return (
            <PageState
                title="Seu perfil ainda não existe"
                description={
                    errorMessage ||
                    "Crie seu perfil para começar a personalizar sua experiência no Wings."
                }
                actionLabel="Criar meu perfil"
                onAction={() => void handleCreateProfile()}
                isBusy={isCreating}
            />
        );
    }


    const displayName =
        profile.nameProfile?.trim() || userData?.name || user.name || "Seu perfil";
    const initial = displayName.charAt(0).toUpperCase();
    const avatar = avatarUrl(profile.avatar);
    const isActive = profile.statusProfile === "ativo";
    const email = userData?.email ?? user.email;
    const phone = formatPhone(userData?.tel?.[0]);
    const birthDate = formatDate(userData?.date);
    const fullName = userData?.name ?? user.name;
    const memberSince = formatMonthYear(profile.createdAt);

    return (
        <main className="profile-page">
            <ProfileTopbar />

            <div className="profile-content">
                <section className="profile-hero">
                    <div className="profile-cover" aria-hidden="true">
                        <span className="profile-cover-orb profile-cover-orb--one" />
                        <span className="profile-cover-orb profile-cover-orb--two" />
                    </div>

                    <div className="profile-hero-body">
                        <div className="profile-avatar" aria-hidden="true">
                            {avatar ? <img src={avatar} alt="" /> : initial}
                        </div>

                        <div className="profile-identity">
                            <div className="profile-name-row">
                                <h1>{displayName}</h1>

                                <span
                                    className={`profile-status profile-status--${
                                        isActive ? "ativo" : "inativo"
                                    }`}
                                >
                                    {isActive ? "Perfil ativo" : "Perfil inativo"}
                                </span>
                            </div>

                            <p className="profile-email">{email}</p>
                            <p className="profile-member">
                                Membro desde {memberSince}
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                className="profile-edit-button"
                                onClick={startEditing}
                            >
                                <IconPencil />
                                Editar perfil
                            </button>
                        )}
                    </div>
                </section>

                <div className="profile-grid">
                    <section className="profile-card profile-about">
                        <div className="profile-card-heading">
                            <span className="profile-card-icon">
                                <IconUser />
                            </span>
                            <h2>Sobre mim</h2>
                        </div>

                        {isEditing ? (
                            <form className="profile-form" onSubmit={handleSave} noValidate>
                                <label className="profile-field">
                                    <span>Nome do perfil</span>
                                    <input
                                        type="text"
                                        name="nameProfile"
                                        value={form.nameProfile}
                                        onChange={handleFormChange}
                                        maxLength={20}
                                        placeholder="Como você quer ser chamado"
                                        disabled={isSaving}
                                    />
                                </label>

                                <label className="profile-field">
                                    <span>Sobre mim</span>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleFormChange}
                                        maxLength={250}
                                        rows={5}
                                        placeholder="Conte um pouco sobre você"
                                        disabled={isSaving}
                                    />
                                    <small>{form.bio.length}/250</small>
                                </label>

                                {saveError && (
                                    <p className="profile-error" role="alert">
                                        {saveError}
                                    </p>
                                )}

                                <div className="profile-form-actions">
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        disabled={isSaving}
                                    >
                                        Cancelar
                                    </button>

                                    <button type="submit" disabled={isSaving}>
                                        {isSaving ? "Salvando..." : "Salvar"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <p className="profile-bio">
                                    {profile.bio ||
                                        "Você ainda não escreveu nada sobre você."}
                                </p>

                                <div className="profile-about-footer">
                                    <span className="profile-about-mark">✦</span>
                                    <p>
                                        Cada passo da sua jornada importa, mesmo
                                        os pequenos.
                                    </p>
                                </div>
                            </>
                        )}
                    </section>

                    <section className="profile-card">
                        <div className="profile-card-heading">
                            <span className="profile-card-icon">
                                <IconIdCard />
                            </span>
                            <h2>Dados pessoais</h2>
                        </div>

                        <dl className="profile-data-list">
                            <div className="profile-data-row">
                                <dt>
                                    <IconUser />
                                    Nome completo
                                </dt>
                                <dd>{fullName}</dd>
                            </div>

                            <div className="profile-data-row">
                                <dt>
                                    <IconMail />
                                    E-mail
                                </dt>
                                <dd>{email}</dd>
                            </div>

                            <div className="profile-data-row">
                                <dt>
                                    <IconPhone />
                                    Telefone
                                </dt>
                                <dd>{phone}</dd>
                            </div>

                            <div className="profile-data-row">
                                <dt>
                                    <IconCalendar />
                                    Nascimento
                                </dt>
                                <dd>{birthDate}</dd>
                            </div>
                        </dl>
                    </section>

                    <section className="profile-card">
                        <div className="profile-card-heading">
                            <span className="profile-card-icon">
                                <IconShield />
                            </span>
                            <h2>Conta</h2>
                        </div>

                        <div className="profile-account-list">
                            <div className="profile-account-row">
                                <span>Status do perfil</span>
                                <span className="profile-account-value">
                                    {isActive ? "Ativo" : "Inativo"}
                                </span>
                            </div>

                            <div className="profile-account-row">
                                <span>Membro desde</span>
                                <span className="profile-account-value">
                                    {memberSince}
                                </span>
                            </div>
                        </div>
                    </section>
                </div>

                <p className="profile-note">
                    Seus dados de perfil são usados para personalizar sua
                    experiência no Wings.
                </p>
            </div>
        </main>
    );
}