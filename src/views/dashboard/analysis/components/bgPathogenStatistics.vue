<template>
  <div ref="cardRef" class="bg-pathogen-statistics-container">
    <Card
      title="背景病原体检出情况"
      :bordered="false"
      class="pathogen-statistics-card"
    >
      <!-- 标题与时间筛选区域 -->
      <template #extra>
        <!-- 使用TimeControls组件 -->
        <TimeControls
          :initial-time-type="timeRangeType"
          :initial-date-range="defaultDateRange"
          @update:time-type="handleTimeTypeChange"
          @update:date-range="handleDateRangeChange"
        />
      </template>

      <!-- 筛选选项 - 添加提取试剂批次和建库试剂批次的双向绑定 -->
      <FilterOptions
        v-model:extractionBatch="extractionBatch"
        v-model:libraryBatch="libraryBatch"
        @reset="handleReset"
        @download="handleExportChartImage"
        @update:extractionBatch="handleBatchChange"
        @update:libraryBatch="handleBatchChange"
        @update:checkType="handleCheckTypeChange"
      />

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
            :extraction-batch="extractionBatch"
            :library-batch="libraryBatch"
            :time-type="timeRangeType"
            :date-range="defaultDateRange.map((d) => d.format('YYYY-MM-DD'))"
            :data="chartData"
            @data-loaded="handleDataLoaded"
            @data-loading="handleDataLoading"
            @chart-type-change="handleChartTypeChange"
          />
        </template>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import { Card, Spin, message } from "ant-design-vue";
import FilterOptions from "./bgPathogenStatistics/FilterOptions.vue";
import PathogenBarChart from "./bgPathogenStatistics/PathogenBarChart.vue";
import TimeControls from "./bgPathogenStatistics/TimeControls.vue";
import {
  getCurrentYearDateRange,
  useChartDataLoader,
  useTimeRangeHandler,
  useResetHandler,
  downloadImageCanvas,
} from "./index";
import {
  getBgPathogenData,
  type PathogenDataItem,
} from "./bgPathogenStatistics/data";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

// 引用图表组件
const chartRef = ref();
const cardRef = ref();
// 图表数据
const chartData = ref<PathogenDataItem[]>([]);

// 搜索条件
const extractionBatch = ref("");
const libraryBatch = ref("");

const pathogenData = ref<PathogenDataItem[]>([]);

// 使用通用的加载状态和事件处理
const { isLoading, handleDataLoaded, handleDataLoading } = useChartDataLoader();

const checkType = ref<any>(null);

// 导出图表为图片
const handleExportChartImage = (icon: any) => {
  downloadImageCanvas("背景病原体", cardRef.value, [icon]);
};

const handleCheckTypeChange = (value: number | null) => {
  checkType.value = value;

  // 加载数据
  fetchData();
}

const chartType = ref<string>("bar");
//
// 获取图表数据
const fetchData = async () => {
  try {
    isLoading.value = true;

    // 获取日期范围参数
    // const dateRange = formatDateRange(defaultDateRange.value);

    // 使用getTop20BgPathogens获取数据
    const data = await getBgPathogenData(
      checkType.value,
      extractionBatch.value,
      libraryBatch.value,
      timeRangeType.value,
      defaultDateRange.value
    );

    pathogenData.value = data;

    isLoading.value = false;

    await nextTick();

    // 还原图表类型
    chartRef.value?.setChartType(chartType.value);

    // 更新图表数据
    chartRef?.value?.setChartData(data);

    console.log("背景病原体数据加载完成:", data);
  } catch (error) {
    console.error("获取背景病原体数据失败:", error);
    message.error("数据加载失败，请稍后重试");
    isLoading.value = false;
  }
};

// 使用通用的时间范围处理函数
const {
  timeRangeType,
  defaultDateRange,
  handleTimeTypeChange,
  handleDateRangeChange,
} = useTimeRangeHandler(fetchData);

// 处理批次变化
const handleBatchChange = () => {
  isLoading.value = true;

  // 加载数据
  fetchData();
};

// 处理筛选条件重置
const resetCallback = () => {
  // 重置搜索条件
  extractionBatch.value = "";
  libraryBatch.value = "";

  // 重置时间类型
  timeRangeType.value = "all";

  // 重置日期范围到当前年份
  defaultDateRange.value = getCurrentYearDateRange();

  // 重置后重新加载数据
  fetchData();
};

// 使用通用的重置处理函数
const { handleReset } = useResetHandler(resetCallback);

const handleChartTypeChange = (key: string) => {
  chartType.value = key;
};

// 组件挂载完成后初始化
onMounted(() => {
  // 初始化时加载数据
  fetchData();
});
</script>

<style scoped lang="less">
.bg-pathogen-statistics-container {
  margin-top: 16px;
  // overflow-x: auto;

  // :deep(.pathogen-statistics-card) {
  //   min-width: 1200px;
  // }
}

.chart-container {
  height: 570px;
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