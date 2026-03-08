<script lang="ts" setup>
import { onMounted, onBeforeUnmount, watch, ref, computed } from "vue";
import * as echarts from "echarts";
import { positiveChartData, getTotalPositiveRate } from "./data";

// 定义组件属性
const props = defineProps<{
  height?: string;
  chartType: string;
}>();

// echarts图表实例
let pieChart: echarts.ECharts | null = null;

// 图表DOM引用
const chartRef = ref<HTMLDivElement | null>(null);

// 判断是否为总体图表
const isTotal = computed(() => props.chartType === "total");

// 获取当前样本类型的数据
const currentTypeData = computed(() => {
  if (props.chartType === "total") {
    // 计算总体数据的总量

    const allSamples = positiveChartData.value.reduce(
      (sum, item) => sum + item.allPositiveRate,
      0
    );

    // 计算阳性样本总量
    const positiveAmount =
      allSamples * (parseInt(getTotalPositiveRate(positiveChartData.value).toString()) / 100);

    return {
      percentage: parseInt(getTotalPositiveRate(positiveChartData.value).toString()),
      color: "#F5515F",
      backgroundColor: "#FFEDED",
      totalAmount: allSamples,
      positiveAmount: Math.round(positiveAmount),
    };
  } else {
    const sampleType = positiveChartData.value.find(
      (item) => item.field === props.chartType
    );
    if (sampleType) {
      // 获取该类型的总量
      const totalAmount = sampleType.allPositiveRate; //62 16

      // 计算阳性样本量
      const positiveAmount = totalAmount * (sampleType.positiveRate / 100);

      return {
        percentage: parseInt(sampleType.positiveRate.toString()),
        color: sampleType.color,
        backgroundColor: sampleType.lightColor,
        totalAmount,
        positiveAmount: Math.round(positiveAmount),
      };
    }
    return {
      percentage: 0,
      color: "#cccccc",
      backgroundColor: "#f5f5f5",
      totalAmount: 0,
      positiveAmount: 0,
    };
  }
});

// 初始化饼图
const initPieChart = () => {
  if (!chartRef.value) return;
  console.log("initPieChart", positiveChartData.value);
  // 销毁之前的实例
  if (pieChart) {
    pieChart.dispose();
  }

  // 初始化echarts实例
  pieChart = echarts.init(chartRef.value);

  // 获取配色和阳性率
  const { percentage, color, backgroundColor } = currentTypeData.value;

  // 设置饼图数据
  const data = [
    { name: "阳性", value: percentage, itemStyle: { color } },
    {
      name: "阴性",
      value: 100 - percentage,
      itemStyle: { color: backgroundColor },
    },
  ];

  // 根据是否为总体图表设置不同的半径
  const radius = isTotal.value ? ["38%", "60%"] : ["40%", "65%"];

  // 配置饼图选项
  const option: echarts.EChartsOption = {
    title: {
      text: "阳性率",
      left: isTotal.value ? "66%" : "40%",
      top: isTotal.value ? "40%" : "28%",
      textStyle: {
        fontSize: 12,
        color: "#00000073",
        fontWeight: "normal",
      },
    },
    graphic: {
      elements: [
        {
          type: "text",
          left: isTotal.value ? "68%" : "42%",
          top: "50%",
          style: {
            text: percentage + "%",
            font: `bold 18px sans-serif`,
            fill: "#000000",
          },
        },
      ],
    },
    series: [
      {
        type: "pie",
        radius: radius,
        center: isTotal.value ? ["30%", "50%"] : ["20%", "50%"], // 将饼图放在左侧
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
        emphasis: {
          disabled: true,
        },
        data: data,
      },
    ],
    tooltip: {
      trigger: "item",
      formatter: function () {
        const { totalAmount, positiveAmount, percentage } =
          currentTypeData.value;

        // 获取当前样本类型名称
        let categoryName = "全部样本";
        if (props.chartType !== "total") {
          const sampleType = positiveChartData.value.find(
            (item) => item.field === props.chartType
          );
          if (sampleType) {
            categoryName = sampleType.name;
          }
        }

        // 创建tooltip数据项
        const tooltipItems = [
          {
            name: "总量",
            key: "totalValue",
            value: totalAmount,
            color: "#5D9CEC",
          },
          {
            name: "阳性量",
            key: "positiveValue",
            value: positiveAmount,
            color: "#F5515F",
          },
          {
            name: "阳性率",
            key: "positiveRate",
            value: percentage,
            color: "#fff",
          },
        ];

        // 构建tooltip HTML内容
        let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${categoryName}</div>`;

        tooltipItems.forEach((item) => {
          tooltipText += `<div style="display: flex; ${
            item.key === "positiveRate" ? "font-weight: bold;" : ""
          } align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;justify-content: space-between;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${
              item.color
            }; margin-right: 5px;"></span>
            <span style="flex: auto;">${item.name}: </span>
            <span>${item.value}${
            item.key === "positiveRate" ? "%" : " 例"
          }</span>
          </div>`;
        });

        return tooltipText;
      },
    },
  };

  // 应用配置
  pieChart.setOption(option);
};

// 处理窗口大小变化
const handleResize = () => {
  pieChart?.resize();
};

// 监听数据变化
watch(
  () => positiveChartData.value,
  () => {
    initPieChart();
  },
  { deep: true }
);

// 组件挂载时初始化图表
onMounted(() => {
  // 添加窗口大小变化事件监听
  window.addEventListener("resize", handleResize);

  // 初始化饼图
  setTimeout(() => {
    initPieChart();
  }, 100);
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  // 移除窗口大小变化事件监听
  window.removeEventListener("resize", handleResize);

  // 销毁图表实例
  if (pieChart) {
    pieChart.dispose();
    pieChart = null;
  }
});
</script>

<template>
  <div
    ref="chartRef"
    class="positive-pie-chart"
    :class="{ 'is-total': isTotal }"
    :style="{ height }"
  ></div>
</template>

<style scoped>
.positive-pie-chart {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  min-height: 70px;
}

.is-total {
  min-height: 140px;
}
</style> 