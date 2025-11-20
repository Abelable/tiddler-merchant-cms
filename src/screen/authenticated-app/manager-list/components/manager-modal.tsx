import { Button, Col, Drawer, Form, Input, Row, Select, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { useForm } from "antd/lib/form/Form";

import {
  ErrorBox,
  ModalLoading,
  OptionAvatar,
  OptionNickname,
} from "components/lib";
import { useAddManager, useUserOptions } from "service/manager";
import { useManagerModal, useManagerListQueryKey } from "../util";
import { useEditManager } from "service/manager";
import { useEffect, useState } from "react";
import { OssUpload } from "components/oss-upload";
import { useDebounce } from "utils";
import type { RoleOption } from "types/role";

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

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
    <Drawer
      forceRender={true}
      title={editingManagerId ? "编辑人员" : "新增人员"}
      size={"large"}
      onClose={closeModal}
      open={managerModalOpen}
      styles={{
        body: { paddingBottom: 80 },
      }}
      extra={
        <Space>
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={submit} loading={mutateLoading} type="primary">
            提交
          </Button>
        </Space>
      }
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="avatar"
                label="人员头像"
                tooltip="图片大小不能超过10MB"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <OssUpload maxCount={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nickname" label="人员昵称">
                <Input placeholder="请输入人员昵称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleId"
                label="人员岗位"
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
            </Col>
          </Row>
          {editingManagerId ? (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="password" label="重置密码">
                  <Input.Password
                    placeholder="请输入新的密码"
                    autoComplete="new-password"
                  />
                </Form.Item>
              </Col>
            </Row>
          ) : (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="account"
                  label="人员账号"
                  rules={[{ required: true, message: "请输入人员账号" }]}
                >
                  <Input placeholder="请输入人员账号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="人员账号密码"
                  rules={[{ required: true, message: "请输入人员账号密码" }]}
                >
                  <Input.Password
                    placeholder="请输入人员账号密码"
                    autoComplete="new-password"
                  />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      )}
    </Drawer>
  );
};
