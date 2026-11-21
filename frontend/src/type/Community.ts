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
        "statusPost": "ativo" | "inativo"
      }
    ],
    "per_page": 15,
    "next_cursor": "eyJpZCI6..."
  }

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
    /* Já vem pronto no feed (PublicationResource -> AuthorResource). */
    author: AuthorSummary | null;
    title: string;
    content: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    statusPost: "ativo" | "inativo" | null;
}

export interface PublicationCreate {
    title: string;
    content: string;
}

/* Envelope da paginação por cursor do Laravel. */
export interface FeedPage {
    data: Publication[];
    per_page: number;
    next_cursor: string | null;
}

/*
  Profissional.

  O ProfessionalResource devolve apenas dados de registro (CRP/CIP).
  Nome, avatar e especialidade NÃO vêm nele: por isso o front busca
  o perfil público de cada profissional pelo id_usuario.
*/
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
