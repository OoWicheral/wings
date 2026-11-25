import { apiFetch } from "./api";
import type {
    ProfessionalChat,
    ProfessionalMessage,
    ProfessionalMessagePage,
} from "../type/ProfessionalChat";


export async function listProfessionalChats(): Promise<ProfessionalChat[]> {
    const res = await apiFetch<{ data: ProfessionalChat[]; message: string }>(
        "/api/chats-professional"
    );

    return res.data;
}

export async function startProfessionalChat(
    professionalId: number
): Promise<ProfessionalChat> {
    const res = await apiFetch<{ data: ProfessionalChat; message: string }>(
        "/api/chats-professional",
        {
            method: "POST",
            body: JSON.stringify({ id_sender: professionalId }),
        }
    );

    return res.data;
}


export async function listProfessionalMessages(
    chatId: number,
    cursor?: string | null
): Promise<ProfessionalMessagePage> {
    const params = new URLSearchParams();

    if (cursor) params.set("cursor", cursor);

    const query = params.toString();

    return apiFetch<ProfessionalMessagePage>(
        `/api/chats-profissionais/${chatId}/messages${query ? `?${query}` : ""}`
    );
}

export async function sendProfessionalMessage(
    chatId: number,
    content: string
): Promise<ProfessionalMessage> {
    const res = await apiFetch<{ data: ProfessionalMessage; message: string }>(
        `/api/chats-profissionais/${chatId}/messages`,
        {
            method: "POST",
            body: JSON.stringify({ conteudo_msg: content }),
        }
    );

    return res.data;
}

export async function updateProfessionalMessage(
    chatId: number,
    messageId: number,
    content: string
): Promise<ProfessionalMessage> {
    const res = await apiFetch<{ data: ProfessionalMessage; message: string }>(
        `/api/chats-profissionais/${chatId}/messages/${messageId}`,
        {
            method: "PATCH",
            body: JSON.stringify({ conteudo_msg: content }),
        }
    );

    return res.data;
}

/* Exclui uma mensagem enviada pelo próprio usuário. */
export async function deleteProfessionalMessage(
    chatId: number,
    messageId: number
): Promise<void> {
    await apiFetch<{ message: string }>(
        `/api/chats-profissionais/${chatId}/messages/${messageId}`,
        { method: "DELETE" }
    );
}

/* Limpa o histórico deste chat só para o usuário logado. */
export async function clearProfessionalChat(chatId: number): Promise<void> {
    await apiFetch<{ message: string }>(
        `/api/chats-professional/${chatId}`,
        { method: "DELETE" }
    );
}
