import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, UserCreate, LoginCredentials, LoginResponse } from "../type/User";
import { createUser } from "../type/User";


interface AuthContextType {
    user: User | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    cadastro: (user: UserCreate) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}



const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem("access_token");

            if (!token) {
                setUser(null);
                return;
            }

            const response = await fetch("/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                localStorage.removeItem("access_token");
                setUser(null);
                return;
            }

            const data: User = await response.json();
            setUser(data);

        } catch (error) {
            console.error("Autenticação falhou:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(()=> {
        void checkAuth();
    }, [checkAuth]);


    const login = async (
        credentials: LoginCredentials
    ): Promise<void> => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error ?? data.message ?? "Login falhou!"
            );
        }

        const result: LoginResponse = data;

        localStorage.setItem("access_token", result.access_token);
        setUser(result.user);
    };

// Cadastro seguido de autenticação
    const cadastro = async (
        dados: UserCreate
    ): Promise<void> => {
        await createUser(dados);

        await login({
            email: dados.email,
            password: dados.password,
        });
    };

// Encerra a sessão
    const logout = async (): Promise<void> => {
        const token = localStorage.getItem("access_token");

        try {
            if (token) {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
            }
        } finally {
            localStorage.removeItem("access_token");
            setUser(null);
        }
    };


    return (
        <AuthContext.Provider value={{user,login, cadastro, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deveria ser usado com AuthProvider");
    }

    return context;
}