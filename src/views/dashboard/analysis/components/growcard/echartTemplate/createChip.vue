<script lang="ts" setup>
import type { Ref } from "vue";
import { onMounted, ref, computed, watch } from "vue";
import { basicProps } from "../../props";
import { useECharts } from "@/hooks/web/useECharts";
import * as echarts from 'echarts';
// import { toolTipFormatter } from "../../../data";

const props = defineProps({
  ...basicProps,
  data: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions, getInstance } = useECharts(chartRef as Ref<HTMLDivElement>);

const data = ref(props.data || [30, 40, 50, 60, 70, 80, 90]);

// 根据data长度创建空数组
const emptyLabels = computed(() => Array(data.value.length).fill(""));

// 生成图表配置的函数
const generateChartOptions = () => {
  return {
    xAxis: {
      type: "category",
      data: emptyLabels.value,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    series: {
      name: "Line 1",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "#86DF6C",
          },
          {
            offset: 1,
            color: "#86DF6C",
          },
        ]),
      },
      emphasis: {
        focus: "series",
      },
      data: data.value,
    },
    // tooltip: {
    //   trigger: "axis",
    //   axisPointer: {
    //     type: "shadow",
    //   },
    //   formatter: (params: any) => toolTipFormatter(params),
    // },
  };
};

// 监听data变化，重新渲染图表
watch(
  data,
  () => {
    console.log("芯片数据变化，重新渲染图表:", data.value);
    setOptions(generateChartOptions() as echarts.EChartsOption);
  },
  { deep: true }
);

// 监听props.data变化
watch(
  () => props.data,
  (newData) => {
    if (newData && newData.length > 0) {
      console.log("芯片props数据变化:", newData);
      data.value = [...newData];
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  console.log("createChip mounted, data:", data.value);
  // 给DOM渲染留出一点时间
  setTimeout(() => {
    setOptions(generateChartOptions() as echarts.EChartsOption);
    // 强制重绘
    const chartInstance = getInstance();
    if (chartInstance) {
      chartInstance.resize();
    }
  }, 50);
});

// 提供给父组件调用的方法，更新图表数据
const setData = (newData: number[]) => {
  // console.log("芯片收到新数据:", newData);
  data.value = Array.isArray(newData) ? newData : [0, 0, 0, 0, 0];
};

defineExpose({
  setData,
});
</script>

<template>
  <div ref="chartRef" :style="{ height, width }" />
</template>
