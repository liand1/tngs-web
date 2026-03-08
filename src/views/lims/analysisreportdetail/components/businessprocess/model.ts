import { ProcessStatusEnum } from "@/enums/customEnum";


export interface StepModel {
  current: number;
  stepslist: sampleFlowListModel[];
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
}
