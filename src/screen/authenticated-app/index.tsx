import { useState } from "react";
import { useAuth } from "context/auth-context";
import styled from "@emotion/styled";
import { HashRouter as Router, Link } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router";
import { useRouteType } from "utils/url";
import { useShopInfo } from "service/auth";
import { useShipOrderCount } from "service/order";
import { useWaitingRefundCount } from "service/refund";

import { Avatar, Dropdown, Layout, Menu, MenuProps } from "antd";
import { NavigationBar } from "components/navigation-bar";
import { Row } from "components/lib";

import {
  DashboardOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  ShopOutlined,
  TeamOutlined,
  ShoppingOutlined,
  SnippetsOutlined,
  EnvironmentOutlined,
  TransactionOutlined,
  TruckOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "assets/images/logo.png";

import { Dashboard } from "./dashboard";
import { FreightTemplateList } from "./freight-template-list";
import { PickupAddressList } from "./pickup-address";
import { RefundAddressList } from "./refund-address";
import { GoodsList } from "./goods-list";
import { OrderList } from "./order-list";
import { RefundList } from "./refund-list";
import { ManagerList } from "./manager-list";
import { ShopCenter } from "./shop-center";

import type { ShopInfo } from "types/auth";

export const AuthenticatedApp = () => {
  const { logout, shopId, roleId } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { data: shopInfo } = useShopInfo(+shopId);

  return (
    <Router>
      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <MenuSider roleId={+roleId} collapsed={collapsed} />
        <Layout>
          <Header>
            <Row>
              <Trigger collapsed={collapsed} setCollapsed={setCollapsed} />
              <NavigationBar />
            </Row>
            <User shopInfo={shopInfo} logout={logout} />
          </Header>
          <Content>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="order_list" element={<OrderList />} />
              <Route path="order_refund" element={<RefundList />} />
              <Route path="goods_list" element={<GoodsList />} />
              <Route
                path="freight_template_list"
                element={<FreightTemplateList />}
              />
              <Route
                path="refund_address_list"
                element={<RefundAddressList />}
              />
              <Route
                path="pickup_address_list"
                element={<PickupAddressList />}
              />
              {+roleId === 1 ? (
                <Route path="manager_list" element={<ManagerList />} />
              ) : (
                <></>
              )}
              <Route path="shop_center" element={<ShopCenter />} />
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
  roleId,
  collapsed,
}: {
  roleId: number;
  collapsed: boolean;
}) => {
  const { defaultOpenKey, selectedKey } = useRouteType();
  const { data: shipOrderCount } = useShipOrderCount();
  const { data: waitingRefundCount } = useWaitingRefundCount();

  const items: MenuProps["items"] =
    +roleId === 1
      ? [
          {
            label: <Link to={"dashboard"}>数据概况</Link>,
            key: "dashboard",
            icon: <DashboardOutlined />,
          },
          {
            label: (
              <Link to={"order_list"}>
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
              <Link to={"order_refund"}>
                <Row between>
                  <span>售后处理</span>
                  {waitingRefundCount ? (
                    <Badge>{waitingRefundCount}</Badge>
                  ) : (
                    <></>
                  )}
                </Row>
              </Link>
            ),
            key: "order_refund",
            icon: <TransactionOutlined />,
          },
          {
            label: <Link to={"goods_list"}>商品列表</Link>,
            key: "goods_list",
            icon: <ShoppingOutlined />,
          },
          {
            label: <Link to={"freight_template_list"}>运费模板</Link>,
            key: "freight_template_list",
            icon: <TruckOutlined />,
          },
          {
            label: <Link to={"refund_address_list"}>退货地址</Link>,
            key: "refund_address_list",
            icon: <EnvironmentOutlined />,
          },
          {
            label: <Link to={"pickup_address_list"}>提货地点</Link>,
            key: "pickup_address_list",
            icon: <EnvironmentOutlined />,
          },
          {
            label: <Link to={"manager_list"}>人员管理</Link>,
            key: "manager_list",
            icon: <TeamOutlined />,
          },
        ]
      : [
          {
            label: <Link to={"dashboard"}>数据概况</Link>,
            key: "dashboard",
            icon: <DashboardOutlined />,
          },
          {
            label: (
              <Link to={"order_list"}>
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
              <Link to={"order_refund"}>
                <Row between>
                  <span>售后处理</span>
                  {waitingRefundCount ? (
                    <Badge>{waitingRefundCount}</Badge>
                  ) : (
                    <></>
                  )}
                </Row>
              </Link>
            ),
            key: "order_refund",
            icon: <TransactionOutlined />,
          },
          {
            label: <Link to={"goods_list"}>商品列表</Link>,
            key: "goods_list",
            icon: <ShoppingOutlined />,
          },
          {
            label: <Link to={"freight_template_list"}>运费模板</Link>,
            key: "freight_template_list",
            icon: <TruckOutlined />,
          },
          {
            label: <Link to={"refund_address_list"}>退货地址</Link>,
            key: "refund_address_list",
            icon: <EnvironmentOutlined />,
          },
          {
            label: <Link to={"pickup_address_list"}>提货地点</Link>,
            key: "pickup_address_list",
            icon: <EnvironmentOutlined />,
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
  shopInfo,
  logout,
}: {
  shopInfo: ShopInfo | undefined;
  logout: () => void;
}) => {
  const items: MenuProps["items"] = [
    {
      key: "center",
      icon: <ShopOutlined />,
      label: <Link to="shop_center">店铺中心</Link>,
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
          src={shopInfo?.logo}
        />
        <div>{shopInfo?.name}</div>
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
