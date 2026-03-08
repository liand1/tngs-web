import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'

export const columns: BasicColumn[] = [
  // {
  //   title: '芯片ID',
  //   dataIndex: 'id',
  //   width: 160,
  // },
  {
    title: '芯片名称',
    dataIndex: 'socCode',
    width: 160,
  },
  {
    title: '下机时间',
    dataIndex: 'downDeviceDate',
    width: 160,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },

  {
    title: '实验人员',
    dataIndex: 'technician',
    width: 160,
  },
  // （0：未知；1：手动创建；2：固定路径导入；）
  {
    title: '创建来源',
    dataIndex: 'createType',
    width: 160,
  },
  {
    title: '数据量',
    dataIndex: 'dataVolume',
    width: 160,
  },
  {
    title: '报告地址',
    dataIndex: 'reportAddress',
    width: 160,
  },
  {
    title: '样本数',
    dataIndex: 'sampleCount',
    width: 160,
  },
  {
    title: '试剂批次',
    dataIndex: 'lrBatch',
    width: 160,
  },
  // （0：未知；1：合格；2：不合格；）
  {
    title: '质控结果',
    dataIndex: 'qcStatus',
    width: 160,
  },

]
// 芯片名称、实验人员、质控结果、创建来源、创建时间段、下机时间段。
export const searchFormSchema: FormSchema[] = [
  {
    label: '芯片名称',
    field: 'socCode',
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
    field: 'downDeviceDate',
    component: 'RangePicker',
    colProps: { span: 8 },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 8 },
  },

]

