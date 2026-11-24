import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import AppSidebar from "../components/AppSidebar";
import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../service/api";
import { createComment, createPost, getAuthor, getComments, getFeed, getProfessionals } from "../service/community";
import { avatarUrl, formatRelativeTime } from "../utils/format";
import type { Comment, Publication } from "../type/Community";

import "./Community.css";



type FeedStatus = "loading" | "ready" | "error";


const USE_DEMO_FEED = false;

const DEMO_POSTS: Publication[] = [
    {
        id: 2,
        userId: 2,
        author: { userId: 2, name: "Marina Alves", avatar: null },
        title: "Um passo de cada vez",
        content: "Ai que não sei oq não sei oq la hahaha",
        image: null,
        createdAt: "2026-11-20T10:45:00",
        updatedAt: "2026-11-20T10:45:00",
        statusPost: "ativo",
    },
    {
        id: 1,
        userId: 1,
        author: { userId: 1, name: "Marco Rubio", avatar: null },
        title: "Primeira semana",
        content: "Ai que não sei oq não sei oq la",
        image: null,
        createdAt: "2026-11-20T10:10:00",
        updatedAt: "2026-11-20T10:10:00",
        statusPost: "ativo",
    },
];

interface ProfessionalCard {
    id: number;
    name: string;
    avatar: string | null;
    registration: string | null;
}

const DEMO_PROFESSIONALS: ProfessionalCard[] = [
    { id: 1, name: "Profissional", avatar: null, registration: null },
    { id: 2, name: "Profissional", avatar: null, registration: null },
    { id: 3, name: "Profissional", avatar: null, registration: null },
];

function IconSearch() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );
}

function IconArrowRight() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

function IconDots() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" focusable="false">
            <circle cx="5" cy="12" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
        </svg>
    );
}

function IconComment() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
    );
}

function IconMessage() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.8L3 21l1.9-4.6A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
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

function CommentPanel({ postId, onCreated }: { postId: number; onCreated: () => void }) {
    const [status, setStatus] = useState<FeedStatus>("loading");
    const [comments, setComments] = useState<Comment[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [moreError, setMoreError] = useState("");
    const [reloadToken, setReloadToken] = useState(0);

    const [draft, setDraft] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState("");

    useEffect(() => {
        let cancelled = false;

        void (async () => {
            setStatus("loading");

            try {
                const page = await getComments(postId);
                if (cancelled) return;

                setComments(page.data);
                setNextCursor(page.next_cursor);
                setStatus("ready");
            } catch (error) {
                if (cancelled) return;

                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível carregar os comentários."
                );
                setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [postId, reloadToken]);

    async function handleLoadMore() {
        if (!nextCursor || isLoadingMore) return;

        setIsLoadingMore(true);
        setMoreError("");

        try {
            const page = await getComments(postId, nextCursor);

            setComments((prev) => [...prev, ...page.data]);
            setNextCursor(page.next_cursor);
        } catch (error) {
            setMoreError(
                error instanceof Error
                    ? error.message
                    : "Não foi possível carregar mais comentários."
            );
        } finally {
            setIsLoadingMore(false);
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmed = draft.trim();

        if (!trimmed) {
            setSendError("Escreva um comentário.");
            return;
        }

        setIsSending(true);
        setSendError("");

        try {
            const created = await createComment(postId, trimmed);

            setComments((prev) => [created, ...prev]);
            setDraft("");
            onCreated();
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                const firstField = Object.values(error.errors)[0];
                setSendError(firstField?.[0] ?? error.message);
            } else {
                setSendError(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível enviar o comentário."
                );
            }
        } finally {
            setIsSending(false);
        }
    }

    return (
        <section className="community-comments" id={`comments-${postId}`}>
            <form className="community-comment-form" onSubmit={handleSubmit} noValidate>
                <input
                    type="text"
                    className="community-comment-input"
                    placeholder="Escreva um comentário…"
                    aria-label="Escreva um comentário"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={150}
                    disabled={isSending}
                />

                <button
                    type="submit"
                    className="community-comment-send"
                    disabled={isSending}
                >
                    {isSending ? "Enviando..." : "Enviar"}
                </button>
            </form>

            {sendError && (
                <p className="community-error" role="alert">
                    {sendError}
                </p>
            )}

            {status === "loading" && (
                <p className="community-comment-feedback">Carregando comentários…</p>
            )}

            {status === "error" && (
                <div className="community-comment-feedback">
                    <p>{errorMessage}</p>
                    <button
                        type="button"
                        className="community-retry"
                        onClick={() => setReloadToken((token) => token + 1)}
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {status === "ready" && comments.length === 0 && (
                <p className="community-comment-feedback">
                    Nenhum comentário ainda. Seja a primeira pessoa a comentar.
                </p>
            )}

            {comments.length > 0 && (
                <ul className="community-comment-list">
                    {comments.map((comment) => {
                        const authorName = comment.author?.name || "Usuário";
                        const avatar = avatarUrl(comment.author?.avatar);

                        return (
                            <li key={comment.id} className="community-comment">
                                <span
                                    className="community-comment-avatar"
                                    aria-hidden="true"
                                >
                                    {avatar ? (
                                        <img src={avatar} alt="" />
                                    ) : (
                                        authorName.charAt(0).toUpperCase()
                                    )}
                                </span>

                                <div className="community-comment-body">
                                    <div className="community-comment-head">
                                        <strong>{authorName}</strong>
                                        <span>{formatRelativeTime(comment.createdAt)}</span>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {moreError && (
                <p className="community-error" role="alert">
                    {moreError}
                </p>
            )}

            {nextCursor && (
                <button
                    type="button"
                    className="community-comment-more"
                    onClick={() => void handleLoadMore()}
                    disabled={isLoadingMore}
                >
                    {isLoadingMore ? "Carregando..." : "Ver mais comentários"}
                </button>
            )}
        </section>
    );
}

export default function Community() {
    const { user } = useAuth();

    const [status, setStatus] = useState<FeedStatus>("loading");
    const [posts, setPosts] = useState<Publication[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [reloadToken, setReloadToken] = useState(0);

    const [search, setSearch] = useState("");
    const [activeSearch, setActiveSearch] = useState("");

    const [openCommentsId, setOpenCommentsId] = useState<number | null>(null);

    const [professionals, setProfessionals] = useState<ProfessionalCard[]>([]);

    // Composer
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishError, setPublishError] = useState("");


    useEffect(() => {
        const timer = setTimeout(() => {
            setActiveSearch(search.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (USE_DEMO_FEED) {
            setPosts(DEMO_POSTS);
            setNextCursor(null);
            setStatus("ready");
            return;
        }

        let cancelled = false;
        setStatus("loading");
        setOpenCommentsId(null);

        void (async () => {
            try {
                const page = await getFeed(null, activeSearch);
                if (cancelled) return;

                setPosts(page.data);
                setNextCursor(page.next_cursor);
                setStatus("ready");
            } catch (error) {
                if (cancelled) return;

                if (error instanceof ApiError && error.status === 401) {
                    setErrorMessage("Sua sessão expirou. Entre novamente.");
                } else {
                    setErrorMessage(
                        error instanceof Error
                            ? error.message
                            : "Não foi possível carregar a comunidade."
                    );
                }

                setStatus("error");
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [reloadToken, activeSearch]);


    useEffect(() => {
        if (USE_DEMO_FEED) {
            setProfessionals(DEMO_PROFESSIONALS);
            return;
        }

        let cancelled = false;

        void (async () => {
            try {
                const list = await getProfessionals();
                const firstThree = list.slice(0, 3);

                const cards = await Promise.all(
                    firstThree.map(async (professional) => {
                        const registration =
                            professional.crpRegion && professional.crpNumber
                                ? `CRP ${professional.crpRegion}/${professional.crpNumber}`
                                : null;

                        try {
                            const author = await getAuthor(professional.id);

                            return {
                                id: professional.id,
                                name: author.name,
                                avatar: author.avatar,
                                registration,
                            };
                        } catch {
                            return {
                                id: professional.id,
                                name: "Profissional",
                                avatar: null,
                                registration,
                            };
                        }
                    })
                );

                if (!cancelled) setProfessionals(cards);
            } catch {

            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);


    async function handleLoadMore() {
        if (!nextCursor || isLoadingMore) return;

        setIsLoadingMore(true);

        try {
            const page = await getFeed(nextCursor, activeSearch);

            setPosts((prev) => [...prev, ...page.data]);
            setNextCursor(page.next_cursor);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Não foi possível carregar mais publicações."
            );
        } finally {
            setIsLoadingMore(false);
        }
    }

    async function handlePublish(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle) {
            setPublishError("Dê um título para a publicação.");
            return;
        }

        if (!trimmedContent) {
            setPublishError("Escreva o conteúdo da publicação.");
            return;
        }

        setIsPublishing(true);
        setPublishError("");

        try {
            const created = await createPost({
                title: trimmedTitle,
                content: trimmedContent,
            });


            setPosts((prev) => [created, ...prev]);
            setTitle("");
            setContent("");
        } catch (error) {
            if (error instanceof ApiError && error.errors) {
                const firstField = Object.values(error.errors)[0];
                setPublishError(firstField?.[0] ?? error.message);
            } else {
                setPublishError(
                    error instanceof Error
                        ? error.message
                        : "Não foi possível publicar."
                );
            }
        } finally {
            setIsPublishing(false);
        }
    }

    function handleCommentCreated(postId: number) {
        setPosts((prev) =>
            prev.map((post) =>
                post.id === postId
                    ? { ...post, commentsCount: (post.commentsCount ?? 0) + 1 }
                    : post
            )
        );
    }

    const firstName = user?.name?.split(" ")[0] ?? "";

    return (
        <div className="community-page">
            <AppSidebar active="comunidade" />

            <main className="community-main">
                <header className="community-header">
                    <div>
                        <h1 className="community-title">
                            Olá{firstName ? `, ${firstName}` : ", Usuário"}
                        </h1>
                        <p className="community-subtitle">Como você está hoje?</p>
                    </div>

                    <div className="community-search">
                        <IconSearch />
                        <input
                            type="search"
                            placeholder="Buscar"
                            aria-label="Buscar na comunidade"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </header>

                <section className="community-hero" aria-label="Profissionais em destaque">
                    {professionals.length > 0 && (
                        <div className="community-hero-cards">
                            {professionals.map((professional) => {
                                const avatar = avatarUrl(professional.avatar);

                                return (
                                    <article
                                        key={professional.id}
                                        className="community-pro-card"
                                    >
                                        <span className="community-pro-avatar">
                                            {avatar ? <img src={avatar} alt="" /> : <IconUser />}
                                        </span>

                                        <span className="community-pro-text">
                                            <span className="community-pro-name">
                                                {professional.name}
                                            </span>
                                            <span className="community-pro-specialty">
                                                Psicólogo
                                                {professional.registration
                                                    ? ` · ${professional.registration}`
                                                    : ""}
                                            </span>
                                        </span>

                                        {/* [LIGAR] Chat com profissional */}
                                        <button
                                            type="button"
                                            className="community-pro-chat"
                                            aria-label={`Conversar com ${professional.name}`}
                                        >
                                            <IconMessage />
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    <button
                        type="button"
                        className="community-hero-arrow"
                        aria-label="Ver todos os profissionais"
                    >
                        <IconArrowRight />
                    </button>
                </section>

                <form className="community-composer" onSubmit={handlePublish} noValidate>
                    <div className="community-composer-head">
                        <h2>Nova publicação</h2>

                        <button
                            type="button"
                            className="community-dots"
                            aria-label="Opções da publicação"
                        >
                            <IconDots />
                        </button>
                    </div>

                    <div className="community-composer-body">
                        <div className="community-composer-fields">
                            <input
                                type="text"
                                className="community-composer-title"
                                placeholder="Título da publicação"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                maxLength={50}
                                disabled={isPublishing}
                            />

                            <input
                                type="text"
                                className="community-composer-input"
                                placeholder="O que você está pensando?"
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                maxLength={500}
                                disabled={isPublishing}
                            />
                        </div>

                        <button
                            type="submit"
                            className="community-publish"
                            disabled={isPublishing}
                        >
                            {isPublishing ? "Publicando..." : "Publicar"}
                        </button>
                    </div>

                    {publishError && (
                        <p className="community-error" role="alert">
                            {publishError}
                        </p>
                    )}
                </form>

                {status === "loading" && (
                    <p className="community-feedback">Carregando publicações…</p>
                )}

                {status === "error" && (
                    <div className="community-feedback">
                        <p>{errorMessage}</p>
                        <button
                            type="button"
                            className="community-retry"
                            onClick={() => setReloadToken((token) => token + 1)}
                        >
                            Tentar novamente
                        </button>
                    </div>
                )}

                {status === "ready" && posts.length === 0 && (
                    <p className="community-feedback">
                        {activeSearch
                            ? `Nenhuma publicação encontrada para "${activeSearch}".`
                            : "Nenhuma publicação ainda. Seja a primeira pessoa a compartilhar algo."}
                    </p>
                )}

                {posts.map((post) => {
                    const author = post.author;
                    const authorName = author?.name || "Usuário";
                    const avatar = avatarUrl(author?.avatar);
                    const time = formatRelativeTime(post.createdAt);

                    const visibility =
                        post.statusPost === "ativo"
                            ? "Público"
                            : post.statusPost === "inativo"
                              ? "Inativo"
                              : "";

                    const meta = [time, visibility].filter(Boolean).join(" · ");

                    return (
                        <article key={post.id} className="community-post">
                            <header className="community-post-header">
                                <div className="community-post-author">
                                    <div className="community-post-avatar" aria-hidden="true">
                                        {avatar ? (
                                            <img src={avatar} alt="" />
                                        ) : (
                                            authorName.charAt(0).toUpperCase()
                                        )}
                                    </div>

                                    <div className="community-post-meta">
                                        <h3>{authorName}</h3>
                                        <p>{meta}</p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="community-dots"
                                    aria-label="Opções da publicação"
                                >
                                    <IconDots />
                                </button>
                            </header>

                            <div className="community-post-body">
                                {post.image && (
                                    <img
                                        className="community-post-image"
                                        src={post.image}
                                        alt=""
                                    />
                                )}

                                <h4 className="community-post-title">{post.title}</h4>
                                <p className="community-post-content">{post.content}</p>
                            </div>

                            <footer className="community-post-footer">
                                <button
                                    type="button"
                                    className="community-comment-link"
                                    aria-expanded={openCommentsId === post.id}
                                    aria-controls={`comments-${post.id}`}
                                    onClick={() =>
                                        setOpenCommentsId((current) =>
                                            current === post.id ? null : post.id
                                        )
                                    }
                                >
                                    <IconComment />
                                    {`Comentários (${post.commentsCount ?? 0})`}
                                </button>
                            </footer>

                            {openCommentsId === post.id && (
                                <CommentPanel
                                    postId={post.id}
                                    onCreated={() => handleCommentCreated(post.id)}
                                />
                            )}
                        </article>
                    );
                })}

                {nextCursor && (
                    <button
                        type="button"
                        className="community-load-more"
                        onClick={() => void handleLoadMore()}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? "Carregando..." : "Carregar mais"}
                    </button>
                )}
            </main>
        </div>
    );
}
