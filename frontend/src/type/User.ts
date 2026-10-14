    export interface User {
        id: number,
        name: string,
        email: string,
        password: string,
        dateNasc: Date
    }

    export type UserCreate = Omit<User, "id">;

    export type LoginCredentials = Pick<User, "email"> & {
        password: string;
    };

    export async function createUser(user: UserCreate): Promise<User> | undefined {

        try {

            if (!user.email.includes("@")) {
            console.error("E-mail invalido!!");
            return undefined;    
            }

            const response = await fetch("rotaaa", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            if (!response) {
                console.error("Erro ao criar User");
                return undefined; 
            }

            const userCreate: User = await response.json();

            return userCreate;

        } catch (error) {
            console.error("Erro de conexão: ", error)
            return undefined;
        }
    
    }
