import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback, useMemo } from "react";
import { usePickupAddress } from "service/pickupAddress";

export const usePickupAddressListSearchParams = () => {
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

export const usePickupAddressListQueryKey = () => {
  const [params] = usePickupAddressListSearchParams();
  return ["pickup_address_list", params];
};

export const usePickupAddressModal = () => {
  const [{ pickupAddressCreate }, setPickupAddressModalOpen] =
    useUrlQueryParams(["pickupAddressCreate"]);
  const [{ editingPickupAddressId }, setEditingPickupAddressId] =
    useUrlQueryParams(["editingPickupAddressId"]);
  const setUrlParams = useSetUrlSearchParams();
  const { data: editingPickupAddress, isLoading } = usePickupAddress(
    Number(editingPickupAddressId)
  );

  const open = useCallback(
    () => setPickupAddressModalOpen({ pickupAddressCreate: true }),
    [setPickupAddressModalOpen]
  );
  const startEdit = useCallback(
    (id: number) =>
      setEditingPickupAddressId({ editingPickupAddressId: `${id}` }),
    [setEditingPickupAddressId]
  );
  const close = useCallback(
    () => setUrlParams({ pickupAddressCreate: "", editingPickupAddressId: "" }),
    [setUrlParams]
  );

  return {
    pickupAddressModalOpen:
      pickupAddressCreate === "true" || !!editingPickupAddressId,
    editingPickupAddressId,
    editingPickupAddress,
    isLoading,
    open,
    startEdit,
    close,
  };
};
