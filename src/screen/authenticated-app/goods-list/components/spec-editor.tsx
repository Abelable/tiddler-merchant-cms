import { useState, useRef, useEffect } from "react";

import {
  Button,
  Input,
  Row,
  InputNumber,
  Card,
  InputRef,
  message,
  Popover,
  Table,
  Modal,
  Form,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { OssUpload } from "components/oss-upload";
import { Row as CustomeRow, ButtonNoPadding } from "components/lib";

import type { Sku, Spec } from "types/goods";

import "assets/style/specEditor.css";

interface TableSku extends Sku {
  [x: string]: string | number | object;
}

export const SpecEditor = ({
  minSalesCommissionRate,
  maxSalesCommissionRate,
  tableSkuList,
  setTableSkuList,
  specContentList,
  setSpecContentList,
}: {
  minSalesCommissionRate: number;
  maxSalesCommissionRate: number;
  tableSkuList: TableSku[];
  setTableSkuList: (list: TableSku[]) => void;
  specContentList: Spec[];
  setSpecContentList: (list: Spec[]) => void;
}) => {
  const [specLabelStr, setSpecLabelStr] = useState<string>("");
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputTagValue, setInputTagValue] = useState<string>("");
  const [inputSpecValue, setInputSpecValue] = useState<string>("");
  const [tagIndex, setTagIndex] = useState<number>(-1);
  const [specIndex, setSpecIndex] = useState<number>(-1);

  // 批量编辑相关状态
  const [batchEditModalVisible, setBatchEditModalVisible] =
    useState<boolean>(false);
  const [batchEditForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const inputRef = useRef<InputRef>(null);
  const tagInputRef = useRef(null);

  // 打开批量编辑模态框
  const handleOpenBatchEdit = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("请先选择要编辑的SKU规格");
      return;
    }

    // 重置表单
    batchEditForm.resetFields();
    // 设置默认值
    const defaultValues: any = {
      price: undefined,
      originalPrice: undefined,
      commissionRate: undefined,
      stock: undefined,
      limit: undefined,
    };

    batchEditForm.setFieldsValue(defaultValues);
    setBatchEditModalVisible(true);
  };

  // 执行批量编辑
  const handleBatchEdit = () => {
    batchEditForm
      .validateFields()
      .then((values) => {
        const newTableSkuList = [...tableSkuList];

        // 更新选中的SKU
        selectedRowKeys.forEach((key) => {
          const index = newTableSkuList.findIndex((sku) => sku.name === key);
          if (index !== -1) {
            // 更新价格
            if (values.price !== undefined && values.price !== null) {
              newTableSkuList[index].price = Number(values.price) || 0;
            }
            // 更新原价
            if (
              values.originalPrice !== undefined &&
              values.originalPrice !== null
            ) {
              newTableSkuList[index].originalPrice =
                Number(values.originalPrice) || 0;
            }
            // 更新佣金比例
            if (
              values.commissionRate !== undefined &&
              values.commissionRate !== null
            ) {
              let rate = Number(values.commissionRate);
              rate = Math.max(
                minSalesCommissionRate,
                Math.min(maxSalesCommissionRate, rate)
              );
              newTableSkuList[index].commissionRate = rate;
            }
            // 更新库存
            if (values.stock !== undefined && values.stock !== null) {
              newTableSkuList[index].stock = Number(values.stock) || 0;
            }
            // 更新限购数量
            if (values.limit !== undefined && values.limit !== null) {
              newTableSkuList[index].limit = Number(values.limit) || 0;
            }
          }
        });

        setTableSkuList(newTableSkuList);
        message.success(`成功批量编辑 ${selectedRowKeys.length} 个SKU规格`);
        setBatchEditModalVisible(false);
        // 清空选择
        setSelectedRowKeys([]);
      })
      .catch((error) => {
        console.error("批量编辑表单验证失败:", error);
      });
  };

  // 处理行选择
  const handleRowSelectionChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  // 处理全选/取消全选
  const handleSelectAll = () => {
    if (selectedRowKeys.length === tableSkuList.length) {
      // 如果已经全选，则取消全选
      setSelectedRowKeys([]);
    } else {
      // 全选
      setSelectedRowKeys(tableSkuList.map((sku) => sku.name));
    }
  };

  // 处理单个复选框变化
  const handleCheckboxChange = (key: React.Key, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys([...selectedRowKeys, key]);
    } else {
      setSelectedRowKeys(selectedRowKeys.filter((k) => k !== key));
    }
  };

  const columns: any[] = [
    // 选择列
    {
      title: (
        <div className="spec-editor-select-header">
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectAll();
            }}
            className="select-all-btn"
          >
            {selectedRowKeys.length === tableSkuList.length ? "取消" : "全选"}
          </Button>
        </div>
      ),
      width: 80,
      render: (_: TableSku, record: TableSku) => (
        <input
          type="checkbox"
          aria-label={`选择规格 ${record.name}`}
          title={`选择规格 ${record.name}`}
          checked={selectedRowKeys.includes(record.name)}
          onChange={(e) => {
            e.stopPropagation();
            handleCheckboxChange(record.name, e.target.checked);
          }}
          className="spec-editor-checkbox"
        />
      ),
    },
    {
      title: "图片",
      render: (item: TableSku, _: TableSku, index: number) => {
        return (
          <OssUpload
            defaultFileList={
              tableSkuList && tableSkuList[index] && tableSkuList[index].image
                ? [
                    {
                      uid: `${index}`,
                      name: "",
                      url: tableSkuList[index].image,
                    },
                  ]
                : []
            }
            onChange={(e: any) => {
              const _tableSkuList = [...tableSkuList];
              _tableSkuList[index].image = e[0]?.url || "";
              setTableSkuList(_tableSkuList);
            }}
            maxCount={1}
            zoom={0.5}
          />
        );
      },
    },
    ...specContentList.map((t) => {
      return {
        title: t.name,
        width: "18rem",
        render: (item: any) => {
          return item[t.name];
        },
      };
    }),
    {
      title: "价格",
      render: (item: TableSku, _: TableSku, index: number) => {
        return (
          <InputNumber
            min={0}
            value={tableSkuList[index].price}
            className="spec-editor-input-number"
            onChange={(e) => {
              const _tableSkuList = [...tableSkuList];
              _tableSkuList[index].price = e || 0;
              setTableSkuList(_tableSkuList);
            }}
          />
        );
      },
    },
    {
      title: "原价",
      render: (item: TableSku, _: TableSku, index: number) => {
        return (
          <InputNumber
            min={0}
            value={tableSkuList[index].originalPrice}
            className="spec-editor-input-number"
            onChange={(e) => {
              const _tableSkuList = [...tableSkuList];
              _tableSkuList[index].originalPrice = e || 0;
              setTableSkuList(_tableSkuList);
            }}
          />
        );
      },
    },
    {
      title: "佣金比例",
      render: (item: TableSku, _: TableSku, index: number) => {
        return (
          <InputNumber
            min={minSalesCommissionRate}
            max={maxSalesCommissionRate}
            className="spec-editor-input-number"
            value={tableSkuList[index].commissionRate}
            onChange={(e) => {
              const _tableSkuList = [...tableSkuList];
              _tableSkuList[index].commissionRate = e || 0;
              setTableSkuList(_tableSkuList);
            }}
            suffix="%"
          />
        );
      },
    },
    {
      title: "库存",
      render: (item: TableSku, _: TableSku, index: number) => {
        return (
          <InputNumber
            min={0}
            value={tableSkuList[index].stock}
            className="spec-editor-input-number"
            onChange={(e) => {
              const _tableSkuList = [...tableSkuList];
              _tableSkuList[index].stock = e || 0;
              setTableSkuList(_tableSkuList);
            }}
          />
        );
      },
    },
    {
      title: "限购数量",
      render: (item: TableSku, _: TableSku, index: number) => {
        return (
          <InputNumber
            min={0}
            value={tableSkuList[index].limit}
            className="spec-editor-input-number"
            onChange={(e) => {
              const _tableSkuList = [...tableSkuList];
              _tableSkuList[index].limit = e || 0;
              setTableSkuList(_tableSkuList);
            }}
          />
        );
      },
    },
  ];

  const setSpecContent = (name: string, index: number) => {
    const specList = [...specContentList];
    specList[index].name = name;
    setSpecContentList(specList);
  };

  const onAddSpecLabel = () => {
    if (specLabelStr) {
      setSpecContentList(
        specContentList.concat({ name: specLabelStr, options: [] })
      );
      setSpecLabelStr("");
      tableSku();
    } else {
      message.error("请填写规格属性");
    }
  };

  const onDeleteSpec = (index: number) => {
    const specList = [...specContentList];
    specList.splice(index, 1);
    setSpecContentList(specList);
    tableSku();
  };

  const onAddSpecTag = (index: number) => {
    if (inputTagValue) {
      const specList = [...specContentList];
      specList[index].options.push(inputTagValue);
      setSpecContentList(specList);
      setInputTagValue("");
      tableSku();
    }
    setTagIndex(-1);
    setInputVisible(false);
  };

  const onEditSpecTag = (index: number, tagIndex: number) => {
    if (inputSpecValue) {
      const specName = specContentList[index].name;
      const originalText = specContentList[index].options[tagIndex];
      const specList = [...specContentList];
      specList[index].options[tagIndex] = inputSpecValue;
      setSpecContentList(specList);
      tableSkuSpec(specName, originalText, inputSpecValue);
    }
    setTagIndex(-1);
    setSpecIndex(-1);
    setInputSpecValue("");
  };

  const onDeleteSpecTag = (labelIndex: number, tagIndex: number) => {
    const specList = [...specContentList];
    specList[labelIndex].options.splice(tagIndex, 1);
    setSpecContentList(specList);
    tableSku();
  };

  const tableSkuSpec = (
    specName: string,
    originalText: string,
    text: string
  ) => {
    const newTableSkuList = tableSkuList.map((item) => {
      if (
        item.name
          .split(",")
          .findIndex((_name: string) => _name === originalText) !== -1
      ) {
        return {
          ...item,
          [specName]: text,
          name: item.name.replace(originalText, text),
        };
      } else {
        return item;
      }
    });
    setTableSkuList([...newTableSkuList]);
  };

  const tableSku = () => {
    let temp: any[] = [];
    specContentList.forEach((item, index) => {
      if (!temp.length) {
        temp.push(
          ...item.options.map((str) => {
            const oldItem = tableSkuList.find((t) => t.name === str);
            if (oldItem) {
              return { ...oldItem };
            } else {
              return {
                [item.name]: str,
                price: 0,
                originalPrice: 0,
                commissionRate: 0,
                stock: 0,
                limit: 0,
                name: str,
              };
            }
          })
        );
      } else {
        const array: TableSku[] = [];
        temp.forEach((obj) => {
          if (item.options.length === 0) array.push(obj);
          array.push(
            ...item.options.map((t) => {
              if (obj.name) {
                const nameList = obj.name.split(",");
                if (index > nameList.length - 1) {
                  obj.name = [...nameList, t].join();
                } else {
                  nameList[index] = t;
                  obj.name = nameList.join();
                }
              }
              const oldItem = tableSkuList.find((_t) => _t.name === obj.name);
              if (oldItem) {
                return { ...oldItem };
              } else {
                return {
                  ...obj,
                  [item.name]: t,
                  price: 0,
                  originalPrice: 0,
                  commissionRate: 0,
                  stock: 0,
                  limit: 0,
                };
              }
            })
          );
        });
        temp = array;
      }
    });
    setTableSkuList(temp);
    // 清空选中的行
    setSelectedRowKeys([]);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    (tagInputRef.current as any)?.childNodes[1].focus();
    (tagInputRef.current as any)?.childNodes[0].focus();
  }, [inputVisible, tagIndex]);

  return (
    <div className="spec-editor-container">
      <div className="spec-editor-header">
        <Popover
          placement="topLeft"
          trigger="click"
          content={
            <Input
              ref={inputRef}
              value={specLabelStr}
              className="spec-editor-popover-input"
              placeholder="请输入规格名称 按下Enter键确认"
              onPressEnter={onAddSpecLabel}
              onChange={(value) => setSpecLabelStr(value.target.value)}
              addonAfter={
                <span
                  className="spec-editor-confirm-btn"
                  onClick={onAddSpecLabel}
                >
                  确认添加
                </span>
              }
            />
          }
        >
          <Button type="primary" icon={<PlusOutlined />}>
            添加规格属性
          </Button>
        </Popover>

        {/* 批量编辑按钮和信息 */}
        {tableSkuList.length > 0 && (
          <div className="batch-edit-info">
            <div className="selected-count">
              已选择{" "}
              <span className="count-number">{selectedRowKeys.length}</span>{" "}
              个SKU规格
            </div>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleOpenBatchEdit}
              disabled={selectedRowKeys.length === 0}
            >
              批量编辑选中项
            </Button>
          </div>
        )}
      </div>

      <>
        {specContentList.map((item, index) => (
          <Card
            key={index}
            className="spec-card"
            title={
              <div className="spec-card-header">
                <Row>
                  <div>规格属性：</div>
                  <Input
                    placeholder="请输入规格属性"
                    value={item.name}
                    size="small"
                    className="spec-name-input"
                    onChange={(e) => setSpecContent(e.target.value, index)}
                  />
                </Row>
                <ButtonNoPadding
                  type="link"
                  danger
                  onClick={() => onDeleteSpec(index)}
                >
                  删除
                </ButtonNoPadding>
              </div>
            }
          >
            <div className="spec-tags-container">
              {item.options.map((str, strKey) => (
                <CustomeRow key={strKey} className="spec-tag-item">
                  <Input
                    placeholder="请输入规格值"
                    value={
                      tagIndex === index && specIndex === strKey
                        ? inputSpecValue
                        : str
                    }
                    size="small"
                    className="spec-tag-input"
                    onChange={(e) => {
                      if (tagIndex === -1) {
                        setTagIndex(index);
                      }
                      if (specIndex === -1) {
                        setSpecIndex(strKey);
                      }
                      if (e.target.value) {
                        setInputSpecValue(e.target.value);
                      }
                    }}
                    onBlur={() => onEditSpecTag(index, strKey)}
                  />
                  <DeleteOutlined
                    className="spec-tag-delete-icon"
                    onClick={() => onDeleteSpecTag(index, strKey)}
                  />
                </CustomeRow>
              ))}
              {inputVisible && index === tagIndex ? (
                <Input
                  placeholder="请输入规格值"
                  value={inputTagValue}
                  size="small"
                  className="spec-tag-input"
                  onChange={(e) => setInputTagValue(e.target.value)}
                  onBlur={() => onAddSpecTag(index)}
                  onPressEnter={() => onAddSpecTag(index)}
                />
              ) : (
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setTagIndex(index);
                    setInputVisible(true);
                  }}
                  className="add-spec-tag-btn"
                >
                  添加规格值
                </Button>
              )}
            </div>
          </Card>
        ))}
      </>

      <Table
        className="spec-table"
        bordered
        rowKey={"name"}
        dataSource={tableSkuList}
        columns={columns}
        pagination={false}
        rowClassName={(record) =>
          selectedRowKeys.includes(record.name) ? "spec-table-row-selected" : ""
        }
      />

      {/* 批量编辑模态框 */}
      <Modal
        title={`批量编辑 (${selectedRowKeys.length} 个SKU)`}
        open={batchEditModalVisible}
        onOk={handleBatchEdit}
        onCancel={() => setBatchEditModalVisible(false)}
        className="batch-edit-modal"
        okText="确认编辑"
        cancelText="取消"
      >
        <Form
          form={batchEditForm}
          layout="vertical"
          className="batch-edit-form"
        >
          <Form.Item
            label="价格"
            name="price"
            rules={[{ type: "number", min: 0, message: "价格不能小于0" }]}
          >
            <InputNumber
              className="batch-edit-input"
              min={0}
              precision={2}
              placeholder="请输入价格（留空则不修改）"
            />
          </Form.Item>

          <Form.Item
            label="原价"
            name="originalPrice"
            rules={[{ type: "number", min: 0, message: "原价不能小于0" }]}
          >
            <InputNumber
              className="batch-edit-input"
              min={0}
              precision={2}
              placeholder="请输入原价（留空则不修改）"
            />
          </Form.Item>

          <Form.Item
            label="佣金比例"
            name="commissionRate"
            rules={[
              {
                type: "number",
                min: minSalesCommissionRate,
                max: maxSalesCommissionRate,
                message: `佣金比例必须在${minSalesCommissionRate}%~${maxSalesCommissionRate}%之间`,
              },
            ]}
          >
            <InputNumber
              className="batch-edit-input"
              min={minSalesCommissionRate}
              max={maxSalesCommissionRate}
              precision={2}
              suffix="%"
              placeholder="请输入佣金比例（留空则不修改）"
            />
          </Form.Item>

          <Form.Item
            label="库存"
            name="stock"
            rules={[{ type: "integer", min: 0, message: "库存不能小于0" }]}
          >
            <InputNumber
              className="batch-edit-input"
              min={0}
              precision={0}
              placeholder="请输入库存（留空则不修改）"
            />
          </Form.Item>

          <Form.Item
            label="限购数量"
            name="limit"
            rules={[{ type: "integer", min: 0, message: "限购数量不能小于0" }]}
          >
            <InputNumber
              className="batch-edit-input"
              min={0}
              precision={0}
              placeholder="请输入限购数量（留空则不修改）"
            />
          </Form.Item>

          <div className="batch-edit-tips">
            <div>提示：</div>
            <div>1. 只修改选中的 {selectedRowKeys.length} 个SKU规格</div>
            <div>2. 留空的字段将不会被修改</div>
            <div>
              3. 佣金比例范围：{minSalesCommissionRate}%~
              {maxSalesCommissionRate}%
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
