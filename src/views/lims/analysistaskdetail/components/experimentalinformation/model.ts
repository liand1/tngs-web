import { AnalysisReportAuditRespVO } from "@/api/lims/analysistask/model";
import { FindAnalysisReportDetailsModel } from "@/views/lims/analysistaskdetail/model";


/**
 * 字段配置接口
 */
export interface FieldConfig {
  /** 字段标签名称 */
  label: string;
  /** 字段数据路径 */
  key: string;
}

/**
 * ExperimentalInformation组件属性接口
 */
export interface ExperimentalInformationProps {
  /** 查找分析报告详情模型 */
  findAnalysisReportDetails?: FindAnalysisReportDetailsModel;
  /** 报告 */
  report?: AnalysisReportAuditRespVO;
}

/**
 * 时间字段数组
 */
export const timeFields = ['sample.samplingDate', 'sample.collectDate', 'sample.createTime', 'startTime', 'finisTime'];

/**
 * 枚举映射类型
 */
export interface EnumMappings {
  [key: string]: {
    [key: number]: string;
  };
}

/**
 * 字段定义列表
 * 定义字段映射，方便动态渲染
 */
export const fields: FieldConfig[] = [
  { label: '样本原编号', key: 'sample.sourceCode' },
  { label: '样本编号', key: 'sample.sampleCode' },
  { label: '防错标签', key: 'sample.failSafeTag' },
  { label: '样本类型', key: 'sample.sampleType' },
  { label: '检测项目', key: 'sample.checkType' },
  { label: '检测试剂', key: 'sample.checkReagent' },
  { label: '水控', key: 'sample.waterControl' },
  { label: 'I7编号', key: 'sample.i7Code' },
  { label: 'I7序列', key: 'sample.i7Serial' },
  { label: 'I5编号', key: 'sample.i5Code' },
  { label: 'I5序列', key: 'sample.i5Serial' },
  { label: '样本量', key: 'sample.sampleVolume' },
  { label: '分析开始时间', key: 'startTime' },
  { label: '分析结束时间', key: 'finisTime' },
  { label: '姓名', key: 'sample.examinee.name' },
  { label: '性别', key: 'sample.examinee.sex' },
  { label: '年龄', key: 'sample.examinee.age' },
  { label: '住院号', key: 'sample.examinee.patientNumber' },
  { label: '床号', key: 'sample.examinee.bed' },
  { label: '联系电话', key: 'sample.examinee.phone' },
  { label: '送检单位', key: 'sample.subHospital' },
  { label: '送检科室', key: 'sample.subRoom' },
  { label: '送检医师', key: 'sample.subDoctor' },
  { label: '采样日期', key: 'sample.samplingDate' },
  { label: '临床表现', key: 'sample.clinicalResult.diagnosis' },
  { label: '检测结果', key: 'sample.clinicalResult.result' },
  { label: 'WBC(10^9/L)', key: 'sample.clinicalResult.wbc' },
  { label: '淋巴细胞(%)', key: 'sample.clinicalResult.lym' },
  { label: '中粒细胞(%)', key: 'sample.clinicalResult.gr' },
  { label: 'CRP(mg/L)', key: 'sample.clinicalResult.crp' },
  { label: 'PCT(ng/ml)', key: 'sample.clinicalResult.pct' },
  { label: '重点关注病原体', key: 'sample.clinicalResult.focusPathogen' },
  { label: '核酸浓度', key: 'sample.clinicalResult.nucleicAcidConc' },
  { label: '文库浓度', key: 'sample.clinicalResult.libraryConc' },
  { label: '提取试剂批次', key: 'sample.clinicalResult.getLrBatch' },
  { label: '建库试剂批次', key: 'sample.clinicalResult.putLrBatch' },
  { label: '上机试剂', key: 'sample.clinicalResult.onDeviceLr' },
  { label: '提取实验员', key: 'sample.clinicalResult.getTechnician' },
  { label: '建库实验员', key: 'sample.clinicalResult.putTechnician' },
  { label: '备注', key: 'sample.remark' }
];
