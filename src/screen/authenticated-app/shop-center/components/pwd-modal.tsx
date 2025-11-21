import { Form, Modal, Button, Input } from "antd";

import { useForm } from "antd/lib/form/Form";
import { resetPassword } from "service/auth";
import { usePwdModal } from "../util";
import { useAuth } from "context/auth-context";

export const PwdModal = () => {
  const [form] = useForm();
  const { pwdModalOpen, close } = usePwdModal();
  const { logout } = useAuth();

  const confirm = () => {
    form.validateFields().then(async () => {
      await resetPassword(form.getFieldsValue());
      closeModal();
      logout();
    });
  };

  const closeModal = () => {
    form.resetFields();
    close();
  };

  return (
    <Modal
      title="重置密码"
      onCancel={closeModal}
      open={pwdModalOpen}
      footer={
        <>
          <Button onClick={closeModal}>取消</Button>
          <Button type={"primary"} onClick={() => confirm()}>
            确定
          </Button>
        </>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="password"
          label="原始密码"
          rules={[
            {
              required: true,
              message: "请输入原始密码",
            },
          ]}
        >
          <Input.Password
            placeholder="请输入原始密码"
            autoComplete="current-password"
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="新密码"
          rules={[
            {
              required: true,
              pattern: /^(?![^a-zA-Z]+$)(?!\\D+$).{8,16}$/,
              message: "8-16位字符，必须包括字母和数字",
            },
          ]}
        >
          <Input.Password
            placeholder="请输入新密码"
            autoComplete="new-password"
          />
        </Form.Item>
        <Form.Item
          name="newPasswordConfirm"
          label="确认密码"
          validateTrigger="onBlur"
          rules={[
            ({ getFieldValue }) => ({
              required: true,
              validator(rule, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                } else {
                  return Promise.reject("两次密码不一致，请重新输入");
                }
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="请再次输入登录密码"
            autoComplete="new-password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
