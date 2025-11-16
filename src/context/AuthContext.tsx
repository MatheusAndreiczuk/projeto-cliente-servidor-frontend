import React, { createContext, ReactNode, useContext, useState } from "react";
import { api } from "../services/axios.js";
import z from "zod";
import { parseJwt } from "../utils/parseJwt.js";

interface decodedToken {
    sub: number | null;
    role: string | null;
    username: string | null;
}

interface IAuthContext {
    token: string | null;
    decodedToken: decodedToken | null;
    logout: () => Promise<void>;
    login: (data: loginSchema) => Promise<void>;
}

const loginSchema = z.object({
    username: z.
        string()
        .trim(),
    password: z.
        string(),
})

type loginSchema = z.infer<typeof loginSchema>

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [decodedToken, setDecodedToken] = useState<decodedToken | null>(null);

    async function login (data: loginSchema) {
        const dataJson = JSON.stringify(data)
        const { data: response } = await api.post('/login', dataJson)
        localStorage.setItem('token', response.token)
        setToken(response.token);
        const decodedToken = parseJwt(response.token);
        setDecodedToken(decodedToken);
    }

    async function logout() {
        await api.post('/logout', {}, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        localStorage.removeItem('token');
        setToken(null);
        setDecodedToken(null);
    }
    const value = { token, login, logout, decodedToken };
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
