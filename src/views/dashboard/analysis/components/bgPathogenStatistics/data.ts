import { ref } from 'vue';
import { TimeRangeType } from '../model';
import { findWaterPathogenStatsByTime } from '@/api/lims/statscenter';
import { Dayjs } from 'dayjs';
import { processDateRangeByTimeType } from '@/utils/custom';

export interface SampleDataItem {
  time: string;
  'lung-lavage': number;
  'thyroid-nodule': number;
  'pleural': number;
  'other': number;
}

export interface PieChartItem {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

export interface ChartOptions {
  colors: string[];
  legendItems: {
    name: string;
    color: string;
    field: string;
  }[];
}

// 病原体数据项接口
export interface PathogenDataItem {
  name: string;        // 病原体名称
  value: number;       // 检出数量
  reportCount: number; // 样本总数量
  outRatio: number;    // 占比
}

// 筛选项接口
export interface FilterOption {
  label: string;
  value: string;
}

// 样本类型选项
export const sampleTypeOptions = ref<FilterOption[]>([
  { label: '全部样本', value: 'all' },
  { label: '肺泡灌洗液', value: 'lung-lavage' },
  { label: '甲状腺', value: 'thyroid-nodule' },
  { label: '胸液', value: 'pleural' },
  { label: '其他样本', value: 'other' }
]);

// 背景病原体图表数据
export const bgPathogenChartData = ref<PathogenDataItem[]>([
  { name: '人鼻疹病毒(HRV)', value: 580 },
  { name: '人博卡病毒(HBoV)', value: 520 },
  { name: '人巨细胞病毒(HCMV)', value: 480 },
  { name: '腺病毒(AdV)', value: 420 },
  { name: '副流感病毒1-4型(PIV1-4)', value: 380 },
  { name: '肺炎支原体(MP)', value: 340 },

]);

// 筛选数据的函数
export function filterBgPathogenData(
  requestData: PathogenDataItem[],
  extractionBatch: string = '',
  libraryBatch: string = '',
  timeType: TimeRangeType = 'all',
  dateRange?: [Dayjs, Dayjs]
): PathogenDataItem[] {
  // 输出筛选条件
  // console.log(`筛选背景病原体数据: 提取试剂批次=${extractionBatch}, 建库试剂批次=${libraryBatch}, 时间类型=${timeType}`);
  if (dateRange && dateRange.length === 2) {
    console.log(`日期范围: ${dateRange[0]} 至 ${dateRange[1]}`);
  }

  // 对时间范围进行处理
  let startDate = new Date(2023, 0, 1);
  let endDate = new Date(2023, 11, 31);

  if (dateRange && dateRange.length === 2) {
    startDate = dateRange[0].toDate();
    endDate = dateRange[1].toDate();
  }

  // 根据时间类型调整数据
  let timeFilterFactor = 1;
  if (timeType === 'month') {
    timeFilterFactor = 0.8 + Math.random() * 0.4; // 月度数据随机波动
  } else if (timeType === 'year') {
    timeFilterFactor = 0.9 + Math.random() * 0.2; // 年度数据稍微波动
  }

  // 创建一个新的数组，包含筛选后的数据和根据时间调整的值
  const filteredData = requestData.map(item => {
    // 复制原始数据
    const newItem = { ...item };

    // 根据时间参数调整数值（模拟不同时间段的数据量变化）
    if (timeType !== 'all') {
      newItem.value = Math.round(item.value * timeFilterFactor);
    }

    return newItem;
  }).sort((a, b) => b.value - a.value); // 按数量从大到小排序

  return filteredData;
}

// 获取样本类型的中文名称
function getSampleTypeName(value: string): string {
  const option = sampleTypeOptions.value.find(opt => opt.value === value);
  return option ? option.label : '';
}

// 获取符合条件的前20个背景病原体
export async function getBgPathogenData(
  checkType: number | null,
  extractionBatch: string = '',
  libraryBatch: string = '',
  timeType: TimeRangeType = 'all',
  dateRange?: [Dayjs, Dayjs]
): Promise<PathogenDataItem[]> {
  // 获取数据
  // const requestData = await fetchBgPathogenData(extractionBatch, libraryBatch, timeType, dateRange);


  // bgPathogenChartData.value
  const { startTime, endTime } = processDateRangeByTimeType(timeType, dateRange);

  const requestData = await findWaterPathogenStatsByTime({
    checkType: checkType,
    startTime: startTime,
    endTime: endTime,
    getLrBatch: extractionBatch,
    putLrBatch: libraryBatch
  })

  bgPathogenChartData.value = []
  requestData.forEach(item => {
    bgPathogenChartData.value.push({
      name: item.pathogenCnSname!,
      value: item.outCount!,
      reportCount: item.reportCount!,
      outRatio: item.outRatio!
    })
  })
  // 过滤数据
  const filteredData = filterBgPathogenData(bgPathogenChartData.value, extractionBatch, libraryBatch, timeType, dateRange);

  // 返回前20条数据
  return filteredData;
} 