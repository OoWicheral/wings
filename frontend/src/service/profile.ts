import { apiFetch } from "./api";
import type { User } from "../type/User";
import type { Profile, ProfilePayload } from "../type/Profile";

export async function getUser(id: number): Promise<User> {
    const res = await apiFetch<{ data: User }>(`/api/user/${id}`);
    return res.data;
}

export async function getProfile(id: number): Promise<Profile> {
    const res = await apiFetch<{ data: Profile }>(`/api/user/${id}/profile`);
    return res.data;
}

export async function createProfile(id: number, payload: ProfilePayload): Promise<Profile> {
    const body = new FormData();
    body.append("nameProfile", payload.nameProfile);
    if (payload.bio !== undefined && payload.bio !== null) body.append("bio", payload.bio);
    if (payload.avatar instanceof File) body.append("avatar", payload.avatar);
    const res = await apiFetch<{ data: Profile }>(`/api/user/${id}/profile`, {
        method: "POST",
        body,
    });
    return res.data;
}

export async function updateProfile(id: number, payload: Partial<ProfilePayload>): Promise<Profile> {
    const body = new FormData();
    body.append("_method", "PATCH");
    if (payload.nameProfile !== undefined) body.append("nameProfile", payload.nameProfile);
    if (payload.bio !== undefined && payload.bio !== null) body.append("bio", payload.bio);
    if (payload.avatar instanceof File) body.append("avatar", payload.avatar);
    if (typeof payload.avatar === "string") body.append("avatar", payload.avatar);
    const res = await apiFetch<{ data: Profile }>(`/api/user/${id}/profile`, {
        method: "POST",
        body,
    });
    return res.data;
}
