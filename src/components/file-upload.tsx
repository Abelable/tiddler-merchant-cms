import { Button, Upload, message } from "antd";
import { initNonce, initTimestamp } from "service/http";
import { useAuth } from "context/auth-context";
import { useState } from "react";

import type { UploadChangeParam } from "antd/lib/upload";
import type { UploadFile } from "antd/lib/upload/interface";

const API_URL = process.env.REACT_APP_API_URL;
const VERSION = process.env.REACT_APP_VERSION;

interface FileUploadType extends React.ComponentProps<typeof Upload> {
  name: string;
  onSuccess: () => void;
}

export const FileUpload = ({
  name,
  onSuccess,
  ...restProps
}: FileUploadType) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  return (
    <Upload
      action={`${API_URL}/api/${VERSION}/shop/order/import`}
      headers={{
        Authorization: `Bearer ${token}`,
        timestamp: initTimestamp(),
        nonce: initNonce(),
      }}
      name="excel"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      maxCount={1}
      showUploadList={false}
      onChange={(info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === "uploading" && info.file.percent === 0) {
          setLoading(true);
        }
        if (info.file.status === "done") {
          setLoading(false);
          if (info.file.response.code === 0) {
            onSuccess();
            message.success("导入成功");
          } else {
            message.error(info.file.response.message);
          }
        }
      }}
      {...restProps}
    >
      <Button type={"primary"} loading={loading}>
        {name}
      </Button>
    </Upload>
  );
};
