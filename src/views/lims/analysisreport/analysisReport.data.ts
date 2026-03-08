import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'
import { h } from 'vue'
import {
  AnalysisTaskTypeEnumMap,
  CheckStatusEnumMap,
  ExcavateDeeplyEnumMap,
  QcStatusEnumMap,
  TaskStatusEnumMap,
  ExcavateDeeplyEnum,
  CheckTypeEnumMap,
  OneAuditStatusEnumMap,
  TwoAuditStatusEnumMap,
  OneAuditStatusEnum,
  TwoAuditStatusEnum,
  SampleTypeEnum
} from '@/enums/customEnum'

export const columns: BasicColumn[] = [
  // {
  //   title: '任务ID',
  //   dataIndex: 'id',
  //   width: 80,
  //   fixed: 'left',
  // },
  {
    title: '任务名称',
    dataIndex: 'name',
    width: 150,
  },


  // 送检单位


  {
    title: '任务创建人',
    dataIndex: 'creatorName',
    width: 120,
  },

  {
    title: '任务完成时间',
    dataIndex: 'endTime',
    width: 180,
    customRender: ({ text }) => {
      return text ? useRender.renderDate(text) : '';
    },
  },

  {
    title: '检测项目',
    dataIndex: 'typeName',
    width: 150,
  },

  // 检测项目

  {
    title: '质控结果',
    dataIndex: 'qcStatus',
    width: 120,
    slots: {
      customRender: 'qcStatus',
    },
  },

  {
    title: '任务分析状态',
    dataIndex: 'taskStatus',
    width: 120,
    slots: {
      customRender: 'taskStatus',
    },
    // customRender: ({ text }) => {
    //   return TaskStatusEnumMap[text];
    // },
  },

  {
    title: '审核状态',
    dataIndex: 'checkStatus',
    width: 120,
    slots: {
      customRender: 'checkStatus',
    },
  },

  {
    title: '并行样本数',
    dataIndex: 'taskCount',
    width: 100,
  },
  {
    title: '单样本线程数',
    dataIndex: 'threadCount',
    width: 100,
  },
  {
    title: '测序长度',
    dataIndex: 'seqLength',
    width: 100,
  },


]

export const searchFormSchema: FormSchema[] = [
  {
    label: '任务名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '任务分析状态',
    field: 'taskStatus',
    component: 'Select',
    componentProps: {
      options: [{
        label: "全部",
        value: null
      }, ...Object.entries(TaskStatusEnumMap).map(([value, label]) => ({ value: Number(value), label }))],
      placeholder: '请选择任务状态',
    },
    colProps: { span: 8 },
  },
  {
    label: '质控结果',
    field: 'qcStatus',
    component: 'Select',
    componentProps: {
      options: [{
        label: "全部",
        value: null
      }, ...Object.entries(QcStatusEnumMap).map(([value, label]) => ({ value: Number(value), label }))],

      placeholder: '请选择质控结果',
    },
    colProps: { span: 8 },
  },
  {
    label: '审核状态',
    field: 'checkStatus',
    component: 'Select',
    componentProps: {
      options: [{
        label: "全部",
        value: null
      }, ...Object.entries(CheckStatusEnumMap).map(([value, label]) => ({ value: Number(value), label }))],
      placeholder: '请选择审核状态',
    },
    colProps: { span: 8 },
  },
  {
    label: '任务创建人',
    field: 'creator',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 8 },
  },
  // {
  //   label: '分析时间',
  //   field: 'analysisTime',
  //   component: 'RangePicker',
  //   colProps: { span: 8 },
  // },
 
]

export const createFormSchema: FormSchema[] = [
  {
    label: '编号',
    field: 'id',
    show: false,
    component: 'Input',
  },
  {
    label: '任务名称',
    field: 'name',
    required: true,
    component: 'Input',
  },
  {
    label: '类型',
    field: 'type',
    required: true,
    component: 'Select',
    componentProps: {
      options: Object.entries(AnalysisTaskTypeEnumMap).map(([value, label]) => ({ value: Number(value), label })),
    },
  },
  {
    label: '芯片ID',
    field: 'socId',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '线程数',
    field: 'threadCount',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '任务数',
    field: 'taskCount',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '测序长度',
    field: 'seqLength',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '深度挖掘',
    field: 'excavateDeeply',
    component: 'RadioButtonGroup',
    defaultValue: ExcavateDeeplyEnum.NO,
    componentProps: {
      options: Object.entries(ExcavateDeeplyEnumMap).map(([value, label]) => ({ value: Number(value), label })),
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
    label: '任务名称',
    field: 'name',
    required: true,
    component: 'Input',
  },
  {
    label: '类型',
    field: 'type',
    required: true,
    component: 'Select',
    componentProps: {
      options: Object.entries(AnalysisTaskTypeEnumMap).map(([value, label]) => ({ value: Number(value), label })),
    },
  },
  {
    label: '芯片ID',
    field: 'socId',
    required: true,
    component: 'InputNumber',
    dynamicDisabled: true,
  },
  {
    label: '线程数',
    field: 'threadCount',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '任务数',
    field: 'taskCount',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '测序长度',
    field: 'seqLength',
    required: true,
    component: 'InputNumber',
  },
  {
    label: '深度挖掘',
    field: 'excavateDeeply',
    component: 'RadioButtonGroup',
    componentProps: {
      options: Object.entries(ExcavateDeeplyEnumMap).map(([value, label]) => ({ value: Number(value), label })),
    },
  },
  {
    label: '任务状态',
    field: 'taskStatus',
    component: 'Select',
    componentProps: {
      options: Object.entries(TaskStatusEnumMap).map(([value, label]) => ({ value: Number(value), label })),
    },
    dynamicDisabled: true,
  },
  {
    label: '质控结果',
    field: 'qcStatus',
    component: 'Select',
    componentProps: {
      options: Object.entries(QcStatusEnumMap).map(([value, label]) => ({ value: Number(value), label })),
    },
    dynamicDisabled: true,
  },
  {
    label: '审核状态',
    field: 'checkStatus',
    component: 'Select',
    componentProps: {
      options: Object.entries(CheckStatusEnumMap).map(([value, label]) => ({ value: Number(value), label })),
    },
    dynamicDisabled: true,
  },
]



export const analysisReportDataColumns: BasicColumn[] = [
  // 文件名

  {
    title: '样本编号',
    dataIndex: 'sampleCode',
    width: 120,
  },
  {
    title: '试剂批次',
    dataIndex: 'putLrBatch',
    width: 130,
  },
  {
    title: '文件大小',
    dataIndex: 'socDataFileSize',
    width: 140,
  },

  {
    title: '检测项目',
    dataIndex: 'checkType',
    width: 150,
    customRender: ({ text }) => {
      return CheckTypeEnumMap[text];
    },
  },
  {
    title: '质控结果',
    dataIndex: 'qcStatus',
    width: 120,
    slots: {
      customRender: 'qcStatus',
    },
  },

  {
    title: '一审状态',
    dataIndex: 'oneAuditStatus',
    width: 100,
    customRender: ({ text, record }) => {
      if (record.sampleType === SampleTypeEnum.WATER_CONTROL) {
        return "-";
      }


      let color = '';
      switch (text) {
        case OneAuditStatusEnum.PASSED: // 已通过
          color = '#52C41A'; // 绿色
          break;
        case OneAuditStatusEnum.REJECTED: // 不通过
          color = '#F5222D'; // 红色
          break;
        case OneAuditStatusEnum.WAITING: // 待审核
          color = '#1890FF'; // 蓝色
          break;
        case OneAuditStatusEnum.CHECKING: // 审核中
          color = '#1890FF'; // 橙色
          break;
        case OneAuditStatusEnum.NO_AUDIT: // 无需审核
          color = '#BFBFBF'; // 灰色
          break; // 默认颜色

      }


      return h('span', { style: { color } }, text ? "● " + OneAuditStatusEnumMap[text] : "");
    },
  },

  {
    title: '二审状态',
    dataIndex: 'twoAuditStatus',
    width: 100,
    customRender: ({ text, record }) => {
      if (record.sampleType === SampleTypeEnum.WATER_CONTROL) {
        return "-";
      }

      let color = '';
      switch (text) {
        case TwoAuditStatusEnum.PASSED: // 已通过
          color = '#52C41A'; // 绿色
          break;
        case TwoAuditStatusEnum.REJECTED: // 不通过
          color = '#F5222D'; // 红色
          break;
        case TwoAuditStatusEnum.WAITING: // 待审核
          color = '#1890FF'; // 蓝色
          break;
        case TwoAuditStatusEnum.CHECKING: // 审核中
          color = '#1890FF'; // 橙色
          break;
        case TwoAuditStatusEnum.NO_AUDIT: // 无需审核
          color = '#BFBFBF'; // 灰色
          break;
      }
      return h('span', { style: { color } }, text ? "● " + TwoAuditStatusEnumMap[text] : "");
    },
  },
  {
    title: '备注',
    dataIndex: 'sampleRemarks',
    width: 300,
  },
  {
    width: 70,
    dataIndex: "action",
    fixed: "right",
    slots: {
      customRender: 'action',
    },
  },
]