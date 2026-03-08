
/**
 * 分析检出结果 Response VO
 */
export interface AnalysisCheckOutRespVO {
  /**
   * 结果ID
   */
  id: number;

  /**
   * 检出时间
   */
  createTime: string;

  /**
   * 病原
   */
  pathogenCnSname: string;

  /**
   * 报告区域/报阳标签（0:未知；1：不展示；2：主报告；3：背景菌；4：疑似致病菌（灰区）；5：耐药；）
   */
  byLabel: number;

  /**
   * 初始报告区域/报阳标签（0:未知；1：不展示；2：主报告；3：背景菌；4：疑似致病菌（灰区）；5：耐药；）
   */
  initialByLabel: number;

  /**
   * 病原体类型
   */
  pathogenType:number;

  /**
   * 均一化reads数
   */
  levellingReads: string;

  /**
   * 样本ID
   */
  sampleId: number;

  /**
   * 受检人姓名
   */
  examineeName?: string;

  /**
   * 送检医院
   */
  subHospital?: string;

  /**
   * 送检科室
   */
  subRoom?: string;

  /**
   * 送检医师
   */
  subDoctor?: string;

  /**
   * 样本类型（0：其他；1：肺泡灌洗液（BALF）；2：痰液；3：鼻/咽拭子；4：水控；）
   */
  sampleType: number;

  /**
   * 批次编号
   */
  batchCode?: string;

  /**
   * 源编号
   */
  sourceCode?: string;

  /**
   * 实验编号（Sample名需要存在于测序数据文件中）
   */
  sampleCode?: string;

  /**
   * 任务ID
   */
  taskId: number;

  /**
   * 任务名称
   */
  taskName?: string;

  /**
   * 检测项目（0：其他；1：tNGS一步法呼吸道; ）
   */
  checkType: number;

  /**
   * 任务审核状态（0：待审核；1：审核中；2：已通过；3：未通过；）
   */
  taskCheckStatus: number;
}

/**
 * 检出结果分页查询参数
 */
export interface CheckOutResultPageReqVO {
  /**
   * 实验编号
   */
  sampleCode?: string;

  /**
   * 送检医院
   */
  subHospital?: string;

  /**
   * 送检科室
   */
  subRoom?: string;

  /**
   * 送检医师
   */
  subDoctor?: string;

  /**
   * 患者姓名（受检人）
   */
  examineeName?: string;

  /**
   * 病原/耐药物名称
   */
  pathogenGeneName?: string;

  /**
   * 检出开始时间
   */
  checkOutStartTime?: string;

  /**
   * 检出结束时间
   */
  checkOutEndTime?: string;

  /**
   * 报告区域/报阳标签
   */
  byLabelCodes?: string;

  /**
   * 页码
   */
  pageNo: number;

  /**
   * 每页条数
   */
  pageSize: number;
} 