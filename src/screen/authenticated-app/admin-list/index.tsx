import styled from "@emotion/styled";
import { useAdmins } from "service/admin";
import { useRoleOptions } from "service/role";
import { toNumber } from "utils";
import { useAdminsSearchParams } from "./util";
import { AdminModal } from "./components/admin-modal";
import { List } from "./components/list";
import { SearchPanel } from "./components/search-panel";

export const AdminList = () => {
  const [params, setParams] = useAdminsSearchParams();
  const { isLoading, error, data } = useAdmins(params);
  const { data: roleOptions, error: roleOptionsError } = useRoleOptions();

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
          error={error || roleOptionsError}
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
      <AdminModal roleOptions={roleOptions || []} />
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
