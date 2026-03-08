<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { positiveChartData, PositiveChartDataItem } from "./data";
import PositiveLineChart from "./PositiveLineChart.vue";
import PositivePieChart from "./PositivePieChart.vue";
//@ts-ignore
import html2canvas from "html2canvas";
import { TimeRangeType } from "../model";

// 定义组件属性
const props = defineProps<{
  height?: string;
  timeType?: TimeRangeType;
}>();

watch(positiveChartData.value, (newData) => {
  console.log("数据变化:", newData);
});

// 引用子组件
const lineChartRef = ref<any>(null);
// 引用整个图表容器
const chartContainerRef = ref<HTMLElement | null>(null);

// 图表状态
const chartState = reactive({
  currentMonth: "",
  selectedDimension: 1,
  loading: false,
  error: null,
});

// 导出图表为图片 - 将整个组件截图为一张图片
const downloadImage = async (fileName = "阳性率统计图") => {
  if (!chartContainerRef.value) {
    console.error("图表容器未初始化，无法导出");
    return false;
  }

  try {
    // 获取当前时间戳，用于文件名
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

    // 完整文件名
    const fullFileName = `${fileName}_${timestamp}.png`;

    // 使用html2canvas将DOM元素转换为Canvas
    const canvas = await html2canvas(chartContainerRef.value, {
      backgroundColor: "#ffffff",
      scale: 2, // 提高截图质量
      useCORS: true, // 允许跨域图片
      logging: false,
      allowTaint: true,
    });

    // 转换Canvas为图片URL
    const url = canvas.toDataURL("image/png");

    // 创建一个下载链接
    const link = document.createElement("a");
    link.download = fullFileName;
    link.href = url;

    // 模拟点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error("导出图表图片出错:", error);
    return false;
  }
};

// 对外暴露当前月份
// const currentMonth = computed({
//   get: () => chartState.currentMonth,
//   set: (value: string) => {
//     chartState.currentMonth = value;
//     emit("update:currentMonth", value);
//   },
// });

// 将图表数据分组，每组2个饼图
const chartDataChunks = computed(() => {
  const charts: PositiveChartDataItem[] = [...positiveChartData.value]; // 复制原数组避免修改原数据
  const result: PositiveChartDataItem[][] = [];

  // 每2个元素一组
  for (let i = 0; i < charts.length; i += 2) {
    result.push(charts.slice(i, i + 2));
  }

  return result;
});

// 监控数据变化
onMounted(() => {
  // console.log(
  //   "PositiveConnectedChart组件挂载, 传入的时间类型:",
  //   props.timeType
  // );
  // console.log("初始数据:", positiveChartData.value);
});

// 暴露组件方法给父组件
defineExpose({
  downloadImage,
});
</script>

<template>
  <div class="positive-connected-chart" style="height: 300px">
    <div v-if="chartState.error" class="error-message">
      {{ chartState.error }}
    </div>
    <div v-else-if="chartState.loading" class="loading-message">加载中...</div>
    <div v-else ref="chartContainerRef" class="chart-container">
      <!-- 左侧柱状图和折线图区域 -->
      <div class="chart-left">
        <PositiveLineChart ref="lineChartRef" height="300px" />
      </div>

      <!-- 右侧饼图区域 -->
      <div class="chart-right">
        <div class="pie-charts-container">
          <div
            v-for="(chunk, chunkIndex) in chartDataChunks"
            :key="chunkIndex"
            class="pie-chart-column"
          >
            <div v-for="item in chunk" :key="item.field" class="pie-chart-item">
              <div class="pie-chart-title">{{ item.name }}</div>
              <PositivePieChart :chart-type="item.field" />
            </div>
          </div>

          <!-- 总体饼图 -->
          <div class="pie-chart-column last-column">
            <div class="pie-chart-item pie-chart-total">
              <div class="pie-chart-title all-title">全部样本</div>
              <PositivePieChart chart-type="total" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.positive-connected-chart {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.chart-container {
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}

.chart-left {
  flex: 1;
  height: 100%;
  padding-right: 16px;
}

.chart-right {
  padding-left: 16px;
  margin-top: 40px;
}

.pie-charts-container {
  display: flex;
  height: 100%;
}

.pie-chart-column {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;

  &.last-column {
    width: 190px;
  }
}

.pie-chart-item {
  display: flex;
  flex-direction: column;
  width: 190px;
  height: 110px;
  background: #fff;
  border-radius: 4px;
}

.pie-chart-total {
  height: 228px;
}

.pie-chart-title {
  position: relative;
  top: 5px;
  left: 0;
  margin-bottom: 2px;
  font-size: 14px;
  font-weight: bold;
  color: #000000d9;

  &.all-title {
    top: 30px;
    left: 30px;
  }
}

.error-message,
.loading-message {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #999;
}

@media (max-width: 1200px) {
  .chart-right {
    display: none;
  }

  .chart-left {
    padding-right: 0;
  }
}
</style> 