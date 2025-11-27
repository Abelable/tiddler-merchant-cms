import { QueryKey, useMutation, useQuery } from "react-query";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";
import { cleanObject } from "utils/index";

import type {
  Manager,
  ManagerListResult,
  ManagerListSearchParams,
  UserOption,
} from "types/manager";

export const useManagerList = (params: Partial<ManagerListSearchParams>) => {
  const client = useHttp();
  return useQuery<ManagerListResult>(["manager_list", params], () =>
    client("shop/manager/list", {
      data: params,
      method: "POST",
    })
  );
};

export const useManager = (id: number) => {
  const client = useHttp();
  return useQuery<Partial<Manager>>(
    ["manager", { id }],
    () => client("shop/manager/detail", { data: { id } }),
    {
      enabled: !!id,
    }
  );
};

export const useAddManager = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Manager>) =>
      client("shop/manager/add", {
        data: cleanObject(params),
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useEditManager = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Manager>) =>
      client("shop/manager/edit", {
        data: cleanObject(params),
        method: "POST",
      }),
    useEditConfig(queryKey)
  );
};

export const useDeleteManager = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (id: number) =>
      client("shop/manager/delete", {
        data: { id },
        method: "POST",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useUserOptions = (keywords: string) => {
  const client = useHttp();
  return useQuery<UserOption[]>(["user_options", keywords], () =>
    client("user/options", { data: cleanObject({ keywords }) })
  );
};
