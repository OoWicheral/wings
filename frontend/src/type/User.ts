    export interface User {
        id: number,
        name: string,
        email: string,
        password: string,
        dateNasc: Date,
        tel: string
    }

    export type UserCreate = Omit<User, "id">;

    export type LoginCredentials = Pick<User, "email"> & {
        password: string;
    };

    export interface LoginResponse {
        access_token: string;
        token_type: string;
        expires_in: number;
        user: User;
    }



    interface CreateUserResponse {
        data: User;
        message: string;
    }

    export async function createUser(user: UserCreate): Promise<User> {
        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                password: user.password,
                date: user.dateNasc.toISOString().slice(0, 10),
                tel: user.tel,
            }),
        });

        const result: CreateUserResponse = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message ?? "Erro ao cadastrar usuário."
            );
        }

        return result.data;
    }
