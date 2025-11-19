import styled from "@emotion/styled";
import { useManagerList } from "service/manager";
import { toNumber } from "utils";
import { useManagerListSearchParams } from "./util";
import { ManagerModal } from "./components/manager-modal";
import { List } from "./components/list";
import { SearchPanel } from "./components/search-panel";

const roleOptions = [
  { id: 1, name: "超级管理员" },
  { id: 2, name: "运营" },
  { id: 3, name: "核销员" },
  { id: 4, name: "客服" },
];

export const ManagerList = () => {
  const [params, setParams] = useManagerListSearchParams();
  const { isLoading, error, data } = useManagerList(params);

  return (
    <Container>
      <Main>
        <SearchPanel
          roleOptions={roleOptions || []}
          params={params}
          setParams={setParams}
        />
        <List
          roleOptions={roleOptions || []}
          params={params}
          setParams={setParams}
          error={error}
          loading={isLoading}
          dataSource={data?.list}
          pagination={{
            current: toNumber(data?.page) || 1,
            pageSize: toNumber(data?.limit),
            total: toNumber(data?.total),
          }}
          bordered
        />
      </Main>
      <ManagerModal roleOptions={roleOptions || []} />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const Main = styled.div`
  padding: 2.4rem;
  height: 100%;
  overflow: scroll;
`;
