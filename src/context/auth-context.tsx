import { createContext, ReactNode, useContext, useState } from "react";
import { useQueryClient } from "react-query";
import * as auth from "service/auth";
import { AuthForm, ShopOption } from "types/auth";

const AuthContext = createContext<
  | {
      token: string;
      shopInfo: ShopOption | undefined;
      login: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState(auth.getToken() || "");
  const [shopInfo, setShopInfo] = useState<ShopOption>();

  const login = (form: AuthForm) =>
    auth.login(form).then(({ token, shopInfo }) => {
      setToken(token);
      setShopInfo(shopInfo);
    });

  const logout = () =>
    auth.logout().then(() => {
      setToken("");
      queryClient.clear();
    });

  return (
    <AuthContext.Provider
      children={children}
      value={{ token, shopInfo, login, logout }}
    />
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth必须在AuthProvider中使用");
  return context;
};
