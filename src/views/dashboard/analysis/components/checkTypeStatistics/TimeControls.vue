<script lang="ts" setup>
import { DatePicker, Segmented } from "ant-design-vue";
import { ref, watch } from "vue";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { getDateFormat } from "../index";
import type { TimeRangeType } from "../model";

const { RangePicker } = DatePicker;

// 定义组件属性
const props = defineProps<{
  initialTimeType?: TimeRangeType;
  initialDateRange?: [Dayjs, Dayjs];
  dateRange?: [string, string]; // 从父组件传入的图表拖拽日期范围
}>();

// 定义事件
const emit = defineEmits<{
  (e: "update:timeType", value: TimeRangeType): void;
  (e: "update:dateRange", dates: [Dayjs, Dayjs]): void;
}>();

// 时间范围类型选择
const timeType = ref<TimeRangeType>(props.initialTimeType || "day");

// 时间范围选项
const timeOptions = [
  { value: "day", label: "天" },
  { value: "month", label: "月" },
];

// 日期范围
const dateRangeValue = ref<[Dayjs, Dayjs]>(
  props.initialDateRange || [dayjs(), dayjs().add(1, "month")]
);

// 处理时间类型变化
const handleTimeTypeChange = (value: TimeRangeType) => {
  timeType.value = value;
  emit("update:timeType", value);
};

// 处理日期范围变化
const handleDateRangeChange = (dates: [Dayjs, Dayjs]) => {
  dateRangeValue.value = dates;
  emit("update:dateRange", dates);
};

// 处理月份范围变化（从图表拖拽）
const handleMonthRangeChange = (monthRange: [string, string]) => {
  // 提取年月信息 - 格式如 "2023年01月"
  const startMonthMatch = monthRange[0].match(/(\d+)年(\d+)月/);
  const endMonthMatch = monthRange[1].match(/(\d+)年(\d+)月/);

  if (startMonthMatch && endMonthMatch) {
    const startYear = parseInt(startMonthMatch[1]);
    const startMonth = parseInt(startMonthMatch[2]);
    const endYear = parseInt(endMonthMatch[1]);
    const endMonth = parseInt(endMonthMatch[2]);

    // 创建对应的日期对象
    const startDate = dayjs(
      `${startYear}-${startMonth.toString().padStart(2, "0")}-01`
    );

    // 计算结束日期（月末）
    let endDate;
    if (endMonth === 12) {
      endDate = dayjs(`${endYear}-12-31`);
    } else {
      // 下个月的第一天减去一天
      endDate = dayjs(
        `${endYear}-${(endMonth + 1).toString().padStart(2, "0")}-01`
      ).subtract(1, "day");
    }

    // 更新日期选择器
    if (startDate.isValid() && endDate.isValid()) {
      dateRangeValue.value = [startDate, endDate];
      // console.log(
      //   "月份范围已更新:",
      //   startDate.format("YYYY-MM-DD"),
      //   endDate.format("YYYY-MM-DD")
      // );
    }
  } else {
    console.error("无法解析月份范围:", monthRange);
  }
};

// 处理天范围变化（从图表拖拽）
const handleDayRangeChange = (dayRange: [string, string]) => {
  console.log("dayRange", dayRange);


  // 日期格式为 "2023年12月01日"，需要解析为日期对象

  // 尝试解析日期 - 提取年月日信息
  const parseDate = (dateStr: string): Dayjs | null => {
    // 匹配 "2023年12月01日" 格式
    const fullDateMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
    if (fullDateMatch) {
      const year = parseInt(fullDateMatch[1]);
      const month = parseInt(fullDateMatch[2]);
      const day = parseInt(fullDateMatch[3]);
      return dayjs(
        `${year}-${month.toString().padStart(2, "0")}-${day
          .toString()
          .padStart(2, "0")}`
      );
    } else {
      // 尝试直接作为日期解析
      const date = dayjs(dateStr);
      return date.isValid() ? date : null;
    }
  };

  const startDate = parseDate(dayRange[0]);
  const endDate = parseDate(dayRange[1]);

  if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
    dateRangeValue.value = [startDate, endDate];
    // console.log(
    //   "解析后的日期范围:",
    //   startDate.format("YYYY-MM-DD"),
    //   endDate.format("YYYY-MM-DD")
    // );
  } else {
    
    console.error("无法解析日期范围:", dayRange);
  }
};

// 监听父组件传入的dateRange变化
watch(
  () => props.dateRange,
  (newRange) => {
    if (newRange && newRange.length === 2 && newRange[0] && newRange[1]) {
      console.log(
        "接收到图表拖拽更新的日期范围:",
        newRange,
        "当前时间类型:",
        timeType.value
      );
      // 根据当前的时间类型处理日期范围
      if (timeType.value === "month") {
        // 处理月份数据，如"2023年01月", "2023年02月"
        handleMonthRangeChange(newRange);
      } else {
        // 处理天数据，如"2023年12月01日", "2023年12月15日"
        handleDayRangeChange(newRange);
      }
    }
  },
  { deep: true }
);

// 初始化时应用初始日期范围
watch(
  () => props.initialDateRange,
  (newRange) => {
    if (newRange && newRange.length === 2) {
      dateRangeValue.value = newRange;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="time-controls">
    <Segmented
      v-model:value="timeType"
      :options="timeOptions"
      @change="handleTimeTypeChange"
    />

    <RangePicker
      class="date-picker"
      v-model:value="dateRangeValue"
      @change="handleDateRangeChange"
      :format="getDateFormat(timeType)"
      :placeholder="['起始日期', '结束日期']"
      :allowClear="false"
    />
  </div>
</template>

<style scoped lang="less">
.time-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.date-picker {
  width: 280px;
}
</style> 