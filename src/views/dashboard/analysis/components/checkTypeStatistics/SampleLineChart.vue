<script lang="ts" setup>
import { onMounted, onBeforeUnmount, watch, reactive, ref } from "vue";
import * as echarts from "echarts";
import { getChartOptions, sampleChartData } from "./data";

// 获取图表选项
let chartOptions = getChartOptions();

// 定义组件属性
defineProps<{
  height?: string;
}>();

// 发出事件
const emit = defineEmits<{
  (e: "update:dateRange", range: [string, string]): void;
  (e: "dimensionChange", dimension: number): void;
  (
    e: "data-zoom",
    zoom: {
      startIndex: number;
      endIndex: number;
      centerIndex: number;
      dimension: number;
      startTime: string;
      endTime: string;
      timeValue: string;
    }
  ): void;
}>();

// echarts图表实例
let lineChart: echarts.ECharts | null = null;

// 图表DOM引用
let chartRef = ref<HTMLDivElement | null>(null);

// 图表数据集
const dataset = reactive<any[][]>([]);

// 准备echarts数据集
const prepareChartDataset = () => {
  // 检查数据是否为空
  if (!sampleChartData.value || sampleChartData.value.length === 0) {
    return [];
  }

  // const itemData = sampleChartData.value.map((item) => item.time.map((item)=>item.value))

  // 准备表头: ['product', '2023年01月', '2023年02月', ...]
  const header = ["product", ...sampleChartData.value[0].time.map((item) => item.time)];

  // 动态准备数据行
  const dataRows = chartOptions.legendItems.map((item) => {
    // 获取字段名
    const fieldName = item.field;
    const itemData = sampleChartData.value.find(
      (item) => item.field === fieldName
    )?.time;
    const data = itemData ? itemData.map((item) => item.value) : [];
    // 生成该图例对应的数据行
    return [item.name, ...data];
  });

  // 合并表头和数据行
  const newDataset = [header, ...dataRows];

  // 更新本地数据集
  dataset.splice(0, dataset.length, ...newDataset);

  return newDataset;
};

// 初始化折线图
const initLineChart = () => {
  if (!chartRef.value) return;

  // 销毁之前的实例
  if (lineChart) {
    lineChart.dispose();
  }

  // 初始化echarts实例
  lineChart = echarts.init(chartRef.value);

  // 准备数据集
  const chartDataset = prepareChartDataset();

  // 配置折线图选项
  const option: echarts.EChartsOption = {
    color: chartOptions.colors,
    legend: {
      data: chartOptions.legendItems.map((item) => item.name),
      icon: "circle",
      top: 0,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        if (!params || !Array.isArray(params) || params.length === 0) {
          return "";
        }

        // 获取当前时间点
        const timeLabel = params[0].axisValue;

        // 计算总计值 - 简化访问方式
        let total = 0;
        params.forEach((param: any) => {
          // 直接访问value字段（对于dataset系列）
          if (typeof param.value[param.seriesIndex + 1] === "number") {
            total += param.value[param.seriesIndex + 1];
          }
          // 兼容其他情况
          else if (typeof param.value === "number") {
            total += param.value;
          }
        });

        // 构建提示文本
        let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${timeLabel}</div>`;

        // 添加每个系列的数据
        params.forEach((param: any) => {
          // 提取数值 - 简化访问
          let value;
          if (typeof param.value[param.seriesIndex + 1] === "number") {
            value = param.value[param.seriesIndex + 1];
          } else if (typeof param.value === "number") {
            value = param.value;
          } else {
            value = 0;
          }

          const formattedValue = value.toLocaleString();
          tooltipText += `<div style="display: flex; align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;justify-content: space-between;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 5px;"></span>
            <span style="flex: auto;">${param.seriesName}: </span>
            <span>${formattedValue}</span>
          </div>`;
        });

        // 添加总计（加粗显示）
        tooltipText += `<div style="display: flex;font-size:12px;font-weight: bold; margin: 5px 0 5px 12px; color: #333;150px;justify-content: space-between;">
        <span>总计:</span> <span>${total.toLocaleString()}</span></div>`;

        return tooltipText;
      },
    },
    dataset: {
      source: chartDataset,
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: "#ddd",
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 500,
      interval: 100,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
          color: "#ddd",
        },
      },
    },
    grid: {
      left: "3%",
      right: "5%",
      top: "14%",
      bottom: "8%",
      containLabel: true,
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        type: "slider",
        xAxisIndex: 0,
        bottom: "2%",
        height: 20,
        start: 0,
        end: 100,
        handleIcon:
          "path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
        handleSize: "80%",
        handleStyle: {
          color: "#fff",
          shadowBlur: 3,
          shadowColor: "rgba(0, 0, 0, 0.6)",
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
      },
    ],
    series: chartOptions.legendItems.map((item) => ({
      name: item.name,
      type: "line",
      smooth: false,
      seriesLayoutBy: "row",
      emphasis: { focus: "series" },
      symbolSize: 6,
      symbol: "circle",
      lineStyle: {
        width: 2,
      },
    })),
  };

  // 应用配置
  lineChart.setOption(option);

  // 设置事件处理函数
  setupChartEvents();
};

// 设置折线图事件处理
const setupChartEvents = () => {
  if (!lineChart) return;

  // 添加UpdateAxisPointer事件监听，实现联动效果
  lineChart.on("updateAxisPointer", (event: any) => {
    if (!lineChart) return;
    const xAxisInfo = event.axesInfo?.[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;

      // 通知维度变更，用于更新饼图
      emit("dimensionChange", dimension);
    }
  });

  // 添加dataZoom事件监听，更新日期范围
  lineChart.on("datazoom", (params: any) => {
    try {
      if (!lineChart) return;

      // 获取当前dataZoom的范围
      const option = lineChart.getOption();
      let start = 0;
      let end = 100;

      // 尝试从事件参数获取
      if (params && params.batch && params.batch[0]) {
        start =
          typeof params.batch[0].start === "number"
            ? params.batch[0].start
            : start;
        end =
          typeof params.batch[0].end === "number" ? params.batch[0].end : end;
      }
      // 如果从事件参数无法获取，尝试从option获取
      else if (option && Array.isArray(option.dataZoom) && option.dataZoom[0]) {
        const dataZoomOpt = option.dataZoom[0] as any;
        start =
          typeof dataZoomOpt.start === "number" ? dataZoomOpt.start : start;
        end = typeof dataZoomOpt.end === "number" ? dataZoomOpt.end : end;
      }

      // 更新当前时间
      const centerPercent = (start + end) / 2;

      if (dataset && dataset[0] && dataset[0].length > 1) {
        // 计算可见数据的索引范围
        const totalTimes = dataset[0].length - 1; // 除去product列

        // 开始和结束索引
        const startIndex = Math.max(1, Math.round((start * totalTimes) / 100));
        const endIndex = Math.min(
          totalTimes,
          Math.round((end * totalTimes) / 100)
        );

        // 中心索引，用于更新饼图
        const centerIndex = Math.round((centerPercent * totalTimes) / 100);
        const dimension = Math.max(1, Math.min(totalTimes, centerIndex));

        // 获取开始和结束的时间字符串
        const startTime = dataset[0][startIndex] as string;
        const endTime = dataset[0][endIndex] as string;

        // 发送日期范围更新事件
        emit("update:dateRange", [startTime, endTime]);

        // 同时也触发自定义事件data-zoom
        emit("data-zoom", {
          startIndex,
          endIndex,
          centerIndex,
          dimension,
          startTime,
          endTime,
          timeValue: dataset[0][dimension] as string,
        });

        // 发送维度变更事件
        emit("dimensionChange", dimension);
      }
    } catch (error) {
      // console.error("处理dataZoom事件时出错:", error);
    }
  });

  // 响应窗口大小变化
  window.addEventListener("resize", handleResize);
};

// 处理窗口大小变化
const handleResize = () => {
  lineChart?.resize();
};

// 设置dataZoom的方法
const setDataZoom = (startIndex: number, endIndex: number) => {
  if (!lineChart) return;

  try {
    if (!dataset || !dataset[0] || dataset[0].length <= 1) return;

    const totalTimes = dataset[0].length - 1; // 除去product列

    // 确保索引在有效范围内
    startIndex = Math.max(1, Math.min(startIndex, totalTimes));
    endIndex = Math.max(startIndex, Math.min(endIndex, totalTimes));

    // 计算百分比
    const start = ((startIndex - 1) / totalTimes) * 100;
    const end = (endIndex / totalTimes) * 100;

    // 设置dataZoom范围
    lineChart.dispatchAction({
      type: "dataZoom",
      start: start,
      end: end,
    });

    // console.log(
    //   "设置dataZoom范围:",
    //   start,
    //   end,
    //   "原始索引:",
    //   startIndex,
    //   endIndex
    // );

    // 更新当前选中的月份/天（使用中心点）
    const centerIndex = Math.floor((startIndex + endIndex) / 2);
    const dimension = Math.max(1, Math.min(totalTimes, centerIndex));

    // 获取相关时间值
    const startTime = dataset[0][startIndex] as string;
    const endTime = dataset[0][endIndex] as string;
    const timeValue = dataset[0][dimension] as string;

    // 发送日期范围更新事件
    emit("update:dateRange", [startTime, endTime]);

    // 触发自定义事件data-zoom
    emit("data-zoom", {
      startIndex,
      endIndex,
      centerIndex,
      dimension,
      startTime,
      endTime,
      timeValue,
    });

    // 发出维度变更事件
    emit("dimensionChange", dimension);
  } catch (error) {
    console.error("设置dataZoom出错:", error);
  }
};

// 初始化图表
const initChart = () => {
  // 检查DOM元素是否存在
  if (!chartRef.value) {
    // console.error("图表DOM元素不存在，无法初始化");
    return;
  }

  // 初始化折线图
  initLineChart();

  // 设置初始dataZoom范围
  if (lineChart && dataset && dataset[0]) {
    const totalTimes = dataset[0].length - 1;
    if (totalTimes > 0) {
      // 获取当前数据范围
      const startIndex = 1;
      const endIndex = Math.min(totalTimes, 12); // 默认显示12个点或全部

      // 计算百分比
      const start = ((startIndex - 1) / totalTimes) * 100;
      const end = (endIndex / totalTimes) * 100;

      // 获取开始和结束的时间字符串
      const startTime = dataset[0][startIndex] as string;
      const endTime = dataset[0][endIndex] as string;

      // 中心点
      const centerIndex = Math.floor((startIndex + endIndex) / 2);
      const dimension = Math.max(1, Math.min(totalTimes, centerIndex));
      const timeValue = dataset[0][dimension] as string;

      // 发送日期范围更新事件
      emit("update:dateRange", [startTime, endTime]);

      // 触发自定义事件data-zoom
      emit("data-zoom", {
        startIndex,
        endIndex,
        centerIndex,
        dimension,
        startTime,
        endTime,
        timeValue,
      });

      // 设置dataZoom范围
      lineChart.dispatchAction({
        type: "dataZoom",
        start: start,
        end: end,
      });

      // 发送初始维度
      const initialDimension = dimension;
      emit("dimensionChange", initialDimension);
    }
  }
};

// 暴露组件方法
defineExpose({
  setDataZoom,
});

// 监听数据变化
watch(
  () => sampleChartData.value,
  (newData) => {
    if (newData && newData.length > 0) {
      // console.log("数据变化，重新初始化图表");
      chartOptions = getChartOptions();
      initChart();
    } else {
      // console.warn("接收到空数据");
      // 即使是空数据也初始化图表，使用默认值
      chartOptions = getChartOptions();
      initChart();
    }
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  // console.log("SampleLineChart mounted");

  // 使用延迟初始化确保DOM已渲染
  setTimeout(() => {
    initChart();
  }, 100);
});

onBeforeUnmount(() => {
  // 清理图表实例
  if (lineChart) {
    lineChart.off("updateAxisPointer");
    lineChart.off("datazoom");
    lineChart.dispose();
    lineChart = null;
  }

  // 移除事件监听
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div
    ref="chartRef"
    class="sample-line-chart"
    :style="{ height: height || '480px' }"
  ></div>
</template>

<style scoped>
.sample-line-chart {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style> 