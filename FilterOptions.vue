<script lang="ts" setup>
import { ref, watch } from "vue";
import { debounce } from "lodash-es";
import { DownloadOutlined } from "@ant-design/icons-vue";

// 定义组件事件
const emit = defineEmits<{
  (e: "update:extractionBatch", value: string): void;
  (e: "update:libraryBatch", value: string): void;
  (e: "reset"): void;
  (e: "download"): void;
}>();

// 搜索条件
const extractionBatch = ref("");
const libraryBatch = ref("");

// 处理提取试剂批次变更（添加节流处理）
const handleExtractionBatchChange = debounce((value: string) => {
  console.log("handleExtractionBatchChange", value);
  emit("update:extractionBatch", value.trim());
}, 300);

// 处理建库试剂批次变更（添加节流处理）
const handleLibraryBatchChange = debounce((value: string) => {
  emit("update:libraryBatch", value.trim());
}, 300);

// 监听输入框值变化
watch(extractionBatch, (newValue) => {
  handleExtractionBatchChange(newValue);
});

watch(libraryBatch, (newValue) => {
  handleLibraryBatchChange(newValue);
});

// 重置过滤条件
const resetFilters = () => {
  extractionBatch.value = "";
  libraryBatch.value = "";

  emit("update:extractionBatch", "");
  emit("update:libraryBatch", "");
  emit("reset");
};

// 处理下载图表
const handleDownload = () => {
  emit("download");
};
</script>

<template>
  <div class="filter-selects">
    <div class="filter-row">
      <div class="filter-inputs">
        <a-input
          v-model:value="extractionBatch"
          placeholder="请输入提取试剂批次"
          allow-clear
          style="width: 200px"
        />

        <a-input
          v-model:value="libraryBatch"
          placeholder="请输入建库试剂批次"
          allow-clear
          style="width: 200px"
        />

        <a-button type="link" danger @click="resetFilters"> 重置条件 </a-button>
      </div>
      
      <div class="filter-actions">
        <a-button class="download-btn" type="primary" @click="handleDownload">
          <template #icon><DownloadOutlined /></template>
          下载图片
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter-selects {
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.filter-inputs {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
}

.filter-actions {
  display: flex;
  align-items: center;
}

.download-btn {
  display: flex;
  align-items: center;
}

.input-group {
  display: flex;
  align-items: center;

  .input-label {
    margin-right: 8px;
    font-weight: 500;
    white-space: nowrap;
  }

  .ant-input {
    width: 200px;
  }
}
</style> 