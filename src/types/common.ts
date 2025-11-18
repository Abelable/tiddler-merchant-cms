export interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
}

export interface PageParams {
  page: number;
  limit: number;
}

export interface Region {
  label: string;
  value: string;
  children?: Region[];
}

export interface RegionItem {
  province_id: number;
  city_id: number;
}

export interface WarningSetting {
  address_repeated_prewarn_num: string;
  address_repeated_prewarn_num_check_period: string;
  phone_repeated_prewarn_num: string;
  phone_repeated_prewarn_num_check_period: string;
}

export interface Option {
  text: string;
  value: number;
  tips?: string;
}

export interface DataOption {
  id: number;
  name: string;
}

export interface OperatorOption {
  id: number;
  name: string;
}

export interface DepositInfo {
  orderSn: string;
  payId: number;
  paymentAmount: string;
  status: number;
  updatedAt: string;
  createdAt: string;
}

export interface ShippingInfo {
  shipChannel: string;
  shipSn: string;
  traces: { AcceptStation: string; AcceptTime: string }[];
}
