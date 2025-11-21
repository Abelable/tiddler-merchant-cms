import { useMutation, useQuery } from "react-query";
import { AuthForm, ShopInfo, UserInfo } from "types/auth";
import { http, useHttp } from "./http";
import { cleanObject } from "utils";
import { useEditAdminBaseInfoConfig } from "./use-optimistic-options";

const localStorageKey = "__auth_provider_token__";
const localStoragePermissionKey = "__auth_provider_permission__";
const localStorageShopIdKey = "__auth_provider_shop_id__";

export const getToken = () => window.localStorage.getItem(localStorageKey);
export const removeToken = () =>
  window.localStorage.removeItem(localStorageKey);

export const getPermission = (): string[] => {
  const permissionStorage = window.localStorage.getItem(
    localStoragePermissionKey
  );
  return permissionStorage ? JSON.parse(permissionStorage) : [];
};
export const removePermission = () =>
  window.localStorage.removeItem(localStoragePermissionKey);

export const login = async (form: AuthForm) => {
  const { token, permission } = await http("auth/login", {
    method: "POST",
    data: form,
  });
  window.localStorage.setItem(localStorageKey, token);
  window.localStorage.setItem(localStoragePermissionKey, permission);
  return { token, permission: JSON.parse(permission) };
};

export const logout = async () => {
  await http("auth/logout", { token: getToken() as string, method: "POST" });
  removeToken();
  removePermission();
};

export const refreshToken = async () => {
  const token = await http("auth/token_refresh", { method: "POST" });
  window.localStorage.setItem(localStorageKey, token);
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

export const useUserInfo = () => {
  const client = useHttp();
  return useQuery<UserInfo>(["user_info"], () => client("user/me"));
};

export const useUpdateUserInfo = () => {
  const client = useHttp();
  return useMutation(
    (params: Partial<UserInfo>) =>
      client("auth/update_base_info", {
        data: cleanObject(params),
        method: "POST",
      }),
    useEditAdminBaseInfoConfig(["user_info"])
  );
};

export const useShopInfo = () => {
  const client = useHttp();
  return useQuery<ShopInfo>(["shop_info"], () =>
    client("shop/info", { data: { id: 1 } })
  );
};

export const useUpdateShopInfo = () => {
  const client = useHttp();
  return useMutation(
    (params: Partial<ShopInfo>) =>
      client("shop/update_info", {
        data: cleanObject({ ...params, id: 1 }),
        method: "POST",
      }),
    useEditAdminBaseInfoConfig(["shop_info"])
  );
};
