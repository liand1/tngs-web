<script lang="ts" setup>
import type { Ref } from "vue";
import { onMounted, ref, computed, watch } from "vue";
import { basicProps } from "../../props";
import { useECharts } from "@/hooks/web/useECharts";
// import { toolTipFormatter } from "../../../data";

const props = defineProps({
  ...basicProps,
  data: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});
const chartRef = ref<HTMLDivElement | null>(null);
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

const data = ref(props.data);

// 根据data长度创建空数组
const emptyLabels = computed(() => Array(data.value.length).fill(''));

// 生成图表配置的函数
const generateChartOptions = () => {
  return {
    xAxis: {
      type: "category",
      data: emptyLabels.value,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    series: {
      data: data.value,
      type: "bar",
      barWidth: 6,
      itemStyle: {
        color: 'rgba(64, 169, 255, 1)',
        borderRadius: [40, 40, 0, 0],
      },
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
    console.log("分析任务数据变化，重新渲染图表:", data.value);
    setOptions(generateChartOptions() as echarts.EChartsOption);
  },
  { deep: true }
);

onMounted(() => {
  console.log(data.value)
  setOptions(generateChartOptions() as echarts.EChartsOption);
});

// 提供给父组件调用的方法，更新图表数据
const setData = (newData: number[]) => {
  console.log("分析任务收到新数据:", newData);
  data.value = Array.isArray(newData) ? newData : [0, 0, 0, 0, 0];
};

defineExpose({
  setData,
});
</script>

<template>
  <div ref="chartRef" :style="{ height, width }" />
</template>
