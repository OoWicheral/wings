import { apiFetch } from "./api";
import type { AiChat, AiMessage, ChatMessagePage } from "../type/Chat";


export async function listChats(): Promise<AiChat[]> {
    const res = await apiFetch<{ data: AiChat[] }>("/api/chats");
    return res.data;
}


export async function createChat(title: string): Promise<AiChat> {
    const res = await apiFetch<{ data: AiChat; message: string }>("/api/chats", {
        method: "POST",
        body: JSON.stringify({ title }),
    });

    return res.data;
}


export async function renameChat(chatId: number, title: string): Promise<AiChat> {
    const res = await apiFetch<{ data: AiChat; message: string }>(
        `/api/chats/${chatId}`,
        {
            method: "PATCH",
            body: JSON.stringify({ title }),
        }
    );

    return res.data;
}


export async function deleteChat(chatId: number): Promise<void> {
    await apiFetch<{ message: string }>(`/api/chats/${chatId}`, {
        method: "DELETE",
    });
}


export async function listMessages(
    chatId: number,
    cursor?: string | null
): Promise<ChatMessagePage> {
    const params = new URLSearchParams();

    if (cursor) params.set("cursor", cursor);

    const query = params.toString();

    return apiFetch<ChatMessagePage>(
        `/api/chats/${chatId}/messages${query ? `?${query}` : ""}`
    );
}


export async function sendMessage(
    chatId: number,
    prompt: string
): Promise<{ user_message: AiMessage; ai_message: AiMessage }> {
    return apiFetch<{ user_message: AiMessage; ai_message: AiMessage }>(
        "/api/chats/messages",
        {
            method: "POST",
            body: JSON.stringify({ idChat: chatId, prompt }),
        }
    );
}


export async function updateMessage(
    messageId: number,
    prompt: string
): Promise<AiMessage> {
    const res = await apiFetch<{ data: AiMessage; message: string }>(
        `/api/messages/${messageId}`,
        {
            method: "PATCH",
            body: JSON.stringify({ prompt }),
        }
    );

    return res.data;
}

export async function deleteMessage(messageId: number): Promise<void> {
    await apiFetch<{ message: string }>(`/api/messages/${messageId}`, {
        method: "DELETE",
    });
}
