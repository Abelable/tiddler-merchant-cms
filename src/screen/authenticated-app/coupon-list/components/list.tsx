import {
  Button,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
  Image,
  Dropdown,
  MenuProps,
  Tag,
} from "antd";
import { ErrorBox, Row, PageTitle, ButtonNoPadding } from "components/lib";
import { PlusOutlined } from "@ant-design/icons";

import styled from "@emotion/styled";
import dayjs from "dayjs";
import { useDeleteCoupon, useDownCoupon, useUpCoupon } from "service/coupon";
import { useCouponModal, useCouponListQueryKey } from "../util";

import type { SearchPanelProps } from "./search-panel";
import type { Coupon, CouponListSearchParams } from "types/coupon";

interface ListProps
  extends TableProps<Coupon>,
    Omit<SearchPanelProps, "goodsOptions"> {
  params: Partial<CouponListSearchParams>;
  setParams: (params: Partial<CouponListSearchParams>) => void;
  error: Error | unknown;
}

export const List = ({
  statusOptions,
  typeOptions,
  error,
  params,
  setParams,
  ...restProps
}: ListProps) => {
  const { open } = useCouponModal();

  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });

  return (
    <Container>
      <Header between={true}>
        <PageTitle>优惠券列表</PageTitle>
        <Button onClick={() => open()} type={"primary"} icon={<PlusOutlined />}>
          新增
        </Button>
      </Header>
      <ErrorBox error={error} />
      <Table
        rowKey={"id"}
        scroll={{ x: 2000 }}
        columns={[
          {
            title: "id",
            dataIndex: "id",
            width: "8rem",
            fixed: "left",
          },
          {
            title: "名称",
            dataIndex: "name",
            width: "16rem",
          },
          {
            title: "面额",
            dataIndex: "denomination",
            render: (value) => <>{`¥${value}`}</>,
            width: "10rem",
          },
          {
            title: "类型",
            dataIndex: "type",
            render: (value) => (
              <Tag color="gold">
                {typeOptions.find((item) => item.value === value)?.text}
              </Tag>
            ),
            width: "12rem",
          },
          {
            title: "使用门槛",
            dataIndex: "type",
            render: (value, coupon) => (
              <>
                {coupon.type === 1
                  ? "无"
                  : coupon.type === 2
                  ? `满${coupon.numLimit}件可用`
                  : `满${coupon.priceLimit}元可用`}
              </>
            ),
            width: "12rem",
          },
          {
            title: "状态",
            dataIndex: "status",
            width: "8rem",
            render: (value) => (
              <div style={{ color: ["#1890ff", "#999", "#ff4d4f"][value - 1] }}>
                {statusOptions.find((item) => item.value === value)?.text}
              </div>
            ),
          },
          {
            title: "商品信息",
            children: [
              {
                title: "id",
                dataIndex: "goodsId",
                width: "8rem",
              },
              {
                title: "封面",
                dataIndex: "goodsCover",
                width: "12rem",
                render: (value) => <Image width={68} src={value} />,
              },
              {
                title: "名称",
                dataIndex: "goodsName",
                width: "30rem",
              },
            ],
          },
          {
            title: "领取数",
            dataIndex: "receivedNum",
            width: "12rem",
          },
          {
            title: "补充说明",
            dataIndex: "description",
            width: "30rem",
          },
          {
            title: "失效时间",
            dataIndex: "expirationTime",
            width: "20rem",
            render: (value) => (
              <span>
                {value ? dayjs(value).format("YYYY-MM-DD HH:mm:ss") : "无"}
              </span>
            ),
          },
          {
            title: "创建时间",
            width: "20rem",
            render: (value, goods) => (
              <span>
                {goods.createdAt
                  ? dayjs(goods.createdAt).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            ),
            sorter: (a, b) =>
              dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
          },
          {
            title: "操作",
            render(value, goods) {
              return <More id={goods.id} status={goods.status} />;
            },
            width: "8rem",
            fixed: "right",
          },
        ]}
        onChange={setPagination}
        {...restProps}
      />
    </Container>
  );
};

const More = ({ id, status }: { id: number; status: number }) => {
  const { startEdit } = useCouponModal();
  const { mutate: deleteCoupon } = useDeleteCoupon(useCouponListQueryKey());
  const { mutate: downCoupon } = useDownCoupon(useCouponListQueryKey());
  const { mutate: upCoupon } = useUpCoupon(useCouponListQueryKey());

  const confirmDown = (id: number) => {
    Modal.confirm({
      title: "确定下架该优惠券吗？",
      content: "点击确定下架",
      okText: "确定",
      cancelText: "取消",
      onOk: () => downCoupon(id),
    });
  };

  const confirmUp = (id: number) => {
    Modal.confirm({
      title: "确定上架该优惠券吗？",
      content: "点击确定上架",
      okText: "确定",
      cancelText: "取消",
      onOk: () => upCoupon(id),
    });
  };

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "确定删除该优惠券吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk: () => deleteCoupon(id),
    });
  };

  const items: MenuProps["items"] =
    status === 1
      ? [
          {
            label: <div onClick={() => startEdit(id)}>编辑</div>,
            key: "edit",
          },
          {
            label: <div onClick={() => confirmDown(id)}>下架</div>,
            key: "down",
          },
          {
            label: <div onClick={() => confirmDelete(id)}>删除</div>,
            key: "delete",
          },
        ]
      : [
          {
            label: <div onClick={() => startEdit(id)}>编辑</div>,
            key: "edit",
          },
          {
            label: <div onClick={() => confirmUp(id)}>上架</div>,
            key: "down",
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
  border-radius: 0.6rem;
`;

const Header = styled(Row)`
  margin-bottom: 2.4rem;
`;
