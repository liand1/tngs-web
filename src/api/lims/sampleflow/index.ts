import { ProcessStatusEnum } from '@/enums/customEnum';
import { defHttp } from '@/utils/http/axios'


/**
 * 审核样本报告
 * @param params 审核参数
 * @returns 审核结果ID
 */
export function auditSampleReport(params: {
  taskId: number; // 任务ID
  sampleId: number; // 样本ID
  reportId: number; // 样本报告ID
  action?: string; // 审核内容
  auditStatus: ProcessStatusEnum; // 审核状态
}) {
  return defHttp.post<number>({
    url: '/lims/sample-flow/audit-sample-report',
    params
  })
}
