<template>
  <div class="file-manager-header">
    <div class="path-container">
      <a-breadcrumb separator="/">
        <a-breadcrumb-item>
          <home-outlined />
          <span class="path-item" @click="navigateTo('/')">主页</span>
        </a-breadcrumb-item>
        <template v-for="item in pathParts" :key="item.path">
          <a-breadcrumb-item>
            <span class="path-item" @click="navigateTo(item.path)">
              {{ item.name }}
            </span>
          </a-breadcrumb-item>
        </template>
      </a-breadcrumb>
    </div>
    <div class="header-actions">
      <a-input-search
        v-if="config.enableSearch"
        placeholder="搜索文件"
        style="width: 200px"
        @search="onSearch"
        :loading="searchLoading"
      />
      <a-button
        v-if="config.enableRefresh"
        type="primary"
        @click="refreshFiles"
        :loading="loading"
      >
        <template #icon><reload-outlined /></template>
        刷新
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";
import { HomeOutlined, ReloadOutlined } from "@ant-design/icons-vue";
import { useFileHeader } from "./useFileHeader";
import { FileManagerConfig, defaultConfig } from "../../config";
import { FilesInfoRespVO } from "@/api/lims/fileupload/model";

// 定义组件属性
const props = defineProps({
  currentPath: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  searchLoading: {
    type: Boolean,
    default: false,
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

// 定义组件事件
const emit = defineEmits([
  "navigate",
  "refresh",
  "search",
  "update:loading",
  "update:searchLoading",
  "update:fileList",
]);

// 使用组件逻辑
const { pathParts, navigateTo, refreshFiles, onSearch } = useFileHeader(
  props,
  emit
);
</script>

<style scoped>
.file-manager-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.path-container {
  display: flex;
  flex: 1;
  align-items: center;
}

.path-item {
  cursor: pointer;
}

.path-item:hover {
  color: #1890ff;
}

.header-actions {
  display: flex;
  gap: 8px;
}
</style> 