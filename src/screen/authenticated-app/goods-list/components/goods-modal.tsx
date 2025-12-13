import { useState, useEffect } from "react";
import { useForm } from "antd/lib/form/Form";
import { useAddGoods, useEditGoods } from "service/goods";
import { useGoodsModal, useGoodsListQueryKey } from "../util";

import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  InputNumber,
  Divider,
  Modal,
  message,
  Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import { OssUpload } from "components/oss-upload";
import { ErrorBox, ModalLoading } from "components/lib";
import { SpecEditor } from "./spec-editor";

import type { OperatorOption } from "types/common";
import type { GoodsCategoryOption, Sku, Spec } from "types/goods";
import type { PickupAddress } from "types/pickupAddress";
import type { RefundAddress } from "types/refundAddress";

interface TableSku extends Sku {
  [x: string]: string | number | object;
}

// 草稿数据类型
interface DraftGoodsData {
  formData: any;
  tableSkuList: TableSku[];
  specContentList: Spec[];
  timestamp: number;
  name?: string;
}

const DRAFT_KEY = "goods_draft";
const DRAFT_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7天

const refundStatusOptions = [
  { text: "不支持", value: 0 },
  { text: "支持", value: 1 },
];
const deliveryMethodOptions = [
  { text: "快递", value: 1 },
  { text: "自提", value: 2 },
  { text: "快递/自提", value: 3 },
];

const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e && e.fileList;
};

export const GoodsModal = ({
  categoryOptions,
  freightTemplateOptions,
  refundAddressOptions,
  pickupAddressOptions,
}: {
  categoryOptions: GoodsCategoryOption[];
  freightTemplateOptions: OperatorOption[];
  refundAddressOptions: Partial<RefundAddress>[];
  pickupAddressOptions: Partial<PickupAddress>[];
}) => {
  const [form] = useForm();

  const { goodsModalOpen, editingGoodsId, editingGoods, isLoading, close } =
    useGoodsModal();

  const useMutationGoods = editingGoodsId ? useEditGoods : useAddGoods;
  const {
    mutateAsync,
    error,
    isLoading: mutateLoading,
  } = useMutationGoods(useGoodsListQueryKey());

  const [tableSkuList, setTableSkuList] = useState<TableSku[]>([]);
  const [specContentList, setSpecContentList] = useState<Spec[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [draftInfo, setDraftInfo] = useState<{ name?: string; time?: string }>(
    {}
  );

  // 检查是否有草稿
  useEffect(() => {
    if (goodsModalOpen && !editingGoodsId) {
      const draft = getDraft();
      if (draft) {
        setHasDraft(true);
        setDraftInfo({
          name: draft.name,
          time: formatTime(draft.timestamp),
        });
      } else {
        setHasDraft(false);
        setDraftInfo({});
      }
    }
  }, [goodsModalOpen, editingGoodsId]);

  // 格式化时间
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  // 加载编辑商品数据
  useEffect(() => {
    if (editingGoods) {
      const {
        video,
        cover,
        imageList,
        detailImageList,
        defaultSpecImage,
        specList = [],
        skuList = [],
        ...rest
      } = editingGoods;

      setTableSkuList(
        skuList.map(
          ({
            name,
            image = "",
            price = 0,
            originalPrice = 0,
            commissionRate = 0,
            stock = 0,
            limit = 0,
          }) => {
            const restData = Object.fromEntries(
              name
                .split(",")
                .map((value, index) => [`${specList[index]?.name}`, value])
            );
            return {
              name,
              image,
              price,
              originalPrice,
              commissionRate,
              stock,
              limit,
              ...restData,
            };
          }
        )
      );
      setSpecContentList(specList || []);

      form.setFieldsValue({
        video: video
          ? [
              {
                url: video,
                thumbUrl: `${video}?x-oss-process=video/snapshot,t_0`,
              },
            ]
          : [],
        cover: [{ url: cover }],
        imageList: imageList?.length
          ? imageList?.map((item) => ({ url: item }))
          : imageList,
        detailImageList: detailImageList?.length
          ? detailImageList?.map((item) => ({ url: item }))
          : detailImageList,
        defaultSpecImage: [{ url: defaultSpecImage }],
        ...rest,
      });
    }
  }, [editingGoods, form]);

  // 获取草稿
  const getDraft = (): DraftGoodsData | null => {
    try {
      const draftStr = localStorage.getItem(DRAFT_KEY);
      if (!draftStr) return null;

      const draft: DraftGoodsData = JSON.parse(draftStr);

      // 检查草稿是否过期
      if (Date.now() - draft.timestamp > DRAFT_EXPIRE_TIME) {
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      return draft;
    } catch (error) {
      console.error("读取草稿失败:", error);
      return null;
    }
  };

  // 保存草稿
  const saveDraft = async () => {
    try {
      const formValues = await form.validateFields();

      const draftData: DraftGoodsData = {
        formData: formValues,
        tableSkuList,
        specContentList,
        timestamp: Date.now(),
        name: formValues.name || "未命名商品",
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setHasDraft(true);
      setDraftInfo({
        name: draftData.name,
        time: formatTime(draftData.timestamp),
      });
      message.success("草稿保存成功");
      return true;
    } catch (error) {
      // 如果有验证错误，只保存通过验证的字段
      const formValues = form.getFieldsValue();

      const draftData: DraftGoodsData = {
        formData: formValues,
        tableSkuList,
        specContentList,
        timestamp: Date.now(),
        name: formValues.name || "未命名商品",
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      setHasDraft(true);
      setDraftInfo({
        name: draftData.name,
        time: formatTime(draftData.timestamp),
      });
      message.success("草稿保存成功（部分字段未验证通过）");
      return true;
    }
  };

  // 加载草稿
  const loadDraft = () => {
    Modal.confirm({
      title: "加载草稿",
      content: `是否要加载草稿"${draftInfo.name}"？当前表单内容将被覆盖。`,
      onOk: () => {
        setIsLoadingDraft(true);
        try {
          const draft = getDraft();
          if (!draft) {
            message.warning("草稿不存在或已过期");
            setHasDraft(false);
            setDraftInfo({});
            return;
          }

          // 重置表单
          form.resetFields();
          setTableSkuList([]);
          setSpecContentList([]);

          // 加载草稿数据
          setTimeout(() => {
            form.setFieldsValue(draft.formData);
            setTableSkuList(draft.tableSkuList);
            setSpecContentList(draft.specContentList);
            setIsLoadingDraft(false);
            message.success("草稿加载成功");
          }, 100);
        } catch (error) {
          console.error("加载草稿失败:", error);
          message.error("加载草稿失败");
          setIsLoadingDraft(false);
        }
      },
    });
  };

  // 清除草稿
  const clearDraft = () => {
    Modal.confirm({
      title: "清除草稿",
      content: `确定要清除草稿"${draftInfo.name}"吗？`,
      onOk: () => {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        setDraftInfo({});
        message.success("草稿已清除");
      },
    });
  };

  // 查看草稿信息
  const showDraftInfo = () => {
    Modal.info({
      title: "草稿信息",
      content: (
        <div>
          <p>
            <strong>草稿名称：</strong>
            {draftInfo.name}
          </p>
          <p>
            <strong>保存时间：</strong>
            {draftInfo.time}
          </p>
        </div>
      ),
    });
  };

  // 草稿下拉菜单
  const draftMenuItems: MenuProps["items"] = [
    {
      key: "load",
      label: "加载草稿",
      onClick: loadDraft,
      disabled: isLoadingDraft,
    },
    {
      key: "info",
      label: "查看草稿信息",
      onClick: showDraftInfo,
    },
    {
      type: "divider",
    },
    {
      key: "clear",
      label: "清除草稿",
      danger: true,
      onClick: clearDraft,
    },
  ];

  const submit = () => {
    form.validateFields().then(async () => {
      const {
        video,
        cover,
        activityCover,
        imageList,
        detailImageList,
        defaultSpecImage,
        stock,
        ...rest
      } = form.getFieldsValue();

      if (
        specContentList.length &&
        specContentList.findIndex(
          (item) => !item.name || !item.options.length
        ) !== -1
      ) {
        Modal.error({
          title: "请完善商品规格信息",
        });
        return;
      }
      if (tableSkuList.length) {
        if (tableSkuList.findIndex((item) => !item.price) !== -1) {
          Modal.error({
            title: "部分商品规格未填写价格",
          });
          return;
        }
        if (
          stock <
          tableSkuList.reduce(
            (stock, sku) => Number(stock) + Number(sku.stock),
            0
          )
        ) {
          Modal.error({
            title: "请核对库存设置",
            content: "商品总库存，小于商品各规格库存总和",
          });
          return;
        }
      }

      await mutateAsync({
        ...editingGoods,
        ...rest,
        video: video && video.length ? video[0].url : "",
        cover: cover[0].url,
        imageList: imageList.map((item: { url: string }) => item.url),
        detailImageList: detailImageList.map(
          (item: { url: string }) => item.url
        ),
        defaultSpecImage: defaultSpecImage[0].url,
        stock,
        specList: specContentList,
        skuList: tableSkuList.map(
          ({
            name,
            image,
            price,
            originalPrice,
            commissionRate,
            stock,
            limit,
          }) => ({
            name,
            image,
            price,
            originalPrice,
            commissionRate,
            stock,
            limit,
          })
        ),
      });

      // 提交成功后清除草稿
      if (!editingGoodsId) {
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        setDraftInfo({});
      }

      closeModal();
    });
  };

  const closeModal = () => {
    // 关闭时提示保存草稿
    if (!editingGoodsId && form.isFieldsTouched()) {
      Modal.confirm({
        title: "保存草稿",
        content: "检测到未保存的内容，是否保存为草稿？",
        okText: "保存草稿",
        cancelText: "不保存",
        onOk: saveDraft,
        onCancel: () => {
          form.resetFields();
          setTableSkuList([]);
          setSpecContentList([]);
          close();
        },
      });
    } else {
      form.resetFields();
      setTableSkuList([]);
      setSpecContentList([]);
      close();
    }
  };

  return (
    <Drawer
      title={editingGoodsId ? "编辑商品" : "新增商品"}
      width={"100rem"}
      forceRender={true}
      onClose={closeModal}
      open={goodsModalOpen}
      styles={{ body: { paddingBottom: 80 } }}
      extra={
        <Space>
          {!editingGoodsId && hasDraft && (
            <Dropdown menu={{ items: draftMenuItems }} placement="bottomRight">
              <Button>草稿管理</Button>
            </Dropdown>
          )}
          {!editingGoodsId && (
            <Button onClick={saveDraft} disabled={!form.isFieldsTouched()}>
              保存草稿
            </Button>
          )}
          <Button onClick={closeModal}>取消</Button>
          <Button onClick={submit} loading={mutateLoading} type="primary">
            提交
          </Button>
        </Space>
      }
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <Form form={form} layout="vertical">
          <Divider orientation="left" plain>
            基本信息
          </Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cover"
                label="商品封面"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "请上传商品封面" }]}
              >
                <OssUpload maxCount={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="video"
                label="商品视频"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <OssUpload accept=".mp4" maxCount={1} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="imageList"
                label="主图图片"
                tooltip="最多不超过10张"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "请上传主图图片" }]}
              >
                <OssUpload maxCount={10} multiple />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="detailImageList"
                label="详情图片"
                tooltip="注意图片顺序"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "请上传详情图片" }]}
              >
                <OssUpload multiple />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: "请输入商品名称" }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="introduction" label="商品介绍">
                <Input placeholder="请输入商品介绍" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="起始价格"
                rules={[{ required: true, message: "请填写起始价格" }]}
              >
                <InputNumber
                  prefix="￥"
                  style={{ width: "100%" }}
                  placeholder="请填写起始价格"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="marketPrice" label="市场原价">
                <InputNumber
                  prefix="￥"
                  style={{ width: "100%" }}
                  placeholder="请填写市场原价"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryIds"
                label="商品分类"
                rules={[{ required: true, message: "请选择商品分类" }]}
              >
                <Select mode="multiple" placeholder="请选择商品分类">
                  {categoryOptions.map(({ id, name }) => (
                    <Select.Option key={id} value={id}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.categoryIds !== currentValues.categoryIds
                }
              >
                {({ getFieldValue }) => {
                  const categoryIds = getFieldValue("categoryIds");
                  if (categoryIds && categoryIds.length > 0) {
                    const selectedCategories = categoryOptions.filter((item) =>
                      categoryIds.includes(item.id)
                    );
                    const minSalesCommissionRate = Math.max(
                      ...selectedCategories.map(
                        (item) => item.minSalesCommissionRate || 0
                      )
                    );
                    const maxSalesCommissionRate = Math.min(
                      ...selectedCategories.map(
                        (item) => item.maxSalesCommissionRate || Infinity
                      )
                    );
                    return (
                      <Form.Item
                        name="salesCommissionRate"
                        label="销售佣金比例"
                        tooltip={`佣金范围${minSalesCommissionRate}%~${maxSalesCommissionRate}%`}
                        rules={[
                          { required: true, message: "请填写销售佣金比例" },
                        ]}
                      >
                        <InputNumber
                          min={minSalesCommissionRate}
                          max={maxSalesCommissionRate}
                          style={{ width: "100%" }}
                          placeholder="请填写销售佣金比例"
                          suffix="%"
                        />
                      </Form.Item>
                    );
                  }
                }}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="numberLimit" label="限购数量">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请填写限购数量"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="deliveryMode"
                label="配送方式"
                rules={[{ required: true, message: "请选择配送方式" }]}
              >
                <Select placeholder="请选择配送方式">
                  {deliveryMethodOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.deliveryMode !== currentValues.deliveryMode
              }
            >
              {({ getFieldValue }) =>
                [1, 3].includes(getFieldValue("deliveryMode")) && (
                  <Col span={12}>
                    <Form.Item
                      name="freightTemplateId"
                      label="运费模板"
                      rules={[{ required: true, message: "请选择运费模板" }]}
                    >
                      <Select placeholder="请选择运费模板">
                        {freightTemplateOptions.map(({ id, name }) => (
                          <Select.Option key={id} value={id}>
                            {name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.deliveryMode !== currentValues.deliveryMode
              }
            >
              {({ getFieldValue }) =>
                [2, 3].includes(getFieldValue("deliveryMode")) && (
                  <Col span={12}>
                    <Form.Item
                      name="pickupAddressIds"
                      label="提货地点"
                      rules={[{ required: true, message: "请选择提货地点" }]}
                    >
                      <Select mode="multiple" placeholder="请选择提货地点">
                        {pickupAddressOptions.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="refundStatus"
                label="7天无理由退换货"
                rules={[
                  {
                    required: true,
                    message: "请选择是否支持7天无理由",
                  },
                ]}
              >
                <Select placeholder="请选择是否支持7天无理由">
                  {refundStatusOptions.map((item) => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.refundStatus !== currentValues.refundStatus
              }
            >
              {({ getFieldValue }) =>
                getFieldValue("refundStatus") === 1 && (
                  <Col span={12}>
                    <Form.Item
                      name="refundAddressId"
                      label="退货地址"
                      rules={[{ required: true, message: "请选择退货地址" }]}
                    >
                      <Select placeholder="请选择退货地址">
                        {refundAddressOptions.map((item) => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.addressDetail}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                )
              }
            </Form.Item>
          </Row>

          <Divider orientation="left" plain>
            商品规格
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="defaultSpecImage"
                label="默认规格图片"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: true, message: "请上传默认规格图片" }]}
              >
                <OssUpload maxCount={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="总库存"
                rules={[{ required: true, message: "请填写总库存" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="请填写总库存"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.categoryIds !== currentValues.categoryIds
            }
          >
            {({ getFieldValue }) => {
              const categoryIds = getFieldValue("categoryIds");
              if (categoryIds && categoryIds.length > 0) {
                const selectedCategories = categoryOptions.filter((item) =>
                  categoryIds.includes(item.id)
                );
                const minSalesCommissionRate = Math.max(
                  ...selectedCategories.map(
                    (item) => item.minSalesCommissionRate || 0
                  )
                );
                const maxSalesCommissionRate = Math.min(
                  ...selectedCategories.map(
                    (item) => item.maxSalesCommissionRate || Infinity
                  )
                );
                return (
                  <SpecEditor
                    minSalesCommissionRate={minSalesCommissionRate || 0}
                    maxSalesCommissionRate={maxSalesCommissionRate || 0}
                    tableSkuList={tableSkuList}
                    setTableSkuList={setTableSkuList}
                    specContentList={specContentList}
                    setSpecContentList={setSpecContentList}
                  />
                );
              }
            }}
          </Form.Item>
        </Form>
      )}
    </Drawer>
  );
};
