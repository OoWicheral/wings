export function formatPhone(tel?: string): string {
    if (!tel) return "—";
    const digits = tel.replace(/\D/g, "").replace(/^55/, "");
    if (digits.length === 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    if (digits.length === 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return digits;
}

export function formatDate(iso?: string | null): string {
    if (!iso) return "—";
    const [y, m, d] = iso.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
}

export function formatMonthYear(value?: string | null): string {
    if (!value) return "—";
    const date = new Date(value.replace(" ", "T"));
    const text = new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        year: "numeric",
    }).format(date);
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatRelativeTime(value?: string | null): string {
    if (!value) return "";

    const date = new Date(value.replace(" ", "T"));
    const diff = Date.now() - date.getTime();

    if (Number.isNaN(diff)) return "";

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "agora";
    if (minutes < 60) return `${minutes} min atrás`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h atrás`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} d atrás`;

    return formatDate(value);
}

export function avatarUrl(avatar?: string | null): string | null {
    if (!avatar) return null;
    if (/^https?:\/\//.test(avatar)) return avatar;
    return `http://127.0.0.1:8000/storage/${avatar.replace(/^\//, "")}`;
}