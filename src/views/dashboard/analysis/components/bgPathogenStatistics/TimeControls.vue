<script lang="ts" setup>
import { ref, watch } from "vue";
import { DatePicker, Segmented } from "ant-design-vue";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { getDateFormat, getPlaceholder, getPickerType } from "../index";
import { TimeRangeType } from "../model";

// 定义组件属性
const props = defineProps<{
  initialTimeType?: TimeRangeType;
  initialDateRange?: [Dayjs, Dayjs];
}>();

// 定义组件事件
const emit = defineEmits<{
  (
    e: "update:time-type",
    value: TimeRangeType,
    dateRange: [Dayjs, Dayjs]
  ): void;
  (e: "update:date-range", dates: [Dayjs, Dayjs]): void;
}>();

// 当前选择的时间范围类型
const timeType = ref<TimeRangeType>(props.initialTimeType || "all");
// 当前选择的日期范围
const dateRange = ref<[Dayjs, Dayjs]>(props.initialDateRange || [ dayjs(`2025-01-01`), dayjs()]);

// 分段选择器选项
const timeTypeOptions = [
  { label: "全部", value: "all" },
  { label: "本年", value: "year" },
  { label: "本月", value: "month" },
];

// 初始化日期范围（如果未提供）
if (!dateRange.value) {
  const currentYear = new Date().getFullYear();
  dateRange.value = [
    dayjs(`2025-01-01`),
    dayjs(`${currentYear}-12-31`),
  ];
}

// 禁用超出范围的日期
const disabledDate = (current: Dayjs) => {
  const today = dayjs().endOf("day");
  // 不能选择未来的日期
  return current && current > today;
};

// 处理时间类型变化
const handleTimeTypeChange = (value: string) => {
  timeType.value = value as "all" | "month" | "year";

  // 根据时间类型自动调整日期范围
  if (timeType.value === "all") {
    // 设置为当前年的全年
    const allRange: [Dayjs, Dayjs] = [dayjs("2025-01-01"), dayjs()];
    dateRange.value = allRange;
    
  } else if (timeType.value === "year") {
    // 设置为当前年
    const currentYear = dayjs().year();
    dateRange.value = [
      dayjs(`${currentYear}-01-01`),
      dayjs(`${currentYear}-12-31`),
    ];
  } else if (timeType.value === "month") {
    // 设置为当前月
    const now = dayjs();
    dateRange.value = [now.startOf("month"), now.endOf("month")];
  }

  emit("update:time-type", timeType.value, dateRange.value);
};

// 处理日期范围变化
const handleDateRangeChange = (dates: [Dayjs, Dayjs] | [string, string]) => {
  if (dates && dates.length === 2) {
    dateRange.value = dates as [Dayjs, Dayjs];
    emit("update:date-range", dates as [Dayjs, Dayjs]);
  }
};

// 监听属性变化
watch(
  () => props.initialTimeType,
  (newValue) => {
    if (newValue && newValue !== timeType.value) {
      timeType.value = newValue;
    }
  }
);

watch(
  () => props.initialDateRange,
  (newValue) => {
    if (
      newValue &&
      (!dateRange.value ||
        !dateRange.value[0].isSame(newValue[0]) ||
        !dateRange.value[1].isSame(newValue[1]))
    ) {
      dateRange.value = newValue;
    }
  }
);
</script>

<template>
  <div class="time-controls">
    <div class="time-type-selector">
      <Segmented
        v-model:value="timeType"
        :options="timeTypeOptions"
        @change="handleTimeTypeChange"
      />
    </div>

    <div class="date-picker-wrapper">
      <DatePicker.RangePicker
        v-model:value="dateRange"
  
        :placeholder="getPlaceholder(timeType)"
   
        :disabled-date="disabledDate"
        @change="handleDateRangeChange"
        :allowClear="false"
        :disabled="timeType === 'all'"
        class="date-range-picker"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.time-controls {
  display: flex;
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }

  .time-type-selector {
    margin-right: 4px;
  }

  .date-picker-wrapper {
    .date-range-picker {
      width: 240px;
    }
  }
}
</style> 