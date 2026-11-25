import { apiFetch } from "./api";
import type { Professional, ProfessionalFormPayload } from "../type/Professional";

/* Monta o multipart do formulário profissional. */
function buildFormData(
    payload: ProfessionalFormPayload,
    spoofPatch = false
): FormData {
    const form = new FormData();


    if (spoofPatch) {
        form.append("_method", "PATCH");
    }

    form.append("crpRegion", payload.crpRegion);
    form.append("crpNumber", payload.crpNumber);
    form.append("certificateExpiring", payload.certificateExpiring);
    form.append("epsiAuth", payload.epsiAuth ? "1" : "0");

    if (payload.cip) {
        form.append("cip", payload.cip);
    }

    if (payload.crpRegularity) {
        form.append("crpRegularity", payload.crpRegularity);
    }

    if (payload.ePsi) {
        form.append("ePsi", payload.ePsi);
    }

    /*
      registerStatus não é enviado de propósito: no cadastro o backend usa
      "pendente" e na atualização o status atual é preservado. Assim o próprio
      usuário não consegue se auto-aprovar.
    */
    return form;
}

/* Busca o cadastro profissional do usuário (404 quando não é profissional). */
export async function getProfessional(id: number): Promise<Professional> {
    const res = await apiFetch<{ data: Professional; message: string }>(
        `/api/user/${id}/professional`
    );

    return res.data;
}

/* Cadastra o usuário como profissional. */
export async function createProfessional(
    id: number,
    payload: ProfessionalFormPayload
): Promise<Professional> {
    const res = await apiFetch<{ data: Professional; message: string }>(
        `/api/user/${id}/professional`,
        {
            method: "POST",
            body: buildFormData(payload),
        }
    );

    return res.data;
}

/* Atualiza o cadastro profissional (multipart com _method=PATCH). */
export async function updateProfessional(
    id: number,
    payload: ProfessionalFormPayload
): Promise<Professional> {
    const res = await apiFetch<{ data: Professional; message: string }>(
        `/api/user/${id}/professional`,
        {
            method: "POST",
            body: buildFormData(payload, true),
        }
    );

    return res.data;
}
