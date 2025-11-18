import { Form, Input, Modal, Tree } from "antd";
import { ErrorBox, ModalLoading } from "components/lib";

import { Key, useEffect, useState } from "react";
import { useForm } from "antd/lib/form/Form";
import { useAddRole, useEditRole } from "service/role";
import { useRoleModal, useRolesQueryKey } from "../util";

import type { DataNode } from "antd/es/tree";

const treeData: DataNode[] = [
  {
    title: "数据概况",
    key: "dashboard",
  },
  {
    title: "用户列表",
    key: "user_list",
  },
  {
    title: "乡村振兴",
    key: "team",
    children: [
      {
        title: "推荐官列表",
        key: "team_promoter_list",
      },
      {
        title: "实名认证",
        key: "team_auth_info_list",
      },
      {
        title: "企业认证",
        key: "team_enterprise_info_list",
      },
      {
        title: "佣金提现",
        key: "team_withdraw_list",
      },
      {
        title: "认养专区",
        key: "team_livestock_list",
      },
      {
        title: "礼包专区",
        key: "team_gift_goods_list",
      },
    ],
  },
  {
    title: "首页专区",
    key: "home_zone",
    children: [
      // {
      //   title: "乡镇百谷",
      //   key: "home_zone_grain_goods",
      // },
      // {
      //   title: "乡集生鲜",
      //   key: "home_zone_fresh_goods",
      // },
      // {
      //   title: "乡村零嘴",
      //   key: "home_zone_snack_goods",
      // },
      // {
      //   title: "乡思礼伴",
      //   key: "home_zone_gift_goods",
      // },
      // {
      //   title: "诚信臻品",
      //   key: "home_zone_integrity_goods",
      // },
      {
        title: "主题专区",
        key: "home_zone_theme_zone",
        children: [
          {
            title: "主题列表",
            key: "home_zone_theme_zone_list",
          },
          {
            title: "商品列表",
            key: "home_zone_theme_zone_goods_list",
          },
        ],
      },
      {
        title: "商品活动",
        key: "home_zone_activity",
        children: [
          {
            title: "活动标签",
            key: "home_zone_activity_tag_list",
          },
          {
            title: "活动列表",
            key: "home_zone_activity_list",
          },
        ],
      },
      {
        title: "诚信乡村",
        key: "home_zone_rural",
        children: [
          {
            title: "地区列表",
            key: "home_zone_rural_region_list",
          },
          {
            title: "商品列表",
            key: "home_zone_rural_goods_list",
          },
        ],
      },
    ],
  },
  {
    title: "活动管理",
    key: "activity",
    children: [
      {
        title: "头图列表",
        key: "activity_banner_list",
      },
      {
        title: "优惠券",
        key: "activity_coupon_list",
      },
      {
        title: "年货节",
        key: "activity_new_year",
        children: [
          {
            title: "年货礼包",
            key: "activity_new_year_goods_list",
          },
          {
            title: "文创礼包",
            key: "activity_new_year_culture_goods_list",
          },
          {
            title: "地区列表",
            key: "activity_new_year_region_list",
          },
          {
            title: "地方特产",
            key: "activity_new_year_local_goods_list",
          },
        ],
      },
      {
        title: "限时招募",
        key: "activity_limited_time_recruit",
        children: [
          {
            title: "商品分类",
            key: "activity_limited_time_recruit_category_list",
          },
          {
            title: "商品列表",
            key: "activity_limited_time_recruit_goods_list",
          },
        ],
      },
    ],
  },
  {
    title: "直播管理",
    key: "live",
    children: [
      {
        title: "直播用户",
        key: "live_user_list",
      },
      {
        title: "直播列表",
        key: "live_room_list",
      },
    ],
  },
  {
    title: "商品管理",
    key: "goods",
    children: [
      {
        title: "商家列表",
        key: "goods_merchant_list",
      },
      {
        title: "运费模板",
        key: "goods_freight_template_list",
      },
      {
        title: "商品分类",
        key: "goods_category_list",
      },
      {
        title: "商品列表",
        key: "goods_list",
      },
    ],
  },
  {
    title: "订单管理",
    key: "order",
    children: [
      {
        title: "快递列表",
        key: "order_express_list",
      },
      {
        title: "订单列表",
        key: "order_list",
      },
      {
        title: "售后处理",
        key: "order_refund",
      },
    ],
  },
  {
    title: "权限管理",
    key: "auth",
    children: [
      {
        title: "岗位列表",
        key: "auth_role_list",
      },
      {
        title: "人员列表",
        key: "auth_admin_list",
      },
    ],
  },
];

export const RoleModal = () => {
  const [form] = useForm();
  const { roleModalOpen, editingRoleId, editingRole, isLoading, close } =
    useRoleModal();
  const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<Key[]>([]);

  const useMutateRole = editingRoleId ? useEditRole : useAddRole;
  const {
    mutateAsync,
    isLoading: mutateLoading,
    error,
  } = useMutateRole(useRolesQueryKey());

  useEffect(() => {
    if (editingRole) {
      const { permission = "", ...rest } = editingRole;
      setDefaultCheckedKeys(JSON.parse(permission) as Key[]);
      form.setFieldsValue({ permission: JSON.parse(permission), ...rest });
    }
  }, [editingRole, form]);

  const confirm = () => {
    form.validateFields().then(async () => {
      const { permission, ...rest } = form.getFieldsValue();
      await mutateAsync({
        ...editingRole,
        permission: JSON.stringify(permission),
        ...rest,
      });
      closeModal();
    });
  };

  const closeModal = () => {
    form.resetFields();
    setDefaultCheckedKeys([]);
    close();
  };

  return (
    <Modal
      forceRender={true}
      title={editingRoleId ? "编辑岗位" : "新增岗位"}
      open={roleModalOpen}
      confirmLoading={mutateLoading}
      onOk={confirm}
      onCancel={closeModal}
    >
      <ErrorBox error={error} />
      {isLoading ? (
        <ModalLoading />
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label={"岗位名称"}
            name={"name"}
            rules={[{ required: true, message: "请输入岗位名称" }]}
          >
            <Input placeholder={"请输入岗位名称"} />
          </Form.Item>
          <Form.Item
            label={"岗位描述"}
            name={"desc"}
            rules={[{ required: true, message: "请输入岗位描述" }]}
          >
            <Input placeholder={"请输入岗位描述"} />
          </Form.Item>

          {!editingRoleId || (editingRoleId && defaultCheckedKeys.length) ? (
            <Form.Item
              label={"岗位权限"}
              name={"permission"}
              rules={[{ required: true, message: "请选择岗位权限" }]}
            >
              <Tree
                checkable
                defaultCheckedKeys={defaultCheckedKeys}
                treeData={treeData}
                onCheck={(checkedKeys) => {
                  form.setFieldsValue({ permission: checkedKeys });
                }}
              />
            </Form.Item>
          ) : (
            <></>
          )}
        </Form>
      )}
    </Modal>
  );
};
