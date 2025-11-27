import { useMutation, useQuery } from "react-query";
import { AuthForm, ShopInfo } from "types/auth";
import { http, useHttp } from "./http";
import { cleanObject } from "utils";
import { useEditAdminBaseInfoConfig } from "./use-optimistic-options";

const localStorageKeyOfToken = "__auth_provider_token__";
const localStorageKeyOfShopId = "__auth_provider_shop_id__";
const localStorageKeyOfRoleId = "__auth_provider_role_id__";

export const getToken = () =>
  window.localStorage.getItem(localStorageKeyOfToken);
export const removeToken = () =>
  window.localStorage.removeItem(localStorageKeyOfToken);

export const getShopId = () =>
  window.localStorage.getItem(localStorageKeyOfShopId);
export const removeShopId = () =>
  window.localStorage.removeItem(localStorageKeyOfShopId);

export const getRoleId = () =>
  window.localStorage.getItem(localStorageKeyOfRoleId);
export const removeRoleId = () =>
  window.localStorage.removeItem(localStorageKeyOfRoleId);

export const login = async (form: AuthForm) => {
  const { token, goodsShopOptions } = await http("auth/login", {
    method: "POST",
    data: form,
  });
  if (!goodsShopOptions.length) {
    throw new Error("您还不是商家或管理员，无法登录商家后台");
  }
  const { id: shopId, roleId } = goodsShopOptions[0];
  window.localStorage.setItem(localStorageKeyOfToken, token);
  window.localStorage.setItem(localStorageKeyOfShopId, shopId);
  window.localStorage.setItem(localStorageKeyOfRoleId, roleId);
  return { token, shopId, roleId };
};

export const logout = async () => {
  removeToken();
  removeShopId();
  removeRoleId();
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
