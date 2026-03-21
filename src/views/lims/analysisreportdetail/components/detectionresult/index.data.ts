import type { BasicColumn, FormSchema } from '@/components/Table'

import { ByLabelEnumMap, PathogenTypeEnum, PathogenTypeEnumMap, virulenceTypeEnumMap } from "@/enums/customEnum";
import { scientificToPower } from '@/utils/custom';
import { isNumber } from '@/utils/is';
// 导出统一枚举映射
export const byLabelMap = ByLabelEnumMap;
export const pathogenTypeMap = PathogenTypeEnumMap;

/**
 * 检测结果列定义
 */
export const columns: BasicColumn[] = [
  {
    title: "样本编号",
    dataIndex: "sampleCode",
    key: "sampleCode",
    resizable: true,
    width: 100,
  },
  {
    title: "报告区域",
    dataIndex: "byLabel",
    key: "byLabel",
    resizable: true,
    width: 120,
    slots: {
      customRender: 'byLabel'
    }
  },
  {
    title: "初始报告区域",
    dataIndex: "initialByLabel",
    key: "initialByLabel",
    width: 150,
    slots: {
      customRender: 'initialByLabel'
    },
    resizable: true,
  },
  {
    title: "病原体中文名",
    dataIndex: "pathogenCnSname",
    key: "pathogenCnSname",
    resizable: true,
    width: 120,
    slots: {
      customRender: 'pathogenCnSname'
    },
  },
  {
    title: "病原体类型",
    dataIndex: "pathogenType",
    key: "pathogenType",
    resizable: true,
    width: 100,
    customRender: ({ text }) => pathogenTypeMap[text] ?? text,
  },
  {
    title: "reads",
    dataIndex: "reads",
    key: "reads",
    resizable: true,
    width: 100,
  },
  {
    title: "均一化reads",
    dataIndex: "levellingReads",
    key: "levellingReads",
    resizable: true,
    width: 120,
    slots: {
      customRender: 'levellingReads'
    },
    // customRender: ({ text }) => {
    //   //右括号去掉
    //   if (!isNaN(text)) {
    //     return Number(text) <= 1 ? 1 : Number(text)
    //   }

    //   const reads = text.slice(0, text.indexOf('('))
    //   const mutationRate = text.slice(text.indexOf('('))
    //   return Number(reads) > 1 ? `${reads}${mutationRate}` : `1${mutationRate}`
    // }
  },
  {
    title: "同批最大检出RPM",
    dataIndex: "batchMaxOutRpm",
    key: "batchMaxOutRpm",
    resizable: true,
    width: 140,
  },
  {
    title: "微生物估测浓度等级",
    dataIndex: "forecastConc",
    key: "forecastConc",
    resizable: true,
    width: 140,
    // customRender: ({ text }) => {
    //   return text ? scientificToPower(text) : ''
    // }
  },
  {
    title: "多引物情况",
    dataIndex: "multiprimer",
    key: "multiprimer",
    resizable: true,
    width: 120,
  },
  {
    title: "该病原同批检出数量",
    dataIndex: "sameBatchOuts",
    key: "sameBatchOuts",
    resizable: true,
    width: 140,
  },
  {
    title: "突变频率(%)",
    dataIndex: "levellingReads_tbl",
    key: "levellingReads_tbl",
    resizable: true,
    width: 100,
    slots: {
      customRender: 'levellingReads_tbl'
    },
  },
  {
    title: "致病性分类 ",
    dataIndex: "virulenceType",
    key: "virulenceType",
    resizable: true,
    width: 100,
    customRender: ({ text }) => {
      return text == 0 ? '-' : virulenceTypeEnumMap[text]
    }
  },
  {
    title: "水控均一化reads",
    dataIndex: "waterControlRpm",
    key: "waterControlRpm",
    resizable: true,
    width: 120,
  },

  {
    title: "背景均一化reads数",
    dataIndex: "backgroundReads",
    key: "backgroundReads",
    resizable: true,
    width: 140,
  },

  // {
  //   title: "株系/血清型",
  //   dataIndex: "strain",
  //   key: "strain",

  // },


  {
    title: "病原体英文名",
    dataIndex: "pathogenEnSname",
    key: "pathogenEnSname",
    resizable: true,
    width: 100,
  },
  {
    title: "中文属名",
    dataIndex: "pathogenCnGname",
    key: "pathogenCnGname",
    resizable: true,
  },
  {
    title: "英文属名",
    dataIndex: "pathogenEnGname",
    key: "pathogenEnGname",
    resizable: true,
  },
  {
    title: "相关亚型",
    dataIndex: "subtype",
    key: "subtype",
    width: 100,
    // resizable: true,
    slots: {
      customRender: 'subtype'
    }
  },
  {
    title: "相关病原体",
    dataIndex: "subPathogen",
    key: "subPathogen",
    width: 140,
    resizable: true,
  },

  {
    title: "病原体注释",
    dataIndex: "pathogenComments",
    key: "pathogenComments",
    width: 140,
    resizable: true,
    align: 'left'
  },

  // {
  //   title: "株系/血清型",
  //   dataIndex: "strain",
  //   key: "strain",

  // },
];


export const createFormSchema: FormSchema[] = [
  {
    label: "Sample",
    field: "sampleCode",
    component: 'Input',
    required: true,
  },
  {
    label: "报告区域",
    field: "byLabel",
    component: 'Select',
    required: true,
    componentProps: {
      options: Object.entries(ByLabelEnumMap).map(([value, label]) => ({
        value: Number(value),
        label
      })),
    },
  },
  {
    label: "初始报告区域",
    field: "byLabels",
    component: 'Input',
    required: false,
  },
  {
    label: "病原体中文名",
    field: "pathogenCnSname",
    component: 'Input',
    required: true,
  },
  // {
  //   label: "株系/血清型",
  //   field: "strain",
  //   component: 'Input',
  //   required: false,
  // },
  {
    label: "病原体类型",
    field: "pathogenType",
    component: 'Select',
    required: true,
    componentProps: {
      options: Object.entries(PathogenTypeEnumMap).map(([value, label]) => ({
        value: Number(value),
        label
      })),
    },
  },
  {
    label: "致病性分类",
    field: "virulenceType",
    component: 'Input',
    required: false,
  },
  {
    label: "病原体英文名",
    field: "pathogenEnSname",
    component: 'Input',
    required: false,
  },
  {
    label: "中文属名",
    field: "pathogenCnGname",
    component: 'Input',
    required: false,
  },
  {
    label: "英文属名",
    field: "pathogenEnGname",
    component: 'Input',
    required: false,
  },
  {
    label: "reads",
    field: "reads",
    component: 'InputNumber',
    required: false,
  },
  {
    label: "均一化reads",
    field: "levellingReads",
    component: 'InputNumber',
    required: false,
  },
  {
    label: "微生物估测浓度等级",
    field: "forecastConc",
    component: 'Input',
    required: false,
  },
  {
    label: "相关亚型",
    field: "subtype",
    component: 'Input',
    required: false,
  },
  {
    label: "水控均一化reads",
    field: "waterControlRpm",
    component: 'InputNumber',
    required: false,
  },
  {
    label: "多引物情况",
    field: "multiprimer",
    component: 'Input',
    required: false,
  },
  {
    label: "该病原同批检出数量",
    field: "sameBatchOuts",
    component: 'InputNumber',
    required: false,
  },
]

export const updateFormSchema: FormSchema[] = [
  {
    label: "ID",
    field: "id",
    component: 'Input',
    show: false,
  },
  {
    label: "样本编号",
    field: "sampleCode",
    component: 'Input',
    dynamicDisabled: true,
  },

  {
    label: "报告区域",
    field: "byLabel",
    component: 'Select',
    componentProps: ({ formModel }) => {
      // 获取当前病原体类型
      const pathogenType = formModel?.pathogenType;

      // 如果病原体类型为耐药基因(6)或耐药突变(10)，则过滤掉疑似选项(2)
      const shouldExcludeSuspect = pathogenType === PathogenTypeEnum.DRUG_RESISTANCE ||
        pathogenType === PathogenTypeEnum.DRUG_RESISTANCE_MUTATION;

      return {
        options: Object.entries(ByLabelEnumMap).filter(([key, value]) => {
          // 过滤掉未知(0)、耐药(5)、不展示(4)
          if (key === "0" || key === "5" || key === "4") {
            return false;
          }

          // 如果是耐药基因或耐药突变，过滤掉疑似选项(2)
          if (shouldExcludeSuspect && key === "2") {
            return false;
          }

          return true;
        }).map(([value, label]) => ({
          value: Number(value),
          label
        })),
      };
    },
  },
  {
    label: "初始报告区域",
    field: "initialByLabel",
    component: 'Select',
    required: false,
    dynamicDisabled: true,

    componentProps: {
      options: Object.entries(ByLabelEnumMap).map(([value, label]) => ({
        value: Number(value),
        label
      })),
    },
  },


  {
    label: "病原体中文名",
    field: "pathogenCnSname",
    component: 'Input',
  },


  {
    label: "病原体类型",
    field: "pathogenType",
    component: 'Select',
    dynamicDisabled: true,
    componentProps: {
      options: Object.entries(PathogenTypeEnumMap).map(([value, label]) => ({
        value: Number(value),
        label
      })),
    },
  },

  {
    label: "致病性分类",
    field: "virulenceType",
    component: 'Select',
    componentProps: {
      options: Object.entries(virulenceTypeEnumMap).map(([value, label]) => ({
        value: Number(value),
        label
      })),
    },

  },
  {
    label: "病原体英文名",
    field: "pathogenEnSname",
    component: 'Input',

  },
  {
    label: "中文属名",
    field: "pathogenCnGname",
    component: 'Input',
  },
  {
    label: "英文属名",
    field: "pathogenEnGname",
    component: 'Input',
  },
  {
    label: "reads",
    field: "reads",
    component: 'InputNumber',
  },
  {
    label: "均一化reads",
    field: "levellingReads",
    component: 'InputNumber',
    componentProps: {
      min: 1,
    },
  },
  {
    label: "微生物估测浓度等级",
    field: "forecastConc",
    component: 'Input',
  },
  {
    label: "水控均一化reads",
    field: "waterControlRpm",
    component: 'InputNumber',
  },
  {
    label: "多引物情况",
    field: "multiprimer",
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: "该病原同批检出数量",
    field: "sameBatchOuts",
    component: 'InputNumber',
    dynamicDisabled: true,
  },

  // {
  //   label: "株系/血清型",
  //   field: "strain",
  //   component: 'Input',
  // },
  {
    label: "相关亚型",
    field: "subtype",
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: "相关病原体",
    field: "subPathogen",
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: "病原体注释",
    field: "pathogenComments",
    component: 'InputTextArea',
    dynamicDisabled: true,
    componentProps: {
      autoSize: {
        minRows: 3,

      },
    },
    colProps: {
      span: 24,
    },
  },


]