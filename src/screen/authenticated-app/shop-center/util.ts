import { useSetUrlSearchParams, useUrlQueryParams } from "utils/url";
import { useCallback } from "react";

export const usePwdModal = () => {
  const [{ pwdModalOpen }, setPwdModalOpen] = useUrlQueryParams([
    "pwdModalOpen",
  ]);
  const setUrlParams = useSetUrlSearchParams();
  const open = useCallback(
    () => setPwdModalOpen({ pwdModalOpen: "true" }),
    [setPwdModalOpen]
  );
  const close = useCallback(
    () => setUrlParams({ pwdModalOpen: "" }),
    [setUrlParams]
  );

  return {
    pwdModalOpen: pwdModalOpen === "true",
    open,
    close,
  };
};
