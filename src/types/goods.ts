export interface GoodsCategoryOption {
  id: number;
  name: string;
  minSalesCommissionRate: number;
  maxSalesCommissionRate: number;
}

export interface GoodsListSearchParams {
  name: string;
  categoryId: number | undefined;
  status: number | undefined;
  page: number;
  limit: number;
}

export interface Spec {
  name: string;
  options: string[];
}

export interface Sku {
  image: string;
  name: string;
  price: number;
  originalPrice: number;
  commissionRate: number;
  stock: number;
  limit: number;
}

export interface Goods {
  id: number;
  status: number;
  failureReason: string;
  categoryIds: number[];
  cover: string;
  video: string;
  imageList: string[];
  detailImageList: string[];
  defaultSpecImage: string;
  name: string;
  introduction: string;
  categoryId: number;
  price: number;
  marketPrice: number;
  salesCommissionRate: number;
  stock: number;
  numberLimit: number;
  deliveryMode: number;
  freightTemplateId: number;
  pickupAddressIds: number[];
  refundStatus: number;
  refundAddressId: number;
  specList: Spec[];
  skuList: Sku[];
  score: number;
  salesVolume: number;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface GoodsListResult {
  list: Goods[];
  page: string;
  limit: string;
  total: string;
}

export interface GoodsOption {
  id: number;
  cover: string;
  name: string;
}
