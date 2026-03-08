import { defHttp } from '@/utils/http/axios'
import { AnalysisReportDownloadRespVO } from './model';

// 查询分析报告列表
export function getAnalysisReportPage(params) {
  const mockData = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    taskId: 'TSK-001',
    sampleId: 'SMP-001',
    inLable: 'A1',
    outLable: 'B2',
    pollution: '无污染',
    cathodicQcResult: '合格',
    plasmidTagRate: '95%',
    libraryConc: '35.6 ng/μl',
    rawReads: '15000000',
    cleanReads: '14500000',
    adapterRate: '200000',
    cleanQthirty: '92%',
    mapReads: '13800000',
    mapRate: '90%',
    processStatus: '3',
    createTime: '2023-01-15T08:30:00',
    deletedTime: null,
  }));
  return {
    list: mockData,
    total: mockData.length,
  }
  // return defHttp.get({ url: '/lims/analysis-report/page', params })
}

// 查询分析报告详情
export function getAnalysisReport(id: number) {
  return defHttp.get({ url: `/lims/analysis-report/get?id=${id}` })
}

// 新增分析报告
export function createAnalysisReport(data) {
  return defHttp.post({ url: '/lims/analysis-report/create', data })
}

// 修改分析报告
export function updateAnalysisReport(data) {
  return defHttp.put({ url: '/lims/analysis-report/update', data })
}

// 删除分析报告
export function deleteAnalysisReport(id: number) {
  return defHttp.delete({ url: `/lims/analysis-report/delete?id=${id}` })
}

// 导出分析报告 Excel
export function exportAnalysisReport(params) {
  return defHttp.download({ url: '/lims/analysis-report/export-excel', params }, '分析报告.xls')
}

/**
 * 获取下载报告详情
 * @param taskId 任务Id
 * @param sampleId 样本Id
 * @returns 下载报告详情数据，包含样本信息、分析结果等
 */
export function getDownloadReportDetails(taskId: number, sampleId: number) {
  return defHttp.get<AnalysisReportDownloadRespVO>({
    url: '/lims/analysis-report/find-download-export',
    params: { taskId, sampleId }
  })
}

/**
 * 更新分析报告文件URL
 * @param reportId 报告ID
 * @param reportFileUrl 报告文件URL
 * @returns 操作结果
 */
export function updateAnalysisReportFileUrl(reportId: string | number, reportFileUrl: string) {
  return defHttp.post<boolean>({
    url: '/lims/analysis-report/update-report-file-url',
    params: { reportId, reportFileUrl }
  })
}


/**
 * 导出指定pdf预览报告
 * @param taskId 任务Id
 * @param sampleIds 样本Ids   1,2,3
 * @returns 
 */
export function exportPdfPreviewReport(taskId: number, sampleIds: string, fileTypes: string) {
  return defHttp.get({
    url: '/lims/analysis-report/export-report-by-ids',
    params: { taskId, sampleIds, fileTypes }
  })
}

/**
 * 申请重出报告
 * @param reportId 
 */
export function markReport(reportId: number) {
  return defHttp.get({
    url: '/lims/analysis-report/mark-report',
    params: { reportId }
  })
}

/**
 * 重出审核
 * @param reportId 
 */
export function auditAgainReport(data: any) {
  return defHttp.post({
    url: '/lims/analysis-report/audit-again-report', data
  })
}

/**
 * 查询最近6个月的历史检测
 * @param name 
 * @param phone 
 * @returns 
 */
export function listHistoryReport(data) {
  return defHttp.post({
    url: '/lims/analysis-report/list-history-report', data
  })
}

/**
 * 报告审核变更签名ID
 * @param data 
 */
export function changeSign(data) {
  return defHttp.post({
    url: '/lims/analysis-report/change-sign', data
  })
}