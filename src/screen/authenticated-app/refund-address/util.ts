import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback, useMemo } from "react";
import { useRefundAddress } from "service/refundAddress";

export const useRefundAddressListSearchParams = () => {
  const [params, setParams] = useUrlQueryParams(["page", "limit"]);
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

export const useRefundAddressListQueryKey = () => {
  const [params] = useRefundAddressListSearchParams();
  return ["refund_address_list", params];
};

export const useRefundAddressModal = () => {
  const [{ refundAddressCreate }, setRefundAddressModalOpen] =
    useUrlQueryParams(["refundAddressCreate"]);
  const [{ editingRefundAddressId }, setEditingRefundAddressId] =
    useUrlQueryParams(["editingRefundAddressId"]);
  const setUrlParams = useSetUrlSearchParams();
  const { data: editingRefundAddress, isLoading } = useRefundAddress(
    Number(editingRefundAddressId)
  );

  const open = useCallback(
    () => setRefundAddressModalOpen({ refundAddressCreate: true }),
    [setRefundAddressModalOpen]
  );
  const startEdit = useCallback(
    (id: number) =>
      setEditingRefundAddressId({ editingRefundAddressId: `${id}` }),
    [setEditingRefundAddressId]
  );
  const close = useCallback(
    () => setUrlParams({ refundAddressCreate: "", editingRefundAddressId: "" }),
    [setUrlParams]
  );

  return {
    refundAddressModalOpen:
      refundAddressCreate === "true" || !!editingRefundAddressId,
    editingRefundAddressId,
    editingRefundAddress,
    isLoading,
    open,
    startEdit,
    close,
  };
};
