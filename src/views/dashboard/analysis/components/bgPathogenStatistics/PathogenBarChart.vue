<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import * as echarts from "echarts";
import { PathogenDataItem } from "./data";
import { downloadImage as downloadImageFn } from "../../data";
import { TimeRangeType } from "../model";
import { Tabs } from "ant-design-vue";
import { getColors } from "@/utils/custom";

// 定义常量
const CHART_TYPES = {
  BAR: "bar",
  PIE: "pie",
};

// 定义组件属性
defineProps<{
  extractionBatch: string;
  libraryBatch: string;
  timeType?: TimeRangeType;
  dateRange?: string[];
}>();

// 定义事件
const emit = defineEmits<{
  (e: "data-loaded"): void;
  (e: "data-loading"): void;
  (e: "chart-type-change", key: string): void;
}>();

// 图表DOM引用
const chartRef = ref<HTMLDivElement | null>(null);
const chartContainerRef = ref<HTMLDivElement | null>(null);

// 当前图表类型
const activeChartType = ref(CHART_TYPES.BAR);

// echarts实例
let chart: echarts.ECharts | null = null;

// 计算当前应该显示的数据
const chartData = ref<PathogenDataItem[]>([]);

// 监听图表类型变化，重新渲染图表
watch(activeChartType, () => {
  // 确保已有图表实例
  if (chart) {
    // 销毁当前图表
    chart.dispose();
    chart = null;

    // 短暂延迟后重新初始化图表，确保DOM已更新
    setTimeout(() => {
      initChart();
    }, 50);
  }
});

// 计算图表高度
const chartHeight = computed(() => {
  return "500px";
  // const data = chartData.value;
  // // 没有数据时，设置最小高度
  // if (data.length === 0) {
  //   return "300px";
  // } else if (data.length > 10 && activeChartType.value === CHART_TYPES.BAR) {
  //   return "500px";
  // }

  // // 根据数据条数动态设置高度
  // // 每条数据约需30px高度，最小300px，最大600px
  // if (activeChartType.value === CHART_TYPES.BAR) {
  //   const baseHeight = 100; // 基础高度
  //   const itemHeight = 30; // 每个条目的高度
  //   const height = Math.max(
  //     300,
  //     Math.min(600, baseHeight + data.length * itemHeight)
  //   );
  //   return `${height}px`;
  // } else {
  //   // 饼图固定高度
  //   return "500px";
  // }
});

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return;

  // 创建新的实例
  chart = echarts.init(chartRef.value);

  // 更新图表
  updateChart();
};

// 更新图表数据
const updateChart = () => {
  if (!chart) return;

  const data = chartData.value;

  // 设置容器高度
  if (chartContainerRef.value) {
    chartContainerRef.value.style.height = chartHeight.value;
  }

  // 如果数据为空
  if (data.length === 0) {
    chart.setOption({
      title: {
        text: "暂无数据",
        left: "center",
        top: "center",
        textStyle: {
          fontSize: 16,
          color: "#999",
        },
      },
    });
    return;
  }

  // 提取数据
  const names = data.map((item) => item.name);
  const values = data.map((item) => item.value);

  // 计算总数，用于计算占比
  const totalValue = values.reduce((sum, value) => sum + value, 0);

  // 数据颜色设置
  const colors = data.map((_) => {
    return "rgba(64, 169, 255, 1)";
  });

  // 根据图表类型选择不同的配置
  if (activeChartType.value === CHART_TYPES.BAR) {
    // 柱状图配置
    const option: echarts.EChartsOption = {
      title: {
        text: "",
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
          // 计算占比
          const percentage = (pathogen.outRatio * 100).toFixed(2);

          // 构建数据对象数组
          const tooltipData = [
          {
              name: "样本总数量",
              key: "reportCount",
              value: pathogen.reportCount,
              color: colors[item.dataIndex],
            },
            {
              name: "检出数量",
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

          // 构建tooltip的HTML
          let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${pathogen.name}</div>`;

          // 添加数据项
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
        bottom: "8%",
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
      dataZoom: [
        {
          type: "inside",
          start: 0,
          end: names.length > 20 ? Math.round((20 / names.length) * 100) : 100,
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
      series: [
        {
          name: "检出数量",
          type: "bar",
          data: values,
          barWidth: "40%",
          itemStyle: {
            color: function (params) {
              return colors[params.dataIndex];
            },
            borderRadius: [2, 2, 0, 0],
          },
          label: {
            show: true,
            position: "top",
            formatter: function (params) {
              return params.value;
            },
          },
        },
      ],
    };
    chart.setOption(option);
  } else {
    const colors = getColors();
    // 饼图配置
    const pieData = data.map((item, index) => {
      return {
        name: item.name,
        value: item.value,
        itemStyle: {
          color: colors[index % colors.length],
        },
      };
    });

    const option: echarts.EChartsOption = {
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
            <span style="flex: auto;">检出数量: </span>
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
      legend: {
        type: "plain",
        orient: "horizontal",
        left: "60%",
        top: 10,
        bottom: 10,

        // height:50,
        data: names,
        pageIconColor: "#1890FF", // 分页按钮颜色
        pageTextStyle: { color: "#333" }, // 分页数字颜色
        // 你可以继续自定义
      },
      series: [
        {
          name: "病原体检出数量",
          type: "pie",
          radius: "75%",
          center: ["30%", "50%"],
          avoidLabelOverlap: true,

          label: {
            show: true,
            // formatter: "{b}: {c} ({d}%)",
            formatter: "{b}",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: "bold",
            },
          },

          data: pieData,
        },
      ],
    };
    chart.setOption(option);
  }
};

// 监听筛选条件变化
// watch(
//   [
//     () => props.sampleType,
//     () => props.resultType,
//     () => props.timeType,
//     () => props.dateRange,
//   ],
//   () => {
//     updateChart();
//   }
// );

// 处理窗口大小变化
const handleResize = () => {
  chart && chart.resize();
};

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

// 组件卸载前清理资源
onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);

  if (chart) {
    chart.dispose();
    chart = null;
  }
});

// 向父组件暴露方法
defineExpose({
  setChartData: (data: PathogenDataItem[]) => {
    chartData.value = data;
    updateChart();
  },
  downloadImage: () => {
    if (!chart) {
      console.error("导出图片失败，请重新导出");
      return null;
    }

    const result = downloadImageFn("病原体检出情况", chart);
    if (result) {
      return true;
    }
    return false;
  },
  setChartType: (key: string) => {
    activeChartType.value = key;
  },
});

const handleChartTypeChange = (key: string) => {
  activeChartType.value = key;
  emit("chart-type-change", key);
  // updateChart();
};
</script>

<template>
  <div class="pathogen-chart">
    <div class="tabs-container">
      <Tabs v-model:activeKey="activeChartType" @change="handleChartTypeChange">
        <Tabs.TabPane key="bar" tab="柱状图">
          <!-- 柱状图标签页内容在底部图表容器中显示 -->
        </Tabs.TabPane>
        <Tabs.TabPane key="pie" tab="饼图">
          <!-- 饼图标签页内容在底部图表容器中显示 -->
        </Tabs.TabPane>
      </Tabs>
    </div>

    <!-- 图表容器 -->
    <div class="chart-container-all">
      <div class="chart-container" ref="chartContainerRef">
        <div class="chart" ref="chartRef"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.pathogen-chart {
  width: 100%;
  height: 100%;
}

.chart-container-all {
  width: 100%;
  overflow-x: auto;
}

.chart-container {
  min-width: 1200px;
  height: 500px;
  overflow: hidden;
}

.tabs-container {
  margin-bottom: 8px;
}


.chart {
  width: 100%;
  height: 100%;
}
</style> 