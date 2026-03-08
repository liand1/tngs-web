<script lang="ts" setup>
import { Input, Button } from "ant-design-vue";
import { reactive, ref, onMounted } from "vue";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { debounce } from "lodash-es";
import { getCheckType } from "@/api/system/dict/custom";


// 定义组件属性
const props = defineProps<{
  // 可以传入初始值
  initialDepartment?: string;
  initialSubject?: string;
  initialDoctor?: string;
}>();

// 定义事件
const emit = defineEmits<{
  // 筛选条件改变事件
  (
    e: "change",
    filters: { department: string; subject: string; doctor: string }
  ): void;
  // 重置事件
  (e: "reset"): void;
  // 下载事件
  (e: "download", icon: any): void;
}>();

// 下载按钮的加载状态
const isDownloading = ref(false);
const downloadIcon = ref();
// 显示的高亮条件
const activeFilter = ref<string | null>(null);

const checkTypeList =ref<any>([])

// 条件筛选值（默认值设为空字符串）
const filterValues = reactive({
  checkType: null,
  department: props.initialDepartment || "",
  subject: props.initialSubject || "",
  doctor: props.initialDoctor || "",
});

// 设置高亮条件
const setActiveFilter = (key: string | null) => {
  if (activeFilter.value === key) {
    activeFilter.value = null;
  } else {
    activeFilter.value = key;
  }

  // 向父组件发送筛选条件变更事件
  emit("change", filterValues);
};

// 防抖处理
const setActiveFilterDebounced = debounce(setActiveFilter, 300);

// 重置过滤条件（重置为空字符串）
const resetFilters = () => {
  filterValues.checkType = null;
  filterValues.department = "";
  filterValues.subject = "";
  filterValues.doctor = "";
  activeFilter.value = null;

  // 发送重置事件
  emit("reset");

  // 同时也发送变更事件，因为值已重置
  emit("change", filterValues);
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
    <div class="filter-left">
      <a-select v-model:value="filterValues.checkType"
        class="filter-select"
        placeholder="检测项目"
        @change="() => setActiveFilterDebounced('checkType')"
      >
        <a-select-option :value="null">全部</a-select-option>
        <a-select-option v-for="item in checkTypeList" :key="item.id" :value="item.value">{{ item.label }}</a-select-option>
      </a-select>
      <Input
        v-model:value="filterValues.department"
        placeholder="送检单位"
        class="filter-select"
        @input="() => setActiveFilterDebounced('department')"
      />
      <Input
        v-model:value="filterValues.subject"
        placeholder="送检科室"
        class="filter-select"
        @input="() => setActiveFilterDebounced('subject')"
      />

      

      <Input
        v-model:value="filterValues.doctor"
        placeholder="送检医师"
        class="filter-select"
        @input="() => setActiveFilterDebounced('doctor')"
      />

      <Button type="link" danger @click="resetFilters"> 重置条件 </Button>
    </div>

    <div class="filter-right" ref="downloadIcon">
      <Button
        class="download-btn"
        :loading="isDownloading"
        @click="handleDownload"
      >
        <template #icon v-if="!isDownloading"><DownloadOutlined /></template>
        {{ isDownloading ? "生成中..." : "下载图片" }}
      </Button>
    </div>
  </div>
</template>

<style scoped lang="less">
.filter-selects {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.filter-left {
  display: flex;
  align-items: center;
}

.filter-right {
  display: flex;
  align-items: center;
}

.filter-select {
  width: 150px;
  margin-right: 10px;
}

.download-btn {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .filter-selects {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-left {
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .filter-select {
    margin-bottom: 8px;
  }
}
</style> 