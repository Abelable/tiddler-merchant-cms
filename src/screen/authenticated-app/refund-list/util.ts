import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback, useMemo } from "react";
import { useRefund, useShippingInfo } from "service/refund";

export const useRefundListSearchParams = () => {
  const [params, setParams] = useUrlQueryParams([
    "orderSn",
    "status",
    "page",
    "limit",
  ]);
  return [
    useMemo(
      () => ({
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 10,
        ...params,
      }),
      [params]
    ),
    setParams,
  ] as const;
};

export const useRefundListQueryKey = () => {
  const [params] = useRefundListSearchParams();
  return ["refund_list", params];
};

export const useRefundModal = () => {
  const [{ editingRefundId }, setEditingRefundId] = useUrlQueryParams([
    "editingRefundId",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const {
    data: refundInfo,
    isLoading,
    error,
  } = useRefund(Number(editingRefundId));

  const open = useCallback(
    (id: number) => setEditingRefundId({ editingRefundId: `${id}` }),
    [setEditingRefundId]
  );
  const close = useCallback(
    () => setUrlParams({ editingRefundId: "" }),
    [setUrlParams]
  );

  return {
    refundModalOpen: !!editingRefundId,
    editingRefundId,
    refundInfo,
    isLoading,
    error,
    open,
    close,
  };
};

export const useRejectModal = () => {
  const [{ rejectRefundId }, setRejectRefundId] = useUrlQueryParams([
    "rejectRefundId",
  ]);
  const setUrlParams = useSetUrlSearchParams();

  const open = useCallback(
    (id: number) => setRejectRefundId({ rejectRefundId: `${id}` }),
    [setRejectRefundId]
  );
  const close = useCallback(
    () => setUrlParams({ rejectRefundId: "" }),
    [setUrlParams]
  );

  return {
    rejectModalOpen: !!rejectRefundId,
    rejectRefundId,
    open,
    close,
  };
};

export const useShippingModal = () => {
  const [{ shippingRefundId }, setShippingRefundId] = useUrlQueryParams([
    "shippingRefundId",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const {
    data: shippingInfo,
    isLoading,
    error,
  } = useShippingInfo(Number(shippingRefundId));

  const open = useCallback(
    (id: number) => setShippingRefundId({ shippingRefundId: `${id}` }),
    [setShippingRefundId]
  );
  const close = useCallback(
    () => setUrlParams({ shippingRefundId: "" }),
    [setUrlParams]
  );

  return {
    shippingModalOpen: !!shippingRefundId,
    shippingRefundId,
    shippingInfo,
    isLoading,
    error,
    open,
    close,
  };
};
