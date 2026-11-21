import { ApiError, apiFetch } from "./api";
import type {
    AuthorSummary,
    FeedPage,
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

async function getAuthor(userId: number): Promise<AuthorSummary> {
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


export async function getAuthors(ids: number[]): Promise<Record<number, AuthorSummary>> {
    const uniqueIds = [...new Set(ids)];
    const results = await Promise.allSettled(uniqueIds.map((id) => getAuthor(id)));

    const authors: Record<number, AuthorSummary> = {};

    for (const result of results) {
        if (result.status === "fulfilled") {
            authors[result.value.userId] = result.value;
        }
    }

    return authors;
}
