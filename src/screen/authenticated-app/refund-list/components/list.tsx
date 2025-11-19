import styled from "@emotion/styled";
import {
  Dropdown,
  MenuProps,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
} from "antd";
import { ButtonNoPadding, ErrorBox, Row, PageTitle } from "components/lib";
import dayjs from "dayjs";
import { useApprovedRefund, useDeleteRefund } from "service/refund";
import {
  useRefundModal,
  useRefundListQueryKey,
  useRejectModal,
  useShippingModal,
} from "../util";
import { SearchPanelProps } from "./search-panel";

import type { Refund } from "types/refund";

interface ListProps extends TableProps<Refund>, SearchPanelProps {
  error: Error | unknown;
}

export const List = ({
  statusOptions,
  error,
  params,
  setParams,
  ...restProps
}: ListProps) => {
  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });

  return (
    <Container>
      <Header between={true}>
        <PageTitle>售后列表</PageTitle>
      </Header>
      <ErrorBox error={error} />
      <Table
        rowKey={"id"}
        columns={[
          {
            title: "id",
            dataIndex: "id",
            width: "8rem",
          },
          {
            title: "订单编号",
            dataIndex: "orderSn",
          },
          {
            title: "状态",
            dataIndex: "status",
            render: (value) => (
              <div
                style={{ color: [0, 2].includes(value) ? "#faad14" : "#000" }}
              >
                {statusOptions.find((item) => item.value === value)?.text}
              </div>
            ),
            filters: statusOptions,
            onFilter: (value, refund) => refund.status === value,
          },
          {
            title: "退款方式",
            dataIndex: "refundType",
            render: (value) => <>{value === 1 ? "仅退款" : "退货退款"}</>,
          },
          {
            title: "退款金额",
            dataIndex: "refundAmount",
            render: (value) => <>¥{value}</>,
          },
          {
            title: "提交时间",
            render: (value, refund) => (
              <span>
                {refund.createdAt
                  ? dayjs(refund.createdAt).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            ),
            sorter: (a, b) =>
              dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
          },
          {
            title: "处理时间",
            render: (value, refund) => (
              <span>
                {refund.updatedAt
                  ? dayjs(refund.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            ),
            sorter: (a, b) =>
              dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
          },
          {
            title: "操作",
            render(value, refund) {
              return <More refund={refund} />;
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

const More = ({ refund }: { refund: Refund }) => {
  const { open: openRefundModal } = useRefundModal();
  const { open: openRejectModal } = useRejectModal();
  const { open: openShippingModal } = useShippingModal();
  const { mutate: approvedRefund } = useApprovedRefund(useRefundListQueryKey());
  const { mutate: deleteRefund } = useDeleteRefund(useRefundListQueryKey());

  const confirmApproved = () => {
    Modal.confirm({
      title: "请核实信息之后，再确定售后申请",
      content: `点击确定${refund.refundType === 1 ? "同意退款" : "同意退货"}`,
      okText: "确定",
      cancelText: "取消",
      onOk: () => approvedRefund(refund.id),
    });
  };

  const confirmReceived = () => {
    Modal.confirm({
      title: "确认收货之前，请核实物流信息",
      content: "点击确定确认收货并退款",
      okText: "确定",
      cancelText: "取消",
      onOk: () => approvedRefund(refund.id),
    });
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "确定删除该售后申请吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk: () => deleteRefund(refund.id),
    });
  };

  let items: MenuProps["items"];
  switch (refund.status) {
    case 0:
      items = [
        {
          label: <div onClick={() => openRefundModal(refund.id)}>详情</div>,
          key: "detail",
        },
        {
          label: (
            <div onClick={() => confirmApproved()}>
              {refund.refundType === 1 ? "同意退款" : "同意退货"}
            </div>
          ),
          key: "approved",
        },
        {
          label: (
            <div onClick={() => openRejectModal(refund.id)}>
              {refund.refundType === 1 ? "拒绝退款" : "拒绝退货"}
            </div>
          ),
          key: "reject",
        },
      ];
      break;

    case 1:
      items = [
        {
          label: <div onClick={() => openRefundModal(refund.id)}>详情</div>,
          key: "detail",
        },
      ];
      break;

    case 2:
      items = [
        {
          label: <div onClick={() => openRefundModal(refund.id)}>详情</div>,
          key: "detail",
        },
        {
          label: <div onClick={() => openShippingModal(refund.id)}>物流</div>,
          key: "express",
        },
        {
          label: <div onClick={() => confirmReceived()}>确认收货</div>,
          key: "received",
        },
      ];
      break;

    case 3:
      items = [
        {
          label: <div onClick={() => openRefundModal(refund.id)}>详情</div>,
          key: "detail",
        },
        {
          label: <div onClick={() => confirmDelete()}>删除</div>,
          key: "delete",
        },
      ];
      break;
    case 4:
      items = [
        {
          label: <div onClick={() => openRefundModal(refund.id)}>详情</div>,
          key: "detail",
        },
      ];
      break;
  }

  return (
    <Dropdown menu={{ items }}>
      <ButtonNoPadding type={"link"}>...</ButtonNoPadding>
    </Dropdown>
  );
};

const Container = styled.div`
  margin-top: 2.4rem;
  padding: 2.4rem;
  background: #fff;
  border-radius: 0.6rem;
`;

const Header = styled(Row)`
  margin-bottom: 2.4rem;
`;
