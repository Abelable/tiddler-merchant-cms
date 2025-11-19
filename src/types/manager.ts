export interface ManagerListSearchParams {
  nickname: string;
  mobile: string;
  roleId: number | undefined;
  page: number;
  limit: number;
}

export interface Manager {
  id: number;
  avatar: string;
  nickname: string;
  account: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ManagerListResult {
  list: Manager[];
  page: string;
  limit: string;
  total: string;
}
