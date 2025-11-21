import { createContext, ReactNode, useContext, useState } from "react";
import { useQueryClient } from "react-query";
import * as auth from "service/auth";
import { AuthForm } from "types/auth";

const AuthContext = createContext<
  | {
      token: string;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(auth.getToken() || "");
  const queryClient = useQueryClient();

  const login = (form: AuthForm) =>
    auth.login(form).then((token) => {
      setToken(token);
    });
  const logout = () =>
    auth.logout().then(() => {
      setToken("");
      queryClient.clear();
    });

  return (
    <AuthContext.Provider
      children={children}
      value={{ token, login, logout }}
    />
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth必须在AuthProvider中使用");
  return context;
};
