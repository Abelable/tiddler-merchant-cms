import styled from "@emotion/styled";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap: { [key: string]: string } = {
  "/dashboard": "数据概况",
  "/user_list": "用户列表",
  "/team": "乡村振兴",
  "/team/promoter_list": "推荐官列表",
  "/team/auth_info_list": "实名认证",
  "/team/enterprise_info_list": "企业认证",
  "/team/withdraw_list": "佣金提现",
  "/team/livestock_list": "认养专区",
  "/team/gift_goods_list": "礼包专区",
  "/home_zone": "首页专区",
  "/home_zone/grain_goods": "乡镇百谷",
  "/home_zone/fresh_goods": "乡集生鲜",
  "/home_zone/snack_goods": "乡村零嘴",
  "/home_zone/gift_goods": "乡思礼伴",
  "/home_zone/rural": "诚信乡村",
  "/home_zone/rural/region_list": "地区列表",
  "/home_zone/rural/goods_list": "商品列表",
  "/home_zone/integrity_goods": "诚信臻品",
  "/home_zone/theme_zone": "主题专区",
  "/home_zone/theme_zone/list": "主题列表",
  "/home_zone/theme_zone/goods_list": "商品列表",
  "/home_zone/activity": "商品活动",
  "/home_zone/activity/tag_list": "活动标签",
  "/home_zone/activity/list": "活动列表",
  "/activity": "活动管理",
  "/activity/banner_list": "头图列表",
  "/activity/coupon_list": "优惠券",
  "/activity/new_year": "年货节",
  "/activity/new_year/goods_list": "年货礼包",
  "/activity/new_year/cultrue_goods_list": "文创礼包",
  "/activity/new_year/region_list": "地区列表",
  "/activity/new_year/local_goods_list": "地方特产",
  "/activity/limited_time_recruit": "限时招募",
  "/activity/limited_time_recruit/category_list": "商品分类",
  "/activity/limited_time_recruit/goods_list": "商品列表",
  "/live": "直播管理",
  "/live/user_list": "直播用户",
  "/live/room_list": "直播列表",
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
