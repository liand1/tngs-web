import { getDictDataPage } from '@/api/system/dict/data'
import type { BasicColumn, FormSchema } from '@/components/Table'
import { useRender } from '@/components/Table'
import { SampleStatusEnum } from '@/enums/customEnum'


export const columns: BasicColumn[] = [
  // {
  //   title: '样本ID',
  //   dataIndex: 'id',
  //   width: 160,
  // },
  {
    title: '批次编号',
    dataIndex: 'batchCode',
    width: 160,
  },
  {
    title: '样本原编号',
    dataIndex: 'sourceCode',
    width: 160,
  },
  {
    title: '样本编号',
    dataIndex: 'sampleCode',
    width: 160,
  },
  {
    title: '对应水控',
    dataIndex: 'waterControl',
    width: 160,
  },
  {
    title: '创建人',
    dataIndex: 'creatorName',
    width: 160,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180,
    sorter: (a, b) => a.createTime - b.createTime,
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
  {
    title: '送检单位',
    dataIndex: 'subHospital',
    width: 160,
  },
  {
    title: '姓名',
    dataIndex: 'examineeName',
    width: 160,
  },
  // （0未知；1手动创建；2导入创建；）
  {
    title: '创建来源',
    dataIndex: 'createType',
    width: 160,
  },

  {
    title: '防错标签',
    dataIndex: 'failSafeTag',
    width: 160,
  },
  {
    title: '是否被分析',
    dataIndex: 'sampleStatus',
    customRender: ({ text }) => {
      switch (text) {
        case SampleStatusEnum.NO_ANALYSIS:
          return '否'
        case SampleStatusEnum.FINISH_ANALYSIS:
          return '是'
        default:
          return '-'
      }

    },
    width: 160,
  },
  // （0其他；1肺泡灌洗液（BALF）；2痰液；3鼻/咽拭子；4水控；）
  {
    title: '样本类型',
    dataIndex: 'sampleType',
    width: 160,
  },

  //（0其他；1tNGS一步法呼吸道;  ）
  {
    title: '检测项目',
    dataIndex: 'checkType',
    width: 160,
  },
  {
    title: '检测试剂',
    dataIndex: 'checkReagent',
    width: 160,
  },
  {
    title: '芯片名称',
    dataIndex: 'fileDataCode',
    width: 240,
  },
]

export const searchFormSchema: FormSchema[] = [
  {
    label: '批次编号',
    field: 'batchCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '样本原编号',
    field: 'sourceCode',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '样本编号',
    field: 'sampleCode',
    component: 'Input',
    colProps: { span: 6 },
  },

  {
    label: '样本类型',
    field: 'sampleType',
    component: 'Select',
    componentProps: {
      options: [],
    },
    colProps: { span: 6 },
  },

  {
    label: '检测项目',
    field: 'checkType',
    component: 'Select',
    componentProps: {
      options: [],
    },
    colProps: { span: 6 },
  },

  {
    label: '创建来源',
    field: 'createType',
    component: 'Select',
    colProps: { span: 6 },
  },
  {
    label: '创建时间',
    field: 'createTime',
    component: 'RangePicker',
    colProps: { span: 6 },
  },
  // {
  //   label: '删除时间',
  //   field: 'deletedTime',
  //   component: 'RangePicker',
  //   colProps: { span: 8 },
  // },
]

export const createFormSchema: FormSchema[] = [
  {
    label: '批次编号',
    field: 'batchCode',
    required: true,
    component: 'Select',
    slot: 'batchCodeDropdownRender',
    componentProps: {
      options: [],
    },
  },
  {
    label: '样本原编号',
    field: 'sourceCode',
    component: 'Input',
  },
  {
    label: '样本编号',
    field: 'sampleCode',
    required: true,
    component: 'Input',
  },
  {
    label: '防错标签',
    field: 'failSafeTag',
    required: false,
    component: 'Input',
  },
  {
    label: '样本类型',
    field: 'sampleType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '检测项目',
    field: 'checkType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '检测试剂',
    field: 'checkReagent',
    required: true,
    component: 'Select',
    componentProps: ({ formModel }) => {
      // 根据分类动态生成产品选项
      const checkType = formModel.checkType
      let options = <any>[];
      if (checkType == '1') {
        options = [
          { label: 'v1.0', value: 'v1.0' },
          { label: 'v1.5', value: 'v1.5' }
        ]
      } else if (checkType == '2') {
        options = [
          { label: 'v1.2', value: 'v1.2' },
          { label: 'v1.3', value: 'v1.3' },
        ]
      }
      return {
        options,
        disabled: checkType == undefined ? true : false,
        placeholder: checkType ? '请选择检测试剂' : '请先选择检测项目'
      }
    },
  },
  {
    label: '水控',
    field: 'waterControl',
    required: false,
    component: 'Input',
  },
  {
    label: 'I7编号',
    field: 'i7Code',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: 'I7序列',
    field: 'i7Serial',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: 'I5编号',
    field: 'i5Code',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: 'I5序列',
    field: 'i5Serial',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '样本量',
    field: 'sampleVolume',
    component: 'Input',
  },
  // {
  //   label: '',
  //   field: '',
  //   component: 'Divider',
  //   colProps: { span: 24 },
  // },
  {
    label: '名称',
    field: 'name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '性别',
    field: 'sex',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '男', value: 0 },
        { label: '女', value: 1 },
      ],
    },
  },
  {
    label: '年龄',
    field: 'age',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '住院号',
    field: 'patientNumber',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '床号',
    field: 'bed',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '联系电话',
    field: 'phone',
    component: 'InputNumber',
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
    label: '接收日期',
    field: 'samplingDate',
    component: 'DatePicker',
    colProps: { span: 6 },

  },
  {
    label: '采样日期',
    field: 'collectDate',
    component: 'DatePicker',
    colProps: { span: 6 },

  },
  {
    label: '临床表现',
    field: 'diagnosis',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '检测结果',
    field: 'result',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    colProps: { span: 24 },
  },
  {
    label: 'WBC(10^9/L)',
    field: 'wbc',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '淋巴细胞(%)',
    field: 'lym',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '中粒细胞(%)',
    field: 'gr',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: 'CRP(mg/L)',
    field: 'crp',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: 'PCT(ng/ml)',
    field: 'pct',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '重点关注病原体',
    field: 'focusPathogen',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '核酸浓度',
    field: 'nucleicAcidConc',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '文库浓度',
    field: 'libraryConc',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '提取试剂批次',
    field: 'getLrBatch',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '建库试剂批次',
    field: 'putLrBatch',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '上机试剂',
    field: 'onDeviceLr',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '提取实验员',
    field: 'getTechnician',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '建库实验员',
    field: 'putTechnician',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
]

export const updateFormSchema: FormSchema[] = [
  {
    label: 'id',
    field: 'id',
    show: false,
    component: 'Input'
  },
  {
    label: 'examineeid',
    field: 'examinee.id',
    show: false,
    component: 'Input'
  },
  {
    label: 'clinicalResultid',
    field: 'clinicalResult.id',
    show: false,
    component: 'Input'
  },
  {
    label: '批次编号',
    field: 'batchCode',
    required: true,
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '样本原编号',
    field: 'sourceCode',
    component: 'Input',
  },
  {
    label: '样本编号',
    field: 'sampleCode',
    required: true,
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '防错标签',
    field: 'failSafeTag',
    component: 'Input',
  },
  {
    label: '样本类型',
    field: 'sampleType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '检测项目',
    field: 'checkType',
    required: true,
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: '检测试剂',
    field: 'checkReagent',
    required: true,
    component: 'Select',
    componentProps: ({ formModel }) => {
          // 根据分类动态生成产品选项
          const checkType = formModel.checkType
          let options = <any>[];
          if (checkType == '1') {
            options = [
              { label: 'v1.0', value: 'v1.0' },
              { label: 'v1.5', value: 'v1.5' }
            ]
          } else if (checkType == '2') {
            options = [
              { label: 'v1.2', value: 'v1.2' },
              { label: 'v1.3', value: 'v1.3' },
            ]
          }
          return {
            options,
            disabled: checkType == undefined ? true : false,
            placeholder: checkType ? '请选择检测试剂' : '请先选择检测项目'
          }
        }
  },
  {
    label: '水控',
    field: 'waterControl',
    required: false,
    component: 'Input',
  },
  {
    label: 'I7编号',
    field: 'i7Code',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: 'I7序列',
    field: 'i7Serial',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: 'I5编号',
    field: 'i5Code',
    component: 'Select',
    componentProps: {
      options: [],
    },
  },
  {
    label: 'I5序列',
    field: 'i5Serial',
    component: 'Input',
    dynamicDisabled: true,
  },
  {
    label: '样本量',
    field: 'sampleVolume',
    component: 'Input',
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    colProps: { span: 24 },
  },
  {
    label: '名称',
    field: 'examinee.name',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '性别',
    field: 'examinee.sex',
    component: 'Select',
    colProps: { span: 6 },
    componentProps: {
      options: [
        { label: '未知', value: 0 },
        { label: '男', value: 1 },
        { label: '女', value: 2 },
      ],
    },
  },
  {
    label: '年龄',
    field: 'examinee.age',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '住院号',
    field: 'examinee.patientNumber',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '床号',
    field: 'examinee.bed',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '联系电话',
    field: 'examinee.phone',
    component: 'InputNumber',
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
    label: '接收日期',
    field: 'samplingDate',
    component: 'DatePicker',
    colProps: { span: 6 },

  },
  {
    label: '采样日期',
    field: 'collectDate',
    component: 'DatePicker',
    colProps: { span: 6 },

  },
  {
    label: '临床表现',
    field: 'clinicalResult.diagnosis',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '检测结果',
    field: 'clinicalResult.result',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '',
    field: '',
    component: 'Divider',
    colProps: { span: 24 },
  },
  {
    label: 'WBC(10^9/L)',
    field: 'clinicalResult.wbc',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '淋巴细胞(%)',
    field: 'clinicalResult.lym',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '中粒细胞(%)',
    field: 'clinicalResult.gr',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: 'CRP(mg/L)',
    field: 'clinicalResult.crp',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: 'PCT(ng/ml)',
    field: 'clinicalResult.pct',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '重点关注病原体',
    field: 'clinicalResult.focusPathogen',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '核酸浓度',
    field: 'clinicalResult.nucleicAcidConc',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '文库浓度',
    field: 'clinicalResult.libraryConc',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '提取试剂批次',
    field: 'clinicalResult.getLrBatch',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '建库试剂批次',
    field: 'clinicalResult.putLrBatch',
    component: 'InputNumber',
    colProps: { span: 6 },
  },
  {
    label: '上机试剂',
    field: 'clinicalResult.onDeviceLr',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '提取实验员',
    field: 'clinicalResult.getTechnician',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '建库实验员',
    field: 'clinicalResult.putTechnician',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    colProps: { span: 24 },
  },
]