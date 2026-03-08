import { ProcessStatusEnum, QcStatusEnum } from "@/enums/customEnum";

/**
 * 检测报告列表项模型
 */
export interface DetectionReportItem {
  /**
   * 报告ID
   */
  id: number;

  /**
   * 任务ID
   */
  taskId: number;

  /**
   * 样本ID
   */
  sampleId: number;

  /**
   * 实验编号
   */
  sampleCode: string;

  /**
   * 流程状态
   */
  processStatus: ProcessStatusEnum;

  /**
   * 质控状态
   */
  qcStatus: QcStatusEnum;

  /**
   * 分析完成时间
   */
  finisAnalysisTime: number;

  /**
   * 创建时间
   */
  createTime: number;
}

/**
 * 检测报告查询参数
 */
export interface DetectionReportQuery {
  /**
   * 任务ID
   */
  taskId?: number;

  /**
   * 样本ID
   */
  sampleId?: number;

  /**
   * 投入标签
   */
  inLable?: string;

  /**
   * 检出标签
   */
  outLable?: string;

  /**
   * 污染情况
   */
  pollution?: string;

  /**
   * 阴控质控结果
   */
  cathodicQcResult?: string;

  /**
   * 质粒靶标检出率
   */
  plasmidTagRate?: string;

  /**
   * 文库浓度
   */
  libraryConc?: number;

  /**
   * raw_reads
   */
  rawReads?: number;

  /**
   * clean_reads
   */
  cleanReads?: number;

  /**
   * adapter_rate
   */
  adapterRate?: number;

  /**
   * clean_q_thirty
   */
  cleanQthirty?: number;

  /**
   * map_reads
   */
  mapReads?: number;

  /**
   * map_rate
   */
  mapRate?: number;
} 