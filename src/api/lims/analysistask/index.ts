import { defHttp } from '@/utils/http/axios'
import {
  AnalysisTaskAuditPageResult,
  AnalysisTaskAuditRespVO,
  AnalysisTaskRebuildRespVO,
  CreateAnalysisTaskReqVO,
  RebuildAnalysisTaskReqVO
} from './model'
import { AuditGetTypeEnum } from '@/enums/customEnum'
import { formatTimeToTimes } from '@/utils/custom'

// 查询分析任务列表
export function getAnalysisTaskPage(params) {
  if (params.createTime) {
    params.createTime = formatTimeToTimes(params.createTime)
  }

  return defHttp.get({ url: `/lims/analysis-task/page`, params })
}

/**
 * 获取分析任务审核分页
 * @param params 查询参数
 * @returns 分析任务审核分页数据
 */
export function getAnalysisAuditTaskPage(params) {
  if (params.createTime) {
    params.createTime = formatTimeToTimes(params.createTime)
  }
  if (params.analysisTime) {
    params.analysisTime = formatTimeToTimes(params.analysisTime)
  }
  return defHttp.get<AnalysisTaskAuditPageResult>({
    url: '/lims/analysis-task/find-page-audit',
    params
  })
}

/**
 * 获取分析任务审核详情
 * @param id 任务ID
 * @returns 分析任务审核详情数据
 */
export function getAnalysisAuditTask(id: number) {
  return defHttp.get<AnalysisTaskAuditRespVO>({
    url: '/lims/analysis-task/find-audit',
    params: { id }
  })
}

/**
 * 审核-领取分析任务
 * @param params 包含taskId(任务ID)、auditorId(领取人ID)、auditGetType(领取类型)
 * @returns 领取结果
 */
export function auditGetTask(params: {
  taskId: number;
  auditorId: number;
  auditGetType: AuditGetTypeEnum;
}) {
  return defHttp.post<boolean>({
    url: '/lims/analysis-task/audit-get-task',
    params
  })
}

// 查询分析任务详情
export function getAnalysisTask(id: number) {
  return defHttp.get({ url: `/lims/analysis-task/get?id=${id}` })
}

/**
 * 创建分析任务
 * @param data 创建分析任务参数
 * @returns 返回创建的任务ID
 */
export function createAnalysisTask(data: CreateAnalysisTaskReqVO) {
  return defHttp.post<number>({
    url: '/lims/analysis-task/create',
    data
  })
}

// 修改分析任务
export function updateAnalysisTask(data) {
  return defHttp.put({ url: '/lims/analysis-task/update', data })
}

/**
 * 更新分析任务名称
 * @param id 任务ID
 * @param name 任务名称
 * @returns 更新结果
 */
export function updateAnalysisTaskName(id: number, name: string) {
  return defHttp.put<boolean>({
    url: '/lims/analysis-task/update-name',
    params: { id, name }
  })
}

// 删除分析任务
export function deleteAnalysisTask(id: number) {
  return defHttp.delete({ url: `/lims/analysis-task/delete?id=${id}` })
}

// 导出分析任务 Excel
export function exportAnalysisTask(params) {
  return defHttp.download({ url: '/lims/analysis-task/export-excel', params }, '分析任务.xls')
}

//获取任务详情
export function getAnalysisTaskDetail(id: number) {
  return defHttp.get({ url: '/lims/analysis-task/get', params: { id } })
}

//获得分析报告详情
export function getAnalysisReportDetail(params) {
  return defHttp.get({ url: '/lims/analysis-report/find-details', params })
}

/**
 * 重建分析任务
 * @param params 重建参数
 * @returns 分析任务重建详情
 */
export function rebuildAnalysisTask(params: RebuildAnalysisTaskReqVO) {
  return defHttp.post<AnalysisTaskRebuildRespVO>({
    url: '/lims/analysis-task/rebuild',
    params
  })
}


/**
 * 下载任务报告文件
 * @param taskId 任务Id
 * @returns 报告文件
 */
export function downloadAnalysisTaskExcel(taskId: number) {
  return defHttp.download({ 
    url: '/lims/analysis-task/download-report-excel', 
    params: { taskId } 
  }, '任务报告.xlsx')
}
