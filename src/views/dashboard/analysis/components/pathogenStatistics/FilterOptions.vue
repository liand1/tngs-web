<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { sampleTypeOptions } from "./data";
import { DownloadOutlined } from "@ant-design/icons-vue";
// import { SampleTypeEnum } from "@/enums/customEnum";
import { getCheckType } from "@/api/system/dict/custom";

// 定义组件事件
const emit = defineEmits<{
  (e: "update:sampleType", value: string): void;
  (e: "update:resultType", value: string): void;
  (e: "update:checkType", value: number | null): void;
  (e: "reset"): void;
  (e: "download", icon: any): void;
}>();

// 下载按钮的加载状态
const isDownloading = ref(false);
const downloadIcon = ref();

// 当前选中的样本类型
const currentSampleType = ref("-1");
const currentcheckType = ref<number | null>(null);

const checkTypeList =ref<any>([])

// 切换样本类型
const handleSampleTypeChange = (value: string) => {
  currentSampleType.value = value;
  emit("update:sampleType", value);
};

// 切换检测项目
const handlecheckTypeChange = (value: number) => {
  currentcheckType.value = value;
  emit("update:checkType", value);
};

// 重置所有筛选条件
const resetFilters = () => {
  // 重置样本类型
  currentcheckType.value = null;
  currentSampleType.value = "-1";
  emit("update:sampleType", "-1");
  emit("update:checkType", null);
  // 触发重置事件
  // emit("reset");
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

        <a-select
          v-model:value="currentSampleType"
          style="width: 200px"
          @change="handleSampleTypeChange"
        >
          <a-select-option
            v-for="option in sampleTypeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>

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
}

.filter-inputs {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-actions {
  display: flex;
  align-items: center;
}

.download-btn {
  display: flex;
  align-items: center;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
}

.filter-group {
  display: flex;
  align-items: center;

  .filter-label {
    width: 80px;
    font-weight: bold;
    color: rgb(0 0 0 / 85%);
  }

  .filter-content {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .filter-inputs {
    margin-bottom: 16px;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;

    .filter-label {
      margin-bottom: 8px;
    }

    .filter-content {
      width: 100%;
    }
  }
}
</style> 