import { Drawer, Button } from "antd";
import { Row } from "components/lib";
import { List } from "./components/list";
import { SearchPanel } from "./components/search-panel";
import { OrderModal } from "./components/order-modal";
import { DeliveryModal } from "./components/delivery-modal";
import { ShippingModal } from "./components/shipping-modal";
import { AddressModal } from "./components/address-modal";

import { useState } from "react";
import styled from "@emotion/styled";

import {
  useExportOrder,
  useExpressOptions,
  useOrderedGoodsOptions,
  useOrderedUserOptions,
  useOrderList,
} from "service/order";
import { toNumber } from "utils";
import { useOrderListQueryKey, useOrderListSearchParams } from "./util";

const deliveryModeOptions = [
  { text: "物流配送", value: 1 },
  { text: "到店自提", value: 2 },
];
const statusOptions = [
  { text: "待发货", value: 1 },
  { text: "待收货", value: 2 },
  { text: "待自提", value: 3 },
  { text: "已完成", value: 4 },
  { text: "售后", value: 5 },
];
const statusDescOptions = [
  { text: "待发货", value: 201 },
  { text: "待发货（已导出）", value: 202 },
  { text: "待退款", value: 203 },
  { text: "已退款", value: 204 },
  { text: "待收货", value: 301 },
  { text: "待自提", value: 302 },
  { text: "已确认（用户）", value: 401 },
  { text: "已确认（系统）", value: 402 },
  { text: "已确认（管理员）", value: 403 },
  { text: "已评价（用户）", value: 501 },
  { text: "已评价（系统）", value: 502 },
];

export const OrderList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [params, setParams] = useOrderListSearchParams();
  const { data: expressOptions = [] } = useExpressOptions();
  const { data: userOptions = [] } = useOrderedUserOptions();
  const { data: goodsOptions = [] } = useOrderedGoodsOptions();

  const { isLoading, error, data } = useOrderList(params);
  const { mutate: exportOrder } = useExportOrder(useOrderListQueryKey());

  return (
    <Container>
      <Main>
        <SearchPanel
          statusOptions={statusOptions}
          userOptions={userOptions}
          goodsOptions={goodsOptions}
          deliveryModeOptions={deliveryModeOptions}
          params={params}
          setParams={setParams}
        />
        <List
          statusDescOptions={statusDescOptions}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
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
      <Drawer
        open={!!selectedRowKeys.length}
        height={"8rem"}
        placement="bottom"
        mask={false}
        getContainer={false}
        closable={false}
      >
        <Row between={true}>
          <div>
            已选择 <SelectedCount>{selectedRowKeys.length}</SelectedCount> 项
          </div>
          <Button
            onClick={() => exportOrder(selectedRowKeys)}
            style={{ marginRight: 0 }}
            type={"primary"}
          >
            导出订单
          </Button>
        </Row>
      </Drawer>
      <OrderModal
        statusDescOptions={statusDescOptions}
        userOptions={userOptions}
      />
      <DeliveryModal expressOptions={expressOptions} />
      <ShippingModal />
      <AddressModal />
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

const SelectedCount = styled.span`
  color: #1890ff;
  font-weight: 600;
`;
