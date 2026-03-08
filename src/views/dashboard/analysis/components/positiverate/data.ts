import { ref } from 'vue';
import { TimeRangeType } from '../model';
import { findPathogenPositiveRateByTime } from '@/api/lims/statscenter';
import { Dayjs } from 'dayjs';
import { PositiveRateStatsRespVO } from '@/api/lims/statscenter/model';
import { processDateRangeByTimeType } from '@/utils/custom';

export interface SampleDataItem {
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

export interface PositiveChartDataItem {
  name: string;
  color: string;
  field: string;
  positiveRate: number; // 阳性数量
  allPositiveRate: number; // 总体阳性数量
  positiveCount: number; // 阳性数量
  lightColor: string; // 浅色（用于半透明效果）
  // data: {
  //   all: { time: string; value: number }[]; // 全部时间数据
  //   month: { time: string; value: number }[];
  //   year: { time: string; value: number }[];
  // };
}

// 新数据模型 - 更灵活的数据结构
export const positiveChartData = ref<PositiveChartDataItem[]>([
]);

// 当前选中月份数据
export const currentMonthData = ref({
  time: '2025年12月',
  data: [
    { name: '肺泡灌洗液', value: 391 },
    { name: '甲状腺', value: 321 },
    { name: '胸液', value: 234 },
    { name: '其他', value: 78 }
  ],
  total: 1024
});

// 设置过滤条件
export const filterOptions = {
  departments: [
    { label: '全部科室', value: 'all' },
    { label: '呼吸科', value: 'respiratory' },
    { label: '内科', value: 'internal' },
    { label: '外科', value: 'surgery' }
  ],
  subjects: [
    { label: '全部科目', value: 'all' },
    { label: '肺部', value: 'lung' },
    { label: '甲状腺', value: 'thyroid' },
    { label: '胸腔', value: 'chest' }
  ],
  doctors: [
    { label: '全部医师', value: 'all' },
    { label: '张医生', value: 'zhang' },
    { label: '李医生', value: 'li' },
    { label: '王医生', value: 'wang' }
  ]
};


// 导出颜色和图例项配置，从positiveChartData动态生成
export const getChartOptions = (): ChartOptions => {
  return {
    colors: positiveChartData.value.map(item => item.color),
    legendItems: positiveChartData.value.map(item => ({
      name: item.name,
      color: item.color,
      field: item.field
    }))
  };
};

// 获取样本数据
export async function fetchSampleData(params: {

  department?: string;
  subject?: string;
  doctor?: string;
  timeType?: TimeRangeType;
}) {
  // 解构参数
  const { department, subject, doctor, timeType = 'month' } = params;
  const data = await requestData(department, subject, doctor, timeType)
  console.log('fetchSampleData 调用，参数:', params);

  // 这里可以添加实际API调用逻辑，现在返回转换后的样本数据
  // const result = convertToSampleDataItems(data, timeType);
  // console.log('fetchSampleData 结果:', result);
  return data;
}


export async function requestData(checkType?: number | null, department?: string, subject?: string, doctor?: string, timeType?: TimeRangeType, dateRange?: [Dayjs, Dayjs]) {

  console.log('requestData 调用，参数:', department, subject, doctor, timeType, dateRange);

  // 使用提取的工具函数处理时间范围
  const { startTime, endTime } = processDateRangeByTimeType(timeType, dateRange);


  const result = await findPathogenPositiveRateByTime({
    checkType: checkType,
    startTime: startTime,
    endTime: endTime,
    subHospital: department || "",
    subRoom: subject || "",
    subDoctor: doctor || ""
  })

  // result 转 positiveChartData
  positiveChartData.value = convertResultToPositiveChartData(result)

  console.log('positiveChartData', positiveChartData.value)


  return positiveChartData.value
}

function convertResultToPositiveChartData(result: PositiveRateStatsRespVO[]): PositiveChartDataItem[] {
  const sampleTypeMap = {
    0: { name: "其他", color: "#EFD864", field: "other", lightColor: "#FFFBE6" },
    1: { name: "肺泡灌洗液", color: "#F5515F", field: "lung-lavage", lightColor: "#FFEDED" },
    2: { name: "痰液", color: "#5D9CEC", field: "thyroid-nodule", lightColor: "#EBF5FF" },
    3: { name: "鼻/咽拭子", color: "#5ECC7F", field: "pleural", lightColor: "#E4F9EB" },
    4: { name: "水控", color: "#A084E8", field: "water-control", lightColor: "#F3F0FF" }
  };

  return (result || []).map(item => {
    const typeKey = typeof item.sampleType === 'number' ? item.sampleType : 0;
    const meta = sampleTypeMap[typeKey as keyof typeof sampleTypeMap] || sampleTypeMap[0];
    return {
      name: meta.name,
      color: meta.color,
      field: meta.field,
      positiveRate: (item.positiveRatio ?? 0) * 100,
      allPositiveRate: item.totalCount ?? 0,
      lightColor: meta.lightColor,
      positiveCount: item.positiveCount ?? 0
    };
  });
}


// 获取总体阳性率
export function getTotalPositiveRate(data: PositiveChartDataItem[]): number {
  // 计算各类型总量和阳性量
  let totalSamples = 0;
  let totalPositiveSamples = 0;

  data.forEach(item => {
    // 假设每个类型的全部时间数据在data.all[0]
    const totalValue = item.allPositiveRate;
    totalSamples += totalValue;

    // 根据阳性率计算阳性样本数量
    const positiveValue = totalValue * (item.positiveRate / 100);
    totalPositiveSamples += positiveValue;
  });

  // 计算总体阳性率（保留一位小数）
  const totalPositiveRate = totalPositiveSamples / totalSamples * 100
  if (totalSamples === 0) {
    return 0;
  }

  return Math.round(totalPositiveRate);
}

// 获取特定时间点的样本类型数据
export function getSampleTypeData(timeIndex: number = 0): {
  sampleNames: string[];
  totalValues: number[];
  positiveValues: number[];
  positiveRates: number[];
  colors: string[];
  lightColors: string[];
} {


  // 初始化返回对象
  const result = {
    sampleNames: [] as string[],
    totalValues: [] as number[],
    positiveValues: [] as number[],
    positiveRates: [] as number[],
    colors: [] as string[],
    lightColors: [] as string[]
  };

  // 为每个类型填充数据
  positiveChartData.value.forEach(item => {
    // 检查是否有对应的数据


    // 添加样本名称
    result.sampleNames.push(item.name);

    // 添加颜色
    result.colors.push(item.color);
    result.lightColors.push(item.lightColor);

    // 添加阳性率
    result.positiveRates.push(parseInt(item.positiveRate.toString()));

    // 获取总量
    const totalValue = item.allPositiveRate;
    result.totalValues.push(totalValue);

    // 根据阳性率计算阳性量
    const positiveValue = item.positiveCount;
    result.positiveValues.push(positiveValue);
  });

  console.log('getSampleTypeData 结果:', result);
  return result;
}