<template>
  <div class="file-toolbar">
    <a-space class="file-toolbar-left">
      <a-button
        v-if="config.enableUpload"
        @click="upload"
        :loading="uploadLoading"
      >
        <template #icon><upload-outlined /></template>
        上传
      </a-button>
      <a-button
        v-if="config.enableCreateFolder"
        @click="createFolder"
        :loading="createFolderLoading"
      >
        <template #icon><folder-add-outlined /></template>
        新建文件夹
      </a-button>
      <a-dropdown
        v-if="filteredFileActions.length > 0"
        :disabled="!hasSelection"
      >
        <a-button>
          <template #icon><more-outlined /></template>
          更多操作
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="action in filteredFileActions"
              :key="action.key"
              @click="action.handler"
              :disabled="action.disabled ? action.disabled() : false"
            >
              <component :is="action.icon" />
              {{ action.title }}
              <a-spin
                v-if="getActionLoading(action.key)"
                size="small"
                style="margin-left: 8px"
              />
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </a-space>
    <div class="file-toolbar-right">
      <a-radio-group
        :value="viewMode"
        @update:value="onViewModeChange"
        v-if="enableViewModeSwitch"
      >
        <a-radio-button value="list" v-if="config.enableListView">
          <unordered-list-outlined />
        </a-radio-button>
        <a-radio-button value="grid" v-if="config.enableGridView">
          <appstore-outlined />
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed } from "vue";
import {
  UploadOutlined,
  FolderAddOutlined,
  MoreOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import { useFileToolbar } from "./useFileToolbar";
import { FileManagerConfig, defaultConfig } from "../../config";
import { FilesInfoRespVO } from "@/api/lims/fileupload/model";

const props = defineProps({
  hasSelection: {
    type: Boolean,
    default: false,
  },
  viewMode: {
    type: String,
    default: "list",
  },
  uploadLoading: {
    type: Boolean,
    default: false,
  },
  createFolderLoading: {
    type: Boolean,
    default: false,
  },
  copyLoading: {
    type: Boolean,
    default: false,
  },
  moveLoading: {
    type: Boolean,
    default: false,
  },
  deleteLoading: {
    type: Boolean,
    default: false,
  },
  renameLoading: {
    type: Boolean,
    default: false,
  },
  hasCopiedFiles: {
    type: Boolean,
    default: false,
  },
  currentPath: {
    type: String,
    required: true,
  },
  selectedFiles: {
    type: Array,
    default: () => [],
  },
  selectedFilesIds: {
    type: Array,
    default: () => [],
  },
  clipboardFiles: {
    type: Object,
    default: () => null as null,
  },
  fileList: {
    type: Array as () => FilesInfoRespVO[],
    default: () => [],
  },
  config: {
    type: Object as () => FileManagerConfig,
    default: () => defaultConfig,
  },
});

const emit = defineEmits([
  "upload",
  "createFolder",
  "download-selected",
  "rename-selected",
  "copy-selected",
  "cut-selected",
  "paste",
  "delete-selected",
  "view-mode-change",
  "update:uploadLoading",
  "update:copyLoading",
  "update:moveLoading",
  "update:deleteLoading",
  "update:selectedFiles",
  "update:selectedFilesIds",
  "update:clipboardFiles",
  "update:hasCopiedFiles",
  "refresh-files",
]);

const {
  fileActions,
  upload,
  createFolder,
  getActionLoading,
  onViewModeChange,
} = useFileToolbar(props, emit);

// 根据配置过滤可用的操作
const filteredFileActions = computed(() => {
  return fileActions.filter((action) => {
    switch (action.key) {
      case "download":
        return props.config.enableDownload;
      case "rename":
        return props.config.enableRename;
      case "copy":
        return props.config.enableCopy;
      case "cut":
        return props.config.enableCut;
      case "paste":
        return props.config.enablePaste;
      case "delete":
        return props.config.enableDelete;
      default:
        return true;
    }
  });
});

// 是否启用视图模式切换
const enableViewModeSwitch = computed(() => {
  return props.config.enableGridView && props.config.enableListView;
});
</script>

<style scoped lang="less">
.file-toolbar {
  display: flex;
  align-items: center;
  justify-content: end;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;

  .file-toolbar-left {
    flex: 1;
  }
}
</style> 