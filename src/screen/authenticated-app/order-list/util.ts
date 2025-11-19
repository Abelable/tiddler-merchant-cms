import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback, useMemo } from "react";
import { useOrder, useShippingInfo } from "service/order";

export const useOrderListSearchParams = () => {
  const [params, setParams] = useUrlQueryParams([
    "orderSn",
    "status",
    "goodsId",
    "merchantId",
    "userId",
    "consignee",
    "mobile",
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

export const useOrderListQueryKey = () => {
  const [params] = useOrderListSearchParams();
  return ["order_list", params];
};

export const useOrderModal = () => {
  const [{ editingOrderId }, setEditingOrderId] = useUrlQueryParams([
    "editingOrderId",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const {
    data: orderInfo,
    isLoading,
    error,
  } = useOrder(Number(editingOrderId));

  const open = useCallback(
    (id: number) => setEditingOrderId({ editingOrderId: `${id}` }),
    [setEditingOrderId]
  );
  const close = useCallback(
    () => setUrlParams({ editingOrderId: "" }),
    [setUrlParams]
  );

  return {
    orderModalOpen: !!editingOrderId,
    editingOrderId,
    orderInfo,
    isLoading,
    error,
    open,
    close,
  };
};

export const useDeliveryModal = () => {
  const [{ deliveryOrderId }, setDeliveryOrderId] = useUrlQueryParams([
    "deliveryOrderId",
  ]);
  const [{ modifyDeliveryOrderId }, setModifyDeliveryOrderId] =
    useUrlQueryParams(["modifyDeliveryOrderId"]);
  const setUrlParams = useSetUrlSearchParams();

  const { data: orderInfo } = useOrder(
    Number(deliveryOrderId) || Number(modifyDeliveryOrderId)
  );

  const open = useCallback(
    (id: number) => setDeliveryOrderId({ deliveryOrderId: `${id}` }),
    [setDeliveryOrderId]
  );
  const modify = useCallback(
    (id: number) =>
      setModifyDeliveryOrderId({ modifyDeliveryOrderId: `${id}` }),
    [setModifyDeliveryOrderId]
  );
  const close = useCallback(
    () => setUrlParams({ deliveryOrderId: "", modifyDeliveryOrderId: "" }),
    [setUrlParams]
  );

  return {
    deliveryModalOpen: !!deliveryOrderId || !!modifyDeliveryOrderId,
    deliveryOrderId,
    modifyDeliveryOrderId,
    orderInfo,
    open,
    modify,
    close,
  };
};

export const useShippingModal = () => {
  const [{ shippingPackageId }, setShippingPackageId] = useUrlQueryParams([
    "shippingPackageId",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const {
    data: shippingInfo,
    isLoading,
    error,
  } = useShippingInfo(Number(shippingPackageId));

  const open = useCallback(
    (id: number) => setShippingPackageId({ shippingPackageId: `${id}` }),
    [setShippingPackageId]
  );
  const close = useCallback(
    () => setUrlParams({ shippingPackageId: "" }),
    [setUrlParams]
  );

  return {
    shippingModalOpen: !!shippingPackageId,
    shippingPackageId,
    shippingInfo,
    isLoading,
    error,
    open,
    close,
  };
};

export const useAddressModal = () => {
  const [{ modifyAddressOrderId }, setModifyAddressOrderId] = useUrlQueryParams(
    ["modifyAddressOrderId"]
  );
  const setUrlParams = useSetUrlSearchParams();
  const {
    data: orderInfo,
    isLoading,
    error,
  } = useOrder(Number(modifyAddressOrderId));

  const open = useCallback(
    (id: number) => setModifyAddressOrderId({ modifyAddressOrderId: `${id}` }),
    [setModifyAddressOrderId]
  );
  const close = useCallback(
    () => setUrlParams({ modifyAddressOrderId: "" }),
    [setUrlParams]
  );

  return {
    addressModalOpen: !!modifyAddressOrderId,
    modifyAddressOrderId,
    orderInfo,
    isLoading,
    error,
    open,
    close,
  };
};
