import styled from "@emotion/styled";
import { useRefundAddressListQueryKey, useRefundAddressModal } from "../util";
import { useDeleteRefundAddress } from "service/refundAddress";

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
  RefundAddress,
  RefundAddressListSearchParams,
} from "types/refundAddress";

interface ListProps extends TableProps<RefundAddress> {
  params: Partial<RefundAddressListSearchParams>;
  setParams: (params: Partial<RefundAddressListSearchParams>) => void;
  error: Error | unknown;
}

export const List = ({ error, params, setParams, ...restProps }: ListProps) => {
  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });

  const { open } = useRefundAddressModal();

  return (
    <Container>
      <Header between={true}>
        <PageTitle>退货地址</PageTitle>
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
            title: "收件人姓名",
            dataIndex: "consigneeName",
          },
          {
            title: "收件人手机号",
            dataIndex: "mobile",
          },
          {
            title: "收件地址",
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
  const { startEdit } = useRefundAddressModal();
  const { mutate: deleteCategoty } = useDeleteRefundAddress(
    useRefundAddressListQueryKey()
  );

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "确定删除该退货地址吗？",
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
