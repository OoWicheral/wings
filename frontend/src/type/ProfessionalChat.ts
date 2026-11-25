
export interface ProfessionalChatParticipant {
    id: number | null;
    name: string | null;
    avatar: string | null;
}

export interface ProfessionalChatLastMessage {
    content: string | null;
    created_at: string;
}

export interface ProfessionalChat {
    chat_id: number;
    created_at: string;
    participant: ProfessionalChatParticipant;
    last_message: ProfessionalChatLastMessage | null;
}

export interface ProfessionalMessage {
    id_msg: number;
    content: string | null;
    id_usuario: number | null;
    id_chat_profissional: number;
    created_at: string;
    updated_at: string | null;
    anexo_url: string | null;
    audio_url: string | null;
}

/* Envelope da paginação por cursor do Laravel (o cursor fica em meta). */
export interface ProfessionalMessagePage {
    data: ProfessionalMessage[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        path: string;
        per_page: number;
        next_cursor: string | null;
        prev_cursor: string | null;
    };
}
