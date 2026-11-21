import { ApiError, apiFetch } from "./api";
import type {
    AuthorSummary,
    FeedPage,
    Professional,
    ProfessionalPage,
    Publication,
    PublicationCreate,
} from "../type/Community";


export async function getFeed(cursor?: string | null): Promise<FeedPage> {
    const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
    return apiFetch<FeedPage>(`/api/posts${query}`);
}

export async function createPost(payload: PublicationCreate): Promise<Publication> {
    const res = await apiFetch<{ data: Publication; message: string }>("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
}


const authorCache = new Map<number, AuthorSummary>();

export async function getAuthor(userId: number): Promise<AuthorSummary> {
    const cached = authorCache.get(userId);
    if (cached) return cached;

    try {
        const res = await apiFetch<{
            data: { userId: number; nameProfile: string; avatar: string | null };
        }>(`/api/user/${userId}/profile`);

        const author: AuthorSummary = {
            userId,
            name: res.data.nameProfile,
            avatar: res.data.avatar,
        };

        authorCache.set(userId, author);
        return author;
    } catch (error) {
        // 404 = usuário sem perfil. Cai no fallback abaixo.
        if (!(error instanceof ApiError) || error.status !== 404) {
            throw error;
        }
    }

    const res = await apiFetch<{ data: { name: string } }>(`/api/user/${userId}`);

    const author: AuthorSummary = {
        userId,
        name: res.data.name,
        avatar: null,
    };

    authorCache.set(userId, author);
    return author;
}

/* =========================================================
   PROFISSIONAIS
   ========================================================= */

export async function getProfessionals(): Promise<Professional[]> {
    const res = await apiFetch<ProfessionalPage>("/api/professionals");
    return res.data;
}
