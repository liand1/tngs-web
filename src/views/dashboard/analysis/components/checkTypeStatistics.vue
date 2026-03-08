<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { Card, message, Spin } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import SampleConnectedChart from "./checkTypeStatistics/SampleConnectedChart.vue";
import FilterSelects from "./checkTypeStatistics/FilterSelects.vue";
import TimeControls from "./checkTypeStatistics/TimeControls.vue";
import {
  convertToSampleDataItems,
  updateChartData,
} from "./checkTypeStatistics/data";
import { downloadImageCanvas, formatDateToChartTime } from "./index";
import type { FilterValues, TimeRangeType } from "./model";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";

// 引用子组件实例
const chartRef = ref();

const statisticsRef = ref();

// 时间范围类型选择
const timeRangeType = ref<TimeRangeType>("day");

// 默认日期范围（当前年份的1月1日到12月31日）
const currentYear = new Date().getFullYear();
const defaultDateRange = ref<[Dayjs, Dayjs]>([
  dayjs(`${currentYear}-01-01`),
  dayjs(`${currentYear}-12-31`),
]);

// 条件筛选
const filterValues = reactive<FilterValues>({
  checkType: null,
  department: "",
  subject: "",
  doctor: "",
});

// 当前选中的月份
const currentMonth = ref("2023年01月");

// 图表拖拽的日期范围字符串，用于传递给TimeControls组件
const chartDateRangeStrings = ref<[string, string]>(["", ""]);

// 获取图表数据
const isLoading = ref(true);

// 导出图片
const handleExportChartImage = async (loadImg: any) => {
  await downloadImageCanvas("样本统计图", statisticsRef.value, [loadImg]);
};

// 处理图表拖拽导致的日期范围变化
const handleChartDateRangeChange = (dateRange: [string, string]) => {
  // debugger
  // console.log(
  //   "图表拖拽范围变更为:",
  //   dateRange,
  //   "当前时间类型:",
  //   timeRangeType.value
  // );

  // 更新日期范围字符串，用于传递给TimeControls组件
  chartDateRangeStrings.value = dateRange;

  // 时间处理逻辑已移至TimeControls组件内部
};

// 处理时间类型变化
const handleTimeTypeChange = (value: TimeRangeType) => {
  timeRangeType.value = value;
  console.log("时间类型变更为:", value);
  // 时间类型变更确实需要重新加载数据
  loadChartData();
};

// 处理日期范围变化
const handleDateRangeChange = (dates: [Dayjs, Dayjs]) => {
  defaultDateRange.value = dates;
  console.log(
    "日期范围变更为:",
    dates.map((d) => d.format("YYYY-MM-DD"))
  );
  // 不再调用loadChartData，而是直接更新datazoom
  // updateChartZoom(dates);
  loadChartData();
};

// 更新折线图的datazoom范围
const updateChartZoom = (dates: [Dayjs, Dayjs]) => {
  // 如果图表组件尚未挂载，则跳过
  if (!chartRef.value) return;

  try {
    const currentTimeType = timeRangeType.value as "month" | "day";
    const dataset = convertToSampleDataItems();

    // 只在数据集非空时进行处理
    if (dataset && dataset.length > 0) {
      // 将日期范围转换为格式化的时间字符串，以便在数据集中查找对应的索引
      const startStr = formatDateToChartTime(dates[0], currentTimeType);
      const endStr = formatDateToChartTime(dates[1], currentTimeType);

      // 在数据集中查找对应的索引
      const startIndex = findTimeIndex(dataset, startStr);
      const endIndex = findTimeIndex(dataset, endStr);

      if (startIndex >= 0 && endIndex >= 0) {
        // 通过子组件的公开方法设置datazoom
        chartRef.value.setDataZoom(startIndex, endIndex + 1);
        console.log("设置datazoom:", startIndex, endIndex + 1);
      } else {
        console.log("未找到对应的时间索引:", startStr, endStr);
      }
    }
  } catch (error) {
    console.error("设置datazoom出错:", error);
  }
};

// 在数据集中查找时间字符串对应的索引
const findTimeIndex = (dataset: any[], timeStr: string): number => {
  // 查找完全匹配
  const exactIndex = dataset.findIndex((item) => {
    //2025-05-30  转成  2025年05月30日
    const time = item.time.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1年$2月$3日')
    return time === timeStr;
  });
  if (exactIndex >= 0) return exactIndex;

  // 如果没有完全匹配，则查找最接近的时间
  try {
    // 解析目标时间
    let targetDate: Date | null = null;

    // 解析时间字符串，格式可能是"2023年01月"或"2023年01月01日"
    const monthMatch = timeStr.match(/(\d+)年(\d+)月/);
    const dayMatch = timeStr.match(/(\d+)年(\d+)月(\d+)日/);

    if (dayMatch) {
      // 日期格式: 2023年01月01日
      const year = parseInt(dayMatch[1]);
      const month = parseInt(dayMatch[2]) - 1; // JavaScript月份从0开始
      const day = parseInt(dayMatch[3]);
      targetDate = new Date(year, month, day);
    } else if (monthMatch) {
      // 月份格式: 2023年01月
      const year = parseInt(monthMatch[1]);
      const month = parseInt(monthMatch[2]) - 1; // JavaScript月份从0开始
      targetDate = new Date(year, month, 1);
    }

    if (!targetDate) return -1;

    // 解析数据集中的每个时间，找到时间最接近的项
    let closestIndex = -1;
    let minDiff = Number.MAX_VALUE;

    dataset.forEach((item, index) => {
      // 解析数据项的时间
      const itemMonthMatch = item.time.match(/(\d+)年(\d+)月/);
      const itemDayMatch = item.time.match(/(\d+)年(\d+)月(\d+)日/);

      let itemDate: Date | null = null;

      if (itemDayMatch) {
        const year = parseInt(itemDayMatch[1]);
        const month = parseInt(itemDayMatch[2]) - 1;
        const day = parseInt(itemDayMatch[3]);
        itemDate = new Date(year, month, day);
      } else if (itemMonthMatch) {
        const year = parseInt(itemMonthMatch[1]);
        const month = parseInt(itemMonthMatch[2]) - 1;
        itemDate = new Date(year, month, 1);
      }

      if (itemDate) {
        const diff = Math.abs(itemDate.getTime() - targetDate!.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      }
    });

    return closestIndex;
  } catch (error) {
    console.error("查找时间索引出错:", error);
    return -1;
  }
};

// 处理筛选条件变更
const handleFilterChange = (filters: {
  department: string;
  subject: string;
  doctor: string;
}) => {
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

// 加载图表数据
const loadChartData = async () => {
  // 设置加载状态
  isLoading.value = true;
  // console.log("开始加载图表数据，时间类型:", timeRangeType.value);
  // console.log("当前月份:", currentMonth.value);
  // console.log("当前日期范围:", defaultDateRange.value);
  // console.log("当前筛选条件:", filterValues);

  try {
    // 转换日期范围为字符串格式
    const dateRange: [string, string] = [
      defaultDateRange.value[0].format("YYYY-MM-DD"),
      defaultDateRange.value[1].format("YYYY-MM-DD"),
    ];
    // 获取当前时间类型
    const currentTimeType = timeRangeType.value as "month" | "day";

    console.log("检测项目统计dateRange", dateRange);

    // 然后异步更新后端数据
    await updateChartData(filterValues, dateRange, currentTimeType);

    // if (!result) {
    //   message.error("数据加载失败，请重试");
    // } else {
    //   // 此处不需要再次赋值，因为updateChartData已经返回了sampleChartData.value
    //   // console.log("图表数据加载完成");
    // }

    isLoading.value = false;
  } catch (error) {
    console.error("加载数据出错:", error);
    message.error("数据加载出错，请稍后重试");
    isLoading.value = false;
  }
};

// 样本数据，使用converter函数动态生成
// const sampleLineData = ref(convertToSampleDataItems("month"));

onMounted(() => {
  // 初始化时加载数据
  loadChartData();
});
</script>

<template>
  <div class="statistics-container" ref="statisticsRef">
    <Card class="statistics-card" :title="'检测项目统计'">
      <!-- 标题与筛选区域 -->
      <template #extra>
        <!-- 使用新的TimeControls组件 -->
        <TimeControls
          :initial-time-type="timeRangeType"
          :initial-date-range="defaultDateRange"
          @update:time-type="handleTimeTypeChange"
          @update:date-range="handleDateRangeChange"
        />
      </template>

      <!-- 过滤条件区域 -->
      <div class="filter-row">
        <!-- 使用新的FilterSelects组件 -->
        <FilterSelects
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
        <div class="spin-container" v-if="isLoading">
          <Spin :spinning="isLoading" tip="数据加载中..." />
        </div>

        <template v-if="!isLoading">
          <div
            v-if="convertToSampleDataItems().length === 0"
            class="error-message"
          >
            <ExclamationCircleOutlined
              style="margin-right: 8px; font-size: 20px; color: #faad14"
            />
            暂无数据
          </div>
          <SampleConnectedChart
            v-else
            height="480px"
            v-model:current-month="currentMonth"
            @update:dateRange="handleChartDateRangeChange"
            ref="chartRef"
          />
        </template>
      </div>
    </Card>
  </div>
</template>

<style lang="less" scoped>
.statistics-container {
  margin-top: 16px;
}

.statistics-card {
  position: relative;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;

  :deep(.arco-spin) {
    display: block;
  }

  :deep(.arco-spin-mask) {
    background-color: rgb(255 255 255 / 60%);
  }
}

.filter-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}

.statistics-body {
  position: relative;
  width: 100%;
  height: 480px;
}

.spin-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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