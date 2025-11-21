import { useAuth } from "context/auth-context";
import { Form, Input } from "antd";
import { useAsync } from "utils/use-async";
import { LongButton } from "components/lib";

export const LoginScreen = ({
  onError,
}: {
  onError: (error: Error) => void;
}) => {
  const { login } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });

  // HTMLFormElement extends Element
  const handleSubmit = async (values: { mobile: string; password: string }) => {
    try {
      await run(login(values));
    } catch (e: any) {
      onError(e);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name={"mobile"}
        rules={[{ required: true, message: "请输入手机号" }]}
      >
        <Input placeholder={"请输入手机号"} id={"account"} />
      </Form.Item>
      <Form.Item
        name={"password"}
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input.Password
          placeholder={"请输入密码"}
          type="password"
          id={"password"}
          autoComplete="current-password"
        />
      </Form.Item>
      <Form.Item>
        <LongButton loading={isLoading} htmlType={"submit"} type={"primary"}>
          登录
        </LongButton>
      </Form.Item>
    </Form>
  );
};
