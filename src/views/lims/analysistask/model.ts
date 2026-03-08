// Parameter interface
import { CheckStatusEnum, CheckTypeEnum, ExcavateDeeplyEnum, ProcessStatusEnum, QcStatusEnum, SampleStatusEnum, SampleTypeEnum, TaskStatusEnum } from '@/enums/customEnum';
import { ref } from 'vue';

// Response interface
export interface GetAnalysisTaskModel {

  /*任务ID */
  id: number;

  /*任务名称 */
  name: string;

  /*类型（1：tNGS一步法呼吸道；0：其他；） */
  type: CheckTypeEnum;

  /*芯片ID */
  socId: number;

  /*线程数/并行样本数 */
  threadCount: number;

  /*	任务数/单样本数(单样本线程数不宜超过服务器最⼤线程数) */
  taskCount: number;

  /*测序长度(75/150，默认75) */
  seqLength: number;

  /*启动深度挖掘（0：否；1：是；） */
  excavateDeeply: ExcavateDeeplyEnum;

  /*任务状态（0：已创建分析任务；1：等待分析；2：分析中；3：已完成分析；4：分析失败；） */
  taskStatus: TaskStatusEnum;

  /*质控结果（0：待分析完成；1：合格；2：不合格；3：预警） */
  qcStatus: QcStatusEnum;

  /*审核状态（0：待审核；1：审核中；2：已通过；3：未通过；） */
  checkStatus: CheckStatusEnum;

  /*开始时间 */
  startTime: number;

  /*结束时间 */
  endTime: number;

  /*分析进度说明 */
  schedule: string;

  /*创建者 */
  creator: string;

  /*创建者名称 */
  creatorName: string;

  /*创建时间 */
  createTime: string;

  /*	任务报告数/总样本数 */
  reportCount: number;

  /*任务报告-质控不合格数量 */
  reportQcFailCount: number;

  reportQcWarningCount: number;

  /*任务报告-已完成分析数量 */
  reportFinishCount: number;

  /*任务报告列表 */
  reportList: ReportListModel[];

}

export interface ReportListModel {

  /*报告ID */
  id: number;

  /*任务ID */
  taskId: number;

  /*样本Id */
  sampleId: number;

  /*实验编号（Sample名需要存在于测序数据文件中） */
  sampleCode: string;

  /*流程状态（0：未知；1：已创建分析任务；2：任务分析中；3：任务分析失败；4：等待生成结果；5：生成分析结果；6：一审通过；7：一审未通过；8：二审通过；9：二审未通过；10：出具报告；） */
  processStatus: ProcessStatusEnum;

  /*质控状态（0：等待质控；1：合格；2：不合格；） */
  qcStatus: QcStatusEnum;

  /* 开始时间 */
  startTime: number;

  /*分析完成时间 */
  finisTime: number;

  /*创建时间 */
  createTime: number;

  /*审核类型（0：未知；1：tNGS一步法呼吸道；） */
  checkType: CheckTypeEnum;

  /*样本状态（0：未分析；1：已分析；2：无需分析；） */
  sampleStatus: SampleStatusEnum;

  /*批次号 */
  putLrBatch: string;

  /*芯片数据文件大小 */
  socDataFileSize: string;

  /*样本备注 */
  sampleRemarks: string;

  /*样本类型 */
  sampleType: SampleTypeEnum;

}




export interface SocToCreateTaskModel {
  sampleId: number;
  socId: number;
  taskId: number;
}

