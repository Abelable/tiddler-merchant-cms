import styled from "@emotion/styled";
import { toNumber } from "utils";
import { useRefundAddressListSearchParams } from "./util";
import { useRefundAddressList } from "service/refundAddress";

import { List } from "./components/list";
import { RefundAddressModal } from "./components/refund-address-modal";

export const RefundAddressList = () => {
  const [params, setParams] = useRefundAddressListSearchParams();
  const { isLoading, error, data } = useRefundAddressList(params);

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
          bordered
        />
      </Main>
      <RefundAddressModal />
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
