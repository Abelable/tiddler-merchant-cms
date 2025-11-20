import { Card, Progress, Tooltip } from "antd";
import { Line } from "@ant-design/charts";
import { PageTitle, Row } from "components/lib";
import type { CommissionData } from "types/dashboard";

export const CommissionCard = ({
  commissionData,
  loading,
}: {
  commissionData: CommissionData | undefined;
  loading: boolean;
}) => {
  const config = {
    data: commissionData?.monthlyCommissionList
      .map((item) => {
        const giftCommission =
          commissionData.monthlyGiftCommissionList.find(
            (_item) => _item.month === item.month
          )?.sum || 0;
        const teamCommission =
          commissionData.monthlyTeamCommissionList.find(
            (_item) => _item.month === item.month
          )?.sum || 0;
        return [
          {
            name: "商品佣金",
            month: item.month,
            sum: +item.sum.toFixed(2),
          },
          {
            name: "礼包佣金",
            month: item.month,
            sum: +giftCommission.toFixed(2),
          },
          {
            name: "团队佣金",
            month: item.month,
            sum: +teamCommission.toFixed(2),
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
      extra={
        <Tooltip
          title={`累计佣金：¥${
            commissionData
              ? (
                  commissionData?.pendingCommissionSum +
                  commissionData?.settledCommissionSum +
                  commissionData?.pendingGiftCommissionSum +
                  commissionData?.settledGiftCommissionSum +
                  commissionData?.pendingTeamCommissionSum +
                  commissionData?.settledTeamCommissionSum
                ).toFixed(2)
              : "0.00"
          }，未提现: ¥${
            commissionData
              ? (
                  commissionData?.pendingCommissionSum +
                  commissionData?.pendingGiftCommissionSum +
                  commissionData?.pendingTeamCommissionSum
                ).toFixed(2)
              : "0.00"
          }`}
        >
          <Row style={{ width: "22rem", cursor: "pointer" }}>
            <Progress
              percent={
                commissionData
                  ? Math.round(
                      ((commissionData?.settledCommissionSum +
                        commissionData?.settledGiftCommissionSum +
                        commissionData?.settledTeamCommissionSum) /
                        (commissionData?.pendingCommissionSum +
                          commissionData?.settledCommissionSum +
                          commissionData?.pendingGiftCommissionSum +
                          commissionData?.settledGiftCommissionSum +
                          commissionData?.pendingTeamCommissionSum +
                          commissionData?.settledTeamCommissionSum)) *
                        100
                    )
                  : 0
              }
              size="small"
              status="active"
            />
          </Row>
        </Tooltip>
      }
    >
      <Line height={350} {...config} />
    </Card>
  );
};
