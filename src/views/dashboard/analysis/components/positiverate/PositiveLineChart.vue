<script lang="ts" setup>
import { onMounted, onBeforeUnmount, watch, reactive, ref } from "vue";
import * as echarts from "echarts";
import { getChartOptions, getSampleTypeData, positiveChartData } from "./data";

// 获取图表选项
const chartOptions = getChartOptions();

// 定义组件属性
defineProps<{
  height?: string;
}>();

// 发出事件
const emit = defineEmits<{
  (e: "dimensionChange", dimension: number): void;
}>();

// echarts图表实例
let lineChart: echarts.ECharts | null = null;

// 图表DOM引用
let chartRef = ref<HTMLDivElement | null>(null);

// 图表数据集
const dataset = reactive<any[][]>([]);

// 导出图片功能
const downloadImage = (fileName = "阳性率统计图") => {
  if (!lineChart) {
    console.error("图表实例不存在，无法导出");
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

    // 获取图表的base64图片URL
    const url = lineChart.getDataURL({
      type: "png",
      backgroundColor: "#ffffff",
      pixelRatio: 2, // 提高导出图片的分辨率
    });

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

// 准备echarts数据集
const prepareChartDataset = () => {
  // 检查数据是否为空
  if (!positiveChartData.value || positiveChartData.value.length === 0) {
    console.warn("No data provided to SampleLineChart");

    // 动态生成默认数据结构，基于chartOptions中的配置
    const defaultHeaderText = ["product", "默认时间"];
    const defaultRows = chartOptions.legendItems.map((item) => [item.name, 0]);

    // 更新本地数据集
    const newDataset = [defaultHeaderText, ...defaultRows];
    dataset.splice(0, dataset.length, ...newDataset);

    return newDataset;
  }

  // 准备表头: ['product', '2023年01月', '2023年02月', ...]
  // const header = ["product", ...positiveChartData.value.map((item) => item.time)];

  // 动态准备数据行
  const dataRows = chartOptions.legendItems.map((item) => {
    // 获取字段名
    const fieldName = item.field;

    // 生成该图例对应的数据行
    return [
      item.name,
      ...positiveChartData.value.map((dataItem) => dataItem[fieldName] || 0),
    ];
  });

  // 合并表头和数据行
  const newDataset = [...dataRows];

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

  // 准备数据集 - 即使不直接使用也要调用以保持dataset数据更新
  prepareChartDataset();

  // 获取当前维度的数据（默认第一个时间点）
  const currentIndex = 0;

  try {
    const {
      sampleNames,
      totalValues,
      positiveValues,
      positiveRates,
      colors,
      lightColors,
    } = getSampleTypeData(currentIndex);

    

    // 配置垂直柱状图选项
    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: (params: any) => {
          // 确保params是数组且有值
          if (!Array.isArray(params) || params.length === 0) return "";

          const categoryName = params[0].name;
          let totalValue = 0;
          let positiveValue = 0;
          let positiveRate = 0;

          // 找出总值和阳性值
          params.forEach((param) => {
            if (param.seriesName === "总量") {
              totalValue = param.value;
            } else if (param.seriesName === "阳性量") {
              positiveValue = param.value;
              // 找出对应的阳性率
              const index = sampleNames.indexOf(categoryName);
              if (index >= 0) {
                positiveRate = positiveRates[index];
              }
            }
          });
          const obj = [
            {
              name: "总量",
              key: "totalValue",
              value: totalValue,
              color: colors[0],
            },
            {
              name: "阳性量",
              key: "positiveValue",
              value: positiveValue,
              color: lightColors[0],
            },
            {
              name: "阳性率",
              key: "positiveRate",
              value: positiveRate,
              color: "#fff",
            },
          ];

          let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${categoryName}</div>`;
          obj.forEach((item) => {
            tooltipText += `<div style="display: flex; ${
              item.key === "positiveRate" ? "font-weight: bold;" : ""
            } align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;justify-content: space-between;">
    <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${
      item.color
    }; margin-right: 5px;"></span>
    <span style="flex: auto;">${item.name}: </span>
    <span>${item.value}${item.key === "positiveRate" ? "%" : ""}</span>
  </div>`;
          });

          return tooltipText;
        },
      },

      grid: {
        left: "3%",
        right: "4%",
        top: "30px",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: sampleNames,
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: "#ddd",
          },
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            type: "dashed",
            color: "#ddd",
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: "总量",
          type: "bar",
          barWidth: 20,
          barGap: "50%", // 柱间距离，调整为50%以获得更好的间距
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            // 使用对应的实心颜色
            color: (params) => {
              return colors[params.dataIndex];
            },
            // 添加圆角
            borderRadius: [2,2,0,0],
          },
          data: totalValues.map((v) => Math.round(v)),
        },
        {
          name: "阳性量",
          type: "bar",
          barWidth: 20,
          emphasis: {
            focus: "series",
          },
          itemStyle: {
            // 使用半透明颜色
            color: (params) => {
              return lightColors[params.dataIndex];
            },
            // 添加圆角
            borderRadius: 2,
          },
          data: positiveValues.map((v) => Math.round(v)),
          label: {
            show: true,
            position: "top",
            formatter: (params) => {
              // 找出对应的阳性率
              const rate = positiveRates[params.dataIndex];
              return rate + "%";
            },
          },
        },
      ] as echarts.SeriesOption[],
    };

    // 应用配置
    lineChart.setOption(option);

    // 设置事件处理函数
    setupChartEvents();
  } catch (error) {
    console.error("初始化图表失败:", error);
    // 显示错误状态
    if (lineChart) {
      lineChart.setOption({
        title: {
          text: "数据加载失败",
          left: "center",
          top: "center",
          textStyle: {
            color: "#999",
            fontSize: 14,
          },
        },
      });
    }
  }
};

// 处理窗口大小变化
const handleResize = () => {
  lineChart?.resize();
};

// 设置图表事件
const setupChartEvents = () => {
  if (!lineChart) return;

  // 点击事件
  lineChart.on("click", (params) => {
    // 发出维度变化事件
    emit("dimensionChange", params.dataIndex + 1);
  });
};

// 监听数据变化
watch(
  () => positiveChartData.value,
  () => {
    console.log("positiveChartData.value", positiveChartData.value);
    initLineChart();
  },
  { deep: true }
);

// 组件挂载时初始化图表
onMounted(() => {
  // 添加窗口大小变化事件监听
  window.addEventListener("resize", handleResize);

  // 初始化图表
  setTimeout(() => {
    initLineChart();
  }, 100);
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  // 移除窗口大小变化事件监听
  window.removeEventListener("resize", handleResize);

  // 销毁图表实例
  if (lineChart) {
    lineChart.dispose();
    lineChart = null;
  }
});

// 向父组件暴露方法
defineExpose({
  downloadImage,
});
</script>

<template>
  <div class="positive-line-chart">
    <div
      ref="chartRef"
      class="chart-container"
      :style="{ height: height || '400px' }"
    ></div>
  </div>
</template>

<style scoped>
.positive-line-chart {
  position: relative;
  width: 100%;
}

.chart-container {
  width: 100%;
  min-height: 300px;
}
</style> 