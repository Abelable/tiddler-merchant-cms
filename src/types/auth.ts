export interface AuthForm {
  mobile: string;
  password: string;
}

export interface ShopInfo {
  id: number;
  bg: string;
  logo: string;
  name: string;
  brief: string;
  ownerName: string;
  mobile: string;
}

export interface ShopOption {
  id: number;
  logo: string;
  name: string;
  roleId: number;
}
