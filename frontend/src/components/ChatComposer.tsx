import type { FormEvent } from "react";

import { IconArrowUp, IconMic, IconPlus } from "./ChatIcons";

interface ChatComposerProps {
    multiline?: boolean;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    maxLength?: number;
}

/*
  Campo de envio compartilhado pelos chats.
  Anexo e áudio ficam desabilitados: ainda não há upload no fluxo de chat.
*/
export default function ChatComposer({
    multiline = false,
    value,
    onChange,
    onSubmit,
    disabled = false,
    placeholder = "Diga ao Caco",
    ariaLabel = "Mensagem para o Caco",
    maxLength = 1000,
}: ChatComposerProps) {
    if (multiline) {
        return (
            <form className="chat-composer chat-composer--multiline" onSubmit={onSubmit}>
                <textarea
                    className="chat-composer-textarea"
                    placeholder={placeholder}
                    rows={2}
                    aria-label={ariaLabel}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    maxLength={maxLength}
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
                placeholder={placeholder}
                aria-label={ariaLabel}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                maxLength={maxLength}
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
