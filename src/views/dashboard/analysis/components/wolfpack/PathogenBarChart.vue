<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { PathogenDataItem } from "./data";
import { downloadImage as downloadImageFn } from "../../data";
import { getRandomColor } from "@/utils/color";
import { getColors } from "@/utils/custom";

// 定义组件属性
defineProps<{
  timeType?: "all" | "month" | "year";
  dateRange?: string[];
}>();

// 图表DOM引用
const barChartRef = ref<HTMLDivElement | null>(null);
const pieChartRef = ref<HTMLDivElement | null>(null);

// echarts实例
let barChart: echarts.ECharts | null = null;
let pieChart: echarts.ECharts | null = null;

// 计算当前应该显示的数据
const chartData = ref<PathogenDataItem[]>([]);

// 初始化柱状图
const initBarChart = () => {
  if (!barChartRef.value) return;
  if (barChart) barChart.dispose();
  barChart = echarts.init(barChartRef.value);
  updateBarChart();
};

// 初始化饼状图
const initPieChart = () => {
  if (!pieChartRef.value) return;
  if (pieChart) pieChart.dispose();
  pieChart = echarts.init(pieChartRef.value);
  updatePieChart();
};

// 更新柱状图数据
const updateBarChart = () => {
  if (!barChart) return;
  const data = chartData.value;
  if (data.length === 0) {
    barChart.setOption(
      {
        title: {
          text: "暂无数据",
          show: true,
          left: "center",
          top: "center",
          textStyle: {
            fontSize: 16,
            color: "#999",
          },
        },
      },
      true
    );
    return;
  }
  const names = data.map((item) => item.name);
  const values = data.map((item) => item.value);
  const totalValue = values.reduce((sum, value) => sum + value, 0);
  const colors = data.map(() => "#52C41A");
  const option: echarts.EChartsOption = {
    title: {
      text: "1",
      show: false,
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (params: any) => {
        const item = params[0];
        const pathogen = data[item.dataIndex];
        const percentage = (pathogen.outRatio * 100).toFixed(2);
        const tooltipData = [
          {
            name: "样本总数量",
            key: "reportCount",
            value: pathogen.reportCount,
            color: colors[item.dataIndex],
          },
          {
            name: "耐药基因检出",
            key: "value",
            value: pathogen.value,
            color: colors[item.dataIndex],
          },
          {
            name: "占比",
            key: "percentage",
            value: percentage,
            color: "#FFA940",
          },
        ];
        let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${pathogen.name}</div>`;
        tooltipData.forEach((dataItem) => {
          tooltipText += `<div style="display: flex; ${
            dataItem.key === "percentage" ? "font-weight: bold;" : ""
          } align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;justify-content: space-between;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${
              dataItem.color
            }; margin-right: 5px;"></span>
            <span style="flex: auto;">${dataItem.name}: </span>
            <span>${dataItem.value}${
            dataItem.key === "percentage" ? "%" : ""
          }</span>
          </div>`;
        });
        return tooltipText;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "20px",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: names,
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
      axisLabel: {
        interval: 0,
        rotate: 45,
        width: 120,
        overflow: "truncate",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: true,
      },
      axisTick: {
        show: true,
      },
      splitLine: {
        lineStyle: {
          type: "dashed",
        },
      },
    },
    series: [
      {
        name: "耐药基因数量",
        type: "bar",
        barWidth: "40%",
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index],
            borderRadius: [4, 4, 0, 0],
          },
        })),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
        },
      },
    ],
  };
  barChart.setOption(option);
};

// 更新饼状图数据
const updatePieChart = () => {
  if (!pieChart) return;
  const data = chartData.value;
  if (data.length === 0) {
    pieChart.setOption(
      {
        title: {
          text: "暂无数据",
          show: true,
          left: "center",
          top: "center",
          textStyle: {
            fontSize: 16,
            color: "#999",
          },
        },
      },
      true
    );
    return;
  }

  const colors = getColors();
  const pieData = data.map((item, idx) => ({
    name: item.name,
    value: item.value,
    itemStyle: { color: colors[idx % colors.length] },
  }));
  pieChart.setOption({
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const item = params;
        const pathogen = data.find((d) => d.name === item.name);
        if (!pathogen) return "";
        // 构建tooltip的HTML
        let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${pathogen.name}</div>`;

        // 添加检出数量
        tooltipText += `<div style="display: flex; align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${item.color}; margin-right: 5px;"></span>
            <span style="flex: auto;">样本总数量: </span>
            <span>${pathogen.reportCount}</span>
          </div>`;

        // 添加检出数量
        tooltipText += `<div style="display: flex; align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${item.color}; margin-right: 5px;"></span>
            <span style="flex: auto;">耐药检出数量: </span>
            <span>${pathogen.value}</span>
          </div>`;

        // 添加占比
        // tooltipText += `<div style="display: flex; font-weight: bold; align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;">
        //   <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: #FFA940; margin-right: 5px;"></span>
        //   <span style="flex: auto;">占比: </span>
        //   <span>${item.percent.toFixed(2)}%</span>
        // </div>`;

        return tooltipText;
      },
    },
    legend: { top: "bottom" },
    series: [
      {
        name: "耐药基因数量",
        type: "pie",
        radius: "70%",
        center: ["50%", "40%"],
        data: pieData,
        label: { show: true, formatter: "{b}" },
      },
    ],
  });
};

// 处理窗口大小变化
const handleResize = () => {
  barChart?.resize();
  pieChart?.resize();
};

// 组件挂载时初始化图表
onMounted(() => {
  window.addEventListener("resize", handleResize);
  setTimeout(() => {
    initBarChart();
    initPieChart();
  }, 100);
});

// 组件卸载前清理资源
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  if (barChart) {
    barChart.dispose();
    barChart = null;
  }
  if (pieChart) {
    pieChart.dispose();
    pieChart = null;
  }
});

// 向父组件暴露方法
defineExpose({
  setChartData: (data: PathogenDataItem[]) => {
    chartData.value = data;
    updateBarChart();
    updatePieChart();
  },
  downloadImage: () => {
    if (!barChart || !pieChart) {
      console.error("导出图片失败，请重新导出");
      return null;
    }
    // 这里只导出柱状图，如需导出饼图可扩展
    const result = downloadImageFn("耐药基因统计", barChart);
    if (result) {
      return true;
    }
    return false;
  },
});
</script>

<template>
  <div class="pathogen-bar-chart">
    <div class="chart-flex">
      <div ref="barChartRef" class="chart-container1"></div>
      <div ref="pieChartRef" class="chart-container2"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.pathogen-bar-chart {
  width: 100%;
  height: 100%;

  .chart-flex {
    display: flex;
    width: 100%;
    height: 100%;

    .chart-container1 {
      flex: 2;
      min-width: 0;
      height: 100%;
    }

    .chart-container2 {
      flex: 1;
      min-width: 0;
      height: 100%;
    }
  }
}

@media (max-width: 1200px) {
  .chart-container2 {
    display: none;
  }
}
</style> 