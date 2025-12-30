import styled from "@emotion/styled";
import {
  Image,
  Dropdown,
  MenuProps,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
  Button,
  Tag,
  InputNumber,
  Tooltip,
} from "antd";
import { ButtonNoPadding, ErrorBox, Row, PageTitle } from "components/lib";
import { PlusOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import {
  useDeleteGoods,
  useDownGoods,
  useEditStock,
  useEditCommission,
  useUpGoods,
  useEditSort,
} from "service/goods";
import { useGoodsModal, useGoodsListQueryKey } from "../util";
import { SearchPanelProps } from "./search-panel";

import type { Goods } from "types/goods";

interface ListProps extends TableProps<Goods>, SearchPanelProps {
  error: Error | unknown;
}

export const List = ({
  statusOptions,
  categoryOptions,
  error,
  params,
  setParams,
  ...restProps
}: ListProps) => {
  const { open } = useGoodsModal();

  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });

  const { mutate: editStock } = useEditStock(useGoodsListQueryKey());
  const { mutate: editCommission } = useEditCommission(useGoodsListQueryKey());
  const { mutate: editSort } = useEditSort(useGoodsListQueryKey());

  return (
    <Container>
      <Header between={true}>
        <PageTitle>商品列表</PageTitle>
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
            title: "状态",
            dataIndex: "status",
            render: (value, goods) =>
              value === 0 ? (
                <span style={{ color: "#faad14" }}>审核中</span>
              ) : value === 1 ? (
                <span style={{ color: "#296BEF" }}>出售中</span>
              ) : value === 1 ? (
                <Tooltip title={goods.failureReason}>
                  <span style={{ color: "#f50", cursor: "pointer" }}>
                    未过审
                  </span>
                </Tooltip>
              ) : (
                <span style={{ color: "#999" }}>已下架</span>
              ),
            filters: statusOptions,
            onFilter: (value, goods) => goods.status === value,
            width: "12rem",
          },
          {
            title: "图片",
            dataIndex: "cover",
            render: (value) => <Image width={68} src={value} />,
            width: "10rem",
          },
          {
            title: "名称",
            dataIndex: "name",
            width: "32rem",
          },
          {
            title: "分类",
            dataIndex: "categoryIds",
            render: (value) =>
              value.map((id: number) => (
                <Tag key={id}>
                  {categoryOptions.find((item) => item.id === id)?.name}
                </Tag>
              )),
            width: "18rem",
          },
          {
            title: "价格",
            dataIndex: "price",
            render: (value) => <>{`¥${value}`}</>,
            width: "12rem",
          },
          {
            title: "销量",
            dataIndex: "salesVolume",
            width: "12rem",
          },
          {
            title: "库存",
            dataIndex: "stock",
            render: (value, goods) => (
              <InputNumber
                value={value}
                onChange={(stock) => editStock({ id: goods.id, stock })}
              />
            ),
            width: "12rem",
          },
          {
            title: "销售佣金比例",
            dataIndex: "salesCommissionRate",
            render: (value, goods) => {
              const selectedCategories = categoryOptions.filter((item) =>
                goods.categoryIds.includes(item.id)
              );
              const minSalesCommissionRate = Math.max(
                ...selectedCategories.map(
                  (item) => item.minSalesCommissionRate || 0
                )
              );
              const maxSalesCommissionRate = Math.min(
                ...selectedCategories.map(
                  (item) => item.maxSalesCommissionRate || Infinity
                )
              );
              return (
                <InputNumber
                  min={minSalesCommissionRate}
                  max={maxSalesCommissionRate}
                  value={value}
                  onChange={(salesCommissionRate) =>
                    editCommission({ id: goods.id, salesCommissionRate })
                  }
                  suffix="%"
                />
              );
            },
            width: "12rem",
          },
          {
            title: "排序",
            dataIndex: "sort",
            render: (value, goods) => (
              <InputNumber
                value={value}
                onChange={(sort) => editSort({ id: goods.id, sort })}
              />
            ),
            width: "12rem",
          },
          {
            title: "创建时间",
            render: (value, goods) => (
              <span>
                {goods.createdAt
                  ? dayjs(goods.createdAt).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            ),
            width: "20rem",
            sorter: (a, b) =>
              dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
          },
          {
            title: "更新时间",
            render: (value, goods) => (
              <span>
                {goods.updatedAt
                  ? dayjs(goods.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            ),
            width: "20rem",
            sorter: (a, b) =>
              dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
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
  const { startEdit } = useGoodsModal();
  const { mutate: deleteGoods } = useDeleteGoods(useGoodsListQueryKey());
  const { mutate: upGoods } = useUpGoods(useGoodsListQueryKey());
  const { mutate: downGoods } = useDownGoods(useGoodsListQueryKey());

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "确定删除该商品吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk: () => deleteGoods(id),
    });
  };

  const confirmDown = (id: number) => {
    Modal.confirm({
      title: "确定下架该商品吗？",
      content: "点击确定下架",
      okText: "确定",
      cancelText: "取消",
      onOk: () => downGoods(id),
    });
  };

  const confirmUp = (id: number) => {
    Modal.confirm({
      title: "确定上架该商品吗？",
      content: "点击确定上架",
      okText: "确定",
      cancelText: "取消",
      onOk: () => upGoods(id),
    });
  };

  const items: MenuProps["items"] = [1, 3].includes(status)
    ? [
        {
          label: (
            <div
              onClick={() => (status === 1 ? confirmDown(id) : confirmUp(id))}
            >
              {status === 1 ? "下架" : "上架"}
            </div>
          ),
          key: status === 1 ? "down" : "up",
        },
        {
          label: <div onClick={() => startEdit(id)}>编辑</div>,
          key: "edit",
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
  margin-top: 2.4rem;
  padding: 2.4rem;
  background: #fff;
  border-radius: 0.6rem;
`;

const Header = styled(Row)`
  margin-bottom: 2.4rem;
`;
