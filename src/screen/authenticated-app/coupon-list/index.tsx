import { CouponModal } from "./components/coupon-modal";
import { List } from "./components/list";

import styled from "@emotion/styled";
import { useCouponList } from "service/coupon";
import { toNumber } from "utils";
import { useCouponListSearchParams } from "./util";
import { SearchPanel } from "./components/search-panel";
import { useGoodsOptions } from "service/goods";

const statusOptions = [
  { text: "发放中", value: 1 },
  { text: "已过期", value: 2 },
  { text: "已下架", value: 3 },
];
const typeOptions = [
  { text: "无门槛券", value: 1 },
  { text: "数量满减券", value: 2 },
  { text: "价格满减券", value: 3 },
];

export const CouponList = () => {
  const [params, setParams] = useCouponListSearchParams();
  const { isLoading, error, data } = useCouponList(params);
  const { data: goodsOptions = [], error: goodsOptionsError } =
    useGoodsOptions();

  return (
    <Container>
      <Main>
        <SearchPanel
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          goodsOptions={goodsOptions}
          params={params}
          setParams={setParams}
        />
        <List
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          params={params}
          setParams={setParams}
          error={error || goodsOptionsError}
          loading={isLoading}
          dataSource={data?.list}
          pagination={{
            current: toNumber(data?.page) || 1,
            pageSize: toNumber(data?.limit),
            total: toNumber(data?.total),
            showSizeChanger: true,
          }}
          bordered
        />
      </Main>
      <CouponModal typeOptions={typeOptions} goodsOptions={goodsOptions} />
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
