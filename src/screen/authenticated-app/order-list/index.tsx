import { Drawer, Select, Button, Modal } from "antd";
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
  useCancelOrder,
  useDeleteOrder,
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
  { text: "待使用", value: 3 },
  { text: "已完成", value: 4 },
  { text: "退款/售后", value: 5 },
];
const batchOprationOptions = [
  { name: "取消订单", value: 1 },
  { name: "删除订单", value: 2 },
];

export const OrderList = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [batchOprationType, setBatchOprationType] = useState(-1);
  const [params, setParams] = useOrderListSearchParams();
  const { data: expressOptions = [] } = useExpressOptions();
  const { data: userOptions = [] } = useOrderedUserOptions();
  const { data: goodsOptions = [] } = useOrderedGoodsOptions();

  const { isLoading, error, data } = useOrderList(params);
  const { mutate: exportOrder } = useExportOrder(useOrderListQueryKey());
  const { mutate: cancelOrder } = useCancelOrder(useOrderListQueryKey());
  const { mutate: deleteOrder } = useDeleteOrder(useOrderListQueryKey());

  const selectBatchOprationType = () => (type: number) => {
    setBatchOprationType(type);
  };
  const batchOprate = () => {
    switch (batchOprationType) {
      case 1:
        Modal.confirm({
          title: "确定批量取消该订单吗？",
          content: "点击确定取消",
          okText: "确定",
          cancelText: "取消",
          onOk: () => {
            const ids = selectedRowKeys.filter((id) =>
              data?.list
                .filter((item) => item.status === 101)
                .map((item) => item.id)
                .includes(id)
            );
            cancelOrder(ids);
            setSelectedRowKeys([]);
          },
        });
        break;

      case 2:
        Modal.confirm({
          title: "确定批量删除该订单吗？",
          content: "点击确定删除",
          okText: "确定",
          cancelText: "取消",
          onOk: () => {
            const ids = selectedRowKeys.filter((id) =>
              data?.list
                .filter((item) => [102, 103, 104].includes(item.status))
                .map((item) => item.id)
                .includes(id)
            );
            deleteOrder(ids);
            setSelectedRowKeys([]);
          },
        });
        break;
    }
  };

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
          <Row gap>
            <Select
              style={{ width: "14rem" }}
              allowClear
              onSelect={selectBatchOprationType()}
              placeholder="批量操作"
            >
              {batchOprationOptions.map(({ name, value }) => (
                <Select.Option key={value} value={value}>
                  {name}
                </Select.Option>
              ))}
            </Select>
            <Button onClick={() => batchOprate()} type={"primary"}>
              确定
            </Button>
            <SplitLine />
            <Button
              onClick={() => exportOrder(selectedRowKeys)}
              style={{ marginRight: 0 }}
              type={"primary"}
            >
              导出订单
            </Button>
          </Row>
        </Row>
      </Drawer>
      <OrderModal statusOptions={statusOptions} userOptions={userOptions} />
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

const SplitLine = styled.div`
  width: 0.1rem;
  height: 1.8rem;
  background: #d9d9d9;
`;
