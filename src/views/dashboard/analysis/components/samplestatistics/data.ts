import { findSampleStatsByGroup } from '@/api/lims/statscenter';
import { SampleStatsRespVO } from '@/api/lims/statscenter/model';
import { getRandomColor } from '@/utils/color';
import { ref } from 'vue';

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

interface SampleChartDataItem {
  name: string;
  color: string;
  field: string;
  time: { time: string; value: number }[]
}

// 新数据模型 - 更灵活的数据结构
export const sampleChartData = ref<SampleChartDataItem[]>([]);

// {
//   name: "",
//   color: "#F5515F",
//   field: "lung-lavage",
//   time: [{ time: "2023年01月1日", value: 450 },]
// }



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
export function convertToSampleDataItems(): SampleDataItem[] {
  if (sampleChartData.value.length === 0) {
    return [];
  }

  // 创建目标数据结构
  const times = sampleChartData.value[0].time.map(item => item.time);

  return times.map((time, index) => {
    // 创建基础对象，只包含时间字段
    const item: SampleDataItem = {
      time: time
    } as SampleDataItem;

    // 初始化所有数据字段为0
    sampleChartData.value.forEach(category => {
      const fieldName = category.field;
      item[fieldName] = 0;
    });

    // 填充每个类型的实际数据
    sampleChartData.value.forEach(category => {
      const fieldName = category.field;
      // 确保index在范围内
      if (index < category.time.length) {
        item[fieldName] = category.time[index].value;
      }
    });

    return item;
  });
}

// 导出颜色和图例项配置，从sampleChartData动态生成
export const getChartOptions = (): ChartOptions => {
  return {
    colors: sampleChartData.value.map(item => item.color),
    legendItems: sampleChartData.value.map(item => ({
      name: item.name,
      color: item.color,
      field: item.field
    }))
  };
};



/**
 * 更新图表数据
 * @param filters 过滤条件
 * @param dateRange 日期范围
 * @param timeType 时间类型
 */
export async function updateChartData(
  filters: { checkType: number, department: string; subject: string; doctor: string },
  dateRange: [string, string],
  timeType: 'month' | 'day' = 'month'
) {
  try {

    console.log("filters", filters);
    console.log("dateRange", dateRange);
    console.log("timeType", timeType);

    const res = await findSampleStatsByGroup({
      checkType: filters.checkType,
      subHospital: filters.department,
      subRoom: filters.subject,
      subDoctor: filters.doctor,
      groupByType: timeType
    })

    sampleChartData.value = convertResToSampleChartData(res)



    return sampleChartData.value;
  } catch (error) {
    console.error('更新图表数据失败:', error);
    return false;
  }
} 

function convertResToSampleChartData(res: Record<string, SampleStatsRespVO[]>): SampleChartDataItem[] {
  const sampleTypeMap = {
    0: { name: "其他", field: "other", color: "#04af02" },
    1: { name: "肺泡灌洗液", field: "lung-lavage", color: "#F5515F" },
    2: { name: "痰液", field: "sputum", color: "#5D9CEC" },
    3: { name: "鼻/咽拭子", field: "nasal-swab", color: "#5ECC7F" },
    4: { name: "水控", field: "water-control", color: "#EFD864" }
  };
  // 颜色缓存
  const colorMap: Record<string, string> = {};

  // 1. 收集所有 sampleType
  const allTypes = new Set<number>();
  Object.values(res).forEach(arr => {
    arr.forEach(item => {
      if (typeof item.sampleType === 'number') allTypes.add(item.sampleType);
    });
  });

  // 2. 收集所有时间点
  const allTimes = Object.keys(res).sort();

  // 3. 构建每个类型的曲线
  const result: SampleChartDataItem[] = [];
  allTypes.forEach(type => {
    const meta = sampleTypeMap[type as keyof typeof sampleTypeMap] || sampleTypeMap[0];
    if (!colorMap[type]) colorMap[type] = meta.color;
    const timeArr = allTimes.map(time => {
      const arr = res[time] || [];
      const found = arr.find(item => item.sampleType === type);
      return {
        time,
        value: found ? (found.sampleCount || 0) : 0
      };
    });
    result.push({
      name: meta.name,
      color: colorMap[type],
      field: meta.field,
      time: timeArr
    });
  });

  return result;
}