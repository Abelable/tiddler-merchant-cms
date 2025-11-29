export interface CouponListSearchParams {
  name: string;
  status: number;
  type: number;
  goodsId: number;
  page: number;
  limit: number;
}

export interface Coupon {
  id: number;
  status: number;
  name: string;
  denomination: number;
  description: string;
  type: number;
  numLimit: number;
  priceLimit: number;
  receiveNumLimit: number;
  expirationTime: string;
  goodsId: number;
  goodsName: string;
  goodsCover: string;
  receivedNum: number;
  createdAt: string;
}

export interface CouponListResult {
  list: Coupon[];
  page: string;
  limit: string;
  total: string;
}

export interface CouponForm {
  name: string;
  denomination: number;
  description: string;
  expirationTime: string;
  numLimit: number;
  priceLimit: number;
  goodsIds: number[];
}
