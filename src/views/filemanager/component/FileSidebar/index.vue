<template>
  <a-layout-sider width="200" class="file-manager-sider">
    <a-menu
      mode="inline"
      :selectedKeys="[currentPath]"
      style="height: 100%; border: none"
    >
      <template v-for="(nav, index) in sidebarNavs" :key="nav.path">
        <a-menu-item>
          <div class="nav-item">
            <div class="nav-content" @click="navigateTo(nav.path)">
              <component :is="nav.icon" />
              <span>{{ nav.title }}</span>
            </div>
            <div class="action-buttons" v-if="!isDefaultNav(nav.path)">
              <a-button
                v-if="config.enableEditNav"
                type="text"
                size="small"
                class="edit-btn"
                @click.stop="showEditNavModal(nav, index)"
              >
                <edit-outlined />
              </a-button>
              <a-button
                v-if="config.enableDelete"
                type="text"
                size="small"
                class="delete-btn"
                @click.stop="confirmDelete(nav, index)"
              >
                <delete-outlined />
              </a-button>
            </div>
          </div>
        </a-menu-item>
        <a-divider v-if="nav.divider" />
      </template>

      <!-- 添加新导航项的按钮 -->
      <a-menu-item v-if="config.enableAddNav">
        <div class="nav-item add-nav-btn" @click="showAddNavModal">
          <plus-outlined />
          <span>添加导航</span>
        </div>
      </a-menu-item>
    </a-menu>

    <!-- 删除确认对话框 -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="删除导航"
      okText="删除"
      cancelText="取消"
      @ok="handleDelete"
    >
      <p>确定要删除"{{ navToDelete?.title }}"导航项吗？</p>
    </a-modal>

    <!-- 添加导航对话框 -->
    <a-modal
      v-model:visible="addNavModalVisible"
      title="添加导航"
      okText="添加"
      cancelText="取消"
      @ok="handleAddNav"
    >
      <a-form :model="addNavForm" layout="vertical">
        <a-form-item
          label="导航名称"
          name="title"
          :rules="[{ required: true, message: '请输入导航名称' }]"
        >
          <a-input
            v-model:value="addNavForm.title"
            placeholder="请输入导航名称"
          />
        </a-form-item>

        <a-form-item
          label="路径"
          name="path"
          :rules="[{ required: true, message: '请输入路径' }]"
        >
          <a-input
            v-model:value="addNavForm.path"
            placeholder="请输入路径，例如: /documents"
          />
        </a-form-item>

        <a-form-item label="图标" name="icon">
          <a-select v-model:value="addNavForm.icon" placeholder="请选择图标">
            <a-select-option value="folder-outlined">文件夹</a-select-option>
            <a-select-option value="file-outlined">文件</a-select-option>
            <a-select-option value="picture-outlined">图片</a-select-option>
            <a-select-option value="play-square-outlined">视频</a-select-option>
            <a-select-option value="sound-outlined">音频</a-select-option>
            <a-select-option value="cloud-outlined">云端</a-select-option>
            <a-select-option value="star-outlined">收藏</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item name="divider">
          <a-checkbox v-model:checked="addNavForm.divider"
            >添加分隔线</a-checkbox
          >
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑导航对话框 -->
    <a-modal
      v-model:visible="editNavModalVisible"
      title="编辑导航"
      okText="保存"
      cancelText="取消"
      @ok="handleEditNav"
    >
      <a-form :model="editNavForm" layout="vertical">
        <a-form-item
          label="导航名称"
          name="title"
          :rules="[{ required: true, message: '请输入导航名称' }]"
        >
          <a-input
            v-model:value="editNavForm.title"
            placeholder="请输入导航名称"
          />
        </a-form-item>

        <a-form-item
          label="路径"
          name="path"
          :rules="[{ required: true, message: '请输入路径' }]"
        >
          <a-input
            v-model:value="editNavForm.path"
            placeholder="请输入路径，例如: /documents"
          />
        </a-form-item>

        <a-form-item label="图标" name="icon">
          <a-select v-model:value="editNavForm.icon" placeholder="请选择图标">
            <a-select-option value="folder-outlined">文件夹</a-select-option>
            <a-select-option value="file-outlined">文件</a-select-option>
            <a-select-option value="picture-outlined">图片</a-select-option>
            <a-select-option value="play-square-outlined">视频</a-select-option>
            <a-select-option value="sound-outlined">音频</a-select-option>
            <a-select-option value="cloud-outlined">云端</a-select-option>
            <a-select-option value="star-outlined">收藏</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item name="divider">
          <a-checkbox v-model:checked="editNavForm.divider"
            >添加分隔线</a-checkbox
          >
        </a-form-item>
      </a-form>
    </a-modal>
  </a-layout-sider>
</template>

<style scoped>
.file-manager-sider {
  background-color: #fff;
  border-right: 1px solid #f0f0f0;
}

/* 将样式应用于自定义的nav-item而不是a-menu-item */
.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
}

.nav-content {
  display: flex;
  flex-grow: 1;
  align-items: center;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  visibility: hidden;
}

.edit-btn,
.delete-btn {
  width: 24px;
  height: 24px;
  padding: 0 4px;
  margin-left: 4px;
}

.nav-item:hover .action-buttons {
  visibility: visible;
}

.add-nav-btn {
  justify-content: center;
  color: #1890ff;
  cursor: pointer;
}
</style>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, reactive } from "vue";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  FolderOutlined,
  FileOutlined,
  PictureOutlined,
  PlaySquareOutlined,
  SoundOutlined,
  CloudOutlined,
  StarOutlined,
} from "@ant-design/icons-vue";
import { useFileSidebar } from "./useFileSidebar";
import { FileManagerConfig, defaultConfig, SidebarNavItem } from "../../config";

const props = defineProps({
  currentPath: {
    type: String,
    required: true,
  },
  config: {
    type: Object as () => FileManagerConfig,
    default: () => defaultConfig,
  },
});

const emit = defineEmits(["navigate", "delete-nav", "add-nav", "edit-nav"]);

const { sidebarNavs, navigateTo, defaultPaths } = useFileSidebar(props, emit);

// 删除相关状态
const deleteModalVisible = ref(false);
const navToDelete = ref<SidebarNavItem | null>(null);
const navIndexToDelete = ref<number>(-1);

// 添加导航相关状态
const addNavModalVisible = ref(false);
const addNavForm = reactive({
  title: "",
  path: "",
  icon: "folder-outlined",
  divider: false,
});

// 编辑导航相关状态
const editNavModalVisible = ref(false);
const editNavForm = reactive({
  title: "",
  path: "",
  icon: "folder-outlined",
  divider: false,
});
const navIndexToEdit = ref<number>(-1);

// 判断是否为默认导航项（不可删除）
function isDefaultNav(path: string): boolean {
  return defaultPaths.includes(path);
}

// 显示删除确认对话框
function confirmDelete(nav: SidebarNavItem, index: number) {
  navToDelete.value = nav;
  navIndexToDelete.value = index;
  deleteModalVisible.value = true;
}

// 处理导航项删除
function handleDelete() {
  if (navToDelete.value) {
    emit("delete-nav", navToDelete.value, navIndexToDelete.value);
    deleteModalVisible.value = false;
    navToDelete.value = null;
    navIndexToDelete.value = -1;
  }
}

// 显示添加导航对话框
function showAddNavModal() {
  // 重置表单
  addNavForm.title = "";
  addNavForm.path = "";
  addNavForm.icon = "folder-outlined";
  addNavForm.divider = false;

  addNavModalVisible.value = true;
}

// 处理添加导航
function handleAddNav() {
  // 获取选择的图标组件
  const iconComponent = getIconComponent(addNavForm.icon);

  // 创建新的导航项
  const newNav: SidebarNavItem = {
    title: addNavForm.title,
    path: addNavForm.path.startsWith("/")
      ? addNavForm.path
      : `/${addNavForm.path}`,
    icon: iconComponent,
    divider: addNavForm.divider,
  };

  // 发送事件
  emit("add-nav", newNav);

  // 关闭对话框
  addNavModalVisible.value = false;
}

// 显示编辑导航对话框
function showEditNavModal(nav: SidebarNavItem, index: number) {
  // 设置当前要编辑的导航项
  navIndexToEdit.value = index;

  // 获取图标名称
  const iconName = getIconName(nav.icon);

  // 填充表单
  editNavForm.title = nav.title;
  editNavForm.path = nav.path;
  editNavForm.icon = iconName;
  editNavForm.divider = nav.divider || false;

  editNavModalVisible.value = true;
}

// 处理编辑导航
function handleEditNav() {
  // 获取选择的图标组件
  const iconComponent = getIconComponent(editNavForm.icon);

  // 创建编辑后的导航项
  const editedNav: SidebarNavItem = {
    title: editNavForm.title,
    path: editNavForm.path.startsWith("/")
      ? editNavForm.path
      : `/${editNavForm.path}`,
    icon: iconComponent,
    divider: editNavForm.divider,
  };

  // 发送事件
  emit("edit-nav", editedNav, navIndexToEdit.value);

  // 关闭对话框
  editNavModalVisible.value = false;
  navIndexToEdit.value = -1;
}

// 获取图标组件
function getIconComponent(iconName: string) {
  switch (iconName) {
    case "folder-outlined":
      return FolderOutlined;
    case "file-outlined":
      return FileOutlined;
    case "picture-outlined":
      return PictureOutlined;
    case "play-square-outlined":
      return PlaySquareOutlined;
    case "sound-outlined":
      return SoundOutlined;
    case "cloud-outlined":
      return CloudOutlined;
    case "star-outlined":
      return StarOutlined;
    default:
      return FolderOutlined;
  }
}

// 获取图标名称
function getIconName(iconComponent: any) {
  if (iconComponent === FolderOutlined) return "folder-outlined";
  if (iconComponent === FileOutlined) return "file-outlined";
  if (iconComponent === PictureOutlined) return "picture-outlined";
  if (iconComponent === PlaySquareOutlined) return "play-square-outlined";
  if (iconComponent === SoundOutlined) return "sound-outlined";
  if (iconComponent === CloudOutlined) return "cloud-outlined";
  if (iconComponent === StarOutlined) return "star-outlined";
  return "folder-outlined";
}
</script> 