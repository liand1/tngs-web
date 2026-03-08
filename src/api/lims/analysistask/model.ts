import { AnalysisTaskTypeEnum, CheckStatusEnum, CheckTypeEnum, ExcavateDeeplyEnum, OneAuditStatusEnum, ProcessStatusEnum, QcStatusEnum, RebuildObjectTypeEnum, SampleStatusEnum, SampleTypeEnum, SeqLengthEnum, TaskStatusEnum, TwoAuditStatusEnum } from "@/enums/customEnum";
import { SampleSocRespVO } from "../sample/model";

/**
 * 创建分析任务请求参数
 */
export interface CreateAnalysisTaskReqVO {
  /**
   * 任务ID（可选）
   */
  id?: number;

  /**
   * 任务名称（名称_数字）
   */
  name?: string;

  /**
   * 类型（1：tNGS一步法；0：其他；）
   */
  type: AnalysisTaskTypeEnum;

  /**
   * 芯片ID
   */
  socId?: number;

  /**
   * 芯片名称
   */
  socName?: string;

  /**
   * 芯片文件目录
   */
  socFilePath?: string;

  /**
   * 线程数/并行样本数
   */
  threadCount: number;

  /**
   * 任务数/单样本数(单样本线程数不宜超过服务器最⼤线程数)
   */
  taskCount: number;

  /**
   * 测序长度(75/150，默认：75；)
   */
  seqLength: number;

  /**
   * 启动深度挖掘（0：否；1：是；）默认：0；
   */
  excavateDeeply?: ExcavateDeeplyEnum;

   /**
   * 启用近缘区分
   */
   ckd?: ExcavateDeeplyEnum;

   /**
    * 启用株系校正
    */
   sc?: ExcavateDeeplyEnum;

  /**
   * 分析进度说明
   */
  schedule?: string;

  /**
   * 样本Id列表
   */
  sampleIds?: number[];

  /**
   * 样本清单
   */
  sampleData?: SampleSocRespVO[];
}

/**
 * 分析任务审核分页结果
 */
export type AnalysisTaskAuditPageResult = PageResult<AnalysisTaskAuditRespVO>;

/**
 * 分析任务审核信息
 */
export interface AnalysisTaskAuditRespVO {
  /**
   * 任务ID
   */
  id: number;

  /**
   * 创建者
   */
  creatorName: string;

  /**
   * 任务名称
   */
  name?: string;

  /**
   * 类型（1：tNGS一步法一步法；0：其他；）
   */
  type: number;

  typeName: string;

  /**
   * 芯片ID
   */
  socId: number;

  /**
   * 线程数/并行样本数
   */
  threadCount: number;

  /**
   * 任务数/单样本数(单样本线程数不宜超过服务器最⼤线程数)
   */
  taskCount: number;

  /**
   * 测序长度(75/150，默认：75；)
   */
  seqLength: number;

  /**
   * 启动深度挖掘（0：否；1：是；）默认：0；
   */
  excavateDeeply?: ExcavateDeeplyEnum;

  /**
   * 任务状态（0：已创建分析任务；1：等待分析；2：分析中；3：已完成分析；4：分析失败；）
   */
  taskStatus: TaskStatusEnum;

  /**
   * 一审人
   */
  oneAuditor?: string;

  /**
   * 二审人
   */
  twoAuditor?: string;

  /**
   * 一审人ID
   */
  oneAuditorId?: number;

  /**
   * 二审人ID
   */
  twoAuditorId?: number;

  /**
   * 重出报告人ID
   */
  againReportUid?: number;

  /**
   * 重出报告人账号
   */
  againReportUser?: string;

  /**
   * 质控结果（0：待分析完成；1：合格；2：不合格；）
   */
  qcStatus: QcStatusEnum;

  /**
   * 审核状态（0：待审核；1：审核中；2：已通过；3：未通过；）
   */
  checkStatus: CheckStatusEnum;


  /**
   * 下载分析结果表
   */
  resultFileUrl: string;

  /**
   * 开始时间
   */
  startTime: number;

  /**
   * 结束时间
   */
  endTime: number;

  /**
   * 分析进度说明
   */
  schedule?: string;

  /**
   * 创建者
   */
  creator?: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 任务报告数
   */
  reportCount: number;

  /**
   * 任务报告-质控不合格数量
   */
  reportQcFailCount: number;

  /**
   * 任务报告-质控预警数量
   */
  reportQcWarningCount: number;

  /**
   * 任务报告-已完成分析数量
   */
  reportFinishCount: number;

  /**
   * 任务报告列表
   */
  reportList?: AnalysisReportAuditRespVO[];

  /**
   * 任务报告一审通过数
   */
  oneAuditPassCount?: number;

  /**
   * 任务报告二审通过数
   */
  twoAuditPassCount?: number;
}

/**
 * 分析报告审核信息
 */
export interface AnalysisReportAuditRespVO {
  /**
   * 报告ID
   */
  id: number;

  /**
   * 任务ID
   */
  taskId: number;

  /**
   * 样本Id
   */
  sampleId: number;

  /**
   * 实验编号（Sample名需要存在于测序数据文件中）
   */
  sampleCode: string;

  /**
   * 受检人姓名
   */
  examineeName: string;

  /**
   * 流程状态（0：未知；1：已创建分析任务；2：任务分析中；3：任务分析失败；4：等待生成结果；5：生成分析结果；6：一审通过；7：一审未通过；8：二审通过；9：二审未通过；10：出具报告；）
   */
  processStatus: ProcessStatusEnum;

  /**
   * 质控状态（0：等待质控；1：合格；2：不合格；）
   */
  qcStatus: QcStatusEnum;

  /**
   * 开始时间
   */
  startTime?: number;

  /**
   * 完成时间
   */
  finisTime?: number;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 检测项目（0：其他；1：tNGS一步法呼吸道; ）
   */
  checkType: CheckTypeEnum;

  /**
   * 样本状态（0：未分析；1：已分析；2：无需分析；）
   */
  sampleStatus: SampleStatusEnum;

  /**
   * 建库试剂批次
   */
  putLrBatch?: string;

  /**
   * 芯片数据文件大小
   */
  socDataFileSize?: string;

  /**
   * 样本备注
   */
  sampleRemarks?: string;

  /**
   * 一审状态（0：未知；1：已通过；2：未通过；）
   */
  oneAuditStatus: OneAuditStatusEnum;

  /**
   * 一审人
   */
  oneAuditor?: string;

  /**
   *  一审人ID
   */
  oneAuditorId?: number;

  /**
   * 二审状态（0：未知；1：已通过；2：未通过；）
   */
  twoAuditStatus: TwoAuditStatusEnum;

  /**
   * 二审人
   */
  twoAuditor?: string;

  /**
   * 二审人ID
   */
  twoAuditorId?: number;

  /**
   * 重出报告者ID
   */
  againReportUid?: number;

  /**
   * 重出报告者
   */
  againReportUser?: string;

  /**
   * 审核未通过原因
   */
  auditRemark?: string;

  /**
   * 报告文件URL
   */
  reportFileUrl?: string;

  /**
   * 样本类型
   */
  sampleType: SampleTypeEnum;

  /**
   * 检测者签名ID
   */
  checkSignId: number;

  /**
   * 检测者签名
   */
  reportCheckSign: ReoirtSignVO;

  /**
   * 一审签名ID
   */
  oneSignId: number;

  /**
   * 一审签名
   */
  reportOneSign: ReoirtSignVO;

  /**
   * 二审签名ID
   */
  twoSignId: number;

  /**
   * 二审签名
   */
  reportTwoSign: ReoirtSignVO;
}

/*分析结果列表 */
export interface resultListModel {
  /*任务ID */
  taskId: number;

  /*结果ID */
  id: number;

  /*样本ID */
  sampleId: number;

  /*实验编号（Sample名需要存在于测序数据文件中） */
  sampleCode: string;

  /*病原体中文名 */
  pathogenCnSname: string;

  /*株系/血清型 */
  strain: string;

  /* 病原体中文名(原名称) */
  pathogenSourceCnSname: string

  /*病原类型（0：其他；1：DNA病毒；2：RNA病毒；3：革兰氏阳性菌；4：革兰氏阴性菌；5：真菌；6：耐药；7：特殊病原体；8：质粒内参；） */
  pathogenType: number;

  /*致病性分类 */
  virulenceType: number;

  /*病原体英文名 */
  pathogenEnSname: string;

  /*中文属名 */
  pathogenCnGname: string;

  /*英文属名 */
  pathogenEnGname: string;

  /*报阳标签（0：不展示；1：主报告；2：背景菌；3：疑似致病菌（灰区）；4：耐药；） */
  byLabel: number;

  /*reads */
  reads: number;

  /*均一化reads数 */
  levellingReads: string;

  /*微生物估测浓度 */
  forecastConc: number;


  /*水控均一化reads数 */
  waterControlRpm: number;

  /*多引物情况 */
  multiprimer: string;

  /*该病原同批检出数量 */
  sameBatchOuts: number;

  /*相关亚型 */
  subtype: string;

  /*病原体注释 */
  pathogenComments: string;

  /*创建时间 */
  createTime: number;

  /*删除时间 */
  deletedTime: number;
}

/**
 * 分析任务重建请求参数
 */
export interface RebuildAnalysisTaskReqVO {
  /**
   * 来源对象ID
   */
  objectId?: number;

  /**
   * 重建来源类型（0:其他；1：分析任务；2：芯片；3：样本；）
   */
  objectType?: RebuildObjectTypeEnum;
}

/**
 * 分析任务简单信息
 */
export interface AnalysisTaskSmallRespVO {
  /**
   * 任务ID
   */
  id: number;

  /**
   * 任务名称
   */
  name?: string;

  /**
   * 类型（1：tNGS一步法；0：其他；）
   */
  type: AnalysisTaskTypeEnum;

  /**
   * 芯片ID
   */
  socId: number;

  /**
   * 线程数/并行样本数
   */
  threadCount: number;

  /**
   * 任务数/单样本数(单样本线程数不宜超过服务器最⼤线程数)
   */
  taskCount: number;

  /**
   * 测序长度(75/150，默认：75；)
   */
  seqLength: number;

  /**
   * 启动深度挖掘（0：否；1：是；）默认：0；
   */
  excavateDeeply?: ExcavateDeeplyEnum;
}

/**
 * 分析任务重建响应数据
 */
export interface AnalysisTaskRebuildRespVO {
  /**
   * 任务信息
   */
  taskInfo: AnalysisTaskSmallRespVO;

  /**
   * 样本芯片信息
   */
  sampleSocs: SampleSocRespVO[];
}

/**
 * 分析任务重建响应数据
 */
export interface ReoirtSignVO {
  /**
   * id
   */
  id: number;

  /**
   * 职责类型,1=检测者,2=一审人员,3=二审人员
   */
  signType: string;

  /**
   * 检测者签名
   */
  signName: string;

  /**
   * 签名图片路径
   */
  imageUrl: string;
}