import { GoodsCover, OptionAvatar, Row } from "components/lib";
import { Button, Input, Select } from "antd";
import { UserOutlined } from "@ant-design/icons";

import { useState } from "react";
import styled from "@emotion/styled";

import type { OperatorOption, Option } from "types/common";
import type { OrderListSearchParams } from "types/order";

export interface SearchPanelProps {
  statusOptions: Option[];
  merchantOptions: OperatorOption[];
  userOptions: { id: number; avatar: string; nickname: string }[];
  goodsOptions: { id: number; cover: string; name: string }[];
  params: Partial<OrderListSearchParams>;
  setParams: (params: Partial<OrderListSearchParams>) => void;
}

const defaultParmas: Partial<OrderListSearchParams> = {
  orderSn: "",
  status: undefined,
  goodsId: undefined,
  merchantId: undefined,
  userId: undefined,
  consignee: "",
  mobile: "",
};

export const SearchPanel = ({
  statusOptions,
  merchantOptions,
  userOptions,
  goodsOptions,
  params,
  setParams,
}: SearchPanelProps) => {
  const [tempParams, setTempParams] = useState(defaultParmas);

  const setOrderSn = (evt: any) => {
    if (!evt.target.value && evt.type !== "change") {
      setTempParams({
        ...tempParams,
        orderSn: "",
      });
      return;
    }

    setTempParams({
      ...tempParams,
      orderSn: evt.target.value,
    });
  };

  const setStatus = (status: number) =>
    setTempParams({ ...tempParams, status });
  const clearStatus = () => setTempParams({ ...tempParams, status: undefined });

  const setMerchant = (merchantId: number) =>
    setTempParams({ ...tempParams, merchantId });
  const clearMerchant = () =>
    setTempParams({ ...tempParams, merchantId: undefined });

  const setUser = (userId: number) => setTempParams({ ...tempParams, userId });
  const clearUser = () => setTempParams({ ...tempParams, userId: undefined });

  const setGoodsId = (goodsId: number) =>
    setTempParams({ ...tempParams, goodsId });
  const clearGoodsId = () =>
    setTempParams({ ...tempParams, goodsId: undefined });

  const setConsignee = (evt: any) => {
    if (!evt.target.value && evt.type !== "change") {
      setTempParams({
        ...tempParams,
        consignee: "",
      });
      return;
    }

    setTempParams({
      ...tempParams,
      consignee: evt.target.value,
    });
  };

  const setMobile = (evt: any) => {
    if (!evt.target.value && evt.type !== "change") {
      setTempParams({
        ...tempParams,
        mobile: "",
      });
      return;
    }

    setTempParams({
      ...tempParams,
      mobile: evt.target.value,
    });
  };

  const clear = () => {
    setParams({ ...params, ...defaultParmas, page: 1 });
    setTempParams({ ...tempParams, ...defaultParmas });
  };

  return (
    <Container>
      <Item>
        <div>订单编号：</div>
        <Input
          style={{ width: "20rem" }}
          value={tempParams.orderSn}
          onChange={setOrderSn}
          placeholder="请输入订单编号"
          allowClear
        />
      </Item>
      <Item>
        <div>订单状态：</div>
        <Select
          style={{ width: "20rem" }}
          value={tempParams.status}
          placeholder="请选择订单状态"
          allowClear
          onSelect={setStatus}
          onClear={clearStatus}
        >
          {statusOptions?.map(({ text, value }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </Select>
      </Item>
      <Item>
        <div>订单商品：</div>
        <Select
          style={{ width: "20rem" }}
          value={tempParams.goodsId}
          placeholder="请选择订单商品"
          allowClear
          onSelect={setGoodsId}
          onClear={clearGoodsId}
          showSearch
          filterOption={(input, option) =>
            (option!.children as any)[1].props.children
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {goodsOptions.map(({ id, cover, name }) => (
            <Select.Option key={id} value={id}>
              <GoodsCover src={cover} />
              <span>{name}</span>
            </Select.Option>
          ))}
        </Select>
      </Item>
      <Item>
        <div>商家：</div>
        <Select
          style={{ width: "20rem" }}
          value={tempParams.merchantId}
          placeholder="请选择商家"
          allowClear
          onSelect={setMerchant}
          onClear={clearMerchant}
          showSearch
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {merchantOptions?.map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
      </Item>
      <Item>
        <div>下单用户：</div>
        <Select
          style={{ width: "20rem" }}
          value={tempParams.userId}
          placeholder="请选择下单用户"
          allowClear
          onSelect={setUser}
          onClear={clearUser}
          showSearch
          filterOption={(input, option) =>
            (option!.children as any)[1].props.children
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {userOptions?.map(({ id, avatar, nickname }) => (
            <Select.Option key={id} value={id}>
              <OptionAvatar src={avatar} icon={<UserOutlined />} />
              <span>{nickname}</span>
            </Select.Option>
          ))}
        </Select>
      </Item>
      <Item>
        <div>收件人姓名：</div>
        <Input
          style={{ width: "20rem" }}
          value={tempParams.consignee}
          onChange={setConsignee}
          placeholder="请输入收件人姓名"
          allowClear
        />
      </Item>
      <Item>
        <div>收件人手机号：</div>
        <Input
          style={{ width: "20rem" }}
          value={tempParams.mobile}
          onChange={setMobile}
          placeholder="请输入收件人手机号"
          allowClear
        />
      </Item>

      <ButtonWrap gap={true}>
        <Button onClick={clear}>重置</Button>
        <Button
          type={"primary"}
          style={{ marginRight: 0 }}
          onClick={() => setParams({ ...params, ...tempParams, page: 1 })}
        >
          查询
        </Button>
      </ButtonWrap>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1.6rem;
  padding: 2.4rem 16.8rem 0 2.4rem;
  background: #fff;
  border-radius: 0.6rem;
`;

const Item = styled(Row)`
  margin-right: 2rem;
  padding-bottom: 2.4rem;
`;

const ButtonWrap = styled(Row)`
  position: absolute;
  right: 2.4rem;
  bottom: 2.4rem;
`;
