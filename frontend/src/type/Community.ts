
export interface Publication {
    id: number;
    userId: number;
    title: string;
    content: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
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

export interface AuthorSummary {
    userId: number;
    name: string;
    avatar: string | null;
}
