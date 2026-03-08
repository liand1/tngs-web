import { QcSettingsStatusEnum, QcTypeEnum } from '@/enums/customEnum';
import { defHttp } from '@/utils/http/axios';


/**
 * 更新质控设置请求参数
 */
export interface QcSettingsModel {
  // 主键ID
  id: number;
  // 质控类型（0：未知；1：芯片质控；2：分析任务质控；）
  type?: QcTypeEnum;
  // 质控点名称
  name: string;
  // 质控点值
  value: string;
  // 信息来源
  source?: string;
  // 状态（0：停用； 1：启用；）
  status?: QcSettingsStatusEnum;
  display?: QcSettingsStatusEnum;
  // 备注
  remark?: string;
}

/**
 * 更新质控设置
 * @param params 质控设置参数
 * @returns 
 */
export function updateQcSettings(params: QcSettingsModel) {
  return defHttp.put({
    url: '/lims/qc-settings/update',
    params,
  });
}

/**
 * 根据质控类型-获得质控设置列表
 * @param type - 质控类型
 * @returns CommonResult<string>
 */
export function findNewestBatchCode(type: QcTypeEnum) {
  return defHttp.get<QcSettingsModel[]>({
    url: '/lims/qc-settings/find-list-by-type',
    params: { type }
  })
}

/** 更新批次质控设置
 *  @param params 质控设置参数
 */
export function updateBatchQcSettings(data: QcSettingsModel[]) {
  return defHttp.put({ url: '/lims/qc-settings/update-batch', data })
}