// 数据源
import { ref } from 'vue';
import { FormSchema } from '@/components/Form';
import { getQcStatus, getTaskStatus, getCheckStatus, getCheckType, getExcavateDeeply } from '@/api/system/dict/custom';

export const taskDetailData = {
  title: "质控详情",
  list: [
    {
      title: "单个样本序列数",
      resultValue: "45000033",
      standardValue: "500000",
      status: "不合格",
      timestamp: "2025-03-04 12:23:32",
    },
    {
      title: "防错标签正常率",
      resultValue: "4%",
      standardValue: "5%",
      status: "合格",
      timestamp: "2025-03-04 12:23:32",
    },
    {
      title: "比对率",
      resultValue: "2%",
      standardValue: "2%",
      status: "合格",
      timestamp: "2025-03-04 12:23:32",
    },
    {
      title: "接头序列污染",
      resultValue: "0.1%",
      standardValue: "0.1%",
      status: "合格",
      timestamp: "2025-03-04 12:23:32",
    },
    {
      title: "质粒（阳性）参考品物种检出率",
      resultValue: "96%",
      standardValue: "0.1%",
      status: "合格",
      timestamp: "2025-03-04 12:23:32",
    },
    {
      title: "样本Q30占比",
      resultValue: "86.43%",
      standardValue: "0.1%",
      status: "合格",
      timestamp: "2025-03-04 12:23:32",
    },
    {
      title: "水控污染",
      resultValue: "",
      standardValue:
        "阴控靶标检出和样本80%一致视为污染(水控物种多于10个再进行比较)",
      status: "不合格（水控污染）",
      timestamp: "2025-03-04 12:23:32",
    },
  ]
};

// 字典数据
export const qcStatusOptions = ref<any[]>([]);
export const taskStatusOptions = ref<any[]>([]);
export const checkStatusOptions = ref<any[]>([]);
export const taskTypeOptions = ref<any[]>([]);
export const excavateDeeplyOptions = ref<any[]>([]);

const fetchDictDataIsRun = ref(false);

// 获取字典数据
export const fetchDictData = async () => {
  if (fetchDictDataIsRun.value) return;
  fetchDictDataIsRun.value = true;
  try {
    const [qcStatusRes, taskStatusRes, checkStatusRes, taskTypeRes, excavateDeeplyRes] = await Promise.all([
      getQcStatus(),
      getTaskStatus(),
      getCheckStatus(),
      getCheckType(),
      getExcavateDeeply()
    ]);

    console.log(qcStatusRes, taskStatusRes, checkStatusRes, taskTypeRes, excavateDeeplyRes);

    qcStatusOptions.value = [{
      label: "全部",
      value: null
    // }, ...qcStatusRes.list.filter(item => item.value !== "0")];
    }, {
      label: "合格",
      value: 1
    }, {
      label: "不合格",
      value: 2
    }, {
      label: "预警",
      value: 3
    }];

    taskStatusOptions.value = [{
      label: "全部",
      value: null
    }, ...taskStatusRes.list];

    checkStatusOptions.value = checkStatusRes.list;
    taskTypeOptions.value = taskTypeRes.list;

    excavateDeeplyOptions.value = excavateDeeplyRes.list;

  } catch (error) {
    console.error('获取字典数据失败:', error);
  }
};

// 处理schemas中的Select组件配置
export const handleSelectSchemas = (schemas: FormSchema[]): FormSchema[] => {
  return schemas.map((schema) => {
    // 处理任务类型字段
    if (schema.field === "type") {
      return {
        ...schema,
        componentProps: {
          options: taskTypeOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    // 处理质控结果字段
    if (schema.field === "qcStatus") {
      return {
        ...schema,
        componentProps: {
          options: qcStatusOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    // 处理任务状态字段
    if (schema.field === "taskStatus") {
      return {
        ...schema,
        componentProps: {
          options: taskStatusOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    // 处理审核状态字段
    if (schema.field === "checkStatus") {
      return {
        ...schema,
        componentProps: {
          options: checkStatusOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    // 处理深度挖掘字段
    if (schema.field === "excavateDeeply") {
      return {
        ...schema,
        component: 'Select',
        componentProps: {
          options: excavateDeeplyOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    return schema;
  });
};