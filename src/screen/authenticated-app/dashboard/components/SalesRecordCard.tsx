import { Card } from "antd";
import { Line } from "@ant-design/charts";
import { PageTitle, Row } from "components/lib";
import type { MonthData } from "types/dashboard";

export const SalesRecordCard = ({
  monthlySalesList,
  monthlyIncomeList,
  loading,
}: {
  monthlySalesList: MonthData[];
  monthlyIncomeList: MonthData[];
  loading: boolean;
}) => {
  const config = {
    data: monthlySalesList
      .map((item) => {
        const income =
          monthlyIncomeList.find((_item) => _item.month === item.month)?.sum ||
          0;
        return [
          {
            name: "销售额",
            month: item.month,
            sum: +item.sum.toFixed(2),
          },
          {
            name: "收益",
            month: item.month,
            sum: +income.toFixed(2),
          },
        ];
      })
      .reduce((a, b) => [...a, ...b], []),
    xField: "month",
    yField: "sum",
    colorField: "name",
    shapeField: "smooth",
    style: {
      lineWidth: 2,
    },
  };
  return (
    <Card
      loading={loading}
      title={
        <Row>
          <PageTitle>销售记录</PageTitle>
        </Row>
      }
      style={{ flex: 2 }}
    >
      <Line height={350} {...config} />
    </Card>
  );
};
