
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";

import { useAuth } from "../hooks/use-auth";

const loginSchema = z.object({
    email: z.string()
        .trim()
        .email("Digite um e-mail válido"),

    password: z.string()
        .min(1, "Digite sua senha"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type LoginErrors = Partial<Record<keyof LoginFormData, string>>;

export default function SignOn() {

    const [formData, setFormData] = useState<LoginFormData>({
        email: "",
        password: "",
    });


    const [erros, setErros] = useState<LoginErrors>({});
    const [erroGeral, setErroGeral] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const { login } = useAuth();
    const navigate = useNavigate();


    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErros((prev) => ({
            ...prev,
            [name]: undefined,
        }));

        setErroGeral("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErros({});
        setErroGeral("");

        const resultado = loginSchema.safeParse(formData);

        if (!resultado.success) {
            const novosErros: LoginErrors = {};

            for (const erro of resultado.error.issues) {
                const campo = erro.path[0] as keyof LoginFormData;
                novosErros[campo] = erro.message;
            }

            setErros(novosErros);
            return;
        }

        try {
            setIsSubmitting(true);

            await login(resultado.data);

            navigate("/comunidade");
        } catch (error: unknown) {
            setErroGeral(
                error instanceof Error
                    ? error.message
                    : "Não foi possível entrar na conta."
            );
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h1 className="auth-title">Entrar</h1>

            <div className="auth-field">
                <input
                    id="email"
                    name="email"
                    type="email"
                    className="auth-input"
                    placeholder="E-mail*"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(erros.email)}
                />

                {erros.email && (
                    <p className="auth-error">
                        {erros.email}
                    </p>
                )}
            </div>

            <div className="auth-field">
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="auth-input"
                    placeholder="Senha*"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={Boolean(erros.password)}
                />

                {erros.password && (
                    <p className="auth-error">
                        {erros.password}
                    </p>
                )}
            </div>

            <label className="auth-check">
                <input
                    type="checkbox"
                    className="auth-checkbox"
                />
                <span>Lembre-se de mim</span>
            </label>

            {erroGeral && (
                <p className="auth-error" role="alert">
                    {erroGeral}
                </p>
            )}

            <button
                type="submit"
                className="auth-submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Entrando..." : "Entrar"}
            </button>

            <p className="auth-switch">
                Não possui conta?{" "}
                <Link to="/cadastro">Cadastre-se</Link>
            </p>
        </form>
    );
}
