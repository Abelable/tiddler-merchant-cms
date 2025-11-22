import { QueryKey, useQueryClient } from "react-query";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old: any) => any
) => {
  const queryClient = useQueryClient();
  return {
    async onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => callback(target, old));
      return { previousItems };
    },
    onSuccess: () => queryClient.invalidateQueries(queryKey),
    onError(error: any, newItem: any, context: any) {
      queryClient.setQueryData(queryKey, context.previousItems);
    },
  };
};

export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: [
            {
              id: old.list[0] ? `${Number(old.list[0].id) + 1}` : "1",
              ...target,
            },
            ...old.list,
          ],
        }
      : null
  );

export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === target.id ? { ...item, ...target } : item
          ),
        }
      : null
  );

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => ({
    ...old,
    list: old.list.filter((item: any) => item.id !== target) || [],
  }));

export const useApprovedConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (id, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === id ? { ...item, status: 1 } : item
          ),
        }
      : null
  );

export const useUpConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (id, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === id ? { ...item, status: 1 } : item
          ),
        }
      : null
  );

export const useDownConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (id, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === id ? { ...item, status: 2 } : item
          ),
        }
      : null
  );

export const useRejectConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === target.id ? { ...item, ...target, status: 3 } : item
          ),
        }
      : null
  );

export const useCancelOrderConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (ids, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            ids.includes(item.id) ? { ...item, status: 104 } : item
          ),
        }
      : null
  );

export const useRefundOrderConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (ids, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            ids.includes(item.id) ? { ...item, status: 203 } : item
          ),
        }
      : null
  );

export const useShipOrderConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === target.id ? { ...item, ...target, status: 301 } : item
          ),
        }
      : null
  );

export const useConfirmOrderConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (ids, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            ids.includes(item.id) ? { ...item, status: 403 } : item
          ),
        }
      : null
  );

export const useExportOrderConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (ids, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            ids.includes(item.id) ? { ...item, status: 204 } : item
          ),
        }
      : null
  );

export const useAddActivityGoodsConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: [
            ...target.goodsIds.map((id: number, index: number) => ({
              id: `${
                (old.list[0]
                  ? Number(
                      old.list.sort(
                        (a: { id: number }, b: { id: number }) => b.id - a.id
                      )[0].id
                    )
                  : 1) +
                target.goodsIds.length -
                index
              }`,
              type: target.type,
            })),
            ...old.list,
          ],
        }
      : null
  );

export const useDownActivityConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (id, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === id ? { ...item, status: 2 } : item
          ),
        }
      : null
  );

export const useDownCouponConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (id, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === id ? { ...item, status: 3 } : item
          ),
        }
      : null
  );

export const useApprovedRefundConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === target.id
              ? { ...item, status: target.refundType === 1 ? 3 : 1 }
              : item
          ),
        }
      : null
  );

export const useRejectRefundConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === target.id ? { ...item, ...target, status: 4 } : item
          ),
        }
      : null
  );

export const useRejectWithdrawConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          list: old.list.map((item: any) =>
            item.id === target.id ? { ...item, ...target, status: 2 } : item
          ),
        }
      : null
  );

export const useEditAdminBaseInfoConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) =>
    old
      ? {
          ...old,
          ...target,
        }
      : null
  );
