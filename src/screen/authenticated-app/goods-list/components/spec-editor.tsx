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
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { OssUpload } from "components/oss-upload";
import { Row as CustomeRow, ButtonNoPadding } from "components/lib";

import type { Sku, Spec } from "types/goods";

interface TableSku extends Sku {
  [x: string]: string | number | object;
}

export const SpecEditor = ({
  tableSkuList,
  setTableSkuList,
  specContentList,
  setSpecContentList,
}: {
  tableSkuList: TableSku[];
  setTableSkuList: (list: TableSku[]) => void;
  specContentList: Spec[];
  setSpecContentList: (list: Spec[]) => void;
}) => {
  const [specLabelStr, setSpecLabelStr] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [inputVisible, setInputVisible] = useState<boolean>(false);
  const [inputTagValue, setInputTagValue] = useState<string>("");
  const [inputSpecValue, setInputSpecValue] = useState<string>("");
  const [tagIndex, setTagIndex] = useState<number>(-1);
  const [specIndex, setSpecIndex] = useState<number>(-1);

  const inputRef = useRef<InputRef>(null);
  const tagInputRef = useRef(null);

  const columns: any[] = [
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
            defaultValue={tableSkuList[index].price}
            style={{ width: "100%" }}
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
            defaultValue={tableSkuList[index].originalPrice}
            style={{ width: "100%" }}
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
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            style={{ width: "100%" }}
            defaultValue={tableSkuList[index].commissionRate}
            onChange={(e) => {
              const _tableSkuList = [...tableSkuList];
              _tableSkuList[index].commissionRate = e || 0;
              setTableSkuList(_tableSkuList);
            }}
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
            defaultValue={tableSkuList[index].stock}
            style={{ width: "100%" }}
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
            defaultValue={tableSkuList[index].limit}
            style={{ width: "100%" }}
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
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [visible]);
  useEffect(() => {
    (tagInputRef.current as any)?.childNodes[1].focus();
    (tagInputRef.current as any)?.childNodes[0].focus();
  }, [inputVisible, tagIndex]);

  return (
    <>
      <Popover
        placement="topLeft"
        trigger="click"
        content={
          <Input
            ref={inputRef}
            value={specLabelStr}
            style={{ width: 350 }}
            placeholder="请输入规格名称 按下Enter键确认"
            onPressEnter={onAddSpecLabel}
            onChange={(value) => setSpecLabelStr(value.target.value)}
            addonAfter={
              <span style={{ cursor: "pointer" }} onClick={onAddSpecLabel}>
                确认添加
              </span>
            }
          />
        }
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(!visible)}
        >
          添加规格属性
        </Button>
      </Popover>
      <>
        {specContentList.map((item, index) => (
          <Card
            key={index}
            style={{ marginTop: "2.4rem" }}
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Row>
                  <div>规格属性：</div>
                  <Input
                    placeholder="请输入规格属性"
                    value={item.name}
                    size="small"
                    style={{ width: "fit-content" }}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {item.options.map((str, strKey) => (
                <CustomeRow key={strKey} style={{ margin: "6px 12px 6px 0" }}>
                  <Input
                    placeholder="请输入规格值"
                    value={
                      tagIndex === index && specIndex === strKey
                        ? inputSpecValue
                        : str
                    }
                    size="small"
                    style={{ width: "fit-content" }}
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
                    style={{
                      marginLeft: "6px",
                      color: "red",
                      fontSize: "14px",
                    }}
                    onClick={() => onDeleteSpecTag(index, strKey)}
                  />
                </CustomeRow>
              ))}
              {inputVisible && index === tagIndex ? (
                <Input
                  placeholder="请输入规格值"
                  value={inputTagValue}
                  size="small"
                  style={{ width: "fit-content" }}
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
                >
                  添加规格值
                </Button>
              )}
            </div>
          </Card>
        ))}
      </>

      <Table
        style={{ marginTop: "2.4rem" }}
        bordered
        rowKey={"name"}
        dataSource={tableSkuList}
        columns={columns}
        pagination={false}
      />
    </>
  );
};
