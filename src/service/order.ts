import { QueryKey, useMutation, useQuery } from "react-query";
import { useHttp } from "./http";
import {
  useConfirmOrderConfig,
  useShipOrderConfig,
  useExportOrderConfig,
  useRefundOrderConfig,
} from "./use-optimistic-options";

import type {
  ExpressOption,
  OrderDetail,
  OrderListResult,
  OrderListSearchParams,
  Shipment,
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

export const useOrder = (orderId: number) => {
  const client = useHttp();
  return useQuery<Partial<OrderDetail>>(
    ["order_detail", { orderId }],
    () => client("shop/order/detail", { data: { orderId } }),
    {
      enabled: !!orderId,
    }
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
    useShipOrderConfig(queryKey)
  );
};

export const useShipOrder = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (data: Shipment) =>
      client("shop/order/ship", {
        data,
        method: "POST",
      }),
    useShipOrderConfig(queryKey)
  );
};

export const useModifyShipment = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (data: Partial<Shipment>) =>
      client("shop/order/modify_shipment", {
        data,
        method: "POST",
      }),
    useShipOrderConfig(queryKey)
  );
};

export const useTrackingInfo = (id: number) => {
  const client = useHttp();
  return useQuery<ShippingInfo>(
    ["tracking_info", { id }],
    () => client("shop/order/tracking_info", { data: { id } }),
    {
      enabled: !!id,
    }
  );
};

export const useExpressOptions = () => {
  const client = useHttp();
  return useQuery<ExpressOption[]>(["express_options"], () =>
    client("shop/express_options")
  );
};
