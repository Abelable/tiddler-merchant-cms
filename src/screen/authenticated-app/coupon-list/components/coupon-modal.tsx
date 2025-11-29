import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import { ErrorBox, GoodsCover, ModalLoading } from "components/lib";

import { useEffect } from "react";
import dayjs from "dayjs";
import { useForm } from "antd/lib/form/Form";
import { useAddCoupon, useEditCoupon } from "service/coupon";
import { useCouponModal, useCouponListQueryKey } from "../util";

import type { GoodsOption } from "types/goods";
import type { Option } from "types/common";

export const CouponModal = ({
  typeOptions,
  goodsOptions,
}: {
  typeOptions: Option[];
  goodsOptions: GoodsOption[];
}) => {
  const [form] = useForm();
  const { couponModalOpen, editingCouponId, editingCoupon, isLoading, close } =
    useCouponModal();
  const useMutationCoupon = editingCouponId ? useEditCoupon : useAddCoupon;
  const {
    mutateAsync,
    isLoading: mutateLoading,
    error,
  } = useMutationCoupon(useCouponListQueryKey());

  useEffect(() => {
    if (editingCoupon) {
      const { expirationTime, goodsId, ...rest } = editingCoupon;
      form.setFieldsValue({
        expirationTime: expirationTime ? dayjs(expirationTime) : expirationTime,
        goodsIds: [goodsId],
        ...rest,
      });
    }
  }, [editingCoupon, form]);

  const confirm = () => {
    form.validateFields().then(async () => {
      await mutateAsync({ ...editingCoupon, ...form.getFieldsValue() });
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
      title={editingCouponId ? "编辑优惠券" : "新增优惠券"}
      open={couponModalOpen}
      confirmLoading={mutateLoading}
      onOk={confirm}
      onCancel={closeModal}
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="优惠券名称"
            rules={[{ required: true, message: "请输入优惠券名称" }]}
          >
            <Input placeholder="请输入优惠券名称" />
          </Form.Item>
          <Form.Item
            name="denomination"
            label="优惠券面额"
            rules={[{ required: true, message: "请输入优惠券面额" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              prefix="￥"
              placeholder="请输入优惠券面额"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="优惠券说明"
            rules={[{ required: true, message: "请输入优惠券说明" }]}
          >
            <Input placeholder="请输入优惠券说明" />
          </Form.Item>
          <Form.Item
            name="type"
            label="优惠券类型"
            rules={[{ required: true, message: "请选择优惠券类型" }]}
          >
            <Select placeholder="请选择优惠券类型">
              {typeOptions.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.text}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.type !== currentValues.type
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("type") === 2 ? (
                <Form.Item
                  name="numLimit"
                  label="使用门槛"
                  rules={[{ required: true, message: "请输入商品数量" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    addonBefore="满"
                    addonAfter="件商品可用"
                    placeholder="请输入商品数量"
                  />
                </Form.Item>
              ) : getFieldValue("type") === 3 ? (
                <Form.Item
                  name="priceLimit"
                  label="使用门槛"
                  rules={[{ required: true, message: "请输入价格" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    addonBefore="满"
                    addonAfter="元可用"
                    placeholder="请输入价格"
                  />
                </Form.Item>
              ) : (
                <></>
              )
            }
          </Form.Item>
          <Form.Item name="receiveNumLimit" label="限领数量">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="请输入限领数量"
            />
          </Form.Item>
          <Form.Item name="expirationTime" label="优惠券失效时间">
            <DatePicker
              style={{ width: "100%" }}
              showTime
              placeholder="请选择优惠券失效时间"
            />
          </Form.Item>
          <Form.Item
            name="goodsIds"
            label="关联商品"
            rules={[{ required: true, message: "请选择关联商品" }]}
          >
            <Select
              mode="multiple"
              showSearch
              filterOption={(input, option) =>
                (option!.children as any)[1].props.children
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              placeholder="请选择关联商品"
            >
              {goodsOptions.map(({ id, cover, name }) => (
                <Select.Option key={id} value={id}>
                  <GoodsCover src={cover} />
                  <span>{name}</span>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
