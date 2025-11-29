import { useCallback, useMemo } from "react";
import { useCoupon } from "service/coupon";
import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";

export const useCouponListSearchParams = () => {
  const [params, setParams] = useUrlQueryParams([
    "name",
    "status",
    "goodsId",
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

export const useCouponListQueryKey = () => {
  const [params] = useCouponListSearchParams();
  return ["coupon_list", params];
};

export const useCouponModal = () => {
  const [{ couponCreate }, setCouponModalOpen] = useUrlQueryParams([
    "couponCreate",
  ]);
  const [{ editingCouponId }, setEditingCouponId] = useUrlQueryParams([
    "editingCouponId",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const {
    data: editingCoupon,
    isLoading,
    error,
  } = useCoupon(Number(editingCouponId));

  const open = useCallback(
    () => setCouponModalOpen({ couponCreate: true }),
    [setCouponModalOpen]
  );
  const startEdit = useCallback(
    (id: number) => setEditingCouponId({ editingCouponId: `${id}` }),
    [setEditingCouponId]
  );
  const close = useCallback(
    () => setUrlParams({ couponCreate: "", editingCouponId: "" }),
    [setUrlParams]
  );

  return {
    couponModalOpen: couponCreate === "true" || !!editingCouponId,
    editingCouponId,
    editingCoupon,
    isLoading,
    error,
    open,
    startEdit,
    close,
  };
};
