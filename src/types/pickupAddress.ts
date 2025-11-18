export interface PickupAddressListSearchParams {
  page: number;
  limit: number;
}

export interface OpenTime {
  startWeekDay: number;
  endWeekDay: number;
  timeFrameList: { openTime: string; closeTime: string }[];
}

export interface PickupAddress {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  addressDetail: string;
  openTimeList: OpenTime[];
  createdAt: string;
  updatedAt: string;
}

export interface PickupAddressListResult {
  list: PickupAddress[];
  page: string;
  limit: string;
  total: string;
}
