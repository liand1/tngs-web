<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { debounce } from "lodash-es";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { getCheckType } from "@/api/system/dict/custom";

// 定义组件事件
const emit = defineEmits<{
  (e: "update:extractionBatch", value: string): void;
  (e: "update:libraryBatch", value: string): void;
  (e: "update:checkType", value: number | null): void;
  (e: "reset"): void;
  (e: "download", icon: any): void;
}>();

// 下载按钮的加载状态
const isDownloading = ref(false);
const downloadIcon = ref();
// 搜索条件
const extractionBatch = ref("");
const libraryBatch = ref("");

const currentcheckType = ref<number | null>(null);

const checkTypeList =ref<any>([])

// 处理提取试剂批次变更（添加节流处理）
const handleExtractionBatchChange = debounce((value: string) => {
  console.log("handleExtractionBatchChange", value);
  emit("update:extractionBatch", value.trim());
}, 300);

// 处理建库试剂批次变更（添加节流处理）
const handleLibraryBatchChange = debounce((value: string) => {
  emit("update:libraryBatch", value.trim());
}, 300);

// 切换检测项目
const handlecheckTypeChange = (value: number) => {
  currentcheckType.value = value;
  emit("update:checkType", value);
};

// 监听输入框值变化
watch(extractionBatch, (newValue) => {
  handleExtractionBatchChange(newValue);
});

watch(libraryBatch, (newValue) => {
  handleLibraryBatchChange(newValue);
});

// 重置过滤条件
const resetFilters = () => {
  currentcheckType.value = null;
  extractionBatch.value = "";
  libraryBatch.value = "";

  emit("update:extractionBatch", "");
  emit("update:libraryBatch", "");
  emit("update:checkType", null);
};

// 处理下载图表
const handleDownload = () => {
  if (isDownloading.value) return;

  isDownloading.value = true;

  setTimeout(() => {
    // 发出下载事件
    emit("download", downloadIcon.value);

    isDownloading.value = false;
  }, 100);
};
onMounted(async () => {
  // 初始化时加载数据
  let data = await getCheckType();
  checkTypeList.value = data.list;
});
</script>

<template>
  <div class="filter-selects">
    <div class="filter-row">
      <div class="filter-inputs">
        <a-select v-model:value="currentcheckType"
        style="width: 160px"
        placeholder="检测项目"
        @change="handlecheckTypeChange"
      >
        <a-select-option :value="null">全部</a-select-option>
        <a-select-option v-for="item in checkTypeList" :key="item.id" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>

        <a-input
          v-model:value="extractionBatch"
          placeholder="请输入提取试剂批次"
          allow-clear
          style="width: 150px"
        />

        <a-input
          v-model:value="libraryBatch"
          placeholder="请输入建库试剂批次"
          allow-clear
          style="width: 150px"
        />

        <a-button type="link" danger @click="resetFilters"> 重置条件 </a-button>
      </div>

      <div class="filter-actions" ref="downloadIcon">
        <a-button
          class="download-btn"
          :loading="isDownloading"
          @click="handleDownload"
        >
          <template #icon v-if="!isDownloading"><DownloadOutlined /></template>
          {{ isDownloading ? "生成中..." : "下载图片" }}
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