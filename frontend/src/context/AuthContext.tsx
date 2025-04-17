// client/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface AuthContextType {
 token: string | null;
 setToken: React.Dispatch<React.SetStateAction<string | null>>;
 userRole: string | null;
 setUserRole: React.Dispatch<React.SetStateAction<string | null>>;
 userId: string | null;
 setUserId: React.Dispatch<React.SetStateAction<string | null>>;
 isLoggedIn: boolean;
 login: (token: string, userRole: string, userId: string) => void;
 logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
 children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
 const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
 const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('userRole'));
 const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
 const isLoggedIn = !!token;

 useEffect(() => {
   localStorage.setItem('token', token || '');
   localStorage.setItem('userRole', userRole || '');
   localStorage.setItem('userId', userId || '');
 }, [token, userRole, userId]);

 const login = (token: string, userRole: string, userId: string) => {
   setToken(token);
   setUserRole(userRole);
   setUserId(userId);
 };

 const logout = () => {
   setToken(null);
   setUserRole(null);
   setUserId(null);
 };

 const value: AuthContextType = {
   token,
   setToken,
   userRole,
   setUserRole,
   userId,
   setUserId,
   isLoggedIn,
   login,
   logout,
 };

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
export const useAuth = () => {
 const context = React.useContext(AuthContext);
 if (!context) {
   throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};