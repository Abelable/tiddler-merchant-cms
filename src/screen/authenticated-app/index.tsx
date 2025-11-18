import { useState } from "react";
import { useAuth } from "context/auth-context";
import styled from "@emotion/styled";
import { HashRouter as Router, Link } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import { useRouteType } from "utils/url";
import { useUserInfo } from "service/auth";
import { useAuthInfoPendingCount } from "service/authInfo";
import { useEnterpriseInfoPendingCount } from "service/enterpriseInfo";
import { useWithdrawPendingCount } from "service/withdraw";
import { useShipOrderCount } from "service/order";
import { useWaitingRefundCount } from "service/refund";

import { Avatar, Dropdown, Layout, Menu, MenuProps } from "antd";
import { NavigationBar } from "components/navigation-bar";
import { Row } from "components/lib";

import {
  DashboardOutlined,
  LockOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MehOutlined,
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  CarOutlined,
  ShopOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  GiftOutlined,
  SnippetsOutlined,
  CloudOutlined,
  PictureOutlined,
  EnvironmentOutlined,
  FlagOutlined,
  VerifiedOutlined,
  TransactionOutlined,
  PayCircleOutlined,
  FireOutlined,
  NotificationOutlined,
  TagOutlined,
  TruckOutlined,
  SunOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import logo from "assets/images/logo.png";
import { CouponIcon } from "assets/icon";

import { Dashboard } from "./dashboard";
import { UserList } from "./user-list";
import { PromoterList } from "./team/promoter-list";
import { AuthInfoList } from "./team/auth-info-list";
import { EnterpriseInfoList } from "./team/enterprise-info-list";
import { WithdrawList } from "./team/withdraw-list";
import { LivestockList } from "./team/livestock-list";
import { GiftGoodsList } from "./team/gift-goods-list";
import { VillageGrainGoodsList } from "./home-zone/grain-goods";
import { VillageFreshGoodsList } from "./home-zone/fresh-goods";
import { VillageSnackGoodsList } from "./home-zone/snack-goods";
import { VillageGiftGoodsList } from "./home-zone/gift-goods";
import { IntegrityGoodsList } from "./home-zone/integrity-goods";
import { ThemeZoneList } from "./home-zone/theme-zone";
import { ThemeZoneGoodsList } from "./home-zone/theme-zone-goods";
import { ActivityTagList } from "./home-zone/activity-tag-list";
import { ActivityList } from "./home-zone/activity-list";
import { CouponList } from "./activity-management/coupon-list";
import { BannerList } from "./activity-management/banner-list";
import { NewYearGoodsList } from "./activity-management/new-year/goods-list";
import { NewYearCultureGoodsList } from "./activity-management/new-year/culture-goods-list";
import { NewYearLocalRegionList } from "./activity-management/new-year/local-region-list";
import { NewYearLocalGoodsList } from "./activity-management/new-year/local-goods-list";
import { LimitedTimeRecruitCategoryList } from "./activity-management/limited-time-recruit/category-list";
import { LimitedTimeRecruitGoodsList } from "./activity-management/limited-time-recruit/goods-list";
import { RuralRegionList } from "./activity-management/rural/region-list";
import { RuralGoodsList } from "./activity-management/rural/goods-list";
import { LiveUserList } from "./live/user-list";
import { LiveRoomList } from "./live/room-list";
import { MerchantList } from "./mall/merchant-list";
import { RefundAddressList } from "./mall/refund-address-list";
import { PickupAddressList } from "./mall/pickup-address-list";
import { FreightTemplateList } from "./mall/freight-template-list";
import { CategoryList } from "./mall/category-list";
import { GoodsList } from "./mall/goods-list";
import { ExpressList } from "./order-management/express-list";
import { OrderList } from "./order-management/order-list";
import { RefundList } from "./order-management/refund-list";
import { RoleList } from "./auth/role-list";
import { AdminList } from "./auth/admin-list";
import { UserCenter } from "./user-center";

import type { UserInfo } from "types/auth";

export const AuthenticatedApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { data: userInfo } = useUserInfo();
  const { permission, logout } = useAuth();

  return (
    <Router>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <MenuSider permission={permission} collapsed={collapsed} />
        <Layout>
          <Header>
            <Row>
              <Trigger collapsed={collapsed} setCollapsed={setCollapsed} />
              <NavigationBar />
            </Row>
            <User userInfo={userInfo} logout={logout} />
          </Header>
          <Content>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="user_list" element={<UserList />} />
              <Route path="team/promoter_list" element={<PromoterList />} />
              <Route path="team/auth_info_list" element={<AuthInfoList />} />
              <Route
                path="team/enterprise_info_list"
                element={<EnterpriseInfoList />}
              />
              <Route path="team/withdraw_list" element={<WithdrawList />} />
              <Route path="team/livestock_list" element={<LivestockList />} />
              <Route path="team/gift_goods_list" element={<GiftGoodsList />} />
              <Route
                path="home_zone/grain_goods"
                element={<VillageGrainGoodsList />}
              />
              <Route
                path="home_zone/fresh_goods"
                element={<VillageFreshGoodsList />}
              />
              <Route
                path="home_zone/snack_goods"
                element={<VillageSnackGoodsList />}
              />
              <Route
                path="home_zone/gift_goods"
                element={<VillageGiftGoodsList />}
              />
              <Route
                path="home_zone/rural/region_list"
                element={<RuralRegionList />}
              />
              <Route
                path="home_zone/rural/goods_list"
                element={<RuralGoodsList />}
              />
              <Route
                path="home_zone/integrity_goods"
                element={<IntegrityGoodsList />}
              />
              <Route
                path="home_zone/theme_zone/list"
                element={<ThemeZoneList />}
              />
              <Route
                path="home_zone/theme_zone/goods_list"
                element={<ThemeZoneGoodsList />}
              />
              <Route
                path="home_zone/activity/tag_list"
                element={<ActivityTagList />}
              />
              <Route
                path="home_zone/activity/list"
                element={<ActivityList />}
              />
              <Route path="activity/banner_list" element={<BannerList />} />
              <Route path="activity/coupon_list" element={<CouponList />} />
              <Route
                path="activity/new_year/goods_list"
                element={<NewYearGoodsList />}
              />
              <Route
                path="activity/new_year/culture_goods_list"
                element={<NewYearCultureGoodsList />}
              />
              <Route
                path="activity/new_year/region_list"
                element={<NewYearLocalRegionList />}
              />
              <Route
                path="activity/new_year/local_goods_list"
                element={<NewYearLocalGoodsList />}
              />
              <Route
                path="activity/limited_time_recruit/category_list"
                element={<LimitedTimeRecruitCategoryList />}
              />
              <Route
                path="activity/limited_time_recruit/goods_list"
                element={<LimitedTimeRecruitGoodsList />}
              />
              <Route path="live/user_list" element={<LiveUserList />} />
              <Route path="live/room_list" element={<LiveRoomList />} />
              <Route path="goods/merchant_list" element={<MerchantList />} />
              <Route
                path="goods/merchant_list/refund_address_list"
                element={<RefundAddressList />}
              />
              <Route
                path="goods/merchant_list/pickup_address_list"
                element={<PickupAddressList />}
              />
              <Route
                path="goods/freight_template_list"
                element={<FreightTemplateList />}
              />
              <Route path="goods/category_list" element={<CategoryList />} />
              <Route path="goods/list" element={<GoodsList />} />
              <Route path="order/express_list" element={<ExpressList />} />
              <Route path="order/list" element={<OrderList />} />
              <Route path="order/refund" element={<RefundList />} />
              <Route path="auth/role_list" element={<RoleList />} />
              <Route path="auth/admin_list" element={<AdminList />} />
              <Route path="user_center" element={<UserCenter />} />
              <Route
                path={"*"}
                element={<Navigate to={"dashboard"} replace={true} />}
              />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

const MenuSider = ({
  permission,
  collapsed,
}: {
  permission: string[];
  collapsed: boolean;
}) => {
  const { defaultOpenKey, selectedKey } = useRouteType();
  const { data: authInfoPendingCount } = useAuthInfoPendingCount();
  const { data: enterpriseInfoPendingCount } = useEnterpriseInfoPendingCount();
  const { data: withdrawPendingCount } = useWithdrawPendingCount();
  const { data: shipOrderCount } = useShipOrderCount();
  const { data: waitingRefundCount } = useWaitingRefundCount();

  const items: MenuProps["items"] = [
    {
      label: <Link to={"dashboard"}>数据概况</Link>,
      key: "dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: (
        <Link to={"order/list"}>
          <Row between>
            <span>订单列表</span>
            {shipOrderCount ? <Badge>{shipOrderCount}</Badge> : <></>}
          </Row>
        </Link>
      ),
      key: "order_list",
      icon: <SnippetsOutlined />,
    },
    {
      label: (
        <Link to={"order/refund"}>
          <Row between>
            <span>售后处理</span>
            {waitingRefundCount ? <Badge>{waitingRefundCount}</Badge> : <></>}
          </Row>
        </Link>
      ),
      key: "order_refund",
      icon: <TransactionOutlined />,
    },
    {
      label: <Link to={"goods/list"}>商品列表</Link>,
      key: "goods_list",
      icon: <ShoppingOutlined />,
    },
    {
      label: <Link to={"goods/freight_template_list"}>运费模板</Link>,
      key: "goods_freight_template_list",
      icon: <TruckOutlined />,
    },
    {
      label: <Link to={"auth/admin_list"}>人员管理</Link>,
      key: "auth_admin_list",
      icon: <TeamOutlined />,
    },
  ];

  return (
    <Layout.Sider
      style={{ overflowY: "scroll" }}
      trigger={null}
      collapsible
      collapsed={collapsed}
    >
      <Link to={"/"}>
        <Logo collapsed={collapsed}>
          <LogoImg src={logo} />
          <div>小鱼游商家后台</div>
        </Logo>
      </Link>
      <Menu
        theme="dark"
        mode="inline"
        defaultOpenKeys={[defaultOpenKey]}
        selectedKeys={[selectedKey]}
        items={items}
      />
    </Layout.Sider>
  );
};

interface Collapsed {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Trigger = ({ collapsed, setCollapsed }: Collapsed) => {
  return (
    <div onClick={() => setCollapsed(!collapsed)}>
      {collapsed ? <Unfold /> : <Fold />}
    </div>
  );
};

const User = ({
  userInfo,
  logout,
}: {
  userInfo: UserInfo | undefined;
  logout: () => void;
}) => {
  const items: MenuProps["items"] = [
    {
      key: "center",
      icon: <UserOutlined />,
      label: <Link to="user_center">个人中心</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  const onClick = (event: any) => {
    const { key } = event;
    if (key === "logout") {
      logout();
    }
  };

  return (
    <Dropdown menu={{ items, onClick }}>
      <UserInfoWrap>
        <Avatar
          style={{ marginRight: "0.8rem", width: "3rem", height: "3rem" }}
          src={userInfo?.avatar}
        />
        <div>{userInfo?.nickname}</div>
      </UserInfoWrap>
    </Dropdown>
  );
};

const Logo = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.6rem;
  padding-left: ${(props) => (props.collapsed ? "2.6rem" : "1.6rem")};
  transition: padding-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;
  > div {
    margin-left: 1rem;
    flex: 1;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    opacity: ${(props) => (props.collapsed ? 0 : 1)};
    transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
`;

const LogoImg = styled.img<{ size?: number }>`
  width: ${(props) => (props.size ? props.size + "rem" : "2.8rem")};
  height: ${(props) => (props.size ? props.size + "rem" : "2.8rem")};
  border-radius: 50%;
  cursor: pointer;
`;

const Header = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 2.4rem;
  background: #fff;
  box-shadow: 0 2px 4px rgb(0 21 41 / 8%);
  z-index: 10;
`;

const UserInfoWrap = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.2rem;
  padding-right: 1.6rem;
  height: 4.4rem;
  color: rgba(0, 0, 0, 0.45);
  border-radius: 0.6rem;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
`;

const Unfold = styled(MenuUnfoldOutlined)`
  padding: 0 2.4rem;
  font-size: 1.8rem;
  line-height: 6.4rem;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`;
const Fold = Unfold.withComponent(MenuFoldOutlined);

const Content = styled(Layout.Content)`
  height: 100%;
`;

const Badge = styled.div`
  padding: 1.4px 3px 0 2.4px;
  height: 14px;
  color: #fff;
  font-size: 10px;
  line-height: 1;
  background: #fc5531;
  border-radius: 4px;
`;
