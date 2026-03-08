import { defHttp } from '@/utils/http/axios';
import { AnalysisCheckOutRespVO, CheckOutResultPageReqVO } from './model';
import { ByLabelEnum, PathogenTypeEnum } from '@/enums/customEnum';
import { AnalysisReportAuditRespVO, resultListModel } from '../analysistask/model';

/**
 * API路径
 */
enum Api {
  CheckOutResultPage = '/lims/analysis-result/page-checkout-result',
  AuditUpdateByLabel = '/lims/analysis-result/audit-update-by-label',
  CopyResult = '/lims/analysis-result/copy-result',
  DeleteResult = '/lims/analysis-result/delete',
  AuditUpdateResult = '/lims/analysis-result/audit-update-report-result',
  UpdateCopyResult = '/lims/analysis-result/update-copy-result',
  ExportExcel = '/lims/analysis-result/export-excel',
  ExportCheckOutExcel = '/lims/analysis-result/export-checkout-excel',
}

/**
 * 获取检出结果分页列表
 * @param params 查询参数
 * @returns 检出结果分页数据
 */
export function getCheckOutResultPage(params: CheckOutResultPageReqVO) {
  return defHttp.get<AnalysisCheckOutRespVO>({
    url: Api.CheckOutResultPage,
    params,
  });
}

/**
 * 审核-变更分析结果报告区域
 * @param params 包含报告ID列表和报告区域标签
 * @returns 变更操作结果
 */
export function updateAuditResultByLabel(params: {
  resultIds: number[]; // 报告ID列表
  byLabel: ByLabelEnum; // 报告区域标签
}) {
  return defHttp.put<boolean>({
    url: Api.AuditUpdateByLabel,
    params
  });
}

/**
 * 复制分析结果
 * @param params 分析结果数据
 * @returns 新创建的结果ID
 */
export function copyAnalysisResult(params: resultListModel) {
  return defHttp.post<number>({
    url: Api.CopyResult,
    params
  });
}

/**
 * 删除分析结果
 * @param id 分析结果ID
 * @returns 删除结果
 */
export function deleteAnalysisResult(id: number) {
  return defHttp.delete<boolean>({
    url: `${Api.DeleteResult}?id=${id}`
  });
}

/**
 * 审核-编辑分析结果
 * @param params 包含报告ID和分析结果数据
 * @returns 更新结果
 */
export interface UpdateAuditResultParams {
  reportId: number | string; // 报告ID
  result: resultListModel; // 分析结果数据
}

export function updateAuditResult(params: UpdateAuditResultParams) {
  return defHttp.put<boolean>({
    url: Api.AuditUpdateResult,
    params
  });
}

/**
 * 修改-复制分析结果
 * @param params 查询参数
 * @returns 分析结果列表
 */
export function updateCopyAnalysisResult(params: resultListModel) {
  return defHttp.post<boolean>({
    url: Api.UpdateCopyResult,
    params
  });
}


/**
 * 导出分析结果 Excel
 * @param params 查询参数
 * @returns Excel文件
 */
export function exportAnalysisResult(params) {
  return defHttp.download({ url: Api.ExportExcel, params }, '分析结果.xls');
}

/**
 * 导出分析结果 Excel
 * @param params 查询参数
 * @returns Excel文件
 */
export function exportAnalysisCheckoutResult(params) {
  return defHttp.download({ url: Api.ExportCheckOutExcel, params }, '任务检出查询结果.xls');
}