export interface MonthData {
  month: string;
  sum: number;
}

export interface SalesData {
  totalSales: number;
  dailySalesList: { createdAt: string; sum: number }[];
  monthlySalesList: MonthData[];
  dailyGrowthRate: number;
  weeklyGrowthRate: number;
}

export interface IncomeData {
  totalIncome: number;
  dailyIncomeList: { createdAt: string; sum: number }[];
  monthlyIncomeList: MonthData[];
  dailyGrowthRate: number;
  weeklyGrowthRate: number;
}

export interface OrderCountData {
  totalCount: number;
  dailyCountList: { createdAt: string; count: number }[];
  monthlyCountList: { month: string; count: number }[];
  dailyGrowthRate: number;
  weeklyGrowthRate: number;
}

export interface UserCountData extends OrderCountData {}

export interface TopGoodsList {
  topSalesGoodsList: { id: number; cover: string; name: string; sum: number }[];
  topOrderCountGoodsList: {
    id: number;
    cover: string;
    name: string;
    count: number;
  }[];
}

export interface Todo {
  type: number;
  referenceId: number;
}
