
import { useState } from "react";
import type { ChangeEvent, SubmitEvent } from "react";
import {Link, useNavigate} from "react-router-dom";
import { z } from "zod";
import type { UserCreate } from "../type/User";
import { useAuth } from "../hooks/use-auth";
import Header from "../components/Header.tsx";
import Card from "../components/Card.tsx";
import { PatternFormat } from 'react-number-format';
import "./Sign-up.css";



const senhaSchema = z.string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "A senha precisa ter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha precisa ter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha precisa ter pelo menos um número");


const signUpSchema = z.object({
  name: z.string()
      .trim()
      .min(1, "O nome é obrigatório"),

  email: z.string()
      .trim()
      .email("Digite um e-mail válido"),

  password: senhaSchema,

  dateNasc: z.string()
      .min(1, "Informe sua data de nascimento")
      .refine((valor) => {
        const data = new Date(`${valor}T00:00:00.000Z`);

        return (
            !Number.isNaN(data.getTime()) &&
            data.toISOString().slice(0, 10) === valor
        );
      }, "Informe uma data válida")
      .transform((valor) => new Date(`${valor}T00:00:00`)),

  tel: z.string()
      .trim()
      .min(1, "O telefone é obrigatório")
      .refine(
          (valor) => valor.replace(/\D/g, "").length === 11,
          "Informe um telefone com DDD válido"
      ),
});

type CampoCadastro = "name" | "email" | "password" | "dateNasc" | "tel";

type ErrosCadastro = Partial<Record<CampoCadastro, string[]>>;

const camposIniciais = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  dateNasc: "",
  tel: "",
  isProfessional: false
};

export default function SignUp() {

  const [formData, setFormData] = useState(camposIniciais);

  const [erros, setErros] = useState<ErrosCadastro>({});
  const [erroGeral, setErroGeral] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cadastro } = useAuth();
  const navigate = useNavigate();


  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const campo = name as CampoCadastro;

    setFormData((prev) => ({
      ...prev,
      [campo]: value
    }));

    setErroGeral("");

    if (campo === "password") {
      if (value === "") {
        setErros((prev) => ({
          ...prev,
          password: undefined
        }));
        return;
      }

      const resultadoSenha = senhaSchema.safeParse(value);

      setErros((prev) => ({
        ...prev,
        password: resultadoSenha.success
            ? undefined
            : resultadoSenha.error.issues.map(
                (erro) => erro.message
            )
      }));

      return;
    }


    setErros((prev) => ({
      ...prev,
      [campo]: undefined
    }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErros({});
    setErroGeral("");

    const resultado = signUpSchema.safeParse(formData);

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (!resultado.success) {
      const novosErros: ErrosCadastro = {};

      for (const erro of resultado.error.issues) {
        const campo = erro.path[0] as CampoCadastro;

        if (!novosErros[campo]) {
          novosErros[campo] = [];
        }

        novosErros[campo]!.push(erro.message);
      }

      setErros(novosErros);
      return;
    }

    const dados: UserCreate = resultado.data;

    try {
      setIsSubmitting(true);

      await cadastro(dados);

      navigate("/app");
    } catch (error: unknown) {
      setErroGeral(
          error instanceof Error
              ? error.message
              : "Não foi possível realizar o cadastro."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const senhaDiferente = formData.confirmPassword.length > 0 && formData.password != formData.confirmPassword;

  return (

      <main className="signup-page">
        <Header/>

        <Card>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <h1 className="signup-title">Cadastre-se</h1>
          <div className="signup-field">
            <input
                id="name"
                name="name"
                type="text"
                placeholder="Nome Completo*"
                value={formData.name}
                onChange={handleChange}
                aria-invalid={Boolean(erros.name?.length)}
                aria-describedby="erro-name"
            />

            <div id="erro-name">
              {erros.name?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          <div className="signup-field">
            <input
                id="email"
                name="email"
                type="email"
                placeholder="E-mail*"
                value={formData.email}
                onChange={handleChange}
                aria-invalid={Boolean(erros.email?.length)}
                aria-describedby="erro-email"
            />

            <div id="erro-email">
              {erros.email?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          <div className="signup-field">
            <PatternFormat
                id="tel"
                name="tel"
                type="tel"
                className="signup-input"
                placeholder="Telefone com DDD*"
                autoComplete="tel"
                value={formData.tel}
                onChange={handleChange}
                aria-invalid={Boolean(erros.tel?.length)}
                aria-describedby="erro-tel"

                format="(##) 9####-####"
                allowEmptyFormatting={false}
                mask="_"
            />

            <div id="erro-tel">
              {erros.tel?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          <div className="signup-field">
            <input
                id="password"
                name="password"
                type="password"
                placeholder="Senha*"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(erros.password?.length)}
                aria-describedby="erro-password"
            />

            <div id="erro-password" aria-live="polite">
              {erros.password?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          <div className="signup-field">

            <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirmar sua senha*"
                value={formData.confirmPassword}
                onChange={handleChange}
                aria-invalid={senhaDiferente}
                aria-describedby="erro-confirm-password"
            />

            <div id="erro-confirm-password" aria-live="polite">
              {senhaDiferente && (
                  <p>As senhas não coincidem.</p>
              )}
            </div>
          </div>

          <div className="signup-field">
            <label htmlFor="dateNasc">
              Data de nascimento:
            </label>
            <input
                id="dateNasc"
                name="dateNasc"
                type="date"
                className="signup-date"
                value={formData.dateNasc}
                onChange={handleChange}
                aria-invalid={Boolean(erros.dateNasc?.length)}
                aria-describedby="erro-dateNasc"
            />

            <div id="erro-dateNasc">
              {erros.dateNasc?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          <div className="signup-professional">
            <input
                id="isProfessional"
                name="isProfessional"
                type="checkbox"
                className="signup-checkbox"
                checked={formData.isProfessional}
                onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isProfessional: e.target.checked
                    }))
                }
            />

            <label htmlFor="isProfessional">
              Sou profissional
            </label>
          </div>

          <button className="button-signup" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar-se"}
          </button>

          {erroGeral && (
              <p role="alert">{erroGeral}</p>
          )}

          <p className="signup-login-link">
            Já possui conta?{" "}
            <Link to="/login">Entrar</Link>
          </p>


        </form>
        </Card>

        <footer>
          <p>O Wings é uma IA de apoio inicial e não substitui o acompanhamento psicológico. Em caso de crise, ligue 188 (CVV).</p>
        </footer>



      </main>
  );
}
