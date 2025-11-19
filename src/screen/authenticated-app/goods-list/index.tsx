import { useState } from "react";
import styled from "@emotion/styled";
import { useCategoryOptions } from "service/category";
import { useGoodsList } from "service/goods";
import { useFreightTemplateOptions } from "service/freightTemplate";
import { useRefundAddressOptions } from "service/refundAddress";
import { usePickupAddressOptions } from "service/pickupAddress";
import { toNumber } from "utils";
import { useGoodsListSearchParams } from "./util";

import { GoodsModal } from "./components/goods-modal";
import { List } from "./components/list";
import { SearchPanel } from "./components/search-panel";

export const GoodsList = () => {
  const [params, setParams] = useGoodsListSearchParams();
  const { isLoading, error, data } = useGoodsList(params);
  const { data: categoryOptions = [], error: categoryOptionsError } =
    useCategoryOptions();

  const {
    data: originalFreightTemplateOptions = [],
    error: freightTemplateOptionsError,
  } = useFreightTemplateOptions();
  const freightTemplateOptions = [
    { id: 0, name: "全国包邮" },
    ...originalFreightTemplateOptions,
  ];

  const { data: refundAddressOptions = [], error: refundAddressOptionsError } =
    useRefundAddressOptions();
  const { data: pickupAddressOptions = [], error: pickupAddressOptionsError } =
    usePickupAddressOptions();

  const statusOptions = [
    { text: "售卖中", value: 1 },
    { text: "已下架", value: 2 },
  ];

  return (
    <Container>
      <Main>
        <SearchPanel
          categoryOptions={categoryOptions || []}
          statusOptions={statusOptions}
          params={params}
          setParams={setParams}
        />
        <List
          categoryOptions={categoryOptions || []}
          statusOptions={statusOptions}
          params={params}
          setParams={setParams}
          error={
            error ||
            categoryOptionsError ||
            freightTemplateOptionsError ||
            refundAddressOptionsError ||
            pickupAddressOptionsError
          }
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
      <GoodsModal
        categoryOptions={categoryOptions}
        freightTemplateOptions={freightTemplateOptions}
        refundAddressOptions={refundAddressOptions}
        pickupAddressOptions={pickupAddressOptions}
      />
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
