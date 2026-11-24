/*
  Tipos do assistente de IA (Caco).

  Contrato atual do backend:

  GET /api/chats -> { "data": [ { chat_id, title, create_at } ] }
  POST /api/chats -> { "data": { chat_id, title, create_at }, "message": "..." }
  PATCH /api/chats/{id} -> { "data": { chat_id, title, create_at }, "message": "..." }
  DELETE /api/chats/{id} -> { "message": "..." }

  GET /api/chats/{chatId}/messages ->
  {
    "data": [ { id_msg, content, is_user: "usuario" | "ia", created_at } ],
    "links": { "first": null, "last": null, "prev": null, "next": null },
    "meta": { "path": "...", "per_page": 20, "next_cursor": null, "prev_cursor": null }
  }

  POST /api/chats/messages ->
  { "user_message": { ... }, "ai_message": { ... } }

  PATCH /api/messages/{id} -> { "data": { ... }, "message": "..." }
  DELETE /api/messages/{id} -> { "message": "..." }
*/

export interface AiChat {
    chat_id: number;
    title: string;
    create_at: string;
}

export interface AiMessage {
    id_msg: number;
    content: string;
    /* "usuario" = mensagem do usuário logado, "ia" = resposta do assistente. */
    is_user: "usuario" | "ia";
    created_at: string;
}

/* Envelope da paginação por cursor do Laravel (o cursor fica em meta). */
export interface ChatMessagePage {
    data: AiMessage[];
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
