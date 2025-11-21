import { useQuery } from "react-query";
import { useHttp } from "./http";

import type {
  IncomeData,
  OrderCountData,
  SalesData,
  Todo,
  TopGoodsList,
  UserCountData,
} from "types/dashboard";

export const useSalesData = () => {
  const client = useHttp();
  return useQuery<SalesData>(["sales_data"], () =>
    client("shop/dashboard/sales_data")
  );
};

export const useIncomeData = () => {
  const client = useHttp();
  return useQuery<IncomeData>(["income_data"], () =>
    client("shop/dashboard/income_data")
  );
};

export const useOrderCountData = () => {
  const client = useHttp();
  return useQuery<OrderCountData>(["order_count_data"], () =>
    client("shop/dashboard/order_count_data")
  );
};

export const useUserCountData = () => {
  const client = useHttp();
  return useQuery<UserCountData>(["user_count_data"], () =>
    client("shop/dashboard/user_count_data")
  );
};

export const useTopGoodsList = (params: {
  startDate: number;
  endDate: number;
}) => {
  const client = useHttp();
  return useQuery<TopGoodsList>(["top_goods_list", params], () =>
    client("shop/dashboard/top_goods_list", { data: params })
  );
};

export const useTodoList = () => {
  const client = useHttp();
  return useQuery<Todo[]>(["todo_list"], () =>
    client("shop/dashboard/todo_list")
  );
};
