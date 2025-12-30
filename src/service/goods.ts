import { QueryKey, useMutation, useQuery } from "react-query";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDownConfig,
  useUpConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";
import { cleanObject } from "utils/index";
import type {
  Goods,
  GoodsCategoryOption,
  GoodsListResult,
  GoodsListSearchParams,
  GoodsOption,
} from "types/goods";

export const useGoodsCategoryOptions = () => {
  const client = useHttp();
  return useQuery<GoodsCategoryOption[]>(["category_options"], () =>
    client("shop/goods/category_options")
  );
};

export const useGoodsList = (params: Partial<GoodsListSearchParams>) => {
  const client = useHttp();
  return useQuery<GoodsListResult>(["goods_list", params], () =>
    client("shop/goods/list", {
      data: params,
      method: "POST",
    })
  );
};

export const useGoods = (id: number) => {
  const client = useHttp();
  return useQuery<Partial<Goods>>(
    ["goods", { id }],
    () => client("shop/goods/detail", { data: { id } }),
    {
      enabled: !!id,
      cacheTime: 0,
      refetchOnWindowFocus: false,
    }
  );
};

export const useUpGoods = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (id: number) =>
      client("shop/goods/up", {
        data: { id },
        method: "POST",
      }),
    useUpConfig(queryKey)
  );
};

export const useDownGoods = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (id: number) =>
      client("shop/goods/down", {
        data: { id },
        method: "POST",
      }),
    useDownConfig(queryKey)
  );
};

export const useAddGoods = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Goods>) =>
      client("shop/goods/add", {
        data: cleanObject(params),
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useEditGoods = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (params: Partial<Goods>) =>
      client("shop/goods/edit", {
        data: cleanObject(params),
        method: "POST",
      }),
    useEditConfig(queryKey)
  );
};

export const useEditStock = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id, stock }: { id: number; stock: number }) =>
      client("shop/goods/edit_stock", {
        data: { id, stock },
        method: "POST",
      }),
    useEditConfig(queryKey)
  );
};

export const useEditSort = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({ id, sort }: { id: number; sort: number }) =>
      client("shop/goods/edit_sort", {
        data: { id, sort },
        method: "POST",
      }),
    useEditConfig(queryKey)
  );
};

export const useEditCommission = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    ({
      id,
      salesCommissionRate,
    }: {
      id: number;
      salesCommissionRate: number;
    }) =>
      client("shop/goods/edit_commission", {
        data: { id, salesCommissionRate },
        method: "POST",
      }),
    useEditConfig(queryKey)
  );
};

export const useDeleteGoods = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (id: number) =>
      client("shop/goods/delete", {
        data: { id },
        method: "POST",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useGoodsOptions = () => {
  const client = useHttp();
  return useQuery<GoodsOption[]>(["goods_options"], () =>
    client("shop/goods/options")
  );
};
