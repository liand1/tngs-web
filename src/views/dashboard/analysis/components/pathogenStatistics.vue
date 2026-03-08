<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import { Card, Spin, message } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import FilterOptions from "./pathogenStatistics/FilterOptions.vue";
import PathogenBarChart from "./pathogenStatistics/PathogenBarChart.vue";
import TimeControls from "./pathogenStatistics/TimeControls.vue";
import ResultTypeSelector from "./pathogenStatistics/ResultTypeSelector.vue";
import {
  getCurrentYearDateRange,
  useChartDataLoader,
  useTimeRangeHandler,
  useResetHandler,
  downloadImageCanvas,
} from "./index";
import type { TimeRangeType, SampleType } from "./model";
import { getPathogenData } from "./pathogenStatistics/data";
import { ByLabelEnum, SampleTypeEnum } from "@/enums/customEnum";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { PathogenDataItem } from "./wolfpack/data";
// 引用图表组件
const chartRef = ref();
const cardRef = ref();
// 当前样本类型和检测结果
const sampleType = ref<SampleType>("-1");
const resultType = ref<string>(ByLabelEnum.MAIN_REPORT.toString());
const checkType = ref<any>(null);

// 使用通用的加载状态和事件处理
const { isLoading, handleDataLoaded, handleDataLoading } = useChartDataLoader();

const pathogenData = ref<PathogenDataItem[]>([]);

const chartType = ref<string>("bar");
// 获取图表数据
const fetchData = async () => {
  try {
    isLoading.value = true;

    // 获取日期范围参数
    // const dateRange = formatDateRange(defaultDateRange.value);

    // getPathogenData
    let data = await getPathogenData(
      checkType.value,
      sampleType.value,
      resultType.value,
      timeRangeType.value,
      defaultDateRange.value
    );

    pathogenData.value = data;

    isLoading.value = false;

    await nextTick();

    // 还原图表类型
    chartRef.value?.setChartType(chartType.value);

    // 更新图表数据
    chartRef.value?.setChartData(data);

    // 使用通用方法设置延时关闭加载状态
    // finishLoading();
  } catch (error) {
    console.error("获取病原体检出数据失败:", error);
    message.error("数据加载失败，请稍后重试");
    isLoading.value = false;
  } finally {
  }
};

// 使用通用的时间范围处理函数
const {
  timeRangeType,
  defaultDateRange,
  handleTimeTypeChange,
  handleDateRangeChange,
} = useTimeRangeHandler(fetchData);

// 处理样本类型或结果类型变化
const handleTypeChange = () => {
  isLoading.value = true;
  
  // 加载数据
  fetchData();
};

const handleCheckTypeChange = (value: number) => {
  checkType.value = value;

  // 加载数据
  fetchData();
}

// 导出图表为图片
const handleExportChartImage = async (icon: any) => {
  downloadImageCanvas("病原体检出情况", cardRef.value, [icon]);
};

// 处理筛选条件重置
const resetCallback = () => {
  sampleType.value = "all";
  // 重置结果类型为阳性
  resultType.value = "positive";

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

<template>
  <div ref="cardRef" class="pathogen-statistics-container">
    <Card
      title="病原体检出情况"
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

      <!-- 筛选选项 - 添加reset事件处理 -->
      <FilterOptions
        v-model:sampleType="sampleType"
        v-model:resultType="resultType"
        @reset="handleReset"
        @update:sampleType="handleTypeChange"
        @update:resultType="handleTypeChange"
        @update:checkType="handleCheckTypeChange"
        @download="handleExportChartImage"
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
            :sampleType="sampleType"
            :resultType="resultType"
            :time-type="timeRangeType"
            :date-range="defaultDateRange.map((d) => d.format('YYYY-MM-DD'))"
            @data-loaded="handleDataLoaded"
            @data-loading="handleDataLoading"
            @chart-type-change="handleChartTypeChange"
          />
        </template>
      </div>

      <!-- 使用新的结果类型选择器组件 -->
      <ResultTypeSelector
        :resultType="resultType"
        @update:resultType="
          (val) => {
            resultType = val;
            handleTypeChange();
          }
        "
      />
    </Card>
  </div>
</template>

<style scoped lang="less">
.pathogen-statistics-container {
  margin-top: 16px;
  // overflow-x: auto;

  // :deep(.pathogen-statistics-card) {
  //   min-width: 1200px;
  // }
}

.spin-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
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

.chart-container {
  height: 570px;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 14px;
  color: #ff4d4f;
}
</style>