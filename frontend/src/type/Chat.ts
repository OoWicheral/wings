export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: string;
    status?: "sending" | "sent" | "error";
}

export interface SendAiMessagePayload {
    idChat: number;
    prompt: string;
}

export interface SendAiMessageResponse {
    data: string;            
    message: string;
}