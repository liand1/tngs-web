<template>
  <div class="file-manager-container">
    <!-- 顶部栏 -->
    <a-layout>
      <a-layout-header v-if="config.showHeader" style="padding: 0">
        <file-header
          :current-path="currentPath"
          v-model:loading="loading"
          v-model:search-loading="searchLoading"
          v-model:file-list="fileList"
          :config="config"
          @navigate="navigateTo"
        />
      </a-layout-header>

      <!-- 主内容区 -->
      <a-layout>
        <!-- 左侧导航栏 -->
        <file-sidebar
          v-if="config.showSidebar"
          :current-path="currentPath"
          :config="config"
          @navigate="navigateTo"
          @delete-nav="handleDeleteNav"
          @add-nav="handleAddNav"
          @edit-nav="handleEditNav"
        />

        <!-- 右侧文件列表 -->
        <a-layout-content class="file-manager-content">
          <!-- 文件操作工具栏 -->
          <file-toolbar
            v-if="config.showToolbar"
            :has-selection="hasSelection"
            :view-mode="viewMode"
            v-model:upload-loading="uploadLoading"
            v-model:create-folder-loading="createFolderLoading"
            v-model:copy-loading="copyLoading"
            v-model:move-loading="moveLoading"
            v-model:delete-loading="deleteLoading"
            v-model:rename-loading="renameLoading"
            v-model:has-copied-files="hasCopiedFiles"
            v-model:clipboard-files="clipboardFiles"
            v-model:selected-files="selectedFiles"
            v-model:selected-files-ids="selectedFilesIds"
            :current-path="currentPath"
            :file-list="fileList"
            :config="config"
            @view-mode-change="viewMode = $event"
            @create-folder="showCreateFolderModal"
            @rename-selected="renameSelected"
            @refresh-files="refreshFiles"
          />

          <!-- 文件列表 -->
          <file-list
            :loading="loading"
            :view-mode="viewMode"
            v-model:file-list="fileList"
            v-model:selected-files-ids="selectedFilesIds"
            v-model:selected-files="selectedFiles"
            v-model:delete-loading="deleteLoading"
            :rename-loading="renameLoading"
            :current-path="currentPath"
            :config="config"
            :enable-multi-select="config.showMultiSelect"
            :show-action-column="config.showActionColumn"
            @open-file="openFile"
            @download-file="downloadFile"
            @rename-file="showRenameModal"
            @refresh-files="refreshFiles"
          />
        </a-layout-content>
      </a-layout>
    </a-layout>

    <!-- 对话框 -->
    <file-dialog
      v-model:new-folder-visible="newFolderModal"
      v-model:rename-visible="renameModal"
      v-model:create-folder-loading="createFolderLoading"
      v-model:rename-loading="renameLoading"
      :new-folder-form="newFolderForm"
      :rename-form="renameForm"
      :current-path="currentPath"
      :file-list="fileList"
      :config="config"
      @create-folder-success="refreshFiles"
      @rename-success="refreshFiles"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { message } from "ant-design-vue";
import { getDownloadUrl, transformFileData } from "./index";
import {
  FileManagerConfig,
  defaultConfig,
  validateConfig,
  SidebarNavItem,
} from "./config";
import {
  HomeOutlined,
  FileOutlined,
  PictureOutlined,
  CloudOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlaySquareOutlined,
  SoundOutlined,
} from "@ant-design/icons-vue";

// 导入子组件
import FileHeader from "./component/FileHeader/index.vue";
import FileSidebar from "./component/FileSidebar/index.vue";
import FileToolbar from "./component/FileToolbar/index.vue";
import FileList from "./component/FileList/index.vue";
import FileDialog from "./component/FileDialog/index.vue";
import { getFilePathList } from "@/api/lims/fileupload";

// 数据结构接口
interface FilesInfoRespVO {
  id: string;
  name: string;
  isDirectory: boolean;
  size: number;
  modifiedTime: string;
  path: string;
}

// 组件属性
const props = defineProps({
  // 功能配置，默认使用全部功能
  config: {
    type: Object as () => FileManagerConfig,
    default: () => defaultConfig,
  },
});

// 定义事件
const emit = defineEmits(["select-folder"]);

// 添加自定义导航栏功能示例
const customNavs: SidebarNavItem[] = [
  {
    path: "/",
    title: "主页",
    icon: HomeOutlined,
  },
  {
    path: "/documents",
    title: "文档",
    icon: FileOutlined,
  },
  {
    path: "/pictures",
    title: "图片",
    icon: PictureOutlined,
  },
  {
    path: "/video",
    title: "视频",
    icon: PlaySquareOutlined,
  },
  {
    path: "/music",
    title: "音乐",
    icon: SoundOutlined,
  },
  {
    path: "/download",
    title: "下载",
    icon: DownloadOutlined,
    divider: true,
  },
  {
    path: "/cloud",
    title: "云存储",
    icon: CloudOutlined,
  },
  {
    path: "/trash",
    title: "回收站",
    icon: DeleteOutlined,
  },
];

// 配置对象增加自定义导航
const config = computed(() => {
  const validConfig = validateConfig(props.config);
  // 添加自定义导航和界面显示控制
  return {
    ...validConfig,
    sidebarNavs: customNavs,
  };
});

// 状态变量
const loading = ref(false);
const uploadLoading = ref(false);
const createFolderLoading = ref(false);
const renameLoading = ref(false);
const deleteLoading = ref(false);
const copyLoading = ref(false);
const moveLoading = ref(false);
const searchLoading = ref(false);
const currentPath = ref("/");
const fileList = ref<FilesInfoRespVO[]>([]);
const selectedFilesIds = ref<string[]>([]);
const selectedFiles = ref<FilesInfoRespVO[]>([]);
// 根据配置设置默认视图模式
const viewMode = ref<"list" | "grid">(
  config.value.enableListView ? "list" : "grid"
);
const newFolderModal = ref(false);
const renameModal = ref(false);
const newFolderForm = reactive({
  name: "",
});
const renameForm = reactive({
  name: "",
  fileId: "",
});
const hasCopiedFiles = ref(false);
const clipboardFiles = ref<any>(null);

// 计算属性
const hasSelection = computed(() => selectedFilesIds.value.length > 0);

// 导航到指定路径
function navigateTo(path: string) {
  currentPath.value = path;
  // 当路径变化时也需要刷新文件列表
  refreshFiles();
}

// 直接获取文件列表
async function fetchFiles() {
  loading.value = true;
  try {
    const response = await getFilePathList(currentPath.value);
    // 转换后端返回的数据为前端所需格式
    fileList.value = transformFileData(response) as FilesInfoRespVO[];
  } catch (error) {
    console.error("获取文件列表失败:", error);
    message.error("获取文件列表失败");
  } finally {
    loading.value = false;
  }
}

// 刷新文件列表
function refreshFiles() {
  // 直接调用获取文件列表的方法
  fetchFiles();
}

// 打开文件
function openFile(file: FilesInfoRespVO) {
  if (file.isDirectory) {
    navigateTo(file.path);
  } else {
    message.info(`打开文件: ${file.name}`);
    // 这里可以实现预览功能，如打开新窗口显示文件
    window.open(getDownloadUrl(file.path), "_blank");
  }
}

// 下载文件
function downloadFile(file: FilesInfoRespVO) {
  if (!config.value.enableDownload) {
    message.warning("下载功能已禁用");
    return;
  }

  window.open(getDownloadUrl(file.path), "_blank");
  message.success(`下载文件: ${file.name}`);
}

// 显示创建文件夹对话框
function showCreateFolderModal() {
  if (!config.value.enableCreateFolder) {
    message.warning("创建文件夹功能已禁用");
    return;
  }

  newFolderForm.name = "";
  newFolderModal.value = true;
}

// 显示重命名对话框
function showRenameModal(file: FilesInfoRespVO) {
  if (!config.value.enableRename) {
    message.warning("重命名功能已禁用");
    return;
  }

  renameForm.fileId = file.id;
  renameForm.name = file.name;
  renameModal.value = true;
}

// 重命名选中的文件
function renameSelected() {
  if (!config.value.enableRename) {
    message.warning("重命名功能已禁用");
    return;
  }

  if (selectedFiles.value.length !== 1) {
    return;
  }

  const file = selectedFiles.value[0];
  showRenameModal(file);
}

// 组件挂载后自动获取文件列表
onMounted(() => {
  // 确保直接在父组件调用fetchFiles获取数据
  fetchFiles();
});

// 监听选中的文件变化
watch(
  selectedFiles,
  (newSelectedFiles) => {
    // 如果有选中的文件，不管是文件还是文件夹，都触发选择事件
    emit("select-folder", newSelectedFiles);
  },
  { deep: true }
);

// 处理删除导航项
function handleDeleteNav(navItem: SidebarNavItem, index: number) {
  // 从导航数组中移除该项
  customNavs.splice(index, 1);

  // 显示操作成功提示
  message.success(`已删除导航项：${navItem.title}`);
}

// 处理添加导航项
function handleAddNav(navItem: SidebarNavItem) {
  // 添加到导航数组
  customNavs.push(navItem);

  // 显示操作成功提示
  message.success(`已添加导航项：${navItem.title}`);
}

// 处理编辑导航项
function handleEditNav(navItem: SidebarNavItem, index: number) {
  // 更新导航数组中的项
  if (index >= 0 && index < customNavs.length) {
    customNavs[index] = navItem;

    // 显示操作成功提示
    message.success(`已更新导航项：${navItem.title}`);
  }
}
</script>

<style scoped>
.file-manager-container {
  width: 100%;
  background-color: #f0f2f5;
}

.file-manager-content {
  /* min-height: calc(100vh - 50px); */
  padding: 16px;
  background-color: #fff;
}
</style>
