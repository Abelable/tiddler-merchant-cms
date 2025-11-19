import styled from "@emotion/styled";
import { toNumber } from "utils";
import { useFreightTemplateListSearchParams } from "./util";
import { useFreightTemplateList } from "service/freightTemplate";

import { List } from "./components/list";
import { FreightTemplateModal } from "./components/freight-template-modal";

export const FreightTemplateList = () => {
  const [params, setParams] = useFreightTemplateListSearchParams();
  const { isLoading, error, data } = useFreightTemplateList(params);

  return (
    <Container>
      <Main>
        <List
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
        />
      </Main>
      <FreightTemplateModal />
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
