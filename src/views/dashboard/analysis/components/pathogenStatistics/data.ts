import { ref } from 'vue';
import { TimeRangeType } from '../model';
import { ByLabelEnum, ByLabelEnumMap, SampleTypeEnum, SampleTypeEnumMap } from '@/enums/customEnum';
import { findPathogenOutStatsByTime } from '@/api/lims/statscenter';
import dayjs, { Dayjs } from 'dayjs';
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

export interface PositiveChartDataItem {
  name: string;
  color: string;
  field: string;
  positiveRate: number; // 阳性率
  lightColor: string; // 浅色（用于半透明效果）
  data: {
    all: { time: string; value: number }[]; // 全部时间数据
    month: { time: string; value: number }[];
    year: { time: string; value: number }[];
  };
}

// 新数据模型 - 更灵活的数据结构
export const positiveChartData = ref<PositiveChartDataItem[]>([
  {
    name: "肺泡灌洗液",
    color: "#F5515F",
    field: "lung-lavage",
    positiveRate: 78.8,
    lightColor: "#FFEDED",
    data: {
      all: [
        { time: "全部时间", value: 4860 }
      ],
      month: [
        { time: "2023年01月", value: 450 },
        { time: "2023年02月", value: 380 },
        { time: "2023年03月", value: 400 },
        { time: "2023年04月", value: 410 },
        { time: "2023年05月", value: 380 },
        { time: "2023年06月", value: 360 },
        { time: "2023年07月", value: 360 },
        { time: "2023年08月", value: 340 },
        { time: "2023年09月", value: 410 },
        { time: "2023年10月", value: 430 },
        { time: "2023年11月", value: 390 },
        { time: "2023年12月", value: 380 }
      ],
      year: [
        { time: "2023年12月01日", value: 450 },
        { time: "2023年12月02日", value: 380 },
        { time: "2023年12月03日", value: 400 },
        { time: "2023年12月04日", value: 410 },
        { time: "2023年12月05日", value: 380 },
        { time: "2023年12月06日", value: 360 },
        { time: "2023年12月07日", value: 360 },
        { time: "2023年12月08日", value: 340 },
        { time: "2023年12月09日", value: 410 }
      ]
    }
  },
  {
    name: "甲状腺",
    color: "#5D9CEC",
    field: "thyroid-nodule",
    positiveRate: 66.2,
    lightColor: "#EBF5FF",
    data: {
      all: [
        { time: "全部时间", value: 3740 }
      ],
      month: [
        { time: "2023年01月", value: 390 },
        { time: "2023年02月", value: 340 },
        { time: "2023年03月", value: 410 },
        { time: "2023年04月", value: 350 },
        { time: "2023年05月", value: 320 },
        { time: "2023年06月", value: 300 },
        { time: "2023年07月", value: 310 },
        { time: "2023年08月", value: 280 },
        { time: "2023年09月", value: 330 },
        { time: "2023年10月", value: 400 },
        { time: "2023年11月", value: 340 },
        { time: "2023年12月", value: 320 }
      ],
      year: [
        { time: "2023年12月01日", value: 390 },
        { time: "2023年12月02日", value: 340 },
        { time: "2023年12月03日", value: 410 },
        { time: "2023年12月04日", value: 350 },
        { time: "2023年12月05日", value: 320 },
        { time: "2023年12月06日", value: 300 },
        { time: "2023年12月07日", value: 310 },
        { time: "2023年12月08日", value: 280 },
        { time: "2023年12月09日", value: 330 }
      ]
    }
  },
  {
    name: "胸液",
    color: "#5ECC7F",
    field: "pleural",
    positiveRate: 31.3,
    lightColor: "#E4F9EB",
    data: {
      all: [
        { time: "全部时间", value: 2250 }
      ],
      month: [
        { time: "2023年01月", value: 250 },
        { time: "2023年02月", value: 270 },
        { time: "2023年03月", value: 270 },
        { time: "2023年04月", value: 210 },
        { time: "2023年05月", value: 240 },
        { time: "2023年06月", value: 160 },
        { time: "2023年07月", value: 180 },
        { time: "2023年08月", value: 190 },
        { time: "2023年09月", value: 180 },
        { time: "2023年10月", value: 190 },
        { time: "2023年11月", value: 160 },
        { time: "2023年12月", value: 150 }
      ],
      year: [
        { time: "2023年12月01日", value: 250 },
        { time: "2023年12月02日", value: 270 },
        { time: "2023年12月03日", value: 270 },
        { time: "2023年12月04日", value: 210 },
        { time: "2023年12月05日", value: 240 },
        { time: "2023年12月06日", value: 160 },
        { time: "2023年12月07日", value: 180 },
        { time: "2023年12月08日", value: 190 },
        { time: "2023年12月09日", value: 180 }
      ]
    }
  },
  {
    name: "其他",
    color: "#EFD864",
    field: "other",
    positiveRate: 66.2,
    lightColor: "#FFFBE6",
    data: {
      all: [
        { time: "全部时间", value: 780 }
      ],
      month: [
        { time: "2023年01月", value: 120 },
        { time: "2023年02月", value: 80 },
        { time: "2023年03月", value: 130 },
        { time: "2023年04月", value: 80 },
        { time: "2023年05月", value: 130 },
        { time: "2023年06月", value: 10 },
        { time: "2023年07月", value: 70 },
        { time: "2023年08月", value: 50 },
        { time: "2023年09月", value: 20 },
        { time: "2023年10月", value: 30 },
        { time: "2023年11月", value: 50 },
        { time: "2023年12月", value: 60 }
      ],
      year: [
        { time: "2023年12月01日", value: 120 },
        { time: "2023年12月02日", value: 80 },
        { time: "2023年12月03日", value: 130 },
        { time: "2023年12月04日", value: 80 },
        { time: "2023年12月05日", value: 130 },
        { time: "2023年12月06日", value: 10 },
        { time: "2023年12月07日", value: 70 },
        { time: "2023年12月08日", value: 50 },
        { time: "2023年12月09日", value: 20 }
      ]
    }
  }
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

// 转换当前月份的数据以适应模型
export function convertToSampleDataItems(timeType: 'all' | 'month' | 'year' = 'month'): SampleDataItem[] {
  console.log('convertToSampleDataItems 调用，时间类型:', timeType);

  // 创建目标数据结构
  const times = positiveChartData.value[0].data[timeType].map(item => item.time);

  const result = times.map((time, index) => {
    // 创建基础对象，只包含时间字段
    const item: SampleDataItem = {
      time: time
    } as SampleDataItem;

    // 初始化所有数据字段为0
    positiveChartData.value.forEach(category => {
      const fieldName = category.field;
      item[fieldName] = 0;
    });

    // 填充每个类型的实际数据
    positiveChartData.value.forEach(category => {
      const fieldName = category.field;
      // 确保index在范围内
      if (index < category.data[timeType].length) {
        item[fieldName] = category.data[timeType][index].value;
      }
    });

    return item;
  });

  console.log('convertToSampleDataItems 结果:', result);
  return result;
}

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
  dateRange: [string, string];
  department?: string;
  subject?: string;
  doctor?: string;
  timeType?: 'all' | 'month' | 'year';
}) {
  // 解构参数
  const { dateRange, department, subject, doctor, timeType = 'month' } = params;

  console.log('fetchSampleData 调用，参数:', params);

  // 这里可以添加实际API调用逻辑，现在返回转换后的样本数据
  const result = convertToSampleDataItems(timeType);
  console.log('fetchSampleData 结果:', result);
  return result;
}

// 更新图表数据
export async function updateChartData(
  filters: { department: string; subject: string; doctor: string },
  dateRange: [string, string],
  timeType: 'all' | 'month' | 'year' = 'month'
) {
  console.log('updateChartData 调用, 时间类型:', timeType, '日期范围:', dateRange, '过滤条件:', filters);

  try {
    // 获取样本数据
    const sampleData = await fetchSampleData({
      dateRange,
      department: filters.department,
      subject: filters.subject,
      doctor: filters.doctor,
      timeType
    });

    // 返回样本数据
    return sampleData;
  } catch (error) {
    console.error('Failed to update chart data:', error);
    // 发生错误时返回空数组
    return [];
  }
}

// 获取总体阳性率
export function getTotalPositiveRate(): number {
  // 计算各类型总量和阳性量
  let totalSamples = 0;
  let totalPositiveSamples = 0;

  positiveChartData.value.forEach(item => {
    // 假设每个类型的全部时间数据在data.all[0]
    const totalValue = item.data.all[0].value;
    totalSamples += totalValue;

    // 根据阳性率计算阳性样本数量
    const positiveValue = totalValue * (item.positiveRate / 100);
    totalPositiveSamples += positiveValue;
  });

  // 计算总体阳性率（保留一位小数）
  return parseFloat((totalPositiveSamples / totalSamples * 100).toFixed(1));
}

// 获取特定时间点的样本类型数据
export function getSampleTypeData(timeIndex: number = 0, timeType: 'all' | 'month' | 'year' = 'month'): {
  sampleNames: string[];
  totalValues: number[];
  positiveValues: number[];
  positiveRates: number[];
  colors: string[];
  lightColors: string[];
} {
  console.log('getSampleTypeData 调用, 时间类型:', timeType, '时间索引:', timeIndex);

  // 确保timeType是有效值
  if (!['all', 'month', 'year'].includes(timeType)) {
    console.warn('无效的timeType:', timeType, '，使用默认值:month');
    timeType = 'month';
  }

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
    if (!item.data[timeType] || item.data[timeType].length === 0) {
      console.warn(`${item.name}的${timeType}类型数据为空`);
      return;
    }

    // 添加样本名称
    result.sampleNames.push(item.name);

    // 添加颜色
    result.colors.push(item.color);
    result.lightColors.push(item.lightColor);

    // 添加阳性率
    result.positiveRates.push(item.positiveRate);

    // 确保时间索引有效
    const safeIndex = Math.min(timeIndex, item.data[timeType].length - 1);

    // 获取总量
    const totalValue = item.data[timeType][safeIndex].value;
    result.totalValues.push(totalValue);

    // 根据阳性率计算阳性量
    const positiveValue = totalValue * (item.positiveRate / 100);
    result.positiveValues.push(positiveValue);
  });

  console.log('getSampleTypeData 结果:', result);
  return result;
}

// 病原体数据项接口
export interface PathogenDataItem {
  name: string;        // 病原体名称
  value: number;       // 检出数量
  isPositive: boolean; // 是否阳性
  isSuspected: boolean; // 是否疑似
  sampleTypes: string[]; // 样本类型列表
  reportCount: number;    //总样本数
  outRatio: number;     //占比
}

// 筛选项接口
export interface FilterOption {
  label: string;
  value: string;
}

// 病原体图表数据
// export const pathogenChartData = ref<PathogenDataItem[]>([
//   { name: '原粒内病毒', value: 480, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液', '甲状腺'] },
//   { name: '冠状病毒NL63', value: 420, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '钩端螺旋菌', value: 380, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺', '其他样本'] },
//   { name: '23S结构域区点突变', value: 320, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '卡他莫拉菌', value: 280, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: 'β-内酰胺酶基因TEM-1型', value: 240, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '粘膜沙眼衣原体', value: 220, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '白念珠菌', value: 210, isPositive: true, isSuspected: false, sampleTypes: ['其他样本'] },
//   { name: '青霉素结合蛋白PBP2a', value: 200, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '人鼻疹病毒4型（EBV）', value: 180, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '其他样本'] },
//   { name: '(D型）β-内酰胺酶基因', value: 170, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液'] },
//   { name: '哈卷氏肺食单胞菌', value: 160, isPositive: false, isSuspected: true, sampleTypes: ['胸液', '其他样本'] },
//   { name: '甲型流感病毒', value: 150, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '甲型流感病毒H1N1', value: 140, isPositive: false, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '大肠埃希菌', value: 130, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '肺炎克雷伯菌1', value: 110, isPositive: false, isSuspected: true, sampleTypes: ['甲状腺'] },
//   { name: '肺炎克雷伯菌2', value: 100, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液'] },
//   { name: '肺炎克雷伯菌3', value: 80, isPositive: false, isSuspected: true, sampleTypes: ['其他样本'] },
//   { name: '肺炎克雷伯菌4', value: 60, isPositive: true, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '肺炎克雷伯菌5', value: 30, isPositive: true, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '腺病毒', value: 480, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液', '甲状腺'] },
//   { name: '呼吸道合胞病毒', value: 420, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '肺炎支原体', value: 380, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺', '其他样本'] },
//   { name: '金黄色葡萄球菌', value: 320, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '铜绿假单胞菌', value: 280, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '鲍曼不动杆菌', value: 240, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '嗜肺军团菌', value: 220, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '肺炎链球菌', value: 210, isPositive: true, isSuspected: false, sampleTypes: ['其他样本'] },
//   { name: '流感嗜血杆菌', value: 200, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '副流感病毒', value: 180, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '其他样本'] },
//   { name: '人偏肺病毒', value: 170, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液'] },
//   { name: '肺炎衣原体', value: 160, isPositive: false, isSuspected: true, sampleTypes: ['胸液', '其他样本'] },
//   { name: '乙型流感病毒', value: 150, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '丙型流感病毒', value: 140, isPositive: false, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '肠道病毒', value: 130, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '莫拉菌', value: 110, isPositive: false, isSuspected: true, sampleTypes: ['甲状腺'] },
//   { name: '肺炎念珠菌', value: 100, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液'] },
//   { name: '曲霉菌', value: 80, isPositive: false, isSuspected: true, sampleTypes: ['其他样本'] },
//   { name: '隐球菌', value: 60, isPositive: true, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '卡氏肺孢子虫', value: 30, isPositive: true, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '巨细胞病毒', value: 480, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液', '甲状腺'] },
//   { name: '单纯疱疹病毒', value: 420, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '水痘带状疱疹病毒', value: 380, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺', '其他样本'] },
//   { name: '结核分枝杆菌', value: 320, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '非结核分枝杆菌', value: 280, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '诺卡菌', value: 240, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '放线菌', value: 220, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '肺孢子菌', value: 210, isPositive: true, isSuspected: false, sampleTypes: ['其他样本'] },
//   { name: '组织胞浆菌', value: 200, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '鹦鹉热衣原体', value: 180, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '其他样本'] },
//   { name: '立克次体', value: 170, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液'] },
//   { name: '布鲁氏菌', value: 160, isPositive: false, isSuspected: true, sampleTypes: ['胸液', '其他样本'] },
//   { name: '炭疽杆菌', value: 150, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '鼠疫耶尔森菌', value: 140, isPositive: false, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '弗朗西斯菌', value: 130, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '伯氏疏螺旋体', value: 110, isPositive: false, isSuspected: true, sampleTypes: ['甲状腺'] },
//   { name: '梅毒螺旋体', value: 100, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液'] },
//   { name: '钩端螺旋体', value: 80, isPositive: false, isSuspected: true, sampleTypes: ['其他样本'] },
//   { name: '回归热螺旋体', value: 60, isPositive: true, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '莱姆病螺旋体', value: 30, isPositive: true, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '埃博拉病毒', value: 480, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液', '甲状腺'] },
//   { name: '马尔堡病毒', value: 420, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '拉沙热病毒', value: 380, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺', '其他样本'] },
//   { name: '汉坦病毒', value: 320, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '登革热病毒', value: 280, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '黄热病毒', value: 240, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '寨卡病毒', value: 220, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '西尼罗病毒', value: 210, isPositive: true, isSuspected: false, sampleTypes: ['其他样本'] },
//   { name: '基孔肯雅病毒', value: 200, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '日本脑炎病毒', value: 180, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '其他样本'] },
//   { name: '狂犬病毒', value: 170, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液'] },
//   { name: '尼帕病毒', value: 160, isPositive: false, isSuspected: true, sampleTypes: ['胸液', '其他样本'] },
//   { name: '亨德拉病毒', value: 150, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '克里米亚刚果出血热病毒', value: 140, isPositive: false, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '立百病毒', value: 130, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '中东呼吸综合征冠状病毒', value: 110, isPositive: false, isSuspected: true, sampleTypes: ['甲状腺'] },
//   { name: '严重急性呼吸综合征冠状病毒', value: 100, isPositive: false, isSuspected: true, sampleTypes: ['肺泡灌洗液'] },
//   { name: '人类免疫缺陷病毒', value: 80, isPositive: false, isSuspected: true, sampleTypes: ['其他样本'] },
//   { name: '人类T细胞白血病病毒', value: 60, isPositive: true, isSuspected: true, sampleTypes: ['胸液'] },
//   { name: '人类疱疹病毒8型', value: 30, isPositive: true, isSuspected: true, sampleTypes: ['肺泡灌洗液', '甲状腺'] },
//   { name: '人类疱疹病毒6型', value: 480, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液', '甲状腺'] },
//   { name: '人类疱疹病毒7型', value: 420, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '胸液'] },
//   { name: '人类乳头瘤病毒', value: 380, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '甲状腺', '其他样本'] },
//   { name: '人类多瘤病毒', value: 320, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },
//   { name: '人类细小病毒B19', value: 280, isPositive: true, isSuspected: false, sampleTypes: ['肺泡灌洗液', '其他样本'] },
//   { name: '人类博卡病毒', value: 240, isPositive: true, isSuspected: false, sampleTypes: ['胸液', '甲状腺'] },

// ]);



// 默认赋109条数据
export const pathogenChartData = ref<PathogenDataItem[]>([
  ...Array.from({ length: 109 - 44 }).map((_, i) => ({
    name: `模拟病原体${i + 1}`,
    value: Math.floor(50 + Math.random() * 500),
    isPositive: Math.random() > 0.5,
    isSuspected: Math.random() > 0.7,
    sampleTypes: [
      ['肺泡灌洗液', '甲状腺', '胸液', '其他样本'][Math.floor(Math.random() * 4)]
    ]
  }))
]);

// 样本类型选项
export const sampleTypeOptions = ref<FilterOption[]>([
  { label: "全部", value: '-1' },
  { label: SampleTypeEnumMap[SampleTypeEnum.BALF], value: SampleTypeEnum.BALF.toString() },
  { label: SampleTypeEnumMap[SampleTypeEnum.CROUP], value: SampleTypeEnum.CROUP.toString() },
  { label: SampleTypeEnumMap[SampleTypeEnum.SWAB], value: SampleTypeEnum.SWAB.toString() },
  { label: '其他', value: SampleTypeEnum.OTHER.toString() },
  // { label: SampleTypeEnumMap[SampleTypeEnum.WATER_CONTROL], value: SampleTypeEnum.WATER_CONTROL.toString() },
]);

//SampleTypeEnumMap

// 结果类型选项
export const resultTypeOptions = ref<FilterOption[]>([

  { label: '阳性', value: ByLabelEnum.MAIN_REPORT.toString() },
  { label: '疑似', value: ByLabelEnum.SUSPECT.toString() },
  { label: '阳性&疑似', value: `${ByLabelEnum.MAIN_REPORT.toString()},${ByLabelEnum.SUSPECT.toString()}` },
]);

// 筛选数据的函数
export function filterPathogenData(
  requestData: PathogenDataItem[],
  sampleType: string = SampleTypeEnum.OTHER.toString(),
  resultType: string = ByLabelEnum.MAIN_REPORT.toString(),
  timeType: TimeRangeType = 'all',
  dateRange?: [Dayjs, Dayjs]
): PathogenDataItem[] {
  // 输出筛选条件
  // console.log(`筛选数据: 样本类型=${sampleType}, 结果类型=${resultType}, 时间类型=${timeType}`);
  // if (dateRange && dateRange.length === 2) {
  //   console.log(`日期范围: ${dateRange[0]} 至 ${dateRange[1]}`);
  // }

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




export async function getPathogenData(
  checkType: number | null,
  sampleType: string = SampleTypeEnum.OTHER.toString(),
  resultType: string = ByLabelEnum.MAIN_REPORT.toString(),
  timeType: TimeRangeType = 'all',
  dateRange?: [Dayjs, Dayjs]
): Promise<PathogenDataItem[]> {
  // 获取数据
  // const requestData = await fetchPathogenData(sampleType, resultType, timeType, dateRange);


  const { startTime, endTime } = processDateRangeByTimeType(timeType, dateRange);

  const requestData = await findPathogenOutStatsByTime({
    checkType: checkType,
    startTime: startTime,
    endTime: endTime,
    sampleType: Number(sampleType),
    byLabelStr: resultType
  })


  pathogenChartData.value = []
  requestData.forEach(item => {
    pathogenChartData.value.push({
      name: item.pathogenCnSname!,
      value: item.outCount!,
      isPositive: resultType.indexOf(ByLabelEnum.MAIN_REPORT.toString()) !== -1,
      isSuspected: resultType.indexOf(ByLabelEnum.SUSPECT.toString()) !== -1,
      sampleTypes: resultType.split(',').map(type => ByLabelEnumMap[type.trim()]),
      reportCount: item.reportCount,
      outRatio: item.outRatio
    })
  })


  // 过滤数据
  const filteredData = filterPathogenData(pathogenChartData.value, sampleType, resultType, timeType, dateRange);

  return filteredData;


}