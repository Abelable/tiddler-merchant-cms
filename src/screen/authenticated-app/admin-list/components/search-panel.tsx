import type { AdminsSearchParams } from "types/admin";
import type { RoleOption } from "types/role";
import { useState } from "react";
import styled from "@emotion/styled";
import { Row } from "components/lib";
import { Button, Input, Select } from "antd";

export interface SearchPanelProps {
  roleOptions: RoleOption[];
  params: Partial<AdminsSearchParams>;
  setParams: (params: Partial<AdminsSearchParams>) => void;
}

const defaultParmas: Partial<AdminsSearchParams> = {
  nickname: "",
  account: "",
  roleId: undefined,
};

export const SearchPanel = ({
  roleOptions,
  params,
  setParams,
}: SearchPanelProps) => {
  const [tempParams, setTempParams] = useState(defaultParmas);

  const setAccount = (evt: any) => {
    if (!evt.target.value && evt.type !== "change") {
      setTempParams({
        ...tempParams,
        account: "",
      });
      return;
    }

    setTempParams({
      ...tempParams,
      account: evt.target.value,
    });
  };

  const setNickname = (evt: any) => {
    if (!evt.target.value && evt.type !== "change") {
      setTempParams({
        ...tempParams,
        nickname: "",
      });
      return;
    }

    setTempParams({
      ...tempParams,
      nickname: evt.target.value,
    });
  };

  const setRole = (roleId: number) => setTempParams({ ...tempParams, roleId });
  const clearRole = () => setTempParams({ ...tempParams, roleId: undefined });

  const clear = () => {
    setParams({ ...params, ...defaultParmas, page: 1 });
    setTempParams({ ...tempParams, ...defaultParmas });
  };

  return (
    <Container>
      <Item>
        <div>管理员账号：</div>
        <Input
          style={{ width: "20rem" }}
          value={tempParams.account}
          onChange={setAccount}
          placeholder="请输入管理员账号"
          allowClear
        />
      </Item>
      <Item>
        <div>管理员昵称：</div>
        <Input
          style={{ width: "20rem" }}
          value={tempParams.nickname}
          onChange={setNickname}
          placeholder="请输入管理员昵称"
          allowClear
        />
      </Item>
      <Item>
        <div>管理员岗位：</div>
        <Select
          style={{ width: "20rem" }}
          value={tempParams.roleId}
          placeholder="请选择管理员岗位"
          allowClear
          onSelect={setRole}
          onClear={clearRole}
        >
          {roleOptions?.map(({ id, name }) => (
            <Select.Option key={id} value={id}>
              {name}
            </Select.Option>
          ))}
        </Select>
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
