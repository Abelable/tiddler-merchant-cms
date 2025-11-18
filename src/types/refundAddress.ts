export interface RefundAddressListSearchParams {
  page: number;
  limit: number;
}

export interface RefundAddress {
  id: number;
  consigneeName: string;
  mobile: string;
  addressDetail: string;
  supplement: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundAddressListResult {
  list: RefundAddress[];
  page: string;
  limit: string;
  total: string;
}
