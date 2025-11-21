import { useMutation, useQuery } from "react-query";
import { AuthForm, ShopInfo } from "types/auth";
import { http, useHttp } from "./http";
import { cleanObject } from "utils";
import { useEditAdminBaseInfoConfig } from "./use-optimistic-options";

const localStorageKeyOfToken = "__auth_provider_token__";
const localStorageKeyOfShopId = "__auth_provider_shop_id__";

export const getToken = () =>
  window.localStorage.getItem(localStorageKeyOfToken);
export const removeToken = () =>
  window.localStorage.removeItem(localStorageKeyOfToken);

export const getShopId = () =>
  window.localStorage.getItem(localStorageKeyOfShopId);
export const removeShopId = () =>
  window.localStorage.removeItem(localStorageKeyOfShopId);

export const login = async (form: AuthForm) => {
  const { token, shopOptions } = await http("auth/login", {
    method: "POST",
    data: form,
  });
  window.localStorage.setItem(localStorageKeyOfToken, token);
  if (shopOptions.length) {
    window.localStorage.setItem(localStorageKeyOfShopId, shopOptions[0].id);
  }
  return { token, shopId: shopOptions.length ? shopOptions[0].id : 0 };
};

export const logout = async () => {
  removeToken();
  removeShopId();
};

export const refreshToken = async () => {
  const token = await http("auth/token_refresh", { method: "POST" });
  window.localStorage.setItem(localStorageKeyOfToken, token);
};

export const resetPassword = async ({
  password,
  newPassword,
}: {
  password: string;
  newPassword: string;
}) => {
  await http("auth/reset_password", {
    token: getToken() as string,
    data: { password, newPassword },
    method: "POST",
  });
};

export const useShopInfo = (id: number) => {
  const client = useHttp();
  return useQuery<ShopInfo>(["shop_info"], () =>
    client("shop/info", { data: { id } })
  );
};

export const useUpdateShopInfo = () => {
  const client = useHttp();
  return useMutation(
    (params: Partial<ShopInfo>) =>
      client("shop/update_info", {
        data: cleanObject({ ...params }),
        method: "POST",
      }),
    useEditAdminBaseInfoConfig(["shop_info"])
  );
};
