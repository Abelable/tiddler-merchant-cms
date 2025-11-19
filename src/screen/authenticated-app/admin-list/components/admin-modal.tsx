import { Button, Col, Drawer, Form, Input, Row, Select, Space } from "antd";
import { useForm } from "antd/lib/form/Form";
import { ErrorBox, ModalLoading } from "components/lib";
import { useAddAdmin } from "service/admin";
import { useAdminModal, useAdminsQueryKey } from "../util";
import { useEditAdmin } from "service/admin";
import { useEffect } from "react";
import { OssUpload } from "components/oss-upload";
import type { RoleOption } from "types/role";

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

export const AdminModal = ({ roleOptions }: { roleOptions: RoleOption[] }) => {
  const [form] = useForm();
  const { adminModalOpen, editingAdminId, editingAdmin, isLoading, close } =
    useAdminModal();

  const useMutateAdmin = editingAdminId ? useEditAdmin : useAddAdmin;
  const {
    mutateAsync,
    isLoading: mutateLoading,
    error,
  } = useMutateAdmin(useAdminsQueryKey());

  useEffect(() => {
    if (editingAdmin) {
      const { avatar, ...rest } = editingAdmin;
      form.setFieldsValue({ avatar: avatar ? [{ url: avatar }] : [], ...rest });
    }
  }, [editingAdmin, form]);

  const submit = () => {
    form.validateFields().then(async () => {
      const { avatar, ...rest } = form.getFieldsValue();
      await mutateAsync({
        ...editingAdmin,
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
      title={editingAdminId ? "编辑管理员" : "新增管理员"}
      size={"large"}
      onClose={closeModal}
      open={adminModalOpen}
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
                label="管理员头像"
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
              <Form.Item name="nickname" label="管理员昵称">
                <Input placeholder="请输入管理员昵称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="roleId"
                label="管理员岗位"
                rules={[{ required: true, message: "请选择管理员岗位" }]}
              >
                <Select placeholder="请选择管理员岗位">
                  {roleOptions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {editingAdminId ? (
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
                  label="管理员账号"
                  rules={[{ required: true, message: "请输入管理员账号" }]}
                >
                  <Input placeholder="请输入管理员账号" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="管理员账号密码"
                  rules={[{ required: true, message: "请输入管理员账号密码" }]}
                >
                  <Input.Password
                    placeholder="请输入管理员账号密码"
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
