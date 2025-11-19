import { List } from "./components/list";
import { SearchPanel } from "./components/search-panel";
import { RejectModal } from "./components/reject-modal";
import { RefundModal } from "./components/refund-modal";
import { ShippingModal } from "./components/shipping-modal";

import styled from "@emotion/styled";
import { useRefundList } from "service/refund";
import { useExpressOptions } from "service/express";
import { toNumber } from "utils";
import { useRefundListSearchParams } from "./util";

const statusOptions = [
  { text: "待审核", value: 0 },
  { text: "同意退货，待寄回", value: 1 },
  { text: "已寄出，待确认", value: 2 },
  { text: "退款成功", value: 3 },
  { text: "已驳回", value: 4 },
];

export const RefundList = () => {
  const { data: expressOptions = [] } = useExpressOptions();
  const [params, setParams] = useRefundListSearchParams();
  const { isLoading, error, data } = useRefundList(params);

  return (
    <Container>
      <Main>
        <SearchPanel
          statusOptions={statusOptions}
          params={params}
          setParams={setParams}
        />
        <List
          statusOptions={statusOptions}
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
      <RefundModal
        statusOptions={statusOptions}
        expressOptions={expressOptions}
      />
      <ShippingModal />
      <RejectModal />
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
