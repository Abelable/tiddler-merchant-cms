import { createContext, ReactNode, useContext, useState } from "react";
import { useQueryClient } from "react-query";
import * as auth from "service/auth";
import { AuthForm } from "types/auth";

const AuthContext = createContext<
  | {
      token: string;
      shopId: string;
      roleId: string;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState(auth.getToken() || "");
  const [shopId, setShopId] = useState(auth.getShopId() || "");
  const [roleId, setRoleId] = useState(auth.getRoleId() || "");

  const login = (form: AuthForm) =>
    auth.login(form).then(({ token, shopId, roleId }) => {
      setToken(token);
      setShopId(shopId);
      setRoleId(roleId);
    });

  const logout = () =>
    auth.logout().then(() => {
      setToken("");
      setShopId("");
      setRoleId("");
      queryClient.clear();
    });

  return (
    <AuthContext.Provider
      children={children}
      value={{ token, shopId, roleId, login, logout }}
    />
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth必须在AuthProvider中使用");
  return context;
};
