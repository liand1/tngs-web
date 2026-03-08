import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'
import { MD5IntegrityStatusEnumMap } from '@/enums/customEnum'



export const columns: BasicColumn[] = [
  // {
  //   title: '芯片ID',
  //   dataIndex: 'id',
  //   width: 160,
  // },
  {
    title: '芯片名称',
    dataIndex: 'socName',

  },
  {
    title: '芯片原名称',
    dataIndex: 'sourceName',

  },

  {
    title: '下机时间',
    dataIndex: 'createTime',
    width: 160,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },

  {
    title: '实验人员',
    dataIndex: 'technician',

  },
  // （0：未知；1：手动创建；2：固定路径导入；）
  {
    title: '创建来源',
    dataIndex: 'createType',

  },
  {
    title: '文件完整性',
    dataIndex: 'fileVerifyStatus',
    slots: {
      customRender: 'fileVerifyStatus',
    },

  },
  {
    title: '样本关联状态',
    dataIndex: 'sampleReStatus',

  },
  {
    title: '文件大小',
    dataIndex: 'dataVolume',

  },
  {
    title: '芯片报告',
    dataIndex: 'reportAddress',

    slots: {
      customRender: 'reportAddress',
    },
  },
  {
    title: '样本数',
    dataIndex: 'waitSampleCount',
    customRender: ({ text, record }) => {
      return `${text}/${record.sampleCount}`
    },
  },
  {
    title: '试剂批次',
    dataIndex: 'lrBatch',

  },
  {
    title: '调用状态',
    dataIndex: 'callStatus',

  },
  // （0：未知；1：合格；2：不合格；）
  {
    title: '质控结果',
    dataIndex: 'qcStatus',

    slots: {
      customRender: 'qcStatus',
    },
  },



  // {
  //   title: '删除时间',
  //   dataIndex: 'deletedTime',
  //   width: 180,
  //   customRender: ({ text }) => {
  //     return useRender.renderDate(text)
  //   },
  // },
]
// 芯片名称、实验人员、质控结果、创建来源、创建时间段、下机时间段。
export const searchFormSchema: FormSchema[] = [
  {
    label: '芯片名称',
    field: 'socName',
    component: 'Input',
    colProps: { span: 6 },
  },

  {
    label: '实验人员',
    field: 'technician',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '质控结果',
    field: 'qcStatus',
    component: 'Select',
    componentProps: {
      options: [],
    },
    colProps: { span: 6 },
  },
  // （0：未知；1：手动创建；2：固定路径导入；）
  {
    label: '创建来源',
    field: 'createType',
    component: 'Select',
    componentProps: {
      options: [],
    },
    colProps: { span: 6 },
  },

  {
    label: '下机时间',
    field: 'createTime',
    component: 'RangePicker',
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
    label: '芯片编号',
    field: 'socCode',
    component: 'Input',
  },

  {
    label: '实验人',
    field: 'technician',
    component: 'Input',
  },
  {
    label: '数据量',
    field: 'dataVolume',
    component: 'Input',
  },
  {
    label: '样本数',
    field: 'sampleCount',
    component: 'Input',
  },
  {
    label: '试剂批次',
    field: 'lrBatch',
    component: 'Input',
  },
  // （0：未知；1：合格；2：不合格；）
  {
    label: '质控结果',
    field: 'qcStatus',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  // （0：未知；1：手动创建；2：固定路径导入；）
  {
    label: '创建来源',
    field: 'createType',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '报告地址',
    field: 'reportAddress',
    component: 'Input',
  },
  // {
  //   label: '删除时间',
  //   field: 'deletedTime',
  //   required: true,
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     format: 'YYYY-MM-DD HH:mm:ss',
  //     valueFormat: 'x',
  //   },
  // },
]

export const updateFormSchema: FormSchema[] = [
  {
    label: '编号',
    field: 'id',
    show: false,
    component: 'Input',
  },
  {
    label: '芯片编号',
    field: 'socCode',
    component: 'Input',
  },

  {
    label: '实验人',
    field: 'technician',
    component: 'Input',
  },
  {
    label: '数据量',
    field: 'dataVolume',
    component: 'Input',
  },
  {
    label: '样本数',
    field: 'sampleCount',
    component: 'Input',
  },
  {
    label: '试剂批次',
    field: 'lrBatch',
    component: 'Input',
  },
  // （0：未知；1：合格；2：不合格；）
  {
    label: '质控结果',
    field: 'qcStatus',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  // （0：未知；1：手动创建；2：固定路径导入；）
  {
    label: '创建来源',
    field: 'createType',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '报告地址',
    field: 'reportAddress',
    component: 'Input',
  },
  // {
  //   label: '删除时间',
  //   field: 'deletedTime',
  //   required: true,
  //   component: 'DatePicker',
  //   componentProps: {
  //     showTime: true,
  //     format: 'YYYY-MM-DD HH:mm:ss',
  //     valueFormat: 'x',
  //   },
  // },
]




export const socDataColumns: BasicColumn[] = [
  {
    title: '文件名',
    dataIndex: 'fileName',
    slots: {
      customRender: 'fileName',
    },
    // width:100
  },
  {
    title: '文件完整性',
    dataIndex: 'integrityStatus',
    slots: {
      customRender: 'integrityStatus',
    },
    width: 150,
  },
  {
    title: '关联样本编号',
    dataIndex: 'sampleCode',
    width: 150,
  },
  {
    title: '关联批次编号',
    dataIndex: 'sampleBatchCode',
    width: 120,
  },
  {
    title: '芯片号',
    dataIndex: 'fileDataCode',
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',

    // customRender: ({ text }) => {
    //   return text + 'kb'
    // },
  }
]
