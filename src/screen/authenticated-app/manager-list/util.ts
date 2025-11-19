import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback, useMemo } from "react";
import { useManager } from "service/manager";

export const useManagerListSearchParams = () => {
  const [params, setParams] = useUrlQueryParams([
    "nickname",
    "mobile",
    "roleId",
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

export const useManagerListQueryKey = () => {
  const [params] = useManagerListSearchParams();
  return ["manager_list", params];
};

export const useManagerModal = () => {
  const [{ managerCreate }, setManagerModalOpen] = useUrlQueryParams([
    "managerCreate",
  ]);
  const [{ editingManagerId }, setEditingManagerId] = useUrlQueryParams([
    "editingManagerId",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const { data: editingManager, isLoading } = useManager(
    Number(editingManagerId)
  );

  const open = useCallback(
    () => setManagerModalOpen({ managerCreate: true }),
    [setManagerModalOpen]
  );
  const startEdit = useCallback(
    (id: number) => setEditingManagerId({ editingManagerId: `${id}` }),
    [setEditingManagerId]
  );
  const close = useCallback(
    () => setUrlParams({ managerCreate: "", editingManagerId: "" }),
    [setUrlParams]
  );

  return {
    managerModalOpen: managerCreate === "true" || !!editingManagerId,
    editingManagerId,
    editingManager,
    isLoading,
    open,
    startEdit,
    close,
  };
};
