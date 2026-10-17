import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import type { UserCreate } from "../type/User";
import { useAuth } from "../hooks/use-auth";

const signUpSchema = z.object({
  name: z.string()
      .trim()
      .min(1, "O nome é obrigatório"),

  email: z.string()
      .trim()
      .email("Digite um e-mail válido"),

  password: z.string()
      .min(8, "A senha precisa ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha precisa ter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "A senha precisa ter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "A senha precisa ter pelo menos um número"),

  dateNasc: z.string()
      .min(1, "Informe sua data de nascimento")
      .refine((valor) => {
        const data = new Date(`${valor}T00:00:00.000Z`);

        return (
            !Number.isNaN(data.getTime()) &&
            data.toISOString().slice(0, 10) === valor
        );
      }, "Informe uma data válida")
      .transform((valor) => new Date(`${valor}T00:00:00`))
});

type CampoCadastro = "name" | "email" | "password" | "dateNasc";

type ErrosCadastro = Partial<Record<CampoCadastro, string[]>>;

export default function SignUp() {

  const [formData, setFormData] = useState({
      nome: "",
      email: "",
      senha: "",
      dataNasc: ""
  });



  const [erros, setErros] = useState<ErrosCadastro>({});
  const [erroGeral, setErroGeral] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cadastro } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setErros({});
    setErroGeral("");


    const resultado = signUpSchema.safeParse({
      name: formData.nome,
      formData.email,
      password: formData.senha,
      dateNasc: formData.dataNasc
    });


    if (!resultado.success) {
      const novosErros: ErrosCadastro = {};

      for (const erro of resultado.error.issues) {
        const campo = erro.path[0] as CampoCadastro;

        const mensagens = novosErros[campo] ?? [];
        mensagens.push(erro.message);
        novosErros[campo] = mensagens;
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
      if (error instanceof Error) {
        setErroGeral(error.message);
      } else {
        setErroGeral("Não foi possível realizar o cadastro.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
      <div>
        <h1>Cadastro</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="nome">Nome:</label>

            <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(evento) => setNome(evento.target.value)}
                aria-invalid={Boolean(erros.name?.length)}
                aria-describedby="erro-nome"
            />

            <div id="erro-nome">
              {erros.name?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="email">E-mail:</label>

            <input
                id="email"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
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

          <div>
            <label htmlFor="senha">Senha:</label>

            <input
                id="senha"
                type="password"
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                aria-invalid={Boolean(erros.password?.length)}
                aria-describedby="erro-senha"
            />

            <div id="erro-senha">
              {erros.password?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="dataNasc">
              Data de nascimento:
            </label>

            <input
                id="dataNasc"
                type="date"
                value={dataNasc}
                onChange={(evento) => setDataNasc(evento.target.value)}
                aria-invalid={Boolean(erros.dateNasc?.length)}
                aria-describedby="erro-dataNasc"
            />

            <div id="erro-dataNasc">
              {erros.dateNasc?.map((mensagem, indice) => (
                  <p key={`${mensagem}-${indice}`}>
                    {mensagem}
                  </p>
              ))}
            </div>
          </div>

          {erroGeral && (
              <p role="alert">
                {erroGeral}
              </p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
  );
}