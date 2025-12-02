import styled from "@emotion/styled";
import dayjs from "dayjs";

import { Area, Column } from "@ant-design/plots";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";

import type {
  IncomeData,
  OrderCountData,
  SalesData,
  UserCountData,
} from "types/dashboard";

export const IntroduceRow = ({
  salesData,
  incomeData,
  orderCountData,
  userCountData,
  salesLoading,
  incomeLoading,
  orderCountLoading,
  userCountLoading,
}: {
  salesData: SalesData | undefined;
  incomeData: IncomeData | undefined;
  orderCountData: OrderCountData | undefined;
  userCountData: UserCountData | undefined;
  salesLoading: boolean;
  incomeLoading: boolean;
  orderCountLoading: boolean;
  userCountLoading: boolean;
}) => (
  <CardList>
    <StatisticCard loading={salesLoading}>
      <Statistic
        title="总销售额"
        value={salesData?.totalSales}
        prefix="¥"
        valueStyle={{ fontSize: "3rem" }}
      />
      <StatisticDetail>
        <Area
          xField="x"
          yField="y"
          shapeField="smooth"
          axis={false}
          padding={-10}
          height={60}
          style={{
            fill: "linear-gradient(-90deg, white 0%, #975FE4 100%)",
            fillOpacity: 0.6,
            width: "100%",
          }}
          data={
            salesData?.dailySalesList
              ? salesData?.dailySalesList.map((item) => ({
                  x: dayjs(item.createdAt).format("YYYY-MM-DD"),
                  y: +item.sum,
                }))
              : []
          }
        />
      </StatisticDetail>
      <CardBottom>
        <Row style={{ marginRight: "1.6rem" }}>
          周同比 {Math.abs(salesData?.weeklyGrowthRate as number)}%{" "}
          {(salesData?.weeklyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
        <Row>
          日同比 {Math.abs(salesData?.dailyGrowthRate as number)}%
          {(salesData?.dailyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
      </CardBottom>
    </StatisticCard>
    <StatisticCard loading={incomeLoading}>
      <Statistic
        title="累计收益"
        value={incomeData?.totalIncome}
        prefix="¥"
        valueStyle={{ fontSize: "3rem" }}
      />
      <StatisticDetail>
        <Area
          xField="x"
          yField="y"
          shapeField="smooth"
          axis={false}
          padding={-10}
          height={60}
          style={{
            fill: "linear-gradient(-90deg, white 0%, #975FE4 100%)",
            fillOpacity: 0.6,
            width: "100%",
          }}
          data={
            incomeData?.dailyIncomeList
              ? incomeData?.dailyIncomeList.map((item) => ({
                  x: dayjs(item.createdAt).format("YYYY-MM-DD"),
                  y: +item.sum,
                }))
              : []
          }
        />
      </StatisticDetail>
      <CardBottom>
        <Row style={{ marginRight: "1.6rem" }}>
          周同比 {Math.abs(incomeData?.weeklyGrowthRate as number)}%{" "}
          {(incomeData?.weeklyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
        <Row>
          日同比 {Math.abs(incomeData?.dailyGrowthRate as number)}%
          {(incomeData?.dailyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
      </CardBottom>
    </StatisticCard>
    <StatisticCard loading={orderCountLoading}>
      <Statistic
        title="订单总数"
        value={orderCountData?.totalCount}
        valueStyle={{ fontSize: "3rem" }}
      />
      <StatisticDetail>
        <Column
          xField="x"
          yField="y"
          axis={false}
          padding={-10}
          height={60}
          data={
            orderCountData?.dailyCountList
              ? orderCountData?.dailyCountList.map((item) => ({
                  x: dayjs(item.createdAt).format("YYYY-MM-DD"),
                  y: item.count,
                }))
              : []
          }
          scale={{ x: { paddingInner: 0.4 } }}
        />
      </StatisticDetail>
      <CardBottom>
        <Row style={{ marginRight: "1.6rem" }}>
          周同比 {Math.abs(orderCountData?.weeklyGrowthRate as number)}%{" "}
          {(orderCountData?.weeklyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
        <Row>
          日同比 {Math.abs(orderCountData?.dailyGrowthRate as number)}%
          {(orderCountData?.dailyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
      </CardBottom>
    </StatisticCard>
    <StatisticCard loading={userCountLoading}>
      <Statistic
        title="访客总数"
        value={userCountData?.totalCount}
        valueStyle={{ fontSize: "3rem" }}
      />
      <StatisticDetail>
        <Column
          xField="x"
          yField="y"
          axis={false}
          padding={-10}
          height={60}
          data={
            userCountData?.dailyCountList
              ? userCountData?.dailyCountList.map((item) => ({
                  x: dayjs(item.createdAt).format("YYYY-MM-DD"),
                  y: item.count,
                }))
              : []
          }
          scale={{ x: { paddingInner: 0.4 } }}
        />
      </StatisticDetail>
      <CardBottom>
        <Row style={{ marginRight: "1.6rem" }}>
          周同比 {Math.abs(userCountData?.weeklyGrowthRate as number)}%{" "}
          {(userCountData?.weeklyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
        <Row>
          日同比 {Math.abs(userCountData?.dailyGrowthRate as number)}%
          {(userCountData?.dailyGrowthRate as number) >= 0 ? (
            <CaretUpOutlined style={{ color: "#f5222d" }} />
          ) : (
            <CaretDownOutlined style={{ color: "#52c41a" }} />
          )}
        </Row>
      </CardBottom>
    </StatisticCard>
  </CardList>
);

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const CardList = styled.div`
  display: flex;
  margin-bottom: 2.4rem;
`;
const StatisticCard = styled(Card)`
  display: flex;
  flex-direction: column;
  margin-right: 2.4rem;
  flex: 1;
  height: 21rem;
  &:last-child {
    margin-right: 0;
  }
  canvas {
    width: 100% !important;
  }
`;
const StatisticDetail = styled.div`
  position: relative;
  flex: 1;
  border-bottom: 1px solid rgba(5, 5, 5, 0.06);
`;
const CardBottom = styled.div`
  display: flex;
  align-items: center;
  padding: 0.9rem 0;
`;
