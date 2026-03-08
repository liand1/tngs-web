<script lang="ts" setup>
import { ref, reactive, computed, watch } from "vue";
import SampleLineChart from "./SampleLineChart.vue";
import SamplePieChart from "./SamplePieChart.vue";

import { sampleChartData, convertToSampleDataItems } from "./data";

// 定义组件属性
defineProps<{
  height?: string;
}>();

// 发出事件
const emit = defineEmits<{
  (e: "update:currentMonth", month: string): void;
  (e: "update:dateRange", range: [string, string]): void;
}>();

// 引用子组件
const lineChartRef = ref(null);
const pieChartRef = ref(null);
// 引用整个图表容器
const chartContainerRef = ref<HTMLElement | null>(null);

// 图表状态
const chartState = reactive({
  currentMonth: "",
  selectedDimension: 1,
});

// 转换后的样本数据
computed(() => {
  return convertToSampleDataItems();
});

// 对外暴露当前月份
const currentMonth = computed({
  get: () => chartState.currentMonth,
  set: (value: string) => {
    chartState.currentMonth = value;
    emit("update:currentMonth", value);
  },
});

// 子组件向上传播维度变化事件的处理函数
const handleDimensionChange = (dimension: number) => {
  if (sampleChartData.value.length === 0) {
    return;
  }

  // 更新当前选中的维度
  chartState.selectedDimension = dimension;
  // 获取 time 数组最长的对象
  const maxTimeItem = sampleChartData.value.reduce((max, item) =>
    item.time.length > max.time.length ? item : max
  );

  // 如果有有效数据，则更新当前月份
  if (
    sampleChartData.value &&
    sampleChartData.value.length > 0 &&
    dimension > 0 &&
    dimension <= maxTimeItem.time.length
  ) {
    // 索引需要减1，因为dimension是从1开始的
    const index = dimension - 1;

    if (maxTimeItem && maxTimeItem.time && maxTimeItem.time.length > 0) {
      const timeValue = maxTimeItem.time[index].time;
      if (timeValue) {
        currentMonth.value = timeValue;
      }
    }
  }
};

// 处理数据缩放事件
const handleDataZoom = (params: any) => {
  // console.log("收到dataZoom事件:", params);

  // 更新当前月份
  if (params.timeValue) {
    currentMonth.value = params.timeValue;
  }

  // 发出日期范围变化事件
  if (params.startTime && params.endTime) {
    emit("update:dateRange", [params.startTime, params.endTime]);
  }
};

// 对外暴露设置dataZoom的方法
const setDataZoom = (startIndex: number, endIndex: number) => {
  // 调用折线图组件的方法
  if (lineChartRef.value) {
    (lineChartRef.value as any).setDataZoom(startIndex, endIndex);
  }
};

// 监听数据变化
watch(
  () => sampleChartData.value,
  (newData) => {
    if (newData && newData.length > 0) {
      // 数据变化时，默认选择第一个维度
      chartState.selectedDimension = 1;

      // 更新当前月份
      const firstItem = newData[0];
      if (firstItem && firstItem.time && firstItem.time.length > 0) {
        const timeValue = firstItem.time[0].time;
        if (timeValue) {
          currentMonth.value = timeValue;
        }
      }
    }
  },
  { deep: true, immediate: true }
);

// 暴露组件方法给父组件
defineExpose({
  setDataZoom,
});
</script>

<template>
  <div class="sample-connected-chart" :style="{ height: height || '480px' }">
    <div ref="chartContainerRef" class="chart-container">
      <div class="charts-wrapper">
        <!-- 折线图 -->
        <div class="line-chart-wrapper">
          <SampleLineChart
            ref="lineChartRef"
            :height="height"
            @dimension-change="handleDimensionChange"
            @data-zoom="handleDataZoom"
          />
        </div>

        <!-- 饼图 -->
        <div class="pie-chart-wrapper">
          <!-- 标题栏 -->
          <div class="chart-title-row">
            <div></div>
            <div class="month-title">
              <span>{{ currentMonth }}</span>
              <b>样本类型统计以及占比</b>
            </div>
          </div>
          <SamplePieChart
            ref="pieChartRef"
            :current-dimension="chartState.selectedDimension"
            :height="height"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sample-connected-chart {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.chart-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.chart-title-row {
  display: flex;
  margin-top: 16px;
}

.month-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.month-title span {
  padding: 2px 8px;
  margin-right: 8px;
  color: #e61f42;
  background-color: #ffeded;
  border: 1px solid #e61f42;
  border-radius: 4px;
}

.month-title b {
  font-weight: normal;
}

.charts-wrapper {
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(100% - 36px);
}

.line-chart-wrapper {
  flex: 1;
  height: 100%;
  background-color: #fff;
}

.pie-chart-wrapper {
  width: 400px;
  height: 100%;
  background-color: #fff;
}

@media (max-width: 1200px) {
  .pie-chart-wrapper {
    display: none;
  }

  .line-chart-wrapper {
    padding-right: 0;
  }
}
</style> 