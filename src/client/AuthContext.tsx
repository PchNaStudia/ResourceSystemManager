import * as React from "react";
import { UserType } from "@common/DbTypes";
import { useSuspenseQuery } from "@tanstack/react-query";

type AuthContextType = {
  user: UserType | null;
  login: () => void;
  logout: () => void;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const {
    data: user = null,
    isPending,
    isError,
    error,
  } = useSuspenseQuery({
    queryKey: ["getSession"],
    queryFn: async () => {
      const res = await fetch("api/auth/session");
      return (res ? await res.json() : null) as UserType | null;
    },
  });
  const login = () => {
    console.log("Login");
    window.location.href = "api/auth/login";
  };

  const logout = () => {
    console.log("Logout");
    window.location.href = "api/auth/logout";
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isPending, isError, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
