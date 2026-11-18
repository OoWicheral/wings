import { Link } from "react-router-dom";
import "./Chat-ia.css";

/*
  Tela estática do assistente (Figma).

  O que já está pronto aqui:
  - estrutura HTML/JSX da sidebar, do estado vazio e do estado com mensagens;
  - todos os estilos em Chat-ia.css;
  - classes pensadas para receber os estados da lógica depois.

  O que ainda NÃO existe aqui (fica para a etapa de lógica):
  - useState das mensagens, input enviado, loading e erro;
  - chamada para POST /api/chataimessage;
  - criar/listar conversas;
  - abrir/fechar a sidebar e navegar entre conversas.

  Para visualizar o estado com mensagens, troque hasConversation para true.
  Para visualizar a sidebar recolhida, troque sidebarCollapsed para true.
*/

const sidebarCollapsed = false;
const hasConversation = false;

const conversations = Array.from({ length: 14 }, (_, index) => ({
    id: String(index + 1),
    title: "Título Conversa",
}));

const activeConversationId = hasConversation ? "4" : null;

const demoMessages = [
    {
        id: "demo-1",
        role: "user" as const,
        content: "Ai que não sei oq, que não sei que lá",
    },
    {
        id: "demo-2",
        role: "assistant" as const,
        content:
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, quis, aut molestias optio aliquam dignissimos sit veritatis quibusdam nulla vel suscipit autem, possimus ullam quisquam? Nobis facere aperiam culpa quaerat. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, quis, aut molestias optio aliquam dignissimos sit veritatis quibusdam nulla vel suscipit autem, possimus ullam quisquam? Nobis facere aperiam culpa quaerat. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, quis, aut molestias optio aliquam dignissimos sit veritatis quibusdam nulla vel suscipit autem, possimus ullam quisquam? Nobis facere aperiam culpa quaerat. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, quis, aut molestias optio aliquam dignissimos sit veritatis quibusdam nulla vel suscipit autem, possimus ullam quisquam? Nobis facere aperiam culpa quaerat.",
    },
];

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
            <path d="M18.4 2.6a2 2 0 0 1 2.8 2.8L12 14.6l-4 1 1-4Z" />
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

interface ChatComposerProps {
    multiline?: boolean;
}

function ChatComposer({ multiline = false }: ChatComposerProps) {
    /*
      [LIGAR]
      Aqui entra o onSubmit de verdade: validar input, chamar o serviço
      e limpar o campo. Por enquanto o preventDefault só evita recarregar
      a página durante a visualização estática.
    */
    if (multiline) {
        return (
            <form
                className="chat-composer chat-composer--multiline"
                onSubmit={(event) => event.preventDefault()}
            >
                <textarea
                    className="chat-composer-textarea"
                    placeholder="Diga ao Caco"
                    rows={2}
                    aria-label="Mensagem para o Caco"
                />

                <div className="chat-composer-bottom">
                    <button
                        type="button"
                        className="chat-composer-add"
                        aria-label="Adicionar anexo"
                    >
                        <IconPlus />
                    </button>

                    <div className="chat-composer-actions">
                        <button
                            type="button"
                            className="chat-composer-mic"
                            aria-label="Gravar áudio"
                        >
                            <IconMic />
                        </button>

                        <button
                            type="submit"
                            className="chat-composer-send"
                            aria-label="Enviar mensagem"
                        >
                            <IconArrowUp />
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <form
            className="chat-composer"
            onSubmit={(event) => event.preventDefault()}
        >
            <button
                type="button"
                className="chat-composer-add"
                aria-label="Adicionar anexo"
            >
                <IconPlus />
            </button>

            <input
                type="text"
                className="chat-composer-input"
                placeholder="Diga ao Caco"
                aria-label="Mensagem para o Caco"
            />

            <div className="chat-composer-actions">
                <button
                    type="button"
                    className="chat-composer-mic"
                    aria-label="Gravar áudio"
                >
                    <IconMic />
                </button>

                <button
                    type="submit"
                    className="chat-composer-send"
                    aria-label="Enviar mensagem"
                >
                    <IconArrowUp />
                </button>
            </div>
        </form>
    );
}

export default function ChatIA() {
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

                    {/* [LIGAR] onClick para alternar sidebarCollapsed */}
                    <button
                        type="button"
                        className="chat-collapse-button"
                        aria-label="Recolher menu"
                    >
                        <IconPanel />
                    </button>
                </div>

                <nav className="chat-nav" aria-label="Menu do assistente">
                    {/* [LIGAR] onClick para criar uma nova conversa */}
                    <button type="button" className="chat-new-chat">
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
                    />
                </div>

                <div className="chat-history">
                    <p className="chat-history-title">Conversas</p>

                    <div className="chat-history-list">
                        {conversations.map((conversation) => (
                            <button
                                key={conversation.id}
                                type="button"
                                className={`chat-history-item ${
                                    activeConversationId === conversation.id
                                        ? "chat-history-item--active"
                                        : ""
                                }`}
                            >
                                {conversation.title}
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
                    <span className="chat-user-name">Nome usuário</span>
                </Link>
            </aside>

            <main
                className={`chat-main ${
                    hasConversation ? "chat-main--conversation" : ""
                }`}
            >
                {hasConversation ? (
                    <>
                        <div className="chat-thread">
                            {demoMessages.map((message) =>
                                message.role === "user" ? (
                                    <div
                                        key={message.id}
                                        className="chat-message chat-message--user"
                                    >
                                        <div className="chat-user-bubble">
                                            {message.content}
                                        </div>

                                        <div className="chat-message-actions">
                                            <button
                                                type="button"
                                                aria-label="Copiar mensagem"
                                            >
                                                <IconCopy />
                                            </button>

                                            <button
                                                type="button"
                                                aria-label="Editar mensagem"
                                            >
                                                <IconPencil />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        key={message.id}
                                        className="chat-message chat-message--assistant"
                                    >
                                        <p className="chat-assistant-text">
                                            {message.content}
                                        </p>

                                        <div className="chat-message-actions">
                                            <button
                                                type="button"
                                                aria-label="Copiar resposta"
                                            >
                                                <IconCopy />
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        <div className="chat-composer-area">
                            <ChatComposer multiline />
                        </div>
                    </>
                ) : (
                    <div className="chat-empty">
                        <h1 className="chat-empty-title">
                            Pronto para te ouvir.
                        </h1>

                        <ChatComposer />
                    </div>
                )}
            </main>
        </div>
    );
}
