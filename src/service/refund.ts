import { QueryKey, useMutation, useQuery } from "react-query";
import { useHttp } from "./http";
import {
  useApprovedRefundConfig,
  useDeleteConfig,
  useRejectRefundConfig,
} from "./use-optimistic-options";
import type {
  RefundDetail,
  RefundListResult,
  RefundListSearchParams,
} from "types/refund";
import type { ShippingInfo } from "types/common";

export const useRefundList = (params: Partial<RefundListSearchParams>) => {
  const client = useHttp();
  return useQuery<RefundListResult>(["refund_list", params], () =>
    client("shop/refund/list", {
      data: params,
      method: "POST",
    })
  );
};

export const useRefund = (id: number) => {
  const client = useHttp();
  return useQuery<Partial<RefundDetail>>(
    ["refund_detail", { id }],
    () => client("shop/refund/detail", { data: { id } }),
    {
      enabled: !!id,
    }
  );
};

export const useApprovedRefund = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (id: number) =>
      client("shop/refund/approved", {
        data: { id },
        method: "POST",
      }),
    useApprovedRefundConfig(queryKey)
  );
};

export const useShippingInfo = (id: number) => {
  const client = useHttp();
  return useQuery<ShippingInfo>(
    ["shipping_info", { id }],
    () => client("shop/refund/shipping_info", { data: { id } }),
    {
      enabled: !!id,
    }
  );
};

export const useRejectRefund = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (data: { id: number; failureReason: string }) =>
      client("shop/refund/reject", {
        data,
        method: "POST",
      }),
    useRejectRefundConfig(queryKey)
  );
};

export const useDeleteRefund = (queryKey: QueryKey) => {
  const client = useHttp();
  return useMutation(
    (id: number) =>
      client("shop/refund/delete", {
        data: { id },
        method: "POST",
      }),
    useDeleteConfig(queryKey)
  );
};

export const useWaitingRefundCount = () => {
  const client = useHttp();
  return useQuery(["waiting_refund_count"], () =>
    client("shop/refund/waiting_count")
  );
};
