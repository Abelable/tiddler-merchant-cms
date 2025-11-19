import styled from "@emotion/styled";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap: { [key: string]: string } = {
  "/dashboard": "数据概况",
  "/order_list": "订单列表",
  "/order_refund": "售后处理",
  "/goods_list": "商品列表",
  "/freight_template_list": "运费模板",
  "/pickup_address_list": "提货地点",
  "/refund_address_list": "退货地址",
  "/manager_list": "人员列表",
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
