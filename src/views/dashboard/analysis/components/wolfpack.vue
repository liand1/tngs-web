<template>
  <div class="wolfpack-container" ref="wolfpackContainer">
    <Card title="耐药基因统计" :bordered="false">
      <!-- 标题与时间筛选区域 -->
      <template #extra>
        <div class="header-tools">
          <!-- 使用TimeControls组件 -->
          <TimeControls
            :initial-time-type="timeRangeType"
            :initial-date-range="defaultDateRange"
            @update:time-type="handleTimeTypeChange"
            @update:date-range="handleDateRangeChange"
          />
        </div>
      </template>
      <!-- 过滤条件区域 -->
      <div
        class="filter-row"
        style="
          display: flex;
          justify-content: space-between;
          min-height: 32px;
          margin-bottom: 24px;
        "
      >
        <div>
          <a-select v-model:value="filterValues.checkType"
            class="filter-select"
            placeholder="检测项目"
            style="width: 180px;"
            @change="(v) => checkTypeChange(v)"
          >
            <a-select-option :value="null">全部</a-select-option>
            <a-select-option v-for="item in checkTypeList" :key="item.id" :value="item.value">{{ item.label }}</a-select-option>
          </a-select>

          <Button type="link" danger @click="resetFilters"> 重置条件 </Button>
        </div>
        <div ref="downloadIcon">
          <!-- 添加下载图片按钮 -->
          <Button
            class="download-btn"
            @click="handleExportChartImage"
            :loading="isDownloading"
          >
            <template #icon><DownloadOutlined /></template>
            下载图片
          </Button>
        </div>
      </div>

      <!-- 图表容器 -->
      <div class="chart-container">
        <div class="spin-container" v-if="isLoading">
          <Spin :spinning="isLoading" tip="数据加载中..." />
        </div>
        <template v-else>
          <div v-if="pathogenData.length === 0" class="error-message">
            <ExclamationCircleOutlined
              style="margin-right: 8px; font-size: 20px; color: #faad14"
            />
            暂无数据
          </div>
          <PathogenBarChart
            v-else
            ref="chartRef"
            :time-type="timeRangeType"
            :date-range="defaultDateRange.map((d) => d.format('YYYY-MM-DD'))"
            @data-loaded="handleDataLoaded"
            @data-loading="handleDataLoading"
          />
        </template>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, reactive } from "vue";
import { Card, Button, Spin, message } from "ant-design-vue";
import {
  DownloadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons-vue";
import type { Dayjs } from "dayjs";
import PathogenBarChart from "./wolfpack/PathogenBarChart.vue";
import TimeControls from "./wolfpack/TimeControls.vue";
import {
  downloadImageCanvas,
  getCurrentYearDateRange,
} from "./index";
import { fetchWolfpackData, PathogenDataItem } from "./wolfpack/data";
import { getCheckType } from "@/api/system/dict/custom";

// 引用图表组件
const chartRef = ref();
const downloadIcon = ref();
const wolfpackContainer = ref();
const isDownloading = ref(false);
// 加载状态
const isLoading = ref(true);

// 时间范围类型选择
const timeRangeType = ref<"all" | "month" | "year">("all");

// 默认日期范围（当前年份的1月1日到12月31日）
const defaultDateRange = ref<[Dayjs, Dayjs]>(getCurrentYearDateRange());

const pathogenData = ref<PathogenDataItem[]>([]);

const checkTypeList =ref<any>([])

// 条件筛选值（默认值设为空字符串）
const filterValues = reactive({
  checkType: null,
});

// 处理时间类型变化
const handleTimeTypeChange = (
  value: "all" | "month" | "year",
  dateRange: [Dayjs, Dayjs]
) => {
  timeRangeType.value = value;
  defaultDateRange.value = dateRange;
  // console.log("时间类型变更为:", value);
  isLoading.value = true;

  // 加载数据
  fetchData();
};

// 重置过滤条件（重置为空字符串）
const resetFilters = () => {
  filterValues.checkType = null;
  fetchData();
};

const checkTypeChange = (value: any) => {
  filterValues.checkType = value;
  fetchData();
}

// 处理日期范围变化
const handleDateRangeChange = (dates: [Dayjs, Dayjs]) => {
  defaultDateRange.value = dates;
  console.log(
    "日期范围变更为:",
    dates.map((d) => d.format("YYYY-MM-DD"))
  );
  isLoading.value = true;

  // 加载数据
  fetchData();
};

// 导出图片功能
const handleExportChartImage = () => {
  isDownloading.value = true;
  setTimeout(() => {
    downloadImageCanvas("耐药基因统计", wolfpackContainer.value, [
      downloadIcon.value,
    ]);
    isDownloading.value = false;
  }, 200);
};

// 处理数据加载完成事件
const handleDataLoaded = () => {
  isLoading.value = false;
};

// 处理数据加载中事件
const handleDataLoading = () => {
  isLoading.value = true;
};

// 获取图表数据
const fetchData = async () => {
  try {
    isLoading.value = true;

    // 获取日期范围参数
    // const dateRange = formatDateRange(defaultDateRange.value);

      // console.log("正在请求耐药基因统计数据:", {
      //   timeType: timeRangeType.value,
      //   defaultDateRange.value,
      // });

    // fetchWolfpackData
    const data = await fetchWolfpackData(filterValues.checkType, timeRangeType.value, defaultDateRange.value);

    pathogenData.value = data;

    isLoading.value = false;

    await nextTick();

    chartRef?.value?.setChartData(data);
  } catch (error) {
    console.error("获取耐药基因统计数据失败:", error);
    message.error("数据加载失败，请稍后重试");
    isLoading.value = false;
  }
};

// 组件挂载完成后初始化
onMounted(async () => {
  // 初始化时加载数据
  fetchData();

  // 初始化时加载数据
  let data = await getCheckType();
  checkTypeList.value = data.list;
});
</script>

<style scoped lang="less">
.wolfpack-container {
  margin-top: 16px;
}

.header-tools {
  display: flex;
  gap: 16px;
  align-items: center;
}

.download-btn {
  display: flex;
  align-items: center;
}

.chart-container {
  width: 100%;
  height: 500px;
}

.spin-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: #ff4d4f;
}

:deep(.ant-spin-nested-loading) {
  height: 100%;
}

:deep(.ant-spin-container) {
  height: 100%;
}

.chart-legend {
  display: flex;
  gap: 16px;
  justify-content: flex-end;

  .legend-item {
    display: flex;
    align-items: center;

    .color-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-right: 4px;
      border-radius: 50%;

      &.positive {
        background-color: #f5515f;
      }

      &.suspected {
        background-color: #5d9cec;
      }

      &.positive-suspected {
        background-color: #945df2;
      }
    }
  }
}
</style>
