/*
  Tipos da comunidade.

  Contrato atual do backend:

  GET /api/posts -> paginação por cursor:
  {
    "data": [
      {
        "id": 12,
        "userId": 7,
        "author": { "id": 7, "name": "Nome", "avatar": "http://..." },
        "title": "...",
        "content": "...",
        "image": "http://..." | null,
        "createdAt": "...",
        "updatedAt": "...",
        "statusPost": "ativo" | "inativo",
        "commentsCount": 0
      }
    ],
    "links": { "first": null, "last": null, "prev": null, "next": null },
    "meta": { "path": "http://...", "per_page": 15, "next_cursor": "eyJpZCIu...", "prev_cursor": null }
  }

  GET /api/posts/{id}/comments -> mesma paginação por cursor, com Comment[].

  POST /api/posts     -> { data: Publication, message }
  PATCH /api/posts/{id} -> { data: Publication, message }
  DELETE /api/posts/{id} -> { message }

  GET /api/professionals -> paginator comum:
  { "data": [ { id, crpRegion, crpNumber, ... } ], "current_page": 1, ... }
*/

export interface AuthorSummary {
    userId: number;
    name: string;
    avatar: string | null;
}

export interface Publication {
    id: number;
    userId: number;
    author: AuthorSummary | null;
    title: string;
    content: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    statusPost: "ativo" | "inativo" | null;
    commentsCount?: number;
}

export interface PublicationCreate {
    title: string;
    content: string;
}

/* Envelope da paginação por cursor do Laravel (o cursor fica em meta). */
export interface FeedPage {
    data: Publication[];
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

export interface Comment {
    id: number;
    userId: number;
    author: AuthorSummary | null;
    postId: number;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface CommentPage {
    data: Comment[];
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

export interface Professional {
    id: number;
    crpRegion: string | null;
    crpNumber: string | null;
    cip: string | null;
    crpRegularity: string | null;
    ePsi: string | null;
    registerStatus: string | null;
    certificateExpiring: string | null;
    epsiAuth: boolean;
}

export interface ProfessionalPage {
    data: Professional[];
}
