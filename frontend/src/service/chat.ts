export async function sendAiMessage(payload: SendAiMessagePayload) {
    return apiFetch<SendAiMessageResponse>("/api/chataimessage", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function sendAiMessageMock(payload: SendAiMessagePayload) {
    await new Promise((r) => setTimeout(r, 900));
    return {
        data: `Resposta simulada para: "${payload.prompt}"`,
        message: "Mensagem enviada com sucesso",
    };
}