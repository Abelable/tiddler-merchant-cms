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
} from "antd";
import { ButtonNoPadding, ErrorBox, Row, PageTitle } from "components/lib";
import { PlusOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import {
  useDeleteGoods,
  useDownGoods,
  useEditSales,
  useUpGoods,
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

  const { mutate: editSales } = useEditSales(useGoodsListQueryKey());

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
          // {
          //   title: "分类",
          //   dataIndex: "categoryIds",
          //   render: (value) => (
          //     <>
          //       {value.map((id: string) => (
          //         <Tag key={id} color="orange">
          //           {categoryOptions.find((item) => item.id === +id)?.name}
          //         </Tag>
          //       ))}
          //     </>
          //   ),
          //   width: "18rem",
          // },
          {
            title: "状态",
            dataIndex: "status",
            render: (value, goods) =>
              value === 2 ? (
                <span style={{ color: "#f50" }}>已下架</span>
              ) : (
                <span style={{ color: "#296BEF" }}>售卖中</span>
              ),
            filters: [
              { text: "售卖中", value: 1 },
              { text: "已下架", value: 2 },
            ],
            onFilter: (value, goods) => goods.status === value,
            width: "8rem",
          },
          {
            title: "价格",
            dataIndex: "price",
            render: (value) => <>{`¥${value}`}</>,
          },
          {
            title: "销量",
            dataIndex: "salesVolume",
            width: "12rem",
            render: (value, goods) => (
              <InputNumber
                value={value}
                onChange={(sales) => editSales({ id: goods.id, sales })}
              />
            ),
          },
          {
            title: "库存",
            dataIndex: "stock",
          },
          {
            title: "佣金比例",
            dataIndex: "commissionRate",
            render: (value) => <>{`${value}%`}</>,
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

  const items: MenuProps["items"] = [
    {
      label: <div onClick={() => startEdit(id)}>编辑</div>,
      key: "edit",
    },
    {
      label: (
        <div onClick={() => (status === 1 ? confirmDown(id) : confirmUp(id))}>
          {status === 1 ? "下架" : "上架"}
        </div>
      ),
      key: status === 1 ? "down" : "up",
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
