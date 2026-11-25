const API_URL = "http://127.0.0.1:8000";

export class ApiError extends Error {
    status: number;
    errors?: Record<string, string[]>;

    constructor(status: number, message: string, errors?: Record<string, string[]>) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("access_token");

    /*
      Com FormData o browser precisa montar o próprio Content-Type (com o
      boundary do multipart). Forçar application/json quebraria o upload.
    */
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            Accept: "application/json",
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem("access_token");
    }

    const body = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(
            response.status,
            body?.message ?? body?.error ?? "Erro na requisição",
            body?.errors
        );
    }

    return body as T;
}