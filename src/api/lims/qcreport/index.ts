import { defHttp } from '@/utils/http/axios';
import { QcReportListResultVO } from './model';
import { QcTypeEnum } from '@/enums/customEnum';

/**
 * 根据质控对象ID获取质控记录列表
 * @param objectId 质控对象ID
 * @param qcType 质控类型
 * @returns 质控记录列表
 */
export function findQcReportByObjectId(objectId: number, qcType: QcTypeEnum, source: number) {
  return defHttp.get<QcReportListResultVO>({
    url: '/lims/qc-report/find-list-by-id',
    params: { objectId, qcType, source: source || 1 },
  });
}
