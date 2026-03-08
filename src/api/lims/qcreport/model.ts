import { QcStatusEnum, QcTypeEnum } from '@/enums/customEnum';
import { Result } from '@/types/axios';




/**
 * 质控记录响应对象
 */
export interface QcReportRespVO {
  // 质控详情ID
  id: number;
  // 质控配置ID
  qcSettingsId: number;
  // 质控对象ID（芯片、分析任务）
  qcObjectId: number;
  // 质控类型（0：未知；1：芯片质控；2：分析任务质控；）
  qcType?: QcTypeEnum;
  // 检出结果值
  checkValue?: string;
  // 质控标准值
  qcValue?: string;
  // 质控状态（0：未知；1：合格；2：不合格；）
  qcStatus: QcStatusEnum;
  // 备注
  remark?: string;
  // 创建时间
  createTime: string;
  // 删除时间
  deletedTime?: string;
  // 质控点名称
  qcSettingsName: string;
}

/**
 * 质控记录列表响应类型
 */
export type QcReportListResultVO = QcReportRespVO[]; 