import styled from "@emotion/styled";
import { usePickupAddressListQueryKey, usePickupAddressModal } from "../util";
import { useDeletePickupAddress } from "service/pickupAddress";

import {
  Button,
  Dropdown,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
} from "antd";
import { MenuProps } from "antd/lib";
import { ButtonNoPadding, ErrorBox, PageTitle, Row } from "components/lib";
import { PlusOutlined } from "@ant-design/icons";

import type {
  PickupAddress,
  PickupAddressListSearchParams,
} from "types/pickupAddress";

interface ListProps extends TableProps<PickupAddress> {
  params: Partial<PickupAddressListSearchParams>;
  setParams: (params: Partial<PickupAddressListSearchParams>) => void;
  error: Error | unknown;
}

export const List = ({ error, params, setParams, ...restProps }: ListProps) => {
  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });

  const { open } = usePickupAddressModal();

  return (
    <Container>
      <Header between={true}>
        <PageTitle>提货地址</PageTitle>
        <Button onClick={() => open()} type={"primary"} icon={<PlusOutlined />}>
          新增
        </Button>
      </Header>
      <ErrorBox error={error} />
      <Table
        rowKey={"id"}
        columns={[
          {
            title: "编号",
            dataIndex: "id",
            width: "8rem",
            sorter: (a, b) => Number(a.id) - Number(b.id),
          },
          {
            title: "提货点名称",
            dataIndex: "name",
          },
          {
            title: "提货点地址详情",
            dataIndex: "addressDetail",
          },
          {
            title: "操作",
            render(value, role) {
              return <More id={role.id} />;
            },
            width: "8rem",
          },
        ]}
        onChange={setPagination}
        {...restProps}
      />
    </Container>
  );
};

const More = ({ id }: { id: number }) => {
  const { startEdit } = usePickupAddressModal();
  const { mutate: deleteCategoty } = useDeletePickupAddress(
    usePickupAddressListQueryKey()
  );

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "确定删除该提货地址吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk: () => deleteCategoty(id),
    });
  };

  const items: MenuProps["items"] = [
    {
      label: <div onClick={() => startEdit(id)}>编辑</div>,
      key: "edit",
    },
    {
      label: <div onClick={() => confirmDelete(id)}>删除</div>,
      key: "delete",
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};

const Container = styled.div`
  padding: 2.4rem;
  background: #fff;
`;

const Header = styled(Row)`
  margin-bottom: 2.4rem;
`;
