import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback, useMemo } from "react";
import { useAdmin } from "service/admin";

export const useAdminsSearchParams = () => {
  const [params, setParams] = useUrlQueryParams([
    "nickname",
    "account",
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

export const useAdminsQueryKey = () => {
  const [params] = useAdminsSearchParams();
  return ["admins", params];
};

export const useAdminModal = () => {
  const [{ adminCreate }, setAdminModalOpen] = useUrlQueryParams([
    "adminCreate",
  ]);
  const [{ editingAdminId }, setEditingAdminId] = useUrlQueryParams([
    "editingAdminId",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const { data: editingAdmin, isLoading } = useAdmin(Number(editingAdminId));

  const open = useCallback(
    () => setAdminModalOpen({ adminCreate: true }),
    [setAdminModalOpen]
  );
  const startEdit = useCallback(
    (id: number) => setEditingAdminId({ editingAdminId: `${id}` }),
    [setEditingAdminId]
  );
  const close = useCallback(
    () => setUrlParams({ adminCreate: "", editingAdminId: "" }),
    [setUrlParams]
  );

  return {
    adminModalOpen: adminCreate === "true" || !!editingAdminId,
    editingAdminId,
    editingAdmin,
    isLoading,
    open,
    startEdit,
    close,
  };
};
