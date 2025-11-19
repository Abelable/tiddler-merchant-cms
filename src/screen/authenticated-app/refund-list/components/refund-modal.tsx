import { Descriptions, Divider, Drawer, Image, Table, Button } from "antd";
import { ErrorBox, ModalLoading } from "components/lib";
import { useRefundModal, useShippingModal } from "../util";

import type { Option } from "types/common";
import type { ExpressOption } from "types/express";
import type { Goods } from "types/refund";

export const RefundModal = ({
  statusOptions,
  expressOptions,
}: {
  statusOptions: Option[];
  expressOptions: ExpressOption[];
}) => {
  const { close, refundModalOpen, refundInfo, error, isLoading } =
    useRefundModal();
  const { open: openShippingModal } = useShippingModal();

  return (
    <Drawer
      forceRender={true}
      title="订单详情"
      width={"120rem"}
      onClose={close}
      open={refundModalOpen}
      styles={{ body: { paddingBottom: 80 } }}
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <>
          <Divider orientation="left">售后商品</Divider>
          <Table
            rowKey={"id"}
            columns={[
              {
                title: "商品图片",
                dataIndex: "cover",
                render: (value) => <Image width={68} src={value} />,
              },
              { title: "商品名称", dataIndex: "name" },
              {
                title: "商品规格",
                dataIndex: "selectedSkuName",
                render: (value) => <>规格：{value}</>,
              },
              {
                title: "价格",
                dataIndex: "price",
                render: (value) => <>¥{value}</>,
              },
              {
                title: "数量",
                dataIndex: "number",
              },
              {
                title: "小计",
                render: (value, goods) => <>¥{goods.price * goods.number}</>,
              },
            ]}
            dataSource={
              refundInfo?.goodsInfo ? [refundInfo?.goodsInfo as Goods] : []
            }
            pagination={false}
            bordered
          />

          <Divider orientation="left">售后信息</Divider>
          <Descriptions size={"small"} column={1} bordered>
            <Descriptions.Item label="申请状态">
              {
                statusOptions.find((item) => item.value === refundInfo?.status)
                  ?.text
              }
            </Descriptions.Item>
            <Descriptions.Item label="订单编号">
              {refundInfo?.orderSn}
            </Descriptions.Item>
            <Descriptions.Item label="售后类型">
              {refundInfo?.refundType === 1 ? "仅退款" : "退货退款"}
            </Descriptions.Item>
            <Descriptions.Item label="退款金额">
              ¥{refundInfo?.refundAmount}
            </Descriptions.Item>
            <Descriptions.Item label="售后原因">
              {refundInfo?.refundReason}
            </Descriptions.Item>
            <Descriptions.Item label="相关图片">
              {refundInfo?.imageList?.map((item) => (
                <Image width={68} src={item} />
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="物流公司">
              {
                expressOptions.find(
                  (item) => item.code === refundInfo?.shipCode
                )?.name
              }
            </Descriptions.Item>
            <Descriptions.Item label="快递单号">
              {refundInfo?.shipSn ? (
                <>
                  {refundInfo?.shipSn}{" "}
                  <Button
                    type="link"
                    onClick={() => openShippingModal(refundInfo?.id as number)}
                  >
                    查看物流
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Drawer>
  );
};
