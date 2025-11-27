export interface OrderListSearchParams {
  status: number | undefined;
  orderSn: string;
  goodsId: number | undefined;
  userId: number | undefined;
  deliveryMode: number | undefined;
  consignee: string;
  mobile: string;
  page: number;
  limit: number;
}

export interface Order {
  id: number;
  orderSn: string;
  status: number;
  deliveryMode: number;
  goodsList: OrderGoods[];
  refundAmount: number;
  merchantId: number;
  userInfo: { id: number; avatar: string; nickname: string };
  consignee: string;
  mobile: string;
  address: string;
  pickupAddress: { name: string; addressDetail: string };
  pickupTime: string;
  pickupMobile: string;
  verifyCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResult {
  list: Order[];
  page: string;
  limit: string;
  total: string;
}

export interface Goods {
  id: number;
  cover: string;
  name: string;
  selectedSkuName: string;
  price: number;
  number: number;
}

export interface OrderGoods extends Omit<Goods, "id"> {
  goodsId: number;
}

export interface PackageGoods {
  goodsId: number;
  cover: string;
  name: string;
  number: number;
}

export interface Package {
  id: number;
  shipChannel: string;
  shipCode?: string;
  shipSn: string;
  goodsList: PackageGoods[];
}

export interface Shipment {
  id: number;
  isAllDelivered: number;
  packageList: {
    shipChannel: string;
    shipCode: string;
    shipSn: string;
    goodsList: string;
  }[];
}

interface UserInfo {
  id: number;
  avatar: string;
  nickname: string;
}
export interface OrderDetail extends Omit<Order, "goodsList"> {
  goodsList: OrderGoods[];
  packageList: Package[];
  packageGoodsList: PackageGoods[];
  goodsPrice: number;
  couponDenomination: number;
  deductionBalance: number;
  freightPrice: number;
  userInfo: UserInfo;
  merchantId: number;
  consignee: string;
  mobile: string;
  address: string;
  payTime: string;
  shipChannel: string;
  shipSn: string;
  shipTime: string;
  confirmTime: string;
  finishTime: string;
}

export interface ExpressOption {
  name: string;
  code: string;
}
