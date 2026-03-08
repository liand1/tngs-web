import { resultListModel, ReoirtSignVO } from "@/api/lims/analysistask/model";
import { SampleDataModel } from "../sample/model";
import { ProcessStatusEnum, QcStatusEnum } from "@/enums/customEnum";

export interface FindAnalysisReportDetailsModel{
  /*报告ID */
  id: number;

  /*任务ID */
  taskId: number;

  /*样本Id */
  sampleId: number;

  /*实验编号（Sample名需要存在于测序数据文件中） */
  sampleCode: string;

  /*流程状态（0：未知；1：已创建分析任务；2：任务分析中；3：任务分析失败；4：生成分析结果；5：一审通过；6：一审未通过；7：二审通过；8：二审未通过；9：出具报告；） */
  processStatus: ProcessStatusEnum;

  /*质控状态（0：等待质控；1：合格；2：不合格；） */
  qcStatus: QcStatusEnum;

  /*开始分析时间 */
  startTime: number;

  /*分析完成时间 */
  finisTime: number;

  /*创建时间 */
  createTime: number;

  /* 样本数据 */
  sample: SampleDataModel;

  /*样本业务流程列表 */
  sampleFlowList: sampleFlowListModel[];

  /*分析结果列表 */
  resultList: resultListModel[];

  geneResultList: any[];

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

export interface sampleFlowListModel {
  /*主键ID */
  id: number;

  /*任务ID */
  taskId: number;

  /*样本ID */
  sampleId: number;

  /*流程状态 */
  processStatus: ProcessStatusEnum;

  /*内容 */
  action: string;

  /*备注 */
  remark?: string;

  /*操作人 */
  operator?: string;

  /*操作时间 */
  operatorTime?: number;

  /*创建时间 */
  createTime?: number;

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
