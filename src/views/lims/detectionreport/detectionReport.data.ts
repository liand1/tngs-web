import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'
import { ByLabelEnumMap, CheckStatusEnumMap, CheckTypeEnumMap, PathogenTypeEnumMap, SampleTypeEnumMap, SexEnumMap } from '@/enums/customEnum';
import dayjs from 'dayjs';
import { pathogenGeneNameList } from '.';
import { ref } from 'vue';
import { isNumber } from '@/utils/is';

export const columns: BasicColumn[] = [
  // {
  //   title: '结果ID',
  //   dataIndex: 'id',
  //   width: 100,
  // },
  // {
  //   title: '任务ID',
  //   dataIndex: 'taskId',
  //   width: 100,
  // },
  {
    title: '样本编号',
    dataIndex: 'sampleCode',
    width: 140,
  },
  {
    title: '检出时间',
    dataIndex: 'finishTime',
    width: 200,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
  {
    title: '患者姓名',
    dataIndex: 'examineeName',
    width: 120,
  },
  {
    title: '患者年龄',
    dataIndex: 'age',
    width: 80,
  },
  {
    title: '检测项目',
    dataIndex: 'checkTypeName',
    width: 140,
  },
  {
    title: '样本类型',
    dataIndex: 'sampleType',
    width: 120,
    customRender: ({ text }) => {
      return SampleTypeEnumMap[text];
    },
  },
  {
    title: '核酸浓度（ng/ul）',
    dataIndex: 'nucleicAcidConc',
    width: 140,
  },
  {
    title: '文库浓度（ng/ul）',
    dataIndex: 'libraryConc',
    width: 140,
  },
  {
    title: '临床信息',
    dataIndex: 'clinicalResult',
    width: 140,
    ellipsis: true,
  },
  {
    title: '防错标签',
    dataIndex: 'failSafeTag',
    width: 140,
  },
  {
    title: '报告区域',
    dataIndex: 'byLabel',
    width: 120,
    customRender: ({ text }) => {
      return ByLabelEnumMap[text];
    },
  },
  {
    title: '一审状态',
    dataIndex: 'oneAuditorStatusName',
    width: 140,
  },
  {
    title: '二审状态',
    dataIndex: 'twoAuditorStatusName',
    width: 140,
  },
  {
    title: '一审人员',
    dataIndex: 'oneAuditor',
    width: 140,
  },
  {
    title: '二审人员',
    dataIndex: 'twoAuditor',
    width: 140,
  },
  {
    title: '最后审核时间',
    dataIndex: 'auditTime',
    width: 200,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
  {
    title: '病原体类型',
    dataIndex: 'pathogenType',
    width: 180,
    customRender: ({ text }) => {
      return PathogenTypeEnumMap[text];
    },
  },
  {
    title: '病原体中文名',
    dataIndex: 'pathogenCnSname',
    width: 140,
    ellipsis: true,
  },
  {
    title: '病原体英文名',
    dataIndex: 'pathogenEnSname',
    width: 140,
    ellipsis: true,
  },
  {
    title: '病原体注释',
    dataIndex: 'pathogenComments',
    width: 140,
    ellipsis: true,
  },
  {
    title: 'read数',
    dataIndex: 'reads',
    width: 120,
  },
  {
    title: '该病原同批检出数量',
    dataIndex: 'sameBatchOuts',
    width: 140,
  },
  {
    title: '多引物情况',
    dataIndex: 'multiprimer',
    width: 140,
  },
  {
    title: '相关病原体',
    dataIndex: 'subPathogen',
    width: 140,
  },
  {
    title: '送检单位',
    dataIndex: 'subHospital',
    width: 140,
  },
  {
    title: '送检科室',
    dataIndex: 'subRoom',
    width: 140,
  },
  {
    title: '送检医师',
    dataIndex: 'subDoctor',
    width: 140,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    customRender: ({ text }) => {
      return SexEnumMap[text];
    },
  },
  {
    title: '床号',
    dataIndex: 'bed',
    width: 140,
  },
  {
    title: '住院号',
    dataIndex: 'patientNumber',
    width: 140,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    width: 140,
  },

]

interface MockVal {
  value: string;
}
const options = ref<MockVal[]>([]);
const mockVal = (str: string, repeat = 1): MockVal => {
  return {
    value: str.repeat(repeat),
  };
};
export const searchFormSchema: FormSchema[] = [
  {
    label: '检出时间',
    field: 'checkOutTime',
    component: 'RangePicker',

    colProps: { span: 6 },
  },
  {
    label: '样本编号',
    field: 'sampleCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '批次编号',
    field: 'batchCode',
    component: 'Input',
    colProps: { span: 6 },
  },

  {
    label: '送检单位',
    field: 'subHospital',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '送检科室',
    field: 'subRoom',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '送检医师',
    field: 'subDoctor',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '病原/耐药基因',
    field: 'pathogenGeneName',
    component: 'AutoComplete',
    colProps: { span: 6 },
    componentProps: {
      options: options,
      onSearch: (searchText: string) => {
        if (!searchText) {
          options.value = []
          return
        }

        options.value = pathogenGeneNameList.filter(label => {
          const searchTextLower = searchText.toLowerCase();
          const labelLower = label.toLowerCase();
          return labelLower.indexOf(searchTextLower) >= 0;
        }).map(label => ({
          value: label
        }));

      }
    }

  },

  {
    label: '患者姓名',
    field: 'examineeName',
    component: 'Input',
    colProps: { span: 6 },
  },


  {
    label: '报告区域',
    field: 'byLabelCodes',
    component: 'Select',
    componentProps: {
      options: (() => {
        return Object.entries(ByLabelEnumMap).filter(([key, value]) => {
          if (key === "0" || key === "4" || key === "5") {
            return false
          }
          return true
        }).map(([key, value]) => {
          return { label: value, value: key }
        })
      })(),
      mode: 'multiple',
      placeholder: '请选择报告区域',
    },
    colProps: { span: 6 },
  },

  {
    label: '检测项目',
    field: 'checkTypes',
    component: 'Select',
    componentProps: {
      options: (() => {
        return Object.entries(CheckTypeEnumMap).filter(([key, value]) => {
          if (key == "0") {
            return false
          }
          return true
        }).map(([key, value]) => {
          return { label: value, value: key }
        })
      })(),
      mode: 'multiple',
      placeholder: '请选择检测项目',
    },
    colProps: { span: 6 },
  },
]

export const createFormSchema: FormSchema[] = [
  {
    label: '编号',
    field: 'id',
    show: false,
    component: 'Input',
  },
  {
    label: '病原',
    field: 'pathogenCnSname',
    required: true,
    component: 'Input',
  },
  {
    label: '报告区域',
    field: 'byLabel',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '未知', value: 0 },
        { label: '主报告', value: 1 },
        { label: '疑似致病菌（灰区）', value: 2 },
        { label: '不展示', value: 3 },
        { label: '不展示（背景）', value: 4 },
        // { label: '耐药', value: 5 },
      ],
    },
  },
  {
    label: '均一化reads数',
    field: 'levellingReads',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '样本ID',
    field: 'sampleId',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '受检人姓名',
    field: 'examineeName',
    component: 'Input',
  },
  {
    label: '送检医院',
    field: 'subHospital',
    component: 'Input',
  },
  {
    label: '送检科室',
    field: 'subRoom',
    component: 'Input',
  },
  {
    label: '送检医师',
    field: 'subDoctor',
    component: 'Input',
  },
  {
    label: '样本类型',
    field: 'sampleType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '其他', value: 0 },
        { label: '肺泡灌洗液（BALF）', value: 1 },
        { label: '痰液', value: 2 },
        { label: '鼻/咽拭子', value: 3 },
        { label: '水控', value: 4 },
      ],
    },
  },
  {
    label: '一审人员',
    field: 'oneAuditor',
    component: 'Input',
  },
  {
    label: '二审人员',
    field: 'twoAuditor',
    component: 'Input',
  },
  {
    label: '批次编号',
    field: 'batchCode',
    component: 'Input',
  },
  {
    label: '源编号',
    field: 'sourceCode',
    component: 'Input',
  },
  {
    label: 'sample实验编号',
    field: 'sampleCode',
    component: 'Input',
  },
  {
    label: '任务ID',
    field: 'taskId',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '任务名称',
    field: 'taskName',
    component: 'Input',
  },
  {
    label: '检测项目',
    field: 'checkType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '其他', value: 0 },
        { label: 'tNGS一步法呼吸道', value: 1 },
      ],
    },
  },
  {
    label: '任务审核状态',
    field: 'taskCheckStatus',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '待审核', value: 0 },
        { label: '审核中', value: 1 },
        { label: '已通过', value: 2 },
        { label: '未通过', value: 3 },
      ],
    },
  },
]

export const updateFormSchema: FormSchema[] = [
  {
    label: '编号',
    field: 'id',
    show: false,
    component: 'Input',
  },
  {
    label: '病原',
    field: 'pathogenCnSname',
    required: true,
    component: 'Input',
  },
  {
    label: '报告区域',
    field: 'byLabel',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '未知', value: 0 },
        { label: '主报告', value: 1 },
        { label: '疑似致病菌（灰区）', value: 2 },
        { label: '不展示', value: 3 },
        { label: '不展示（背景）', value: 4 },
        // { label: '耐药', value: 5 },
      ],
    },
  },
  {
    label: '均一化reads数',
    field: 'levellingReads',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '样本ID',
    field: 'sampleId',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '受检人姓名',
    field: 'examineeName',
    component: 'Input',
  },
  {
    label: '送检医院',
    field: 'subHospital',
    component: 'Input',
  },
  {
    label: '送检科室',
    field: 'subRoom',
    component: 'Input',
  },
  {
    label: '送检医师',
    field: 'subDoctor',
    component: 'Input',
  },
  {
    label: '样本类型',
    field: 'sampleType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '其他', value: 0 },
        { label: '肺泡灌洗液（BALF）', value: 1 },
        { label: '痰液', value: 2 },
        { label: '鼻/咽拭子', value: 3 },
        { label: '水控', value: 4 },
      ],
    },
  },
  {
    label: '批次编号',
    field: 'batchCode',
    component: 'Input',
  },
  {
    label: '源编号',
    field: 'sourceCode',
    component: 'Input',
  },
  {
    label: 'sample实验编号',
    field: 'sampleCode',
    component: 'Input',
  },
  {
    label: '任务ID',
    field: 'taskId',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '任务名称',
    field: 'taskName',
    component: 'Input',
  },
  {
    label: '检测项目',
    field: 'checkType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '其他', value: 0 },
        { label: 'tNGS一步法呼吸道', value: 1 },
      ],
    },
  },
  {
    label: '任务审核状态',
    field: 'taskCheckStatus',
    required: true,
    component: 'Select',
    componentProps: {
      options: [
        { label: '待审核', value: 0 },
        { label: '审核中', value: 1 },
        { label: '已通过', value: 2 },
        { label: '未通过', value: 3 },
      ],
    },
  },
]