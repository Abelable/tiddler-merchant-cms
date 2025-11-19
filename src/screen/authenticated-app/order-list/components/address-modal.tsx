import { Form, Input, Modal } from "antd";

import { useForm } from "antd/lib/form/Form";
import { useModifyOrderAddressInfo } from "service/order";
import { useAddressModal, useOrderListQueryKey } from "../util";
import { useEffect } from "react";

export const AddressModal = () => {
  const [form] = useForm();
  const { modifyAddressOrderId, close, addressModalOpen, orderInfo } =
    useAddressModal();

  const { mutateAsync, isLoading: mutateLoading } = useModifyOrderAddressInfo(
    useOrderListQueryKey()
  );

  useEffect(() => {
    if (orderInfo) {
      const { consignee, mobile, address } = orderInfo;
      form.setFieldsValue({ consignee, mobile, address });
    }
  }, [form, orderInfo]);

  const confirm = () => {
    form.validateFields().then(async () => {
      await mutateAsync({
        id: +modifyAddressOrderId,
        ...form.getFieldsValue(),
      });
      closeModal();
    });
  };

  const closeModal = () => {
    form.resetFields();
    close();
  };

  return (
    <Modal
      forceRender={true}
      title="修改收件信息"
      open={addressModalOpen}
      confirmLoading={mutateLoading}
      onOk={confirm}
      onCancel={closeModal}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label={"收件人姓名"}
          name={"consignee"}
          rules={[{ required: true, message: "请输入收件人姓名" }]}
        >
          <Input placeholder={"请输入收件人姓名"} />
        </Form.Item>
        <Form.Item
          label={"收件人手机号"}
          name={"mobile"}
          rules={[{ required: true, message: "请输入收件人手机号" }]}
        >
          <Input placeholder={"请输入收件人手机号"} />
        </Form.Item>
        <Form.Item
          label={"收件地址"}
          name={"address"}
          rules={[{ required: true, message: "请输入收件地址" }]}
        >
          <Input placeholder={"请输入收件地址"} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
