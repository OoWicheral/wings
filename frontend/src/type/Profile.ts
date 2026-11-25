export interface Profile {
    userId: number;
    nameProfile: string;
    bio: string | null;
    avatar: string | null;
    statusProfile: "ativo" | "inativo";
    createdAt: string;
    updatedAt: string;
}

export interface ProfilePayload {
    nameProfile: string;
    bio?: string | null;
    avatar?: string | File | null;
    statusProfile?: "ativo" | "inativo";
}
