import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useShopInfo, useUpdateShopInfo } from "service/auth";

import { Button, Col, Form, Input, Menu, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { OssUpload } from "components/oss-upload";
import { PwdModal } from "./components/pwd-modal";
import { usePwdModal } from "./util";

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

const menuOptions = [
  {
    key: "base",
    label: "基本设置",
  },
  {
    key: "security",
    label: "安全设置",
  },
];

export const ShopCenter = () => {
  const [form] = useForm();
  const [selectKey, setSelectKey] = useState("base");

  const { data: shopInfo } = useShopInfo();
  const { mutateAsync, isLoading: mutateLoading } = useUpdateShopInfo();
  const { open } = usePwdModal();

  useEffect(() => {
    if (shopInfo) {
      const { bg, logo, ...rest } = shopInfo;
      form.setFieldsValue({
        bg: bg ? [{ url: bg }] : [],
        logo: logo ? [{ url: logo }] : [],
        ...rest,
      });
    }
  }, [shopInfo, form]);

  const submit = () => {
    form.validateFields().then(async () => {
      const { bg, logo, ...rest } = form.getFieldsValue();
      await mutateAsync({
        bg: bg && bg.length ? bg[0].url : "",
        logo: logo && logo.length ? logo[0].url : "",
        ...rest,
      });
    });
  };

  return (
    <Container>
      <Main>
        <Menu
          style={{ width: "22.4rem", height: "100%" }}
          items={menuOptions}
          selectedKeys={[selectKey]}
          onClick={({ key }: { key: string }) => setSelectKey(key)}
        />
        <Content>
          <Title>
            {menuOptions.find((item) => item.key === selectKey)?.label}
          </Title>
          {selectKey === "base" ? (
            <div>
              <Form
                style={{ marginTop: "3rem", width: "80rem" }}
                form={form}
                layout="vertical"
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="bg"
                      label="店铺背景图"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                    >
                      <OssUpload maxCount={1} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="logo"
                      label="店铺头像"
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                    >
                      <OssUpload maxCount={1} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="name" label="店铺名称">
                      <Input placeholder="请输入店铺名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="brief" label="店铺简介">
                      <Input placeholder="请输入店铺简介" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="ownerName" label="店主姓名">
                      <Input placeholder="请输入店主姓名" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="mobile" label="联系方式">
                      <Input placeholder="请输入联系方式" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Button
                style={{ marginTop: "3rem" }}
                type={"primary"}
                onClick={submit}
                loading={mutateLoading}
              >
                更新基本信息
              </Button>
            </div>
          ) : (
            <div style={{ marginTop: "2rem" }}>
              <SecurityItem>
                <div>
                  <SecurityTitle>账户密码</SecurityTitle>
                  <SecurityContent>当前密码强度：强</SecurityContent>
                </div>
                <Button type="link" onClick={open}>
                  修改
                </Button>
              </SecurityItem>
            </div>
          )}
        </Content>
      </Main>
      <PwdModal />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  padding: 2.4rem;
  height: 100%;
`;
const Main = styled.div`
  position: relative;
  display: flex;
  padding: 2.4rem;
  height: 100%;
  background: #fff;
  border-radius: 0.6rem;
`;
const Content = styled.div`
  padding: 0.8rem 4rem;
  flex: 1;
`;
const Title = styled.div`
  color: rgba(0, 0, 0, 0.88);
  font-size: 2rem;
  font-weight: 500;
`;

const SecurityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 0;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
`;
const SecurityTitle = styled.div`
  color: rgba(0, 0, 0, 0.88);
  font-size: 1.4rem;
  font-weight: 500;
`;
const SecurityContent = styled.div`
  margin-top: 1rem;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1.4rem;
`;
