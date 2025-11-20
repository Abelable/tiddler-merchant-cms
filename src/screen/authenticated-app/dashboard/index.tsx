import { useState } from "react";
import styled from "@emotion/styled";
import dayjs from "dayjs";
import {
  useIncomeData,
  useOrderCountData,
  useSalesData,
  useTodoList,
  useTopGoodsList,
  useUserCountData,
} from "service/dashboard";
import { getTimeDistance } from "./util";
import useStyles from "./style.style";

import { IntroduceRow } from "./components/IntroduceRow";
import { SalesCard } from "./components/SalesCard";
import { SalesRecordCard } from "./components/SalesRecordCard";
import { TodoListCard } from "./components/TodoListCard";

import type { RangePickerProps } from "antd/es/date-picker/generatePicker/interface";

type TimeType = "today" | "week" | "month" | "year";
type RangePickerValue = RangePickerProps<dayjs.Dayjs>["value"];

export const Dashboard = () => {
  const { styles } = useStyles();
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>(
    getTimeDistance("year")
  );

  const { data: topGoodsList } = useTopGoodsList({
    startDate: dayjs(rangePickerValue?.[0]).valueOf() / 1000,
    endDate: dayjs(rangePickerValue?.[1]).valueOf() / 1000,
  });
  const { data: salesData, isLoading: salesLoading } = useSalesData();
  const { data: incomeData, isLoading: incomeLoading } = useIncomeData();
  const { data: orderCountData, isLoading: orderCountLoading } =
    useOrderCountData();
  const { data: userCountData, isLoading: userCountLoading } =
    useUserCountData();
  const { data: todoList, isLoading: todoLoading } = useTodoList();

  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };
  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return "";
    }
    const value = getTimeDistance(type);
    if (!value) {
      return "";
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return "";
    }
    if (
      rangePickerValue[0].isSame(value[0] as dayjs.Dayjs, "day") &&
      rangePickerValue[1].isSame(value[1] as dayjs.Dayjs, "day")
    ) {
      return styles.currentDate;
    }
    return "";
  };

  return (
    <Container>
      <Main>
        <IntroduceRow
          salesData={salesData}
          incomeData={incomeData}
          orderCountData={orderCountData}
          userCountData={userCountData}
          salesLoading={salesLoading}
          incomeLoading={incomeLoading}
          orderCountLoading={orderCountLoading}
          userCountLoading={userCountLoading}
        />

        <SalesCard
          rangePickerValue={rangePickerValue}
          salesData={salesData}
          orderCountData={orderCountData}
          topGoodsList={topGoodsList}
          isActive={isActive}
          loading={salesLoading}
          handleRangePickerChange={handleRangePickerChange}
          selectDate={selectDate}
        />

        <CardList>
          <SalesRecordCard
            monthlySalesList={salesData?.monthlySalesList || []}
            monthlyIncomeList={incomeData?.monthlyIncomeList || []}
            loading={salesLoading && incomeLoading}
          />
          <TodoListCard todoList={todoList || []} loading={todoLoading} />
        </CardList>
      </Main>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Main = styled.div`
  padding: 2.4rem;
  height: 100%;
  overflow: scroll;
`;

const CardList = styled.div`
  display: flex;
  margin-bottom: 2.4rem;
`;
