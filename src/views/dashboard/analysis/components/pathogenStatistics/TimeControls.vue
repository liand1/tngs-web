<script lang="ts" setup>
import { ref, watch } from "vue";
import { Segmented, DatePicker } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { getDateFormat, getPlaceholder, getPickerType } from "../index";
import type { TimeRangeType } from "../model";

// 定义组件属性
const props = defineProps<{
  initialTimeType: TimeRangeType;
  initialDateRange: [Dayjs, Dayjs];
}>();

// 定义事件
const emit = defineEmits<{
  (e: "update:timeType", value: TimeRangeType,range: [Dayjs, Dayjs]): void;
  (e: "update:dateRange", range: [Dayjs, Dayjs]): void;
}>();

// 时间选择类型
const timeType = ref<TimeRangeType>(props.initialTimeType || "all");

// 日期范围
const dateRange = ref<[Dayjs, Dayjs]>(props.initialDateRange || [dayjs(`2025-01-01`), dayjs()]);

// 分段选择器选项
const timeTypeOptions = [
  { label: "全部", value: "all" },
  { label: "本年", value: "year" },
  { label: "本月", value: "month" },
];

// 处理时间类型变化
const handleTimeTypeChange = (value: TimeRangeType) => {
  timeType.value = value;

  // 如果选择了"全部"，更新日期范围为全部时间
  if (timeType.value === "all") {
    // 假设全部时间是从2025-01-01到现在
    const allRange: [Dayjs, Dayjs] = [dayjs("2025-01-01"), dayjs()];
    dateRange.value = allRange;
    emit("update:dateRange", allRange);
  }
  // 如果选择了"本年"，设置日期范围为当前年
  else if (timeType.value === "year") {
    const currentYear = dayjs().year();
    const yearStart = dayjs(`${currentYear}-01-01`);
    const yearEnd = dayjs(`${currentYear}-12-31`);

    dateRange.value = [yearStart, yearEnd];

    // emit("update:dateRange", dateRange.value);
  }
  // 如果选择了"本月"，设置日期范围为当前月
  else if (timeType.value === "month") {
    const now = dayjs();
    const monthStart = now.startOf("month");
    const monthEnd = now.endOf("month");

    dateRange.value = [monthStart, monthEnd];
    // emit("update:dateRange", dateRange.value);
  }

  emit("update:timeType", timeType.value,dateRange.value);
};

// 处理日期范围变化
const handleDateRangeChange = (dates: [Dayjs, Dayjs]) => {
  if (dates && dates.length === 2) {
    dateRange.value = dates;
    emit("update:dateRange", dateRange.value);
  }
};

// 监视初始时间类型变化
watch(
  () => props.initialTimeType,
  (newType) => {
    if (newType && newType !== timeType.value) {
      timeType.value = newType;
    }
  }
);

// 监视初始日期范围变化
watch(
  () => props.initialDateRange,
  (newRange) => {
    if (newRange && newRange.length === 2) {
      // 只有在新日期范围与当前不同时才更新
      const currentStart = dateRange.value[0].format("YYYY-MM-DD");
      const currentEnd = dateRange.value[1].format("YYYY-MM-DD");
      const newStart = newRange[0].format("YYYY-MM-DD");
      const newEnd = newRange[1].format("YYYY-MM-DD");

      if (currentStart !== newStart || currentEnd !== newEnd) {
        dateRange.value = newRange;
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="time-controls">
    <!-- 时间粒度选择 -->
    <div class="time-type-selector">
      <Segmented
        v-model:value="timeType"
        :options="timeTypeOptions"
        @change="handleTimeTypeChange"
      />
    </div>

    <!-- 日期选择器 -->
    <div class="date-picker-wrapper">
      <DatePicker.RangePicker
        v-model:value="dateRange"
     
        :placeholder="getPlaceholder(timeType)"
        @change="handleDateRangeChange"
 
        :allow-clear="false"
        :disabled="timeType === 'all'"
        class="date-range-picker"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.time-controls {
  display: flex;
  align-items: center;

  .time-type-selector {
    margin-right: 16px;
  }

  .date-picker-wrapper {
    .date-range-picker {
      width: 240px;
    }
  }
}
</style> 