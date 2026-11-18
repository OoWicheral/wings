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

export function avatarUrl(avatar?: string | null): string | null {
    if (!avatar) return null;
    if (/^https?:\/\//.test(avatar)) return avatar;
    return `http://127.0.0.1:8000/storage/${avatar.replace(/^\//, "")}`;
}