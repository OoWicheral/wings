import { ApiError, apiFetch } from "./api";
import type {
    AuthorSummary,
    Comment,
    CommentPage,
    FeedPage,
    Publication,
    PublicationCreate,
} from "../type/Community";
import type { ProfessionalPage } from "../type/Professional";


export async function getFeed(
    cursor?: string | null,
    search?: string
): Promise<FeedPage> {
    const params = new URLSearchParams();

    if (cursor) params.set("cursor", cursor);
    if (search) params.set("search", search);

    const query = params.toString();

    return apiFetch<FeedPage>(`/api/posts${query ? `?${query}` : ""}`);
}

export async function createPost(payload: PublicationCreate): Promise<Publication> {
    const res = await apiFetch<{ data: Publication; message: string }>("/api/posts", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return res.data;
}

export async function getComments(
    postId: number,
    cursor?: string | null
): Promise<CommentPage> {
    const params = new URLSearchParams();

    if (cursor) params.set("cursor", cursor);

    const query = params.toString();

    return apiFetch<CommentPage>(
        `/api/posts/${postId}/comments${query ? `?${query}` : ""}`
    );
}

export async function createComment(postId: number, content: string): Promise<Comment> {
    const res = await apiFetch<{ data: Comment; message: string }>(
        `/api/posts/${postId}/comments`,
        {
            method: "POST",
            body: JSON.stringify({ content }),
        }
    );

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



export async function getProfessionals(
    params: { search?: string; region?: string; page?: number } = {}
): Promise<ProfessionalPage> {
    const query = new URLSearchParams();

    if (params.search) query.set("search", params.search);
    if (params.region) query.set("region", params.region);
    if (params.page && params.page > 1) query.set("page", String(params.page));

    const qs = query.toString();

    return apiFetch<ProfessionalPage>(
        `/api/professionals${qs ? `?${qs}` : ""}`
    );
}
