import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User, UserCreate, LoginCredentials } from "../type/User";
import { createUser } from "../type/User";


interface AuthContextType {
    user: User | undefined;
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

            const response = await fetch("/api/auth/me", {
                credentials: "include",
            });

            if (!response.ok) {
                setUser(null);
                return; 
            }

            const data: User = await response.json();
            setUser(data);
            
        } catch (error) {
            console.error("Autenticacao falhou: ", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

     useEffect(()=> {
        void checkAuth();
    }, [checkAuth]);

    // Autentica o Login
    const login = async (credentials: LoginCredentials) => {

        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type" : "application/json"},
            credentials: "include",
            body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Login falhou!");
        }

        const data: User = await response.json();
        setUser(data);
        
    }

    // Autentica o user apos cadastro
    const cadastro = async (dados: UserCreate) => {

        const usuario = await createUser(dados);
        
        if (!usuario) {
            throw new Error("Cadastro falhou!");
        }

        setUser(usuario);
    }

    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

    setUser(null);
    }

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