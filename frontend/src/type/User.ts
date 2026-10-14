export default interface User {
    id: number,
    nome: string,
    email: string,
    password: string,
    dateNasc: Date
}

type UserCreate = Omit<User, "id">;

async function createUser(user: UserCreate): Promise<User> | undefined {

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

        const userCreate: User = await.response.json();

        return userCreate;

    } catch (error) {
        console.error("Erro de conexão: ", error)
        return undefined;
    }
  
}
