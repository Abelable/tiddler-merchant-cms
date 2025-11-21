import { Form, Modal, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";
import {
  ErrorBox,
  ModalLoading,
  OptionAvatar,
  OptionNickname,
} from "components/lib";

import { useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { useDebounce } from "utils";
import { useAddManager, useEditManager, useUserOptions } from "service/manager";
import { useManagerModal, useManagerListQueryKey } from "../util";

import type { RoleOption } from "types/manager";

export const ManagerModal = ({
  roleOptions,
}: {
  roleOptions: RoleOption[];
}) => {
  const [form] = useForm();
  const {
    managerModalOpen,
    editingManagerId,
    editingManager,
    isLoading,
    close,
  } = useManagerModal();

  const [keywords, setKeywords] = useState("");
  const debouncedKeywords = useDebounce(keywords, 300);
  const { data: userOptions = [] } = useUserOptions(debouncedKeywords);

  const useMutateManager = editingManagerId ? useEditManager : useAddManager;
  const {
    mutateAsync,
    isLoading: mutateLoading,
    error,
  } = useMutateManager(useManagerListQueryKey());

  useEffect(() => {
    if (editingManager) {
      const { avatar, ...rest } = editingManager;
      form.setFieldsValue({ avatar: avatar ? [{ url: avatar }] : [], ...rest });
    }
  }, [editingManager, form]);

  const submit = () => {
    form.validateFields().then(async () => {
      const { avatar, ...rest } = form.getFieldsValue();
      await mutateAsync({
        ...editingManager,
        ...rest,
        avatar: avatar && avatar.length ? avatar[0].url : "",
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
      title={editingManagerId ? "编辑人员" : "新增人员"}
      open={managerModalOpen}
      confirmLoading={mutateLoading}
      onOk={submit}
      onCancel={closeModal}
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="userId"
            label="人员"
            rules={[{ required: true, message: "请选择人员" }]}
          >
            <Select
              onSearch={(value) => setKeywords(value)}
              onChange={() => setKeywords("")}
              filterOption={false}
              showSearch
              placeholder="请输入手机号或昵称进行搜索"
            >
              {userOptions.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  <OptionAvatar src={item.avatar} icon={<UserOutlined />} />
                  <OptionNickname>{item.nickname}</OptionNickname>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="roleId"
            label="职位"
            rules={[{ required: true, message: "请选择职位" }]}
          >
            <Select placeholder="请选择职位">
              {roleOptions.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
