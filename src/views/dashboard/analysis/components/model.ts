import type { PropType } from 'vue';
import type { Dayjs } from 'dayjs';

// 基础图表属性接口
export interface BasicProps {
  width: string;
  height: string;
}

// 基础图表属性配置
export const basicProps = {
  width: {
    type: String as PropType<string>,
    default: '100%',
  },
  height: {
    type: String as PropType<string>,
    default: '280px',
  },
};

// 时间范围类型定义
export type TimeRangeType = 'all' | 'month' | 'day' | 'year';

// 科室/主题/医生筛选值接口
export interface FilterValues {
  checkType: number | null;
  department: string;
  subject: string;
  doctor: string;
}

// 提取试剂和建库试剂筛选接口
export interface BatchFilterValues {
  extractionBatch: string;
  libraryBatch: string;
}

// 图表日期范围类型
export type DateRangeType = [string, string];
export type DayjsDateRangeType = [Dayjs, Dayjs];

// 结果类型
export type ResultType = 'positive' | 'suspected' | 'all';

// 样本类型
export type SampleType = 'all' | string;
