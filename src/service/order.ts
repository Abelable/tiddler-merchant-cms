import { QueryKey, useMutation, useQuery } from "react-query";
import { useHttp } from "./http";
import {
  useDeleteConfig,
  useCancelOrderConfig,
  useConfirmOrderConfig,
  useDeliveryOrderConfig,
  useExportOrderConfig,
  useRefundOrderConfig,
} from "./use-optimistic-options";

import type {
  Delivery,
  ExpressOption,
  OrderDetail,
  OrderListResult,
  OrderListSearchParams,
} from "types/order";
import type { ShippingInfo } from "types/common";
import type { GoodsOption } from "types/goods";

export const useOrderList = (params: Partial<OrderListSearchParams>) => {
  const client = useHttp();
  return useQuery<OrderListResult>(["order_list", params], () =>
    client("shop/order/list", {
      data: params,
      method: "POST",
    })
  );
};

export const useOrder = (id: number) => {
  const client = useHttp();
  return useQuery<Partial<OrderDetail>>(
    ["order_detail", { id }],
    () => client("shop/order/detail", { data: { id } }),
    {
      enabled: !!id,
    }
  );
};

export const useCancelOrder = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (ids: number[]) =>
      client("shop/order/cancel", {
        data: { ids },
        method: "POST",
      }),
    useCancelOrderConfig(queryKey)
  );
};

export const useRefundOrder = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (ids: number[]) =>
      client("shop/order/refund", {
        data: { ids },
        method: "POST",
      }),
    useRefundOrderConfig(queryKey)
  );
};

export const useShippingInfo = (id: number) => {
  const client = useHttp();
  return useQuery<ShippingInfo>(
    ["shipping_info", { id }],
    () => client("shop/order/shipping_info", { data: { id } }),
    {
      enabled: !!id,
    }
  );
};

export const useConfirmOrder = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (ids: number[]) =>
      client("shop/order/confirm", {
        data: { ids },
        method: "POST",
      }),
    useConfirmOrderConfig(queryKey)
  );
};

export const useDeleteOrder = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (ids: number[]) =>
      client("shop/order/delete", {
        data: { ids },
        method: "POST",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useExportOrder = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (ids: number[]) =>
      client("shop/order/export", {
        data: { ids },
        method: "POST",
        headers: {
          responseType: "arraybuffer",
        },
      }),
    useExportOrderConfig(queryKey)
  );
};

export const useOrderedUserOptions = () => {
  const client = useHttp();
  return useQuery<{ id: number; avatar: string; nickname: string }[]>(
    ["ordered_user_options"],
    () => client("shop/order/user_options")
  );
};

export const useOrderedGoodsOptions = () => {
  const client = useHttp();
  return useQuery<GoodsOption[]>(["ordered_goods_options"], () =>
    client("shop/order/goods_options")
  );
};

export const useShipOrderCount = () => {
  const client = useHttp();
  return useQuery(["ship_order_count"], () =>
    client("shop/order/ship_order_count")
  );
};

export const useModifyOrderAddressInfo = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (data: {
      id: number;
      consignee: string;
      mobile: string;
      address: string;
    }) =>
      client("shop/order/modify_address_info", {
        data,
        method: "POST",
      }),
    useDeliveryOrderConfig(queryKey)
  );
};

export const useDeliveryOrder = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (data: Delivery) =>
      client("shop/order/delivery", {
        data,
        method: "POST",
      }),
    useDeliveryOrderConfig(queryKey)
  );
};

export const useModifyDeliveryInfo = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (data: Partial<Delivery>) =>
      client("shop/order/modify_delivery_info", {
        data,
        method: "POST",
      }),
    useDeliveryOrderConfig(queryKey)
  );
};

export const useExpressOptions = () => {
  const client = useHttp();
  return useQuery<ExpressOption[]>(["express_options"], () =>
    client("express/options")
  );
};
