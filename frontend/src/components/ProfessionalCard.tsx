import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { ApiError } from "../service/api";
import {
    createProfessional,
    getProfessional,
    updateProfessional,
} from "../service/professional";
import { formatDate } from "../utils/format";
import type { Professional } from "../type/Professional";

import "./ProfessionalCard.css";


const UF_LIST = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
    "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
    "SP", "SE", "TO",
];

/* Limite do backend: mimes:pdf,jpg,jpeg,png,webp|max:5120 (5 MB). */
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_FILES = ".pdf,.jpg,.jpeg,.png,.webp";

const STATUS_LABEL: Record<string, string> = {
    ativo: "Registro ativo",
    pendente: "Aguardando análise",
    suspenso: "Registro suspenso",
    inativo: "Registro inativo",
    cancelado: "Registro cancelado",
};

interface ProfessionalCardProps {
    userId: number;
}

interface ProfessionalForm {
    crpRegion: string;
    crpNumber: string;
    certificateExpiring: string;
    epsiAuth: boolean;
}

type ProfessionalFiles = {
    cip: File | null;
    crpRegularity: File | null;
    ePsi: File | null;
};

const EMPTY_FORM: ProfessionalForm = {
    crpRegion: "",
    crpNumber: "",
    certificateExpiring: "",
    epsiAuth: false,
};

const EMPTY_FILES: ProfessionalFiles = {
    cip: null,
    crpRegularity: null,
    ePsi: null,
};

function IconBriefcase() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M3 12h18" />
        </svg>
    );
}

function IconPencil() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
    );
}

function IconUpload() {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
    );
}

function readError(error: unknown, fallback: string) {
    if (error instanceof ApiError) {
        if (error.status === 401) {
            return "Sua sessão expirou. Entre novamente.";
        }

        if (error.status === 409) {
            return "Você já possui um cadastro profissional.";
        }

        const firstField = error.errors
            ? Object.values(error.errors)[0]?.[0]
            : undefined;

        return firstField ?? error.message ?? fallback;
    }

    return error instanceof Error ? error.message : fallback;
}

export default function ProfessionalCard({ userId }: ProfessionalCardProps) {
    const [professional, setProfessional] = useState<Professional | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState<ProfessionalForm>(EMPTY_FORM);
    const [files, setFiles] = useState<ProfessionalFiles>(EMPTY_FILES);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    /* Carrega o cadastro profissional (404 = ainda não é profissional). */
    useEffect(() => {
        let cancelled = false;

        void (async () => {
            setIsLoading(true);

            try {
                const data = await getProfessional(userId);
                if (cancelled) return;

                setProfessional(data);
            } catch (error) {
                if (cancelled) return;

                if (error instanceof ApiError && error.status === 404) {
                    setProfessional(null);
                    return;
                }

                setErrorMessage(
                    readError(
                        error,
                        "Não foi possível carregar seu cadastro profissional."
                    )
                );
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [userId]);

    function openCreateForm() {
        setForm(EMPTY_FORM);
        setFiles(EMPTY_FILES);
        setErrorMessage("");
        setSuccessMessage("");
        setIsFormOpen(true);
    }

    function openEditForm() {
        if (!professional) return;

        setForm({
            crpRegion: professional.crpRegion ?? "",
            crpNumber: professional.crpNumber ?? "",
            certificateExpiring: (professional.certificateExpiring ?? "").slice(
                0,
                10
            ),
            epsiAuth: professional.epsiAuth,
        });

        /* Os arquivos já enviados continuam valendo até o usuário trocar. */
        setFiles(EMPTY_FILES);
        setErrorMessage("");
        setSuccessMessage("");
        setIsFormOpen(true);
    }

    function cancelForm() {
        setIsFormOpen(false);
        setErrorMessage("");
    }

    function handleTextChange(
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = event.target;

        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function handleFileChange(
        event: ChangeEvent<HTMLInputElement>,
        field: keyof ProfessionalFiles
    ) {
        const file = event.target.files?.[0] ?? null;

        setFiles((prev) => ({ ...prev, [field]: file }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const crpRegion = form.crpRegion.trim().toUpperCase();
        const crpNumber = form.crpNumber.trim();
        const certificateExpiring = form.certificateExpiring;

        if (!/^[A-Z]{2}$/.test(crpRegion)) {
            setErrorMessage("Selecione a região (UF) do seu CRP.");
            return;
        }

        if (!crpNumber) {
            setErrorMessage("Informe o número do seu CRP.");
            return;
        }

        if (!certificateExpiring) {
            setErrorMessage("Informe a validade do certificado.");
            return;
        }

        /* No cadastro os dois documentos são obrigatórios. */
        if (!professional && (!files.cip || !files.crpRegularity)) {
            setErrorMessage(
                "Anexe o CIP e o comprovante de regularidade do CRP."
            );
            return;
        }

        const oversized = [files.cip, files.crpRegularity, files.ePsi].find(
            (file) => file && file.size > MAX_FILE_SIZE
        );

        if (oversized) {
            setErrorMessage(
                `O arquivo "${oversized.name}" passa de 5 MB. Envie um arquivo menor.`
            );
            return;
        }

        setIsSaving(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const payload = {
                crpRegion,
                crpNumber,
                certificateExpiring,
                epsiAuth: form.epsiAuth,
                cip: files.cip,
                crpRegularity: files.crpRegularity,
                ePsi: files.ePsi,
            };

            const saved = professional
                ? await updateProfessional(userId, payload)
                : await createProfessional(userId, payload);

            setProfessional(saved);
            setIsFormOpen(false);
            setFiles(EMPTY_FILES);
            setSuccessMessage(
                professional
                    ? "Cadastro profissional atualizado com sucesso."
                    : "Cadastro enviado! Em breve seu perfil será analisado."
            );
        } catch (error) {
            setErrorMessage(
                readError(
                    error,
                    professional
                        ? "Não foi possível atualizar seu cadastro."
                        : "Não foi possível enviar seu cadastro."
                )
            );
        } finally {
            setIsSaving(false);
        }
    }

    const isEditing = professional !== null;
    const status = professional?.registerStatus ?? "";
    const statusLabel = STATUS_LABEL[status] ?? "Registro em análise";

    return (
        <section className="profile-card professional-card">
            <div className="profile-card-heading">
                <span className="profile-card-icon">
                    <IconBriefcase />
                </span>
                <h2>Profissional</h2>

                {professional && (
                    <span
                        className={`professional-status professional-status--${
                            status === "ativo" ? "ativo" : "pendente"
                        }`}
                    >
                        {statusLabel}
                    </span>
                )}
            </div>

            {isLoading && (
                <p className="professional-feedback">
                    Verificando seu cadastro profissional...
                </p>
            )}

            {!isLoading && errorMessage && !isFormOpen && (
                <p className="profile-error" role="alert">
                    {errorMessage}
                </p>
            )}

            {!isLoading && successMessage && (
                <p className="professional-success" role="status">
                    {successMessage}
                </p>
            )}

            {!isLoading && !isFormOpen && !professional && (
                <>
                    <p className="professional-text">
                        Cadastre-se como profissional para aparecer na lista de
                        profissionais e conversar com quem busca apoio.
                    </p>

                    <ul className="professional-list">
                        <li>Aparecer na busca por região (CRP)</li>
                        <li>Receber conversas de usuários</li>
                        <li>Divulgar seus documentos de registro</li>
                    </ul>

                    <button
                        type="button"
                        className="profile-edit-button professional-cta"
                        onClick={openCreateForm}
                    >
                        <IconPencil />
                        Quero me cadastrar como profissional
                    </button>
                </>
            )}

            {!isLoading && !isFormOpen && professional && (
                <>
                    <dl className="professional-data-list">
                        <div className="professional-data-row">
                            <dt>CRP</dt>
                            <dd>
                                {professional.crpRegion ?? "—"}/
                                {professional.crpNumber ?? "—"}
                            </dd>
                        </div>

                        <div className="professional-data-row">
                            <dt>Validade do certificado</dt>
                            <dd>{formatDate(professional.certificateExpiring)}</dd>
                        </div>

                        <div className="professional-data-row">
                            <dt>e-Psi</dt>
                            <dd>
                                {professional.epsiAuth
                                    ? "Autorizado"
                                    : "Não autorizado"}
                            </dd>
                        </div>

                        <div className="professional-data-row">
                            <dt>Documentos</dt>
                            <dd className="professional-docs">
                                {professional.cip && (
                                    <a
                                        href={professional.cip}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        CIP
                                    </a>
                                )}

                                {professional.crpRegularity && (
                                    <a
                                        href={professional.crpRegularity}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Regularidade do CRP
                                    </a>
                                )}

                                {professional.ePsi && (
                                    <a
                                        href={professional.ePsi}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        e-Psi
                                    </a>
                                )}

                                {!professional.cip &&
                                    !professional.crpRegularity &&
                                    !professional.ePsi && (
                                        <span>Nenhum documento</span>
                                    )}
                            </dd>
                        </div>
                    </dl>

                    <button
                        type="button"
                        className="profile-edit-button professional-cta"
                        onClick={openEditForm}
                    >
                        <IconPencil />
                        Atualizar cadastro profissional
                    </button>
                </>
            )}

            {isFormOpen && (
                <form
                    className="profile-form professional-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <div className="professional-form-grid">
                        <label className="profile-field">
                            <span>Região do CRP (UF)</span>
                            <select
                                name="crpRegion"
                                value={form.crpRegion}
                                onChange={handleTextChange}
                                disabled={isSaving}
                            >
                                <option value="">Selecione</option>

                                {UF_LIST.map((uf) => (
                                    <option key={uf} value={uf}>
                                        {uf}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="profile-field">
                            <span>Número do CRP</span>
                            <input
                                type="text"
                                name="crpNumber"
                                value={form.crpNumber}
                                onChange={handleTextChange}
                                maxLength={12}
                                placeholder="Ex.: 123456"
                                disabled={isSaving}
                            />
                        </label>
                    </div>

                    <label className="profile-field">
                        <span>Validade do certificado</span>
                        <input
                            type="date"
                            name="certificateExpiring"
                            value={form.certificateExpiring}
                            onChange={handleTextChange}
                            disabled={isSaving}
                        />
                    </label>

                    <div className="professional-form-grid">
                        <label className="profile-field">
                            <span>
                                CIP {isEditing ? "(opcional)" : "(obrigatório)"}
                            </span>
                            <span className="professional-file">
                                <IconUpload />
                                <input
                                    type="file"
                                    name="cip"
                                    accept={ACCEPTED_FILES}
                                    onChange={(event) =>
                                        handleFileChange(event, "cip")
                                    }
                                    disabled={isSaving}
                                />
                            </span>
                            <small>
                                PDF, JPG ou PNG, até 5 MB.
                                {files.cip && ` Arquivo: ${files.cip.name}`}
                            </small>
                        </label>

                        <label className="profile-field">
                            <span>
                                Regularidade do CRP{" "}
                                {isEditing ? "(opcional)" : "(obrigatório)"}
                            </span>
                            <span className="professional-file">
                                <IconUpload />
                                <input
                                    type="file"
                                    name="crpRegularity"
                                    accept={ACCEPTED_FILES}
                                    onChange={(event) =>
                                        handleFileChange(event, "crpRegularity")
                                    }
                                    disabled={isSaving}
                                />
                            </span>
                            <small>
                                PDF, JPG ou PNG, até 5 MB.
                                {files.crpRegularity &&
                                    ` Arquivo: ${files.crpRegularity.name}`}
                            </small>
                        </label>
                    </div>

                    <label className="profile-field">
                        <span>e-Psi (opcional)</span>
                        <span className="professional-file">
                            <IconUpload />
                            <input
                                type="file"
                                name="ePsi"
                                accept={ACCEPTED_FILES}
                                onChange={(event) =>
                                    handleFileChange(event, "ePsi")
                                }
                                disabled={isSaving}
                            />
                        </span>
                        <small>
                            PDF, JPG ou PNG, até 5 MB.
                            {files.ePsi && ` Arquivo: ${files.ePsi.name}`}
                        </small>
                    </label>

                    <label className="professional-check">
                        <input
                            type="checkbox"
                            name="epsiAuth"
                            checked={form.epsiAuth}
                            onChange={(event) =>
                                setForm((prev) => ({
                                    ...prev,
                                    epsiAuth: event.target.checked,
                                }))
                            }
                            disabled={isSaving}
                        />
                        <span>
                            Autorizo o uso do meu e-Psi pela plataforma.
                        </span>
                    </label>

                    {errorMessage && (
                        <p className="profile-error" role="alert">
                            {errorMessage}
                        </p>
                    )}

                    <div className="profile-form-actions">
                        <button
                            type="button"
                            onClick={cancelForm}
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>

                        <button type="submit" disabled={isSaving}>
                            {isSaving
                                ? "Enviando..."
                                : isEditing
                                  ? "Salvar alterações"
                                  : "Enviar cadastro"}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
