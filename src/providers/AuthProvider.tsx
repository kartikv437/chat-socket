"use client";
import { createContext, useContext } from "react";

const AuthContext = createContext<{
  token: string;
  myUserId: string;
} | null>(null);

export const AuthProvider = ({
  children,
  token,
  myUserId,
}: any) => {
  return (
    <AuthContext.Provider value={{ token, myUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside provider");
  return ctx;
};
