<script lang="ts" setup>
import { Card, Segmented } from "ant-design-vue";
import { reactive, ref, onMounted } from "vue";
import { cardList } from "./data";
import { SegmentedValue } from "ant-design-vue/lib/segmented/src/segmented";
import CreateSample from "./echartTemplate/createSample.vue";
import CreateChip from "./echartTemplate/createChip.vue";
import CreateAnalysis from "./echartTemplate/createAnalysis.vue";
import CreateReport from "./echartTemplate/createReport.vue";
import { findBaseStats } from "@/api/lims/statscenter";
import { StatsBaseRespVO } from "@/api/lims/statscenter/model";

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

let allData: StatsBaseRespVO = {};

// 存储组件实例的Map
const chartInstances = ref(new Map());

// 存储组件实例的方法
const saveChartInstance = (el, index, chartType) => {
  if (el) {
    chartInstances.value.set(`${chartType}-${index}`, el);
  }
};

// 为每个卡片创建独立的状态
const timeRanges = reactive(cardList.value.map(() => 0));

// 内部加载状态
const isLoading = ref(true);

//0 是日  1 是月
const setCardData = (type: number) => {
  if (type === 0) {
    cardList.value[0].value = allData.ysampleBatchs || 0;
    cardList.value[0].count = allData.ysamples || 0;
    cardList.value[1].value = allData.ysocs || 0;
    cardList.value[2].value = allData.ytasks || 0;
    cardList.value[3].value = allData.ymakeReport || 0;
  } else if (type === 1) {
    cardList.value[0].value = allData.msampleBatchs || 0;
    cardList.value[0].count = allData.msamples || 0;
    cardList.value[1].value = allData.msocs || 0;
    cardList.value[2].value = allData.mtasks || 0;
    cardList.value[3].value = allData.mmakeReport || 0;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;

    allData = await findBaseStats();

    setCardData(0);

    cardList.value[0].data = Object.values(allData.batchSampleMap || {});
    cardList.value[1].data = Object.values(allData.socMap || {});
    cardList.value[2].data = Object.values(allData.taskMap || {});
    cardList.value[3].data = Object.values(allData.makeReportMap || {});

    cardList.value[0].dataTime = Object.keys(allData.batchSampleMap || {});
    cardList.value[1].dataTime = Object.keys(allData.socMap || {});
    cardList.value[2].dataTime = Object.keys(allData.taskMap || {});
    cardList.value[3].dataTime = Object.keys(allData.makeReportMap || {});

    // 确保每个卡片都有初始数据
    // cardList.value.forEach((item) => {
    //   if (!item.data || item.data.length === 0) {
    //     // 设置默认数据，避免图表组件报错
    //     item.data = [30, 40, 50, 60, 70, 80, 90];
    //   }
    // });

    // // 先获取所有卡片的初始数据
    // const dataPromises = cardList.value.map((item, index) =>
    //   fetchData(item.chart, timeRanges[index])
    // );

    // // 等待所有数据加载完成
    // const results = await Promise.all(dataPromises);

    // // 更新数据
    // cardList.value.forEach((item, index) => {
    //   item.data = results[index];
    // });

    // // 等待DOM更新
    // await nextTick();

    // 手动更新所有图表
    setTimeout(() => {
      cardList.value.forEach((item, index) => {
        const chartKey = `${item.chart}-${index}`;
        const chartInstance = chartInstances.value.get(chartKey);
        if (chartInstance && chartInstance.setData) {
          chartInstance.setData(item.data);
          console.log(`初始化图表 ${chartKey} 完成`, item.data);
        }
      });

      isLoading.value = false;
    }, 100);
  } catch (error) {
    console.error("初始化卡片数据失败:", error);
    isLoading.value = false;
  }
});

const handleChange = async (
  value: SegmentedValue,
  index: number,
  _: string
) => {
  try {
    if (index === 0) {
      cardList.value[0].value =
        value === 0 ? allData.ysampleBatchs || 0 : allData.msampleBatchs || 0;
      cardList.value[0].count =
        value === 0 ? allData.ysamples || 0 : allData.msamples || 0;
    } else if (index === 1) {
      cardList.value[1].value =
        value === 0 ? allData.ysocs || 0 : allData.msocs || 0;
    } else if (index === 2) {
      cardList.value[2].value =
        value === 0 ? allData.ytasks || 0 : allData.mtasks || 0;
    } else if (index === 3) {
      cardList.value[3].value =
        value === 0 ? allData.ymakeReport || 0 : allData.mmakeReport || 0;
    }

    // 获取数据
    // const data = await fetchData(chartType, value as number);
    // cardList.value[index].data = data;
    // 获取对应的图表实例
    // const chartKey = `${chartType}-${index}`;
    // const chartInstance = chartInstances.value.get(chartKey);
    // console.log(`正在更新${chartKey}图表数据:`, data);
    // // 更新图表数据
    // if (chartInstance && chartInstance.setData) {
    //   await nextTick();
    //   chartInstance.setData(data);
    // } else {
    //   // console.warn(`找不到图表实例: ${chartKey}`);
    // }
    // console.log(
    //   `卡片${index + 1}的时间范围变更为:`,
    //   value === 0 ? "昨日" : "本月"
    // );
  } catch (error) {
    console.error("更新图表数据失败:", error);
  }
};
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div
      v-for="(item, index) in cardList"
      :key="index"
      class="card-item flex-1 min-w-64"
    >
      <Card
        :title="item.title"
        :loading="props.loading || isLoading"
        :bordered="false"
        class="h-full shadow-sm"
      >
        <template #extra>
          <div class="segmented-container">
            <Segmented
              v-model:value="timeRanges[index]"
              @change="(value) => handleChange(value, index, item.chart)"
              size="small"
              :options="[
                { value: 0, label: item.yesterday },
                { value: 1, label: item.month },
              ]"
            />
          </div>
        </template>

        <div class="flex justify-between">
          <div class="data-value" style="align-content: end">
            <span style="font-size: 30px">{{ item.value }}</span>
            <span class="text-base ml-1" style="font-size: 14px">{{
              item.unit
            }}</span>
            <template v-if="item.count">
              <span
                class="text-base ml-1"
                style="margin-left: 10px; font-size: 14px"
                >共</span
              >
              <span style="font-size: 30px">{{ item.count }}</span>
              <span class="text-base ml-1" style="font-size: 14px">条</span>
            </template>
          </div>

          <div class="chart-container">
            <template v-if="item.chart === 'createSample'">
              <CreateSample
                :data="item.data"
                :height="'60px'"
                :ref="(el) => saveChartInstance(el, index, 'createSample')"
              />
            </template>
            <template v-else-if="item.chart === 'createChip'">
              <CreateChip
                :data="item.data"
                :height="'60px'"
                :ref="(el) => saveChartInstance(el, index, 'createChip')"
              />
            </template>
            <template v-else-if="item.chart === 'createAnalysis'">
              <CreateAnalysis
                :data="item.data"
                :height="'60px'"
                :ref="(el) => saveChartInstance(el, index, 'createAnalysis')"
              />
            </template>
            <template v-else-if="item.chart === 'createReport'">
              <CreateReport
                :data="item.data"
                :height="'60px'"
                :ref="(el) => saveChartInstance(el, index, 'createReport')"
              />
            </template>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card-item {
  .chart-container {
    display: flex;
    align-items: flex-end;
    width: 140px;
    height: 64px;
  }
}

.segmented-container {
  :deep(.ant-segmented) {
    background-color: #f5f5f5;

    .ant-segmented-item-selected {
      background-color: #fff;
    }
  }
}
</style>
