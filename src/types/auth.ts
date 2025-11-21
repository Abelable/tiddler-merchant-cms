export interface AuthForm {
  account: string;
  password: string;
}

export interface UserInfo {
  nickname: string;
  avatar: string | null;
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
