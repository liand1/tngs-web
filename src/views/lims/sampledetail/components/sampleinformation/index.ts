import { reactive } from 'vue';
import { SampleData } from './model';

export const createfields = [

];

// 定义字段映射，方便动态渲染
export const fields = [

  { label: '批次编号', key: 'batchCode' },
  { label: '创建时间', key: 'createTime' },
  { label: '创建方式', key: 'createType' },
  { label: '创建后是否被分析', key: 'sampleStatus' },
  { label: '样本原编号', key: 'sourceCode' },
  { label: '样本编号', key: 'sampleCode' },
  { label: '防错标签', key: 'failSafeTag' },
  { label: '样本类型', key: 'sampleType' },
  { label: '检测项目', key: 'checkType' },
  { label: '检测试剂', key: 'checkReagent' },
  { label: '水控', key: 'waterControl' },
  { label: 'I7编号', key: 'i7Code' },
  { label: 'I7序列', key: 'i7Serial' },
  { label: 'I5编号', key: 'i5Code' },
  { label: 'I5序列', key: 'i5Serial' },
  { label: '样本量', key: 'sampleVolume' },
  { label: '样本单位', key: 'sampleUnit' },
  { label: '芯片名称', key: 'fileDataCode' },
  { label: '姓名', key: 'examinee.name' },
  { label: '性别', key: 'examinee.sex' },
  { label: '年龄', key: 'examinee.age' },
  { label: "床号", key: "examinee.bed" },
  { label: '住院号', key: 'examinee.patientNumber' },
  { label: '联系电话', key: 'examinee.phone' },
  { label: '送检单位', key: 'subHospital' },
  { label: '送检科室', key: 'subRoom' },
  { label: '送检医师', key: 'subDoctor' },
  { label: '采样日期', key: 'samplingDate' },
  { label: '接收日期', key: 'collectDate' },
  { label: '临床表现', key: 'clinicalResult.diagnosis' },
  { label: '检测结果', key: 'clinicalResult.result' },
  { label: 'WBC(10^9/L)', key: 'clinicalResult.wbc' },
  { label: '淋巴细胞(%)', key: 'clinicalResult.lym' },
  { label: '中粒细胞(%)', key: 'clinicalResult.gr' },
  { label: 'CRP(mg/L)', key: 'clinicalResult.crp' },
  { label: 'PCT(ng/ml)', key: 'clinicalResult.pct' },
  { label: '重点关注病原体', key: 'clinicalResult.focusPathogen' },
  { label: '核酸浓度', key: 'clinicalResult.nucleicAcidConc' },
  { label: '文库浓度', key: 'clinicalResult.libraryConc' },
  { label: '提取试剂批次', key: 'clinicalResult.getLrBatch' },
  { label: '建库试剂批次', key: 'clinicalResult.putLrBatch' },
  { label: '上机试剂', key: 'clinicalResult.onDeviceLr' },
  { label: '提取实验员', key: 'clinicalResult.getTechnician' },
  { label: '建库实验员', key: 'clinicalResult.putTechnician' },
  { label: '备注', key: 'remark' }
];