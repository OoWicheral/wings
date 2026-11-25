import { useRef } from "react";
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
    attachment?: File | null;
    onAttachmentChange?: (file: File | null) => void;
}

/*
  Campo de envio compartilhado pelos chats.
  O anexo pode ser habilitado pelos chats que aceitam upload.
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
    attachment = null,
    onAttachmentChange,
}: ChatComposerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachmentPicker = onAttachmentChange ? (
        <>
            <input
                ref={fileInputRef}
                className="chat-composer-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,.pdf,.doc,.docx"
                onChange={(event) => onAttachmentChange(event.target.files?.[0] ?? null)}
                aria-label="Selecionar imagem ou documento"
            />
            <button
                type="button"
                className="chat-composer-add"
                aria-label="Adicionar anexo"
                title="Adicionar imagem ou documento"
                disabled={disabled}
                onClick={() => fileInputRef.current?.click()}
            >
                <IconPlus />
            </button>
        </>
    ) : (
        <button type="button" className="chat-composer-add" aria-label="Adicionar anexo" title="Anexos indisponíveis" disabled>
            <IconPlus />
        </button>
    );

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
                    {attachmentPicker}

                    {attachment && (
                        <span className="chat-composer-attachment">
                            {attachment.name}
                            <button type="button" aria-label="Remover anexo" onClick={() => onAttachmentChange?.(null)}>×</button>
                        </span>
                    )}

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
            {attachmentPicker}

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
