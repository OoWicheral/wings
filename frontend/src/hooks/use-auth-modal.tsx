import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type AuthMode = "login" | "signup" | "professional";

interface AuthModalContextValue {
    mode: AuthMode | null;
    openAuthModal: (mode: AuthMode) => void;
    closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<AuthMode | null>(null);

    const openAuthModal = useCallback((next: AuthMode) => setMode(next), []);
    const closeAuthModal = useCallback(() => setMode(null), []);

    const value = useMemo(
        () => ({ mode, openAuthModal, closeAuthModal }),
        [mode, openAuthModal, closeAuthModal]
    );

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal precisa estar dentro de AuthModalProvider");
    }
    return context;
}