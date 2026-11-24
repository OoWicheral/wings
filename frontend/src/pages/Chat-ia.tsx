import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../service/api";
import {
    createChat,
    deleteMessage,
    listChats,
    listMessages,
    sendMessage,
    updateMessage,
} from "../service/chat";
import type { AiChat, AiMessage } from "../type/Chat";

import "./Chat-ia.css";

/* Limite do titulo: coluna chat_ia.titulo_chat_ia e VARCHAR(50). */
const MAX_TITLE_LENGTH = 50;
/* Limite do texto: coluna mensagens_ia.conteudo_msg e VARCHAR(1000). */
const MAX_MESSAGE_LENGTH = 1000;

function readError(error: unknown, fallback: string) {
    if (error instanceof ApiError) {
        if (error.status === 401) {
            return "Sua sessao expirou. Entre novamente.";
        }

        const firstField = error.errors
            ? Object.values(error.errors)[0]?.[0]
            : undefined;

        return firstField ?? error.message ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
}

function IconPanel() {
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
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
        </svg>
    );
}

function IconEdit() {
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
            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.4 2.6a2 2 0 1 1 2.8 2.8L12 14.6l-4 1 1-4Z" />
        </svg>
    );
}

function IconHome() {
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
            <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            <path d="M9 22V12h6v10" />
        </svg>
    );
}

function IconCommunity() {
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 4v16" />
            <path d="M4 12h16" />
        </svg>
    );
}

function IconSearch() {
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
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
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

function IconMic() {
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
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <path d="M12 19v3" />
        </svg>
    );
}

function IconArrowUp() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
        </svg>
    );
}

function IconCopy() {
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
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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

function IconTrash() {
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
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
        </svg>
    );
}

interface ChatComposerProps {
    multiline?: boolean;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
}

function ChatComposer({
    multiline = false,
    value,
    onChange,
    onSubmit,
    disabled = false,
}: ChatComposerProps) {
    if (multiline) {
        return (
            <form className="chat-composer chat-composer--multiline" onSubmit={onSubmit}>
                <textarea
                    className="chat-composer-textarea"
                    placeholder="Diga ao Caco"
                    rows={2}
                    aria-label="Mensagem para o Caco"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    maxLength={MAX_MESSAGE_LENGTH}
                    disabled={disabled}
                />

                <div className="chat-composer-bottom">
                    <button
                        type="button"
                        className="chat-composer-add"
                        aria-label="Adicionar anexo"
                        title="Anexos em breve"
                        disabled
                    >
                        <IconPlus />
                    </button>

                    <div className="chat-composer-actions">
                        <button
                            type="button"
                            className="chat-composer-mic"
                            aria-label="Gravar áudio"
                            title="Áudio em breve"
                            disabled
                        >
                            <IconMic />
                        </button>

                        <button
                            type="submit"
                            className="chat-composer-send"
                            aria-label="Enviar mensagem"
                            disabled={disabled}
                        >
                            <IconArrowUp />
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <form className="chat-composer" onSubmit={onSubmit}>
            <button
                type="button"
                className="chat-composer-add"
                aria-label="Adicionar anexo"
                title="Anexos em breve"
                disabled
            >
                <IconPlus />
            </button>

            <input
                type="text"
                className="chat-composer-input"
                placeholder="Diga ao Caco"
                aria-label="Mensagem para o Caco"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={disabled}
            />

            <div className="chat-composer-actions">
                <button
                    type="button"
                    className="chat-composer-mic"
                    aria-label="Gravar áudio"
                    title="Áudio em breve"
                    disabled
                >
                    <IconMic />
                </button>

                <button
                    type="submit"
                    className="chat-composer-send"
                    aria-label="Enviar mensagem"
                    disabled={disabled}
                >
                    <IconArrowUp />
                </button>
            </div>
        </form>
    );
}

export default function ChatIA() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    /* Conversas */
    const [chats, setChats] = useState<AiChat[]>([]);
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [isLoadingChats, setIsLoadingChats] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    /* Mensagens */
    const [messages, setMessages] = useState<AiMessage[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSending, setIsSending] = useState(false);

    /* Editar mensagem */
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingDraft, setEditingDraft] = useState("");

    /* Interface */
    const [draft, setDraft] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [search, setSearch] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const threadRef = useRef<HTMLDivElement>(null);

    /* ---------- Efeitos ---------- */

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [authLoading, user, navigate]);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        void (async () => {
            setIsLoadingChats(true);

            try {
                const list = await listChats();
                if (cancelled) return;

                setChats(list);
            } catch (error) {
                if (cancelled) return;

                setErrorMessage(
                    readError(error, "Nao foi possivel carregar suas conversas.")
                );
            } finally {
                if (!cancelled) setIsLoadingChats(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user]);

    useEffect(() => {
        if (activeChatId === null) return;

        let cancelled = false;

        void (async () => {
            setIsLoadingMessages(true);

            try {
                const page = await listMessages(activeChatId);
                if (cancelled) return;

                /* O backend entrega da mais nova para a mais antiga. */
                const fetched = [...page.data].reverse();
                const fetchedIds = new Set(
                    fetched.map((message) => message.id_msg)
                );

                /* Preserva o que entrou na tela enquanto o fetch estava em voo. */
                setMessages((prev) => [
                    ...fetched,
                    ...prev.filter((message) => !fetchedIds.has(message.id_msg)),
                ]);

                setNextCursor(page.meta.next_cursor);
            } catch (error) {
                if (cancelled) return;

                setErrorMessage(
                    readError(error, "Nao foi possivel carregar as mensagens.")
                );
            } finally {
                if (!cancelled) setIsLoadingMessages(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [activeChatId]);

    /* Mantem a conversa sempre ancorada na ultima mensagem. */
    useEffect(() => {
        const node = threadRef.current;
        if (!node) return;

        node.scrollTop = node.scrollHeight;
    }, [messages, isSending]);

    /* ---------- Conversas ---------- */

    const visibleChats = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return chats;

        return chats.filter((chat) => chat.title.toLowerCase().includes(term));
    }, [chats, search]);

    function handleSelectChat(chatId: number) {
        if (chatId === activeChatId) return;

        setActiveChatId(chatId);
        setMessages([]);
        setNextCursor(null);
        setEditingId(null);
        setEditingDraft("");
        setErrorMessage("");
    }

    function handleNewChat() {
        setActiveChatId(null);
        setMessages([]);
        setNextCursor(null);
        setEditingId(null);
        setEditingDraft("");
        setErrorMessage("");
    }

    /* ---------- Mensagens ---------- */

    async function handleSend(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const prompt = draft.trim();

        if (!prompt || isSending || isCreating) return;

        setErrorMessage("");

        let chatId = activeChatId;
        let tempId: number | null = null;

        try {
            /* Sem conversa aberta: cria uma usando o proprio texto como titulo. */
            if (chatId === null) {
                setIsCreating(true);

                const chat = await createChat(prompt.slice(0, MAX_TITLE_LENGTH));

                chatId = chat.chat_id;
                setChats((prev) => [chat, ...prev]);
                setActiveChatId(chat.chat_id);
                setMessages([]);
            }

            setIsSending(true);
            setDraft("");

            /* Mensagem otimista: aparece na hora, antes da resposta da IA. */
            tempId = -Date.now();

            const optimistic: AiMessage = {
                id_msg: tempId,
                content: prompt,
                is_user: "usuario",
                created_at: new Date().toISOString(),
            };

            setMessages((prev) => [...prev, optimistic]);

            const response = await sendMessage(chatId, prompt);

            setMessages((prev) => [
                ...prev.filter((message) => message.id_msg !== tempId),
                response.user_message,
                response.ai_message,
            ]);
        } catch (error) {
            if (tempId !== null) {
                setMessages((prev) =>
                    prev.filter((message) => message.id_msg !== tempId)
                );
            }

            setDraft(prompt);

            setErrorMessage(
                readError(error, "Nao foi possivel enviar a mensagem.")
            );
        } finally {
            setIsSending(false);
            setIsCreating(false);
        }
    }

    async function handleLoadMore() {
        if (!activeChatId || !nextCursor || isLoadingMore) return;

        setIsLoadingMore(true);

        try {
            const page = await listMessages(activeChatId, nextCursor);

            /* A pagina seguinte traz as mensagens mais antigas. */
            setMessages((prev) => [...[...page.data].reverse(), ...prev]);
            setNextCursor(page.meta.next_cursor);
        } catch (error) {
            setErrorMessage(
                readError(error, "Nao foi possivel carregar mais mensagens.")
            );
        } finally {
            setIsLoadingMore(false);
        }
    }

    async function handleCopy(content: string) {
        try {
            await navigator.clipboard.writeText(content);
        } catch {
            /* Área de transferência indisponível. */
        }
    }

    function handleStartEdit(message: AiMessage) {
        setEditingId(message.id_msg);
        setEditingDraft(message.content);
        setErrorMessage("");
    }

    function handleCancelEdit() {
        setEditingId(null);
        setEditingDraft("");
    }

    async function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (editingId === null) return;

        const content = editingDraft.trim();

        if (!content) return;

        try {
            const updated = await updateMessage(editingId, content);

            setMessages((prev) =>
                prev.map((message) =>
                    message.id_msg === editingId ? updated : message
                )
            );
            setEditingId(null);
            setEditingDraft("");
        } catch (error) {
            setErrorMessage(
                readError(error, "Nao foi possivel atualizar a mensagem.")
            );
        }
    }

    async function handleDeleteMessage(messageId: number) {
        try {
            await deleteMessage(messageId);

            setMessages((prev) =>
                prev.filter((message) => message.id_msg !== messageId)
            );
            setEditingId(null);
            setEditingDraft("");
        } catch (error) {
            setErrorMessage(
                readError(error, "Nao foi possivel excluir a mensagem.")
            );
        }
    }

    const hasConversation = activeChatId !== null;
    const isBusy = isSending || isCreating;

    return (
        <div className="chat-page">
            <aside
                className={`chat-sidebar ${
                    sidebarCollapsed ? "chat-sidebar--collapsed" : ""
                }`}
            >
                <div className="chat-sidebar-top">
                    <Link to="/" className="chat-logo" aria-label="Wings - Início">
                        <img
                            src="/logo.svg"
                            alt=""
                            className="chat-logo-mark"
                        />
                        <span className="chat-logo-text">WINGS</span>
                    </Link>

                    <button
                        type="button"
                        className="chat-collapse-button"
                        aria-label={
                            sidebarCollapsed ? "Expandir menu" : "Recolher menu"
                        }
                        aria-expanded={!sidebarCollapsed}
                        onClick={() => setSidebarCollapsed((value) => !value)}
                    >
                        <IconPanel />
                    </button>
                </div>

                <nav className="chat-nav" aria-label="Menu do assistente">
                    <button
                        type="button"
                        className="chat-new-chat"
                        onClick={handleNewChat}
                        disabled={isCreating}
                    >
                        <IconEdit />
                        <span className="chat-nav-label">Nova Conversa</span>
                    </button>

                    <Link to="/" className="chat-nav-item">
                        <IconHome />
                        <span className="chat-nav-label">Home</span>
                    </Link>

                    <Link to="/comunidade" className="chat-nav-item">
                        <IconCommunity />
                        <span className="chat-nav-label">Comunidade</span>
                    </Link>

                    <Link to="/profissionais" className="chat-nav-item">
                        <IconPlus />
                        <span className="chat-nav-label">Profissionais</span>
                    </Link>
                </nav>

                <div className="chat-search">
                    <IconSearch />
                    <input
                        type="search"
                        placeholder="Pesquisar Conversa"
                        aria-label="Pesquisar conversa"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="chat-history">
                    <p className="chat-history-title">Conversas</p>

                    <div className="chat-history-list">
                        {isLoadingChats && (
                            <p className="chat-history-empty">Carregando...</p>
                        )}

                        {!isLoadingChats && visibleChats.length === 0 && (
                            <p className="chat-history-empty">
                                {search.trim()
                                    ? "Nenhuma conversa encontrada."
                                    : "Voce ainda nao tem conversas."}
                            </p>
                        )}

                        {visibleChats.map((chat) => (
                            <button
                                key={chat.chat_id}
                                type="button"
                                className={`chat-history-item ${
                                    activeChatId === chat.chat_id
                                        ? "chat-history-item--active"
                                        : ""
                                }`}
                                onClick={() => handleSelectChat(chat.chat_id)}
                            >
                                {chat.title}
                            </button>
                        ))}
                    </div>
                </div>

                <Link
                    to="/perfil"
                    className="chat-user"
                    aria-label="Abrir meu perfil"
                >
                    <span className="chat-user-avatar">
                        <IconUser />
                    </span>
                    <span className="chat-user-name">
                        {user?.name ?? "Nome usuário"}
                    </span>
                </Link>
            </aside>

            <main
                className={`chat-main ${
                    hasConversation ? "chat-main--conversation" : ""
                }`}
            >
                {hasConversation ? (
                    <>
                        <div className="chat-thread" ref={threadRef}>
                            {nextCursor && (
                                <button
                                    type="button"
                                    className="chat-thread-more"
                                    onClick={() => void handleLoadMore()}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore
                                        ? "Carregando..."
                                        : "Carregar mensagens anteriores"}
                                </button>
                            )}

                            {isLoadingMessages && (
                                <p className="chat-thread-status">
                                    Carregando mensagens...
                                </p>
                            )}

                            {messages.map((message) => {
                                const isUser = message.is_user === "usuario";
                                const isEditing = editingId === message.id_msg;

                                if (isUser) {
                                    return (
                                        <div
                                            key={message.id_msg}
                                            className="chat-message chat-message--user"
                                        >
                                            {isEditing ? (
                                                <form
                                                    className="chat-message-edit"
                                                    onSubmit={handleSaveEdit}
                                                >
                                                    <textarea
                                                        className="chat-message-edit-input"
                                                        value={editingDraft}
                                                        onChange={(event) =>
                                                            setEditingDraft(
                                                                event.target.value
                                                            )
                                                        }
                                                        rows={3}
                                                        maxLength={
                                                            MAX_MESSAGE_LENGTH
                                                        }
                                                        aria-label="Editar mensagem"
                                                        autoFocus
                                                    />

                                                    <div className="chat-message-edit-actions">
                                                        <button
                                                            type="submit"
                                                            className="chat-message-edit-save"
                                                        >
                                                            Salvar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                handleCancelEdit
                                                            }
                                                        >
                                                            Cancelar
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="chat-message-edit-delete"
                                                            onClick={() =>
                                                                void handleDeleteMessage(
                                                                    message.id_msg
                                                                )
                                                            }
                                                            aria-label="Excluir mensagem"
                                                        >
                                                            <IconTrash />
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <div className="chat-user-bubble">
                                                    {message.content}
                                                </div>
                                            )}

                                            {!isEditing && (
                                                <div className="chat-message-actions">
                                                    <button
                                                        type="button"
                                                        aria-label="Copiar mensagem"
                                                        onClick={() =>
                                                            void handleCopy(
                                                                message.content
                                                            )
                                                        }
                                                    >
                                                        <IconCopy />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label="Editar mensagem"
                                                        onClick={() =>
                                                            handleStartEdit(
                                                                message
                                                            )
                                                        }
                                                    >
                                                        <IconPencil />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={message.id_msg}
                                        className="chat-message chat-message--assistant"
                                    >
                                        <p className="chat-assistant-text">
                                            {message.content}
                                        </p>

                                        <div className="chat-message-actions">
                                            <button
                                                type="button"
                                                aria-label="Copiar resposta"
                                                onClick={() =>
                                                    void handleCopy(message.content)
                                                }
                                            >
                                                <IconCopy />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {isSending && (
                                <div className="chat-message chat-message--assistant">
                                    <p
                                        className="chat-assistant-text chat-typing"
                                        aria-label="Caco esta digitando"
                                    >
                                        <span />
                                        <span />
                                        <span />
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="chat-composer-area">
                            {errorMessage && (
                                <p className="chat-error" role="alert">
                                    {errorMessage}
                                </p>
                            )}

                            <ChatComposer
                                multiline
                                value={draft}
                                onChange={setDraft}
                                onSubmit={(event) => void handleSend(event)}
                                disabled={isBusy}
                            />
                        </div>
                    </>
                ) : (
                    <div className="chat-empty">
                        <h1 className="chat-empty-title">
                            Pronto para te ouvir.
                        </h1>

                        {errorMessage && (
                            <p className="chat-error" role="alert">
                                {errorMessage}
                            </p>
                        )}

                        <ChatComposer
                            value={draft}
                            onChange={setDraft}
                            onSubmit={(event) => void handleSend(event)}
                            disabled={isBusy}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
