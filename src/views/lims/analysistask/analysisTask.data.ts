import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'
import { CheckStatusEnum, CheckTypeEnum, CheckTypeEnumMap, ExcavateDeeplyEnum, ProcessStatusEnum, ProcessStatusEnumMap, QcStatusEnum, QcStatusEnumMap, TaskStatusEnum } from '@/enums/customEnum';

export const columns: BasicColumn[] = [
  // {
  //   title: '任务ID',
  //   dataIndex: 'id',
  //   width: 160,
  // },
  {
    title: '任务名称',
    dataIndex: 'name',
  },
  {
    title: '任务创建人',
    dataIndex: 'creatorName',

  },
  {
    title: '任务创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
  //（1：tNGS一步法呼吸道；0：其他；）
  {
    title: '检测项目',
    dataIndex: 'typeName',
  },

  //（0：待分析完成；1：合格；2：不合格；）
  {
    title: '质控结果',
    dataIndex: 'qcStatus',
    slots: {
      customRender: 'qcStatus',
    },
  },
  //（0：等待分析；1：分析中；2：已完成分析；3：分析失败；）
  {
    title: '任务分析状态',
    dataIndex: 'taskStatus',
    slots: {
      customRender: 'taskStatus',
    },
  },

  //需要计算
  {
    title: '分析进度',
    dataIndex: '',
    slots: {
      customRender: 'analysisProgress',
    },
  },

  //需要计算
  {
    title: '并行样本',
    dataIndex: 'threadCount',

  },

  {
    title: '单样本线程数',
    dataIndex: 'taskCount',

  },

  //(75/150，默认75)
  {
    title: '测序长度',
    dataIndex: 'seqLength',

  },

]


// 任务名称、创建人员、分析状态、质控结果、创建时间
export const searchFormSchema: FormSchema[] = [
  {
    label: '任务名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    label: '任务创建人员',
    field: 'creator',
    component: 'Input',
    colProps: { span: 8 },
  },

  {
    label: '任务分析状态',
    field: 'taskStatus',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [],
    },
  },
  {
    label: '质控结果',
    field: 'qcStatus',
    component: 'Select',
    colProps: { span: 8 },
    componentProps: {
      options: [],
    },
  },

  {
    label: '创建时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 8 },
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
    label: '任务名称',
    field: 'name',
    component: 'Input',
  },
  {
    label: '类型（1：tNGS一步法呼吸道；0：其他；）',
    field: 'type',
    required: true,
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '芯片ID',
    field: 'socId',
    required: true,
    component: 'Input',
  },
  {
    label: '线程数',
    field: 'threadCount',
    required: true,
    component: 'Input',
  },
  {
    label: '任务数',
    field: 'taskCount',
    required: true,
    component: 'Input',
  },
  {
    label: '测序长度(75/150，默认75)',
    field: 'seqLength',
    required: true,
    component: 'Input',
  },
  {
    label: '启动深度挖掘（0：否；1：是；）',
    field: 'excavateDeeply',
    component: 'Input',
  },
  {
    label: '任务状态（0：等待分析；1：分析中；2：已完成分析；3：分析失败；）',
    field: 'taskStatus',
    required: true,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '质控结果（0：待分析完成；1：合格；2：不合格；）',
    field: 'qcStatus',
    required: true,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '审核状态（0：待审核；1：审核中；2：已通过；3：未通过；）',
    field: 'checkStatus',
    required: true,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '开始时间',
    field: 'startTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
  {
    label: '结束时间',
    field: 'endTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
  {
    label: '分析进度说明',
    field: 'schedule',
    component: 'Input',
  },
  {
    label: '删除时间',
    field: 'deletedTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
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
    component: 'Input',
  },
  {
    label: '类型（1：tNGS一步法呼吸道；0：其他；）',
    field: 'type',
    required: true,
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '芯片ID',
    field: 'socId',
    required: true,
    component: 'Input',
  },
  {
    label: '线程数',
    field: 'threadCount',
    required: true,
    component: 'Input',
  },
  {
    label: '任务数',
    field: 'taskCount',
    required: true,
    component: 'Input',
  },
  {
    label: '测序长度(75/150，默认75)',
    field: 'seqLength',
    required: true,
    component: 'Input',
  },
  {
    label: '启动深度挖掘（0：否；1：是；）',
    field: 'excavateDeeply',
    component: 'Input',
  },
  {
    label: '任务状态（0：等待分析；1：分析中；2：已完成分析；3：分析失败；）',
    field: 'taskStatus',
    required: true,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '质控结果（0：待分析完成；1：合格；2：不合格；3：预警）',
    field: 'qcStatus',
    required: true,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '审核状态（0：待审核；1：审核中；2：已通过；3：未通过；）',
    field: 'checkStatus',
    required: true,
    component: 'RadioButtonGroup',
    componentProps: {
      options: [],
    },
  },
  {
    label: '开始时间',
    field: 'startTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
  {
    label: '结束时间',
    field: 'endTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
  {
    label: '分析进度说明',
    field: 'schedule',
    component: 'Input',
  },
  {
    label: '删除时间',
    field: 'deletedTime',
    required: true,
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'x',
    },
  },
]



export const analysisDataColumns: BasicColumn[] = [
  {
    title: '样本编号',
    dataIndex: 'sampleCode',
    key: 'sampleCode',
  },
  {
    title: '试剂批次（上机）',
    dataIndex: 'putLrBatch',
    key: 'putLrBatch',
  },
  {
    title: '文件大小',
    dataIndex: 'socDataFileSize',
    key: 'socDataFileSize',
  },
  {
    title: '检测项目',
    dataIndex: 'checkType',
    key: 'checkType',
    customRender: ({ text }) => {
      return CheckTypeEnumMap[text]
    },
  },
  {
    title: '分析状态',
    dataIndex: 'processStatus',
    key: 'processStatus',
    customRender: ({ text }) => {
      return ProcessStatusEnumMap[text]
    },
  },
  {
    title: '质控结果',
    dataIndex: 'qcStatus',
    key: 'qcStatus',
    slots: {
      customRender: 'qcStatus',
    },

  },
  {
    title: '备注',
    dataIndex: 'sampleRemarks',
    key: 'sampleRemarks',
    width: 200,
  }
]
