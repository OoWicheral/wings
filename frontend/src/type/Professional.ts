
export interface Professional {
    id: number;
    name: string | null;
    avatar: string | null;
    bio: string | null;
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
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
}

/* Campos do formulário de cadastro/actualização do profissional. */
export interface ProfessionalFormPayload {
    crpRegion: string;
    crpNumber: string;
    certificateExpiring: string;
    epsiAuth: boolean;
    /* Arquivos: no cadastro são obrigatórios (cip/crpRegularity). */
    cip?: File | null;
    crpRegularity?: File | null;
    ePsi?: File | null;
}
