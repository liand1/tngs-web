import type { BasicColumn, FormSchema } from '@/components/Table'

import { ByLabelEnumMap, PathogenTypeEnum, PathogenTypeEnumMap, virulenceTypeEnumMap, mutationCodeType } from "@/enums/customEnum";
import { scientificToPower } from '@/utils/custom';
import { isNumber } from '@/utils/is';
// 导出统一枚举映射
export const byLabelMap = mutationCodeType;
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
    dataIndex: "mutationTypeUpdate",
    key: "mutationTypeUpdate",
    resizable: true,
    width: 120,
    slots: {
      customRender: 'byLabel'
    }
  },
  {
    title: "初始报告区域",
    dataIndex: "mutationType",
    key: "mutationType",
    width: 150,
    slots: {
      customRender: 'initialByLabel'
    },
    resizable: true,
  },
  {
    title: "基因名",
    dataIndex: "drugGene",
    key: "drugGene",
    resizable: true,
    width: 120,
  },
  {
    title: "突变类型",
    dataIndex: "mutationClass",
    key: "mutationClass",
    resizable: true,
    width: 100,
  },
  {
    title: "核苷酸突变",
    dataIndex: "dntMutation",
    key: "dntMutation",
    resizable: true,
    width: 100,
  },
  {
    title: "氨基酸突变",
    dataIndex: "aminoMutation",
    key: "aminoMutation",
    resizable: true,
    width: 100,
  },
  {
    title: "突变频率(%)",
    dataIndex: "mutationRate",
    key: "mutationRate",
    resizable: true,
    width: 200,
    slots: {
      customRender: 'mutationRate'
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
    title: "总序列数",
    dataIndex: "count",
    key: "count",
    resizable: true,
    width: 100,
  },
  {
    title: "突变序列数",
    dataIndex: "mutationCount",
    key: "mutationCount",
    resizable: true,
    width: 120,
  },

  {
    title: "总均一化序列数",
    dataIndex: "mutationRpm",
    key: "mutationRpm",
    resizable: true,
    width: 140,
  },

  {
    title: "突变均一化序列数",
    dataIndex: "levellingReads",
    key: "levellingReads",
    resizable: true,
    width: 140,
  },
  {
    title: "水控突变均一化序列数",
    dataIndex: "waterLevellingReads",
    key: "waterLevellingReads",
    resizable: true,
    width: 140,
  },
  {
    title: "相关病原体",
    dataIndex: "relatedPathogen",
    key: "relatedPathogen",
    resizable: true,
    width: 100,
  },
  {
    title: "一线药物耐药",
    dataIndex: "drugResistant1",
    key: "drugResistant1",
    resizable: true,
  },
  {
    title: "二线药物耐药",
    dataIndex: "drugResistant2",
    key: "drugResistant2",
    resizable: true,
  },

  {
    title: "WHO评级",
    dataIndex: "whoRating",
    key: "whoRating",
    resizable: true,
    width: 140,
  },


  {
    title: "包含突变",
    dataIndex: "containsMutation",
    key: "containsMutation",
    resizable: true,
    width: 120,
  },
  {
    title: "相关突变",
    dataIndex: "relatedMutation",
    key: "relatedMutation",
    resizable: true,
    width: 140,
  },
  {
    title: "引物ID",
    dataIndex: "primerId",
    key: "primerId",
    width: 100,
    resizable: true,
  },

  {
    title: "病原体注释",
    dataIndex: "annotation",
    key: "annotation",
    width: 140,
    resizable: true,
    align: 'left'
  },
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
    field: "mutationTypeUpdate",
    component: 'Select',
    componentProps: ({ formModel }) => {

      return {
        options: Object.entries(mutationCodeType).filter(([key, value]) => {
          // 过滤掉未知(0)、耐药(5)、不展示(4)
          if (key === "0" ) {
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
    field: "mutationType",
    component: 'Select',
    required: false,
    dynamicDisabled: true,

    componentProps: {
      options: Object.entries(mutationCodeType).map(([value, label]) => ({
        value: Number(value),
        label
      })),
    },
  },

  {
    label: "基因名",
    field: "drugGene",
    component: 'Input',
  },

  {
    label: "突变类型",
    field: "mutationClass",
    component: 'Input',
    dynamicDisabled: true,
  },

  {
    label: "核苷酸突变",
    field: "dntMutation",
    component: 'Input',
  },
  {
    label: "氨基酸突变",
    field: "aminoMutation",
    component: 'Input',
  },
  {
    label: "突变频率（%）",
    field: "mutationRate",
    component: 'Input',
  },
  {
    label: "总序列数",
    field: "count",
    component: 'InputNumber',
  },
  {
    label: "突变序列数",
    field: "mutationCount",
    component: 'InputNumber',
  },
  {
    label: "总均一化序列数",
    field: "mutationRpm",
    component: 'InputNumber',
    componentProps: {
      min: 0.01,
    },
  },
  {
    label: "突变均一化序列数",
    field: "levellingReads",
    component: 'InputNumber',
    componentProps: {
      min: 0.01,
    },
  },
  {
    label: "水控突变均一化序列数",
    field: "waterLevellingReads",
    component: 'InputNumber',
  },
  {
    label: "相关病原体",
    field: "relatedPathogen",
    component: 'Input',
  },
  {
    label: "一线药物耐药",
    field: "drugResistant1",
    component: 'Input',
  },
  {
    label: "二线药物耐药",
    field: "drugResistant2",
    component: 'Input',
  },
  {
    label: "WHO评级",
    field: "whoRating",
    component: 'Input',
  },
  {
    label: "包含突变",
    field: "containsMutation",
    component: 'Input',
  },
  {
    label: "相关突变",
    field: "relatedMutation",
    component: 'Input',
  },
  {
    label: "引物ID",
    field: "primerId",
    component: 'Input',
  },
  {
    label: "注释",
    field: "annotation",
    component: 'InputTextArea',
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