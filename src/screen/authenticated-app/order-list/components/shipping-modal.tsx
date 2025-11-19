import { Descriptions, Modal, Timeline } from "antd";
import { ErrorBox, ModalLoading } from "components/lib";
import dayjs from "dayjs";
import { useShippingModal } from "../util";

export const ShippingModal = () => {
  const { close, shippingModalOpen, shippingInfo, error, isLoading } =
    useShippingModal();

  return (
    <Modal
      forceRender={true}
      title="物流信息"
      open={shippingModalOpen}
      onCancel={close}
      footer={null}
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <>
          <Descriptions size={"small"} layout="vertical" bordered>
            <Descriptions.Item label="快递公司">
              {shippingInfo?.shipChannel}
            </Descriptions.Item>
            <Descriptions.Item label="物流单号">
              {shippingInfo?.shipSn}
            </Descriptions.Item>
          </Descriptions>
          <Timeline style={{ marginTop: "2.4rem" }}>
            {shippingInfo?.traces.map((item, index) => (
              <Timeline.Item key={index} color={index === 0 ? "blue" : "gray"}>
                <p>{dayjs(item.AcceptTime).format("MM.DD HH:mm")}</p>
                <p>{item.AcceptStation}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </>
      )}
    </Modal>
  );
};
