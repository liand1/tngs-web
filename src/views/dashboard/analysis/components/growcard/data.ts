import { ref } from "vue";

// 定义卡片项的接口
export interface CardItem {
  title: string;
  value: number;
  count: string | number;
  unit: string;
  chart: 'createSample' | 'createChip' | 'createAnalysis' | 'createReport';
  yesterday: string;
  month: string;
  data: number[];
  dataTime: String[];
}

// 应用接口到卡片列表
export const cardList = ref<CardItem[]>([
  {
    title: "新增样本",
    value: 41,
    count: "127",
    unit: "批次",
    chart: "createSample",
    yesterday: "昨日",
    month: "本月",
    data: [],
    dataTime: []
  },
  {
    title: "新增芯片数据",
    value: 40,
    count: "",
    unit: "条",
    chart: "createChip",
    yesterday: "昨日",
    month: "本月",
    data: [],
    dataTime: []
  },
  {
    title: "创建分析任务",
    value: 38,
    count: "",
    unit: "次",
    chart: "createAnalysis",
    yesterday: "昨日",
    month: "本月",
    data: [],
    dataTime: []
  },
  {
    title: "出具报告",
    value: 112,
    count: "",
    unit: "份",
    chart: "createReport",
    yesterday: "昨日",
    month: "本月",
    data: [],
    dataTime: []
  },
]);


