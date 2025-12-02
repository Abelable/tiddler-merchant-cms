import { Column } from "@ant-design/plots";
import { Card, Col, DatePicker, Row, Tabs } from "antd";
import { ButtonNoPadding, GoodsCover } from "components/lib";
import numeral from "numeral";
import useStyles from "../style.style";

import type dayjs from "dayjs";
import type { RangePickerProps } from "antd/es/date-picker/generatePicker/interface";
import type { OrderCountData, SalesData, TopGoodsList } from "types/dashboard";

export type TimeType = "today" | "week" | "month" | "year";
const { RangePicker } = DatePicker;

const rankingListData: {
  title: string;
  total: number;
}[] = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

export const SalesCard = ({
  salesData,
  orderCountData,
  topGoodsList,
  rangePickerValue,
  isActive,
  loading,
  handleRangePickerChange,
  selectDate,
}: {
  salesData: SalesData | undefined;
  orderCountData: OrderCountData | undefined;
  topGoodsList: TopGoodsList | undefined;
  rangePickerValue: RangePickerProps<dayjs.Dayjs>["value"];
  isActive: (key: TimeType) => string;
  loading: boolean;
  handleRangePickerChange: RangePickerProps<dayjs.Dayjs>["onChange"];
  selectDate: (key: TimeType) => void;
}) => {
  const { styles } = useStyles();
  return (
    <Card
      loading={loading}
      variant={"borderless"}
      styles={{
        body: { padding: 0 },
      }}
      style={{ marginBottom: "2.4rem" }}
    >
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <ButtonNoPadding
                  type="link"
                  style={{ color: "rgba(0, 0, 0, 0.8)" }}
                  className={isActive("today")}
                  onClick={() => selectDate("today")}
                >
                  今日
                </ButtonNoPadding>
                <ButtonNoPadding
                  type="link"
                  style={{ color: "rgba(0, 0, 0, 0.8)" }}
                  className={isActive("week")}
                  onClick={() => selectDate("week")}
                >
                  本周
                </ButtonNoPadding>
                <ButtonNoPadding
                  type="link"
                  style={{ color: "rgba(0, 0, 0, 0.8)" }}
                  className={isActive("month")}
                  onClick={() => selectDate("month")}
                >
                  本月
                </ButtonNoPadding>
                <ButtonNoPadding
                  type="link"
                  style={{ color: "rgba(0, 0, 0, 0.8)" }}
                  className={isActive("year")}
                  onClick={() => selectDate("year")}
                >
                  本年
                </ButtonNoPadding>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{
                  width: 256,
                }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
          items={[
            {
              key: "sales",
              label: "销售额",
              children: (
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Column
                        height={300}
                        data={
                          salesData?.monthlySalesList
                            ? salesData?.monthlySalesList?.map((item) => ({
                                x: item.month,
                                y: +item.sum,
                              }))
                            : []
                        }
                        xField="x"
                        yField="y"
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                            gridLineDash: null,
                            gridStroke: "#ccc",
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: "销售额",
                          channel: "y",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>商品销售额排名</h4>
                      <ul className={styles.rankingList}>
                        {topGoodsList?.topSalesGoodsList.map((item, i) => (
                          <li key={item.id}>
                            <span
                              className={`${styles.rankingItemNumber} ${
                                i < 3 ? styles.rankingItemNumberActive : ""
                              }`}
                            >
                              {i + 1}
                            </span>
                            <GoodsCover src={item.cover} />
                            <span
                              className={styles.rankingItemTitle}
                              title={item.name}
                              style={{ marginRight: "8rem" }}
                            >
                              {item.name}
                            </span>
                            <span>¥{numeral(item.sum).format("0,0")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              ),
            },
            {
              key: "views",
              label: "订单量",
              children: (
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Column
                        height={300}
                        data={
                          orderCountData?.monthlyCountList
                            ? orderCountData?.monthlyCountList?.map((item) => ({
                                x: item.month,
                                y: +item.count,
                              }))
                            : []
                        }
                        xField="x"
                        yField="y"
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: "订单量",
                          channel: "y",
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>商品订单量排名</h4>
                      <ul className={styles.rankingList}>
                        {topGoodsList?.topOrderCountGoodsList.map((item, i) => (
                          <li key={item.id}>
                            <span
                              className={`${
                                i < 3
                                  ? styles.rankingItemNumberActive
                                  : styles.rankingItemNumber
                              }`}
                            >
                              {i + 1}
                            </span>
                            <GoodsCover src={item.cover} />
                            <span
                              className={styles.rankingItemTitle}
                              title={item.name}
                              style={{ marginRight: "8rem" }}
                            >
                              {item.name}
                            </span>
                            <span>{numeral(item.count).format("0,0")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};
