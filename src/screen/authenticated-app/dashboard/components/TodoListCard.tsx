import styled from "@emotion/styled";
import { Badge, Card, Empty } from "antd";
import { ButtonNoPadding, PageTitle, Row } from "components/lib";
import { Link } from "react-router-dom";
import type { Todo } from "types/dashboard";

const typeOptions = [
  { desc: "您有一笔待发货订单，请及时处理", path: "/order_list", value: 400 },
  {
    desc: "您有一笔售后处理订单，请及时处理",
    path: "/order_refund",
    value: 500,
  },
];

export const TodoListCard = ({
  todoList,
  loading,
}: {
  todoList: Todo[];
  loading: boolean;
}) => (
  <Card
    loading={loading}
    title={
      <Row>
        <PageTitle>代办事项</PageTitle>
        <Badge style={{ marginLeft: "0.8rem" }} count={todoList.length} />
      </Row>
    }
    style={{ marginLeft: "2.4rem", flex: 1 }}
  >
    {todoList.length ? (
      <div style={{ height: "37rem", overflowY: "scroll" }}>
        {todoList.map((item, index) => (
          <TodoItem key={index}>
            <Badge
              status="processing"
              text={
                typeOptions.find((_item) => _item.value === item.type)?.desc
              }
            />
            <Link
              to={
                typeOptions.find((_item) => _item.value === item.type)?.path ||
                ""
              }
            >
              <ButtonNoPadding type="link">立即处理</ButtonNoPadding>
            </Link>
          </TodoItem>
        ))}
      </div>
    ) : (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="暂无代办事项"
        style={{ marginTop: "12rem" }}
      />
    )}
  </Card>
);

const TodoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  padding-left: 0.4rem;
  width: 100%;
`;
