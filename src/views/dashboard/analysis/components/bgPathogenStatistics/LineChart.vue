<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue';
import { useECharts } from '@/hooks/web/useECharts';
import { SampleDataItem, sampleTypeOptions } from './data';

defineOptions({ name: 'BgPathogenLineChart' });

// 定义属性
const props = defineProps({
  loading: { type: Boolean },
  extractionBatch: { type: String, default: '' },
  libraryBatch: { type: String, default: '' },
  timeType: { type: String, default: 'month' },
  width: { type: String, default: '100%' },
  height: { type: String, default: '400px' },
});

// 图表引用和设置
const chartRef = ref<HTMLDivElement>();
const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

// 模拟样本数据
const mockSampleData: SampleDataItem[] = [
  { time: '2023-01', 'lung-lavage': 52, 'thyroid-nodule': 43, 'pleural': 38, 'other': 28 },
  { time: '2023-02', 'lung-lavage': 58, 'thyroid-nodule': 45, 'pleural': 40, 'other': 32 },
  { time: '2023-03', 'lung-lavage': 64, 'thyroid-nodule': 52, 'pleural': 42, 'other': 35 },
  { time: '2023-04', 'lung-lavage': 62, 'thyroid-nodule': 48, 'pleural': 45, 'other': 30 },
  { time: '2023-05', 'lung-lavage': 56, 'thyroid-nodule': 50, 'pleural': 39, 'other': 28 },
  { time: '2023-06', 'lung-lavage': 60, 'thyroid-nodule': 53, 'pleural': 41, 'other': 32 },
  { time: '2023-07', 'lung-lavage': 68, 'thyroid-nodule': 56, 'pleural': 48, 'other': 36 },
  { time: '2023-08', 'lung-lavage': 72, 'thyroid-nodule': 60, 'pleural': 52, 'other': 38 },
  { time: '2023-09', 'lung-lavage': 70, 'thyroid-nodule': 58, 'pleural': 50, 'other': 35 },
  { time: '2023-10', 'lung-lavage': 74, 'thyroid-nodule': 62, 'pleural': 53, 'other': 40 },
  { time: '2023-11', 'lung-lavage': 76, 'thyroid-nodule': 64, 'pleural': 55, 'other': 42 },
  { time: '2023-12', 'lung-lavage': 80, 'thyroid-nodule': 68, 'pleural': 58, 'other': 45 },
];

// 图表数据计算
const chartData = computed(() => {
  console.log(`准备时间序列图表数据: 提取试剂批次=${props.extractionBatch}, 建库试剂批次=${props.libraryBatch}, 时间类型=${props.timeType}`);
  
  const times = mockSampleData.map(item => item.time);
  const seriesData: any[] = [];
  
  // 根据筛选条件生成图表数据
  const hasBatchFilters = props.extractionBatch || props.libraryBatch;
  
  if (!hasBatchFilters) {
    // 没有批次筛选时显示所有系列
    const sampleTypeFields = ['lung-lavage', 'thyroid-nodule', 'pleural', 'other'];
    const colors = ['#5D9CEC', '#4FC1E9', '#A0D468', '#FFCE54'];
    
    sampleTypeFields.forEach((field, index) => {
      const option = sampleTypeOptions.value.find(opt => opt.value === field);
      const name = option?.label || field;
      
      seriesData.push({
        name,
        type: 'line',
        data: mockSampleData.map(item => item[field as keyof SampleDataItem]),
        itemStyle: { color: colors[index] },
        lineStyle: { width: 2 },
        symbol: 'circle',
        symbolSize: 6,
        smooth: true,
      });
    });
  } else {
    // 有批次筛选时显示筛选后的数据
    seriesData.push({
      name: '检出数量',
      type: 'line',
      data: mockSampleData.map(item => {
        // 模拟批次筛选，实际应该根据后端返回的数据处理
        const total = Object.values(item)
          .filter(val => typeof val === 'number')
          .reduce((sum, val) => sum + (val as number), 0) / 2;
          
        return Math.floor(total * 0.8); // 模拟筛选后的数据
      }),
      itemStyle: { color: '#5D9CEC' },
      lineStyle: { width: 3 },
      symbol: 'circle',
      symbolSize: 8,
      smooth: true,
    });
  }

  return {
    times,
    seriesData,
  };
});

// 初始化和更新图表
const initChart = () => {
  if (!chartRef.value) return;
  
  const { times, seriesData } = chartData.value;
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: seriesData.map(item => item.name),
      icon: 'rect',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 12,
      textStyle: {
        fontSize: 12,
        color: '#626262',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: times,
      axisLine: {
        lineStyle: {
          color: '#E0E0E0',
        },
      },
      axisLabel: {
        color: '#626262',
      },
    },
    yAxis: {
      type: 'value',
      name: '检出例数',
      nameTextStyle: {
        color: '#626262',
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#E0E0E0',
        },
      },
      splitLine: {
        lineStyle: {
          color: ['#E0E0E0'],
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#626262',
      },
    },
    series: seriesData,
  } as echarts.EChartsOption;
  
  setOptions(option);
};

// 监听变化并更新图表
watch(
  () => [props.extractionBatch, props.libraryBatch, props.timeType, props.loading],
  () => {
    initChart();
  },
  { deep: true }
);

// 组件挂载时初始化图表
onMounted(() => {
  initChart();
});
</script>

<template>
  <div ref="chartRef" :style="{ width, height }"></div>
</template> 