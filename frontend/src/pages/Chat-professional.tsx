import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ChatComposer from "../components/ChatComposer";
import {
    IconCommunity,
    IconCopy,
    IconEdit,
    IconHome,
    IconPanel,
    IconPencil,
    IconPlus,
    IconSearch,
    IconTrash,
    IconUser,
} from "../components/ChatIcons";
import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../service/api";
import {
    deleteProfessionalMessage,
    listProfessionalChats,
    listProfessionalMessages,
    openProfessionalMessageFile,
    sendProfessionalMessage,
    updateProfessionalMessage,
} from "../service/professional-chat";
import { avatarUrl } from "../utils/format";
import type {
    ProfessionalChat,
    ProfessionalMessage,
} from "../type/ProfessionalChat";

import "./Chat-ia.css";
import "./Chat-professional.css";

/* Limite do texto: coluna mensagem_chat_profissional.conteudo_msg é VARCHAR(1000). */
const MAX_MESSAGE_LENGTH = 1000;

function readError(error: unknown, fallback: string) {
    if (error instanceof ApiError) {
        if (error.status === 401) {
            return "Sua sessão expirou. Entre novamente.";
        }

        if (error.status === 403) {
            return "Você não participa desta conversa.";
        }

        const firstField = error.errors
            ? Object.values(error.errors)[0]?.[0]
            : undefined;

        return firstField ?? error.message ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
}

export default function ChatProfessional() {
    const { user, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId: string }>();

    /* O :chatId da URL é a fonte da conversa aberta. */
    const activeChatId =
        chatId && /^\d+$/.test(chatId) ? Number(chatId) : null;

    /* Conversas */
    const [chats, setChats] = useState<ProfessionalChat[]>([]);
    const [isLoadingChats, setIsLoadingChats] = useState(true);

    /* Mensagens */
    const [messages, setMessages] = useState<ProfessionalMessage[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSending, setIsSending] = useState(false);

    /* Edição */
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingDraft, setEditingDraft] = useState("");

    /* Interface */
    const [draft, setDraft] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
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

    /* Lista de conversas */
    useEffect(() => {
        if (!user) return;

        let cancelled = false;

        void (async () => {
            setIsLoadingChats(true);

            try {
                const list = await listProfessionalChats();
                if (cancelled) return;

                setChats(list);
            } catch (error) {
                if (cancelled) return;

                setErrorMessage(
                    readError(error, "Não foi possível carregar suas conversas.")
                );
            } finally {
                if (!cancelled) setIsLoadingChats(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user, activeChatId]);

    /* Mensagens da conversa aberta */
    useEffect(() => {
        if (activeChatId === null) return;

        let cancelled = false;

        void (async () => {
            setIsLoadingMessages(true);
            setEditingId(null);
            setEditingDraft("");
            setDraft("");
            setAttachment(null);
            setErrorMessage("");

            /* Troca de conversa: limpa a anterior antes de buscar a nova. */
            setMessages([]);
            setNextCursor(null);

            try {
                const page = await listProfessionalMessages(activeChatId);
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
                    readError(error, "Não foi possível carregar as mensagens.")
                );
            } finally {
                if (!cancelled) setIsLoadingMessages(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [activeChatId]);

    /*
      Mantém a conversa ancorada na última mensagem. O gatilho é o id da última
      mensagem, e não o array inteiro: ao carregar mensagens antigas (que entram
      no topo) o id final não muda, então a leitura não pula para o fim.
    */
    const lastMessageId = messages.length
        ? messages[messages.length - 1].id_msg
        : null;

    useEffect(() => {
        const node = threadRef.current;
        if (!node || lastMessageId === null) return;

        node.scrollTop = node.scrollHeight;
    }, [lastMessageId, isSending]);

    /* ---------- Conversas ---------- */

    const activeChat = useMemo(
        () => chats.find((chat) => chat.chat_id === activeChatId) ?? null,
        [chats, activeChatId]
    );

    const visibleChats = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return chats;

        return chats.filter((chat) =>
            (chat.participant.name ?? "").toLowerCase().includes(term)
        );
    }, [chats, search]);

    function handleSelectChat(id: number) {
        if (id === activeChatId) return;

        navigate(`/chat-profissional/${id}`);
    }

    /* ---------- Mensagens ---------- */

    async function handleSend(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (activeChatId === null) return;

        const content = draft.trim();

        if ((!content && !attachment) || isSending) return;

        setIsSending(true);
        setErrorMessage("");
        setDraft("");

        /* Mensagem otimista: aparece na hora, antes da resposta do servidor. */
        const tempId = -Date.now();

        const optimistic: ProfessionalMessage = {
            id_msg: tempId,
            content: content || null,
            id_usuario: user?.id ?? null,
            id_chat_profissional: activeChatId,
            created_at: new Date().toISOString(),
            updated_at: null,
            anexo_url: attachment ? "pending" : null,
            audio_url: null,
        };

        setMessages((prev) => [...prev, optimistic]);

        try {
            const saved = await sendProfessionalMessage(activeChatId, content, attachment);

            setMessages((prev) => [
                ...prev.filter((message) => message.id_msg !== tempId),
                saved,
            ]);
            setAttachment(null);

            setChats((prev) =>
                prev.map((chat) =>
                    chat.chat_id === activeChatId
                        ? {
                              ...chat,
                              last_message: {
                                  content: saved.content,
                                  anexo_url: saved.anexo_url,
                                  created_at: saved.created_at,
                              },
                          }
                        : chat
                )
            );
        } catch (error) {
            setMessages((prev) =>
                prev.filter((message) => message.id_msg !== tempId)
            );
            setDraft(content);

            setErrorMessage(
                readError(error, "Não foi possível enviar a mensagem.")
            );
        } finally {
            setIsSending(false);
        }
    }

    async function handleLoadMore() {
        if (activeChatId === null || !nextCursor || isLoadingMore) return;

        setIsLoadingMore(true);

        try {
            const page = await listProfessionalMessages(
                activeChatId,
                nextCursor
            );

            /* A página seguinte traz as mensagens mais antigas. */
            setMessages((prev) => [...[...page.data].reverse(), ...prev]);
            setNextCursor(page.meta.next_cursor);
        } catch (error) {
            setErrorMessage(
                readError(error, "Não foi possível carregar mais mensagens.")
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

    async function handleOpenAttachment(url: string) {
        try {
            const objectUrl = await openProfessionalMessageFile(url);
            window.open(objectUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            setErrorMessage(readError(error, "Não foi possível abrir o anexo."));
        }
    }

    function handleStartEdit(message: ProfessionalMessage) {
        setEditingId(message.id_msg);
        setEditingDraft(message.content ?? "");
        setErrorMessage("");
    }

    function handleCancelEdit() {
        setEditingId(null);
        setEditingDraft("");
    }

    async function handleSaveEdit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (activeChatId === null || editingId === null) return;

        const content = editingDraft.trim();

        if (!content) return;

        try {
            const updated = await updateProfessionalMessage(
                activeChatId,
                editingId,
                content
            );

            setMessages((prev) =>
                prev.map((message) =>
                    message.id_msg === editingId ? updated : message
                )
            );
            setEditingId(null);
            setEditingDraft("");
        } catch (error) {
            setErrorMessage(
                readError(error, "Não foi possível atualizar a mensagem.")
            );
        }
    }

    async function handleDeleteMessage(messageId: number) {
        if (activeChatId === null) return;

        try {
            await deleteProfessionalMessage(activeChatId, messageId);

            setMessages((prev) =>
                prev.filter((message) => message.id_msg !== messageId)
            );
            setEditingId(null);
            setEditingDraft("");
        } catch (error) {
            setErrorMessage(
                readError(error, "Não foi possível excluir a mensagem.")
            );
        }
    }

    const hasConversation = activeChatId !== null;
    const participantName = activeChat?.participant.name ?? "Profissional";
    const participantAvatar = avatarUrl(activeChat?.participant.avatar);

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

                <nav className="chat-nav" aria-label="Menu do chat">
                    <Link to="/chat-profissional" className="chat-nav-item" aria-current={!hasConversation ? "page" : undefined}>
                        <IconUser />
                        <span className="chat-nav-label">Conversas</span>
                    </Link>

                    <Link to="/profissionais" className="chat-new-chat">
                        <IconEdit />
                        <span className="chat-nav-label">Nova Conversa</span>
                    </Link>

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
                                    : "Você ainda não tem conversas."}
                            </p>
                        )}

                        {visibleChats.map((chat) => {
                            const avatar = avatarUrl(chat.participant.avatar);

                            return (
                                <button
                                    key={chat.chat_id}
                                    type="button"
                                    className={`chat-history-item pro-conv ${
                                        activeChatId === chat.chat_id
                                            ? "chat-history-item--active"
                                            : ""
                                    }`}
                                    onClick={() => handleSelectChat(chat.chat_id)}
                                >
                                    <span className="pro-conv-avatar">
                                        {avatar ? (
                                            <img src={avatar} alt="" />
                                        ) : (
                                            <IconUser />
                                        )}
                                    </span>

                                    <span className="pro-conv-text">
                                        <span className="pro-conv-name">
                                            {chat.participant.name ??
                                                "Profissional"}
                                        </span>
                                        <span className="pro-conv-preview">
                                            {chat.last_message?.content ??
                                                (chat.last_message?.anexo_url ? "Anexo enviado" : "Sem mensagens ainda")}
                                        </span>
                                    </span>
                                </button>
                            );
                        })}
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
                        <header className="pro-thread-header">
                            <span className="pro-thread-avatar">
                                {participantAvatar ? (
                                    <img src={participantAvatar} alt="" />
                                ) : (
                                    <IconUser />
                                )}
                            </span>

                            <div className="pro-thread-text">
                                <p className="pro-thread-name">
                                    {participantName}
                                </p>
                                <p className="pro-thread-sub">
                                    Conversa com profissional
                                </p>
                            </div>
                        </header>

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

                            {!isLoadingMessages && messages.length === 0 && !errorMessage && (
                                <p className="chat-thread-status">
                                    Nenhuma mensagem ainda. Diga olá.
                                </p>
                            )}

                            {messages.map((message) => {
                                const isMine =
                                    message.id_usuario !== null &&
                                    message.id_usuario === user?.id;
                                const isEditing = editingId === message.id_msg;
                                const content = message.content ?? "";

                                if (isMine) {
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
                                                    {content || (message.anexo_url ? "Anexo enviado" : "")}
                                                </div>
                                            )}

                                            {message.anexo_url && message.anexo_url !== "pending" && (
                                                <button type="button" className="pro-message-attachment" onClick={() => void handleOpenAttachment(message.anexo_url!)}>
                                                    Abrir anexo
                                                </button>
                                            )}

                                            {!isEditing && (
                                                <div className="chat-message-actions">
                                                    <button
                                                        type="button"
                                                        aria-label="Copiar mensagem"
                                                        onClick={() =>
                                                            void handleCopy(content)
                                                        }
                                                    >
                                                        <IconCopy />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        aria-label="Editar mensagem"
                                                        onClick={() =>
                                                            handleStartEdit(message)
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
                                            {content || "Anexo enviado"}
                                        </p>

                                        {message.anexo_url && (
                                            <button type="button" className="pro-message-attachment" onClick={() => void handleOpenAttachment(message.anexo_url!)}>
                                                Abrir anexo
                                            </button>
                                        )}

                                        {content && (
                                            <div className="chat-message-actions">
                                                <button
                                                    type="button"
                                                    aria-label="Copiar mensagem"
                                                    onClick={() =>
                                                        void handleCopy(content)
                                                    }
                                                >
                                                    <IconCopy />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
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
                                disabled={isSending}
                                placeholder={`Mensagem para ${participantName}`}
                                ariaLabel={`Mensagem para ${participantName}`}
                                maxLength={MAX_MESSAGE_LENGTH}
                                attachment={attachment}
                                onAttachmentChange={setAttachment}
                            />
                        </div>
                    </>
                ) : (
                    <section className="pro-inbox">
                        <header className="pro-inbox-heading">
                            <div>
                                <p>WINGS · APOIO PROFISSIONAL</p>
                                <h1>Suas conversas</h1>
                                <span>Acesse aqui as conversas iniciadas com os profissionais.</span>
                            </div>
                            <Link to="/profissionais">Encontrar profissionais</Link>
                        </header>

                        {errorMessage && (
                            <p className="chat-error" role="alert">
                                {errorMessage}
                            </p>
                        )}

                        {isLoadingChats ? (
                            <p className="pro-inbox-empty">Carregando suas conversas…</p>
                        ) : visibleChats.length ? (
                            <div className="pro-inbox-list">
                                {visibleChats.map((chat) => {
                                    const chatAvatar = avatarUrl(chat.participant.avatar);
                                    return (
                                        <button key={chat.chat_id} type="button" className="pro-inbox-card" onClick={() => handleSelectChat(chat.chat_id)}>
                                            <span className="pro-conv-avatar">{chatAvatar ? <img src={chatAvatar} alt="" /> : <IconUser />}</span>
                                            <span className="pro-inbox-card-copy">
                                                <strong>{chat.participant.name ?? "Profissional"}</strong>
                                                <span>{chat.last_message?.content ?? (chat.last_message?.anexo_url ? "Anexo enviado" : "Conversa iniciada. Envie uma mensagem para começar.")}</span>
                                            </span>
                                            <span className="pro-inbox-card-arrow">›</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="pro-inbox-empty">
                                <span className="pro-inbox-empty-icon"><IconUser /></span>
                                <h2>Suas conversas aparecerão aqui</h2>
                                <p>Quando iniciar uma conversa com um profissional, você poderá acompanhar tudo nesta tela.</p>
                                <Link to="/profissionais">Ver profissionais</Link>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
