import { useQuery } from "react-query";
import { useHttp } from "./http";

import type {
  CommissionData,
  OrderCountData,
  SalesData,
  Todo,
  TopGoodsList,
  UserCountData,
} from "types/dashboard";

export const useSalesData = () => {
  const client = useHttp();
  return useQuery<SalesData>(["sales_data"], () =>
    client("dashboard/sales_data")
  );
};

export const useOrderCountData = () => {
  const client = useHttp();
  return useQuery<OrderCountData>(["order_count_data"], () =>
    client("dashboard/order_count_data")
  );
};

export const useUserCountData = () => {
  const client = useHttp();
  return useQuery<UserCountData>(["user_count_data"], () =>
    client("dashboard/user_count_data")
  );
};

export const useTopGoodsList = (params: {
  startDate: number;
  endDate: number;
}) => {
  const client = useHttp();
  return useQuery<TopGoodsList>(["top_goods_list", params], () =>
    client("dashboard/top_goods_list", { data: params })
  );
};

export const useCommissionData = () => {
  const client = useHttp();
  return useQuery<CommissionData>(["commission_data"], () =>
    client("dashboard/commission_data")
  );
};

export const useTodoList = () => {
  const client = useHttp();
  return useQuery<Todo[]>(["todo_list"], () => client("dashboard/todo_list"));
};
