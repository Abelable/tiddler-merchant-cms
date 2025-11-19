import { useEffect } from "react";
import styled from "@emotion/styled";
import { useForm } from "antd/lib/form/Form";
import {
  useAddPickupAddress,
  useEditPickupAddress,
} from "service/pickupAddress";
import { usePickupAddressModal, usePickupAddressListQueryKey } from "../util";

import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  TimePicker,
} from "antd";
import { ErrorBox, ModalLoading, Row as CustomRow } from "components/lib";
import { Map } from "components/map";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { OpenTime } from "types/pickupAddress";

const weekDayOptions = [
  { text: "周一", value: 1 },
  { text: "周二", value: 2 },
  { text: "周三", value: 3 },
  { text: "周四", value: 4 },
  { text: "周五", value: 5 },
  { text: "周六", value: 6 },
  { text: "周日", value: 7 },
];

export const PickupAddressModal = () => {
  const [form] = useForm();
  const {
    pickupAddressModalOpen,
    editingPickupAddress,
    editingPickupAddressId,
    isLoading,
    close,
  } = usePickupAddressModal();

  const useMutatePickupAddress = editingPickupAddressId
    ? useEditPickupAddress
    : useAddPickupAddress;
  const {
    mutateAsync,
    isLoading: mutateLoading,
    error,
  } = useMutatePickupAddress(usePickupAddressListQueryKey());

  useEffect(() => {
    if (editingPickupAddress) {
      const { openTimeList, ...rest } = editingPickupAddress;
      form.setFieldsValue({
        openTimeList: openTimeList.length
          ? openTimeList.map((item) => ({
              startWeekDay: +item.startWeekDay,
              endWeekDay: +item.endWeekDay,
              timeFrameList: item.timeFrameList.map((_item) => ({
                openTime: dayjs(_item.openTime, "HH:mm"),
                closeTime: dayjs(_item.closeTime, "HH:mm"),
              })),
            }))
          : [],
        ...rest,
      });
    }
  }, [editingPickupAddress, form]);

  const setLng = (longitude: number | undefined) =>
    form.setFieldsValue({
      longitude,
    });
  const setLat = (latitude: number | undefined) =>
    form.setFieldsValue({
      latitude,
    });

  const confirm = () => {
    form.validateFields().then(async () => {
      const { openTimeList, ...rest } = form.getFieldsValue();
      await mutateAsync({
        ...editingPickupAddress,
        openTimeList:
          openTimeList && openTimeList.length
            ? openTimeList.map((item: OpenTime) => ({
                ...item,
                timeFrameList: item.timeFrameList.map((_item) => ({
                  openTime: dayjs(_item.openTime).format("HH:mm"),
                  closeTime: dayjs(_item.closeTime).format("HH:mm"),
                })),
              }))
            : [],
        ...rest,
      });
      closeModal();
    });
  };

  const closeModal = () => {
    form.resetFields();
    close();
  };

  return (
    <Modal
      forceRender={true}
      title={editingPickupAddressId ? "编辑提货地点" : "新增提货地点"}
      open={pickupAddressModalOpen}
      confirmLoading={mutateLoading}
      onOk={confirm}
      onCancel={closeModal}
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item label="提货点名称" name="name">
            <Input placeholder={"请输入提货点名称"} />
          </Form.Item>
          <Form.Item label="提货时间范围">
            <Form.List name="openTimeList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <CustomRow key={key} style={{ marginBottom: "2rem" }}>
                      <Card style={{ marginRight: "1rem" }}>
                        <CustomRow between>
                          <Form.Item
                            {...restField}
                            name={[name, "startWeekDay"]}
                            rules={[
                              { required: true, message: "请选择开始时间" },
                            ]}
                          >
                            <Select
                              style={{ width: "20.9rem" }}
                              placeholder="开始时间"
                            >
                              {weekDayOptions.map(({ text, value }) => (
                                <Select.Option key={value} value={value}>
                                  {text}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "endWeekDay"]}
                            rules={[
                              { required: true, message: "请选择结束时间" },
                            ]}
                          >
                            <Select
                              style={{ width: "20.9rem" }}
                              placeholder="结束时间"
                            >
                              {weekDayOptions.map(({ text, value }) => (
                                <Select.Option key={value} value={value}>
                                  {text}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </CustomRow>
                        <Form.List name={[name, "timeFrameList"]}>
                          {(
                            fieldsInside,
                            { add: addInside, remove: removeInside }
                          ) => (
                            <TimeFrameWrap>
                              {fieldsInside.map(
                                ({
                                  key: insideKey,
                                  name: insideName,
                                  ...insideRestField
                                }) => (
                                  <Space
                                    key={insideKey}
                                    style={{ display: "flex" }}
                                    align="baseline"
                                  >
                                    <Form.Item
                                      {...insideRestField}
                                      name={[insideName, "openTime"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "请选择营业时间",
                                        },
                                      ]}
                                    >
                                      <TimePicker
                                        style={{ width: "19.4rem" }}
                                        format="HH:mm"
                                        placeholder="营业时间"
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      {...insideRestField}
                                      name={[insideName, "closeTime"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "请选择休息时间",
                                        },
                                      ]}
                                    >
                                      <TimePicker
                                        style={{ width: "19.4rem" }}
                                        format="HH:mm"
                                        placeholder="休息时间"
                                      />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                      style={{ color: "#ff4d4f" }}
                                      onClick={() => removeInside(insideName)}
                                    />
                                  </Space>
                                )
                              )}
                              <Button
                                type="dashed"
                                onClick={() => addInside()}
                                block
                                icon={<PlusOutlined />}
                              >
                                添加营业时间段
                              </Button>
                            </TimeFrameWrap>
                          )}
                        </Form.List>
                      </Card>
                      <MinusCircleOutlined
                        style={{ color: "#ff4d4f" }}
                        onClick={() => remove(name)}
                      />
                    </CustomRow>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    添加提货时间
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item
            label="提货点地址详情"
            name="addressDetail"
            rules={[{ required: true, message: "请输入提货点地址详情" }]}
          >
            <Input placeholder={"请输入提货点地址详情"} />
          </Form.Item>
          <Form.Item label="提货点经纬度" required>
            <Space.Compact>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="longitude"
                    rules={[{ required: true, message: "请输入经度" }]}
                  >
                    <Input placeholder="请输入经度" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="latitude"
                    rules={[{ required: true, message: "请输入纬度" }]}
                  >
                    <Input placeholder="请输入纬度" />
                  </Form.Item>
                </Col>
              </Row>
            </Space.Compact>
          </Form.Item>
          <Map setLng={setLng} setLat={setLat} />
        </Form>
      )}
    </Modal>
  );
};

const Card = styled.div`
  padding: 1rem;
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 1rem;
`;
const TimeFrameWrap = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
`;
