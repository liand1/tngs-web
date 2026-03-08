<script lang="ts" setup>
import { onMounted, onBeforeUnmount, watch, reactive, ref } from "vue";
import * as echarts from "echarts";
import { getChartOptions, sampleChartData } from "./data";

// 获取图表选项
let chartOptions = getChartOptions();

// 定义组件属性
const props = defineProps<{
  currentDimension: number;
  height?: string;
}>();

// echarts图表实例
let pieChart: echarts.ECharts | null = null;

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

  // 准备表头: ['product', '2023年01月', '2023年02月', ...]
  const header = [
    "product",
    ...sampleChartData.value[0].time.map((item) => item.time),
  ];

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

// 计算特定维度的总数
const calculateTotal = (dimension: number) => {
  // 确保数据集已准备好
  const chartDataset = dataset.length > 0 ? dataset : prepareChartDataset();

  let total = 0;

  // 确保所有值为数字
  for (let i = 1; i <= chartOptions.legendItems.length; i++) {
    const value = chartDataset[i][dimension];
    total += typeof value === "number" ? value : 0;
  }

  return total;
};

// 准备饼图数据
const preparePieData = (dimension: number) => {
  // 确保数据集已准备好
  const chartDataset = dataset.length > 0 ? dataset : prepareChartDataset();
  if (chartDataset.length === 0) {
    chartOptions.legendItems = [];
    return [];
  }

  return chartOptions.legendItems.map((item, index) => {
    return {
      name: item.name,
      value: chartDataset[index + 1][dimension],
      itemStyle: { color: item.color },
    };
  });
};

// 初始化饼图
const initPieChart = (dimension = 1) => {
  if (!chartRef.value) return;

  // 销毁之前的实例
  if (pieChart) {
    pieChart.dispose();
  }

  // 初始化echarts实例
  pieChart = echarts.init(chartRef.value);

  // 计算总数
  const total = calculateTotal(dimension);

  // 配置饼图选项
  const option: echarts.EChartsOption = {
    color: chartOptions.colors,
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        // 构建提示文本
        let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${params.name}</div>`;

        const data = [
          {
            name: "样本数",
            key: "value",
            value: params.value,
            color: params.color,
          },
          {
            name: "占比",
            key: "percent",
            value: params.percent,
            color: "#fff",
          },
        ];

        // 添加每个系列的数据
        data.forEach((item: any) => {
          tooltipText += `<div style="display: flex;${
            item.key === "percent" ? "font-weight: bold;" : ""
          } align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;justify-content: space-between;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${
            item.color
          }; margin-right: 5px;"></span>
          <span style="flex: auto;">${item.name}: </span>
          <span>${item.value}${item.key === "percent" ? "%" : ""}</span>
  </div>`;
        });

        return tooltipText;
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "样本类型",
        type: "pie",
        radius: ["35%", "55%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: "outside",
          formatter: "{b}: {c}\n({d}%)",
          fontSize: 12,
          color: "#333",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10,
          smooth: true,
        },
        data: preparePieData(dimension),
      },
    ] as unknown as echarts.SeriesOption[],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "总数\n" + total.toLocaleString(),
          textAlign: "center",
          fill: "#333",
          fontSize: 16,
          fontWeight: "bold",
          lineHeight: 24,
        },
      } as echarts.GraphicComponentOption,
    ],
  };

  // 应用配置
  pieChart.setOption(option);
};

// 更新饼图数据
const updatePieChart = (dimension: number) => {
  if (!pieChart) return;

  const total = calculateTotal(dimension);

  pieChart.setOption({
    series: [
      {
        name: "样本类型",
        type: "pie",
        data: preparePieData(dimension),
      },
    ] as unknown as echarts.SeriesOption[],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "center",
        style: {
          text: "总数\n" + total.toLocaleString(),
          textAlign: "center",
          fill: "#333",
          fontSize: 16,
          fontWeight: "bold",
          lineHeight: 24,
        },
      } as echarts.GraphicComponentOption,
    ],
  });
};

// 处理窗口大小变化
const handleResize = () => {
  pieChart?.resize();
};

// 初始化图表
const initChart = () => {
  // 检查DOM元素是否存在
  if (!chartRef.value) {
    // console.error("饼图DOM元素不存在，无法初始化");
    return;
  }

  // 准备数据集
  prepareChartDataset();

  // 初始化饼图，使用当前维度
  initPieChart(props.currentDimension);
};

// 监听数据变化
watch(
  () => sampleChartData.value,
  (newData) => {
    if (newData && newData.length > 0) {
      // console.log("饼图数据变化，重新初始化");
      chartOptions = getChartOptions();
      initChart();
    } else {
      // console.warn("饼图接收到空数据");
      // 即使是空数据也初始化图表，使用默认值
      chartOptions = getChartOptions();
      initChart();
    }
  },
  { deep: true, immediate: true }
);

// 监听维度变化
watch(
  () => props.currentDimension,
  (newDimension) => {
    if (dataset.length > 0) {
      // 只更新饼图数据，无需重新初始化整个图表
      updatePieChart(newDimension);
    }
  }
);

onMounted(() => {
  // console.log("SamplePieChart mounted");

  // 使用延迟初始化确保DOM已渲染
  setTimeout(() => {
    initChart();
  }, 100);

  // 添加窗口大小变化监听
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  // 清理图表实例
  if (pieChart) {
    pieChart.dispose();
    pieChart = null;
  }

  // 移除事件监听
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div
    ref="chartRef"
    class="sample-pie-chart"
    :style="{ height: height || '480px' }"
  ></div>
</template>

<style scoped>
.sample-pie-chart {
  width: 100%;
  height: 100%;

  /* background-color: #fff; */
}
</style> 