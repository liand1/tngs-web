<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { Card, Spin } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import PositiveConnectedChart from "./positiverate/PositiveConnectedChart.vue";
import FilterSelects from "./positiverate/FilterSelects.vue";
import TimeControls from "./positiverate/TimeControls.vue";
import { positiveChartData, requestData } from "./positiverate/data";
import { downloadImageCanvas } from "./index";
import type { FilterValues, TimeRangeType } from "./model";
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

// 引用子组件实例
const chartRef = ref();

// 时间范围类型选择
const timeRangeType = ref<TimeRangeType>("all");

// 默认日期范围（当前年份的1月1日到12月31日）
// const currentYear = new Date().getFullYear();
const defaultDateRange = ref<[Dayjs, Dayjs]>([
  dayjs(`2025-01-01`),
  dayjs(),
]);

// 条件筛选
const filterValues = reactive<FilterValues>({
  checkType: null,
  department: "",
  subject: "",
  doctor: "",
});

// 当前选中的月份
// const currentMonth = ref("2023年01月");

// 获取图表数据
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");
const statisticsContainer = ref();
// 处理时间类型变化
const handleTimeTypeChange = (value: TimeRangeType, dates: [Dayjs, Dayjs]) => {
  defaultDateRange.value = dates;
  timeRangeType.value = value;
  // console.log("时间类型变更为:", value);
  // 时间类型变更需要重新加载数据
  loadChartData();
};

// 处理日期范围变化
const handleDateRangeChange = (dates: [Dayjs, Dayjs]) => {
  defaultDateRange.value = dates;
  // console.log(
  //   "日期范围变更为:",
  //   dates.map((d) => d.format("YYYY-MM-DD"))
  // );
  // 日期范围变更需要重新加载数据
  loadChartData();
};

// 处理筛选条件变更
const handleFilterChange = (filters: FilterValues) => {
  // 更新筛选值
  Object.assign(filterValues, filters);
  // 加载新数据
  loadChartData();
};

// 处理筛选条件重置
const handleFilterReset = () => {
  // 加载新数据
  loadChartData();
};

// 导出图表为图片
const handleExportChartImage = async (icon: any) => {
  await downloadImageCanvas("阳性率统计图", statisticsContainer.value, [icon]);
};

// 加载图表数据
const loadChartData = async () => {
  // 设置加载状态
  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = "";

  // console.log("开始加载图表数据，时间类型:", timeRangeType.value);
  // console.log("当前筛选条件:", filterValues);
  // console.log("当前日期范围:", defaultDateRange.value);
  // console.log("当前时间类型:", timeRangeType.value);

  try {
    // 获取当前时间类型
    const currentTimeType = timeRangeType.value;

    const data = await requestData(
      filterValues.checkType,
      filterValues.department,
      filterValues.subject,
      filterValues.doctor,
      currentTimeType,
      defaultDateRange.value
    );

    if (data.length > 0) {
      positiveChartData.value = data;
    } else {
      // 如果模拟数据也为空，显示错误
      hasError.value = true;
      errorMessage.value = "无法获取数据，当前时间范围内没有数据";
    }

    // 给图表渲染预留时间
    setTimeout(() => {
      isLoading.value = false;
    }, 300); // 增加延时，确保图表有足够时间渲染
  } catch (error) {
    console.error("加载数据出错:", error);
    hasError.value = true;
    errorMessage.value = "数据加载失败，请重新加载";
    isLoading.value = false;
  }
};

// 样本数据，使用converter函数动态生成
// const sampleLineData = ref<SampleDataItem[]>([]);
// const initSampleLineData = ref<PositiveChartDataItem[]>([]);
onMounted(() => {
  // 初始化时加载数据
  loadChartData();
});
</script>

<template>
  <div class="statistics-container" ref="statisticsContainer">
    <Card class="statistics-card" :title="'阳性率统计'">
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

      <!-- 过滤条件区域 -->
      <div class="filter-row">
        <!-- 使用FilterSelects组件 -->
        <FilterSelects
          :show-check-type="true"
          :initial-department="filterValues.department"
          :initial-subject="filterValues.subject"
          :initial-doctor="filterValues.doctor"
          @change="handleFilterChange"
          @reset="handleFilterReset"
          @download="handleExportChartImage"
        />
      </div>

      <!-- 图表区域 -->
      <div class="statistics-body">
        <!-- 图表内容区域 -->
        <div class="chart-container">
          <Spin :spinning="isLoading" tip="数据加载中...">
            <div v-if="hasError" class="error-message">
              <ExclamationCircleOutlined style=" margin-right: 8px;font-size: 20px; color: #faad14;" />
              暂无数据
            </div>
            <PositiveConnectedChart
              v-else
              height="300px"
              :time-type="timeRangeType"
              ref="chartRef"
            />
          </Spin>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped lang="less">
.statistics-container {
  width: 100%;
  margin-top: 16px;
}

.statistics-card {
  width: 100%;
}

.filter-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 4px;
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
</style>