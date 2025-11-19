import styled from "@emotion/styled";
import {
  Button,
  Dropdown,
  MenuProps,
  Modal,
  Table,
  TablePaginationConfig,
  TableProps,
} from "antd";
import { ButtonNoPadding, ErrorBox, Row, PageTitle } from "components/lib";
import dayjs from "dayjs";
import { useDeleteFreightTemplate } from "service/freightTemplate";
import {
  useFreightTemplateModal,
  useFreightTemplateListQueryKey,
} from "../util";
import { PlusOutlined } from "@ant-design/icons";

import type {
  FreightTemplateListSearchParams,
  FreightTemplate,
} from "types/freightTemplate";

interface ListProps extends TableProps<FreightTemplate> {
  error: Error | unknown;
  params: Partial<FreightTemplateListSearchParams>;
  setParams: (params: Partial<FreightTemplateListSearchParams>) => void;
}

export const List = ({ error, params, setParams, ...restProps }: ListProps) => {
  const { open } = useFreightTemplateModal();

  const setPagination = (pagination: TablePaginationConfig) =>
    setParams({
      ...params,
      page: pagination.current,
      limit: pagination.pageSize,
    });

  return (
    <Container>
      <Header between={true}>
        <PageTitle>运费模板</PageTitle>
        <Button onClick={() => open()} type={"primary"} icon={<PlusOutlined />}>
          新增
        </Button>
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
            title: "模板名称",
            dataIndex: "name",
          },
          {
            title: "创建时间",
            render: (value, role) => (
              <span>
                {role.createdAt
                  ? dayjs(role.createdAt).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            ),
            width: "20rem",
            sorter: (a, b) =>
              dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf(),
          },
          {
            title: "更新时间",
            render: (value, role) => (
              <span>
                {role.updatedAt
                  ? dayjs(role.updatedAt).format("YYYY-MM-DD HH:mm:ss")
                  : "无"}
              </span>
            ),
            width: "20rem",
            sorter: (a, b) =>
              dayjs(a.updatedAt).valueOf() - dayjs(b.updatedAt).valueOf(),
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
  const { startEdit } = useFreightTemplateModal();
  const { mutate: deleteFreightTemplate } = useDeleteFreightTemplate(
    useFreightTemplateListQueryKey()
  );

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "确定删除该运费模板吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk: () => deleteFreightTemplate(id),
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
  border-radius: 0.6rem;
`;

const Header = styled(Row)`
  margin-bottom: 2.4rem;
`;
