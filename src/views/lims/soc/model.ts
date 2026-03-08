import { CallStatusEnum, CreateTypeEnum } from "@/enums/customEnum";


export interface GetSocPageModel {
  /*芯片ID */
  id?: number;

  /*芯片编号 */
  socCode: string;

  /*下机时间 */
  downDeviceDate: number;

  /*实验人 */
  technician: string;

  /*数据量 */
  dataVolume: string;

  /*样本数 */
  sampleCount: string;

  /*试剂批次 */
  lrBatch: string;

  /*质控状态（0：等待质控；1：合格；2：不合格；） */
  qcStatus: number;

  /*创建来源（0：未知；1：手动创建；2：固定路径导入；） */
  createType: CreateTypeEnum;

   /*调用状态（0：否；1：是；） */
   callStatus: CallStatusEnum;

  /*报告地址 */
  reportAddress: string;

  /*创建时间 */
  createTime: Record<string, unknown>;

  /*删除时间 */
  deletedTime: Record<string, unknown>;

  /*芯片数据列表 */
  dataList: GetSocDataModel[];
}

export interface GetSocDataModel {
  /*算法ID */
  id: number;

  /*芯片ID */
  scoId: number;

  /*文件名 */
  fileName: string;

  /*文件地址 */
  fileAddress: string;

  /*试剂批次 */
  lrBatch: string;

  /*文件大小（单位：kb） */
  fileSize: number;

 

  /*创建时间 */
  createTime: Record<string, unknown>;

  /*删除时间 */
  deletedTime: Record<string, unknown>;
}