import styled from "@emotion/styled";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap: { [key: string]: string } = {
  "/dashboard": "数据概况",
  "/goods": "商品管理",
  "/goods/merchant_list": "商家列表",
  "/goods/merchant_list/refund_address_list": "退货地址",
  "/goods/merchant_list/pickup_address_list": "提货地址",
  "/goods/freight_template_list": "运费模板",
  "/goods/category_list": "商品分类",
  "/goods/list": "商品列表",
  "/order": "订单管理",
  "/order/express_list": "快递列表",
  "/order/list": "订单列表",
  "/order/refund": "售后处理",
  "/auth": "权限管理",
  "/auth/role_list": "岗位列表",
  "/auth/admin_list": "人员列表",
  "/user_center": "个人中心",
};

export const NavigationBar = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      title: <Link to={url}>{breadcrumbNameMap[url]}</Link>,
    };
  });
  return (
    <Wrap>
      <div>当前位置：</div>
      <Breadcrumb items={extraBreadcrumbItems} />
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 0.4rem;
`;
