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
    const res = await apiFetch<{ data: Profile }>(`/api/user/${id}/profile`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res.data;
}

export async function updateProfile(id: number, payload: Partial<ProfilePayload>): Promise<Profile> {
    const res = await apiFetch<{ data: Profile }>(`/api/user/${id}/profile`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    return res.data;
}