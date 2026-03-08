<template>
  <div class="bg-pathogen-statistics">
    <div class="header">
      <h2 class="title">背景病原体</h2>
      <TimeControls 
        v-model:time-type="timeType" 
        v-model:date-range="dateRange" 
      />
    </div>
    
    <FilterOptions 
      v-model:extractionBatch="extractionBatch"
      v-model:libraryBatch="libraryBatch"
    />
    
    <!-- 图表容器 -->
    <div class="charts-container">
      <!-- 条形图 -->
      <a-card title="背景病原体 Top 20" :loading="loading">
        <PathogenBarChart 
          :extractionBatch="extractionBatch"
          :libraryBatch="libraryBatch"
          :timeType="timeType"
          :dateRange="dateRangeStrings"
        />
      </a-card>
      
      <!-- 折线图 -->
      <a-card title="背景病原体趋势" :loading="loading">
        <LineChart 
          :extractionBatch="extractionBatch"
          :libraryBatch="libraryBatch"
          :timeType="timeType"
        />
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import TimeControls from './TimeControls.vue';
import FilterOptions from './FilterOptions.vue';
import PathogenBarChart from './PathogenBarChart.vue';
import LineChart from './LineChart.vue';

// 组件名称定义
defineOptions({
  name: 'BgPathogenStatistics',
});

// 数据加载状态
const loading = ref(false);

// 筛选条件
const extractionBatch = ref("");
const libraryBatch = ref("");
const timeType = ref<'all' | 'month' | 'year'>('all');
const dateRange = ref<[any, any]>([null, null]);

// 将日期对象转换为字符串数组
const dateRangeStrings = computed(() => {
  if (!dateRange.value || !dateRange.value[0] || !dateRange.value[1]) {
    return undefined;
  }
  
  return [
    dateRange.value[0].format('YYYY-MM-DD'),
    dateRange.value[1].format('YYYY-MM-DD')
  ];
});
</script>

<style scoped lang="less">
.bg-pathogen-statistics {
  width: 100%;
  
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    
    .title {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }
  }
  
  .charts-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
    
    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  }
}
</style> 