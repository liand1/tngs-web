import { CheckStatusEnum, ProcessStatusEnum, QcStatusEnum, TaskStatusEnum } from "@/enums/customEnum";

/**
 * 分析任务控制台展示信息
 */
export interface MyAnalysisTaskConsoleRespVO {
  id: number; // 任务ID
  taskReportName?: string; // 任务名称 b报告审核
  type: number; // 类型（1：tNGS一步法一步法；0：其他；） 我创建的分析里面用的
  name: string; // 任务名称 我创建的分析里面用的
  socId: number; // 芯片ID
  threadCount: number; // 线程数/并行样本数
  taskCount: number; // 任务数/单样本数(单样本线程数不宜超过服务器最⼤线程数)
  seqLength: number; // 测序长度(75/150，默认：75；)
  excavateDeeply?: number; // 启动深度挖掘（0：否；1：是；）默认：0；
  updateTime: string; // 更新时间
  creator: string; // 创建人ID
  creatorName: string; // 创建人
  oneAuditorId: number; // 一审领取人ID
  oneAuditor: string; // 一审领取人
  taskId: number; // 任务ID
  taskStatus: TaskStatusEnum; // 任务状态
  processStatus: ProcessStatusEnum;
  checkStatus: CheckStatusEnum; //审核状态
}


export interface AnalysisTaskConsoleRespVO {
  creator: string; // 创建人ID
  creatorName: string; // 创建人
  oneAuditorId: number; // 一审领取人ID
  oneAuditor: string; // 一审领取人
  taskId: number; // 任务ID
  taskReportName?: string; // 任务名称 b报告审核
  taskStatus: TaskStatusEnum; // 任务状态
  updateTime: string; // 更新时间
}

/**
 * 芯片简单信息
 */
export interface SocSmallRespVO {
  id: number; // 芯片ID
  socName?: string; // 芯片名称
  sourceName?: string; // 芯片原名称
  callStatus?: number; // 调用状态（0：否；1：是；）
  qcStatus?: QcStatusEnum; // 质控状态（0：等待质控；1：合格；2：不合格；）
  createTime: string; // 创建时间
}

/**
 * 控制台月度统计信息
 */
export interface ConsoleMonthStatsRespVO {
  sampleBatchs?: number; // 样本批次数
  samples?: number; // 样本数
  tasks?: number; // 任务数
  taskQcPassRate?: number; // 任务质控合格率(%)
  reports?: number; // 报告数
  reportPassed?: number; // 报告未通过数
  reportPassRate?: number; // 报告通过率(%)
}

export interface ConsoleAllStatsRespVO {
  sampleBatchs?: number; // 样本批次数
  samples?: number; // 样本数
  tasks?: number; // 任务数
  taskQcPassRate?: number; // 任务质控合格率(%)
  reports?: number; // 报告数
  reportPassed?: number; // 报告未通过数
  reportPassRate?: number; // 报告通过率(%)
}
