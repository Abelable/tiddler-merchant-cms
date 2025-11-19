import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback, useMemo } from "react";
import { useFreightTemplate } from "service/freightTemplate";

export const useFreightTemplateListSearchParams = () => {
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

export const useFreightTemplateListQueryKey = () => {
  const [params] = useFreightTemplateListSearchParams();
  return ["freight_template_list", params];
};

export const useFreightTemplateModal = () => {
  const [{ freightTemplateCreate }, setFreightTemplateModalOpen] =
    useUrlQueryParams(["freightTemplateCreate"]);
  const [{ editingFreightTemplateId }, setEditingFreightTemplateId] =
    useUrlQueryParams(["editingFreightTemplateId"]);
  const setUrlParams = useSetUrlSearchParams();
  const { data: editingFreightTemplate, isLoading } = useFreightTemplate(
    Number(editingFreightTemplateId)
  );

  const open = useCallback(
    () => setFreightTemplateModalOpen({ freightTemplateCreate: true }),
    [setFreightTemplateModalOpen]
  );
  const startEdit = useCallback(
    (id: number) =>
      setEditingFreightTemplateId({ editingFreightTemplateId: `${id}` }),
    [setEditingFreightTemplateId]
  );
  const close = useCallback(
    () =>
      setUrlParams({ freightTemplateCreate: "", editingFreightTemplateId: "" }),
    [setUrlParams]
  );

  return {
    freightTemplateModalOpen:
      freightTemplateCreate === "true" || !!editingFreightTemplateId,
    editingFreightTemplateId,
    editingFreightTemplate,
    isLoading,
    open,
    startEdit,
    close,
  };
};
