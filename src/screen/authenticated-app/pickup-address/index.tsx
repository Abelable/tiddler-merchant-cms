import styled from "@emotion/styled";
import { toNumber } from "utils";
import { usePickupAddressListSearchParams } from "./util";
import { usePickupAddressList } from "service/pickupAddress";

import { List } from "./components/list";
import { PickupAddressModal } from "./components/pickup-address-modal";

export const PickupAddressList = () => {
  const [params, setParams] = usePickupAddressListSearchParams();
  const { isLoading, error, data } = usePickupAddressList(params);

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
      <PickupAddressModal />
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
