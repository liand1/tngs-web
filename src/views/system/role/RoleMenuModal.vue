<script lang="ts" setup>
import { ref, unref } from "vue";
import { without } from "lodash-es";
import { menuScopeFormSchema } from "./role.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { BasicForm, useForm } from "@/components/Form";
import { BasicModal, useModalInner } from "@/components/Modal";
import { getRole } from "@/api/system/role";
import type { CheckKeys, CheckedEvent, TreeItem } from "@/components/Tree";
import { BasicTree } from "@/components/Tree";
import { listSimpleMenus } from "@/api/system/menu";
import { handleTree } from "@/utils/tree";
import { assignRoleMenu, listRoleMenus } from "@/api/system/permission";
import { useUserStore } from "@/store/modules/user";
import { UserRoleEnum } from "@/enums/customEnum";
const userStore = useUserStore();
const roles = userStore.getUserInfo?.roles || [];
defineOptions({ name: "SystemRoleMenuModal" });

const emit = defineEmits(["success", "register"]);
const { t } = useI18n();
const { createMessage } = useMessage();
const treeData = ref<TreeItem[]>([]);
const menuKeys = ref<number[]>([]);
const menuHalfKeys = ref<number[]>([]);

// 默认展开的层级
const defaultExpandLevel = ref<number>(1);
// 祖先节点list
const parentIdSets = ref<Set<number>>(new Set());
const treeRef = ref();

const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  labelWidth: 120,
  baseColProps: { span: 24 },
  schemas: menuScopeFormSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
});


const filterMenuIds = [100, 101, 2]; // 账号管理、角色管理、基础设施
// 递归过滤子节点
function filterTreeData(nodes: TreeItem[]): TreeItem[] {
  return nodes.filter((node) => {
    if (filterMenuIds.includes(node.id)) {
      return false;
    }
    if (node.children && node.children.length > 0) {
      node.children = filterTreeData(node.children);
    }
    return true;
  });
}
const [registerModal, { setModalProps, closeModal }] = useModalInner(
  async (data) => {
    await resetFields();
    menuReset();
    setModalProps({ confirmLoading: false });
    if (unref(treeData).length === 0) {
      const res = await listSimpleMenus();
      treeData.value = handleTree(res, "id");
      // 去重 拿到所有的父节点
      parentIdSets.value = new Set(res.map((item) => item.parentId));
    }
    
    //如果是sys_admin
    if (roles.some((role) => role === UserRoleEnum.SYSTEM_ADMIN)) {
      // 需要删除的菜单权限
      // 账号管理 1-2939-100
      // 角色管理 1-2939-101
      // 基础设施 2
      // 过滤掉需要删除的菜单权限
    
      treeData.value = treeData.value.filter(
        (item) => !filterMenuIds.includes(item.id)
      );

      treeData.value = filterTreeData(treeData.value);
    }

    const role = await getRole(data.record.id);
    const menuIds = await listRoleMenus(data.record.id);

    debugger

    // https://www.lodashjs.com/docs/lodash.without
    // 默认关联节点  需要排除所有的祖先节点  否则会全部勾选
    // 只保留子节点 关联情况下会自己选中父节点
    // 排除祖先节点后的子节点  达到"独立"的效果 但可以进行关联选择
    const excludeParentIds = without(
      menuIds,
      ...Array.from(parentIdSets.value)
    );
    // 这里是后期更新/新增需要用的 需要使用原始参数
    menuKeys.value = menuIds;
    // 这里是view需要的  需要排除祖先节点才能正常显示  否则传入父节点会勾选所有子节点

    console.log(excludeParentIds);

    role.menuIds = excludeParentIds;
    // 这里只负责显示 后期传递参数不使用这里  所以不用祖先节点
    await setFieldsValue({ ...role });

    // 默认展开的层级
    if (unref(treeRef)) unref(treeRef).filterByLevel(defaultExpandLevel.value);
  }
);

async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });
    await assignRoleMenu({
      roleId: values.id,
      menuIds: [...menuKeys.value, ...menuHalfKeys.value],
    });
    closeModal();
    emit("success");
    createMessage.success(t("common.saveSuccessText"));
  } finally {
    setModalProps({ confirmLoading: false });
  }
}

function menuReset() {
  menuKeys.value = [];
  menuHalfKeys.value = [];
}

function menuCheck(checkedKeys: CheckKeys, event: CheckedEvent) {
  if (Array.isArray(checkedKeys)) {
    // 这里是子节点的ID
    menuKeys.value = checkedKeys as number[];
    // 这里是父节点的ID 默认空数组
    menuHalfKeys.value = (event.halfCheckedKeys as number[]) || [];
  }
}
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    title="修改角色菜单权限"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menuIds="{ model, field }">
        <BasicTree
          v-if="treeData.length"
          ref="treeRef"
          v-model:checkedKeys="model[field]"
          :tree-data="treeData"
          :field-names="{ title: 'name', key: 'id' }"
          toolbar
          checkable
          search
          :show-strictly-button="false"
          :selectable="false"
          title="菜单分配"
          @check="menuCheck"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
