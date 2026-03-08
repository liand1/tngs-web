import { defHttp } from '@/utils/http/axios'
import { formatTimeToTimes } from '@/utils/custom';

// 查询样本信息列表
export function getSampleBatchPage(params) {
  // 处理创建时间范围，确保日期范围包含整天
  params.createTime = formatTimeToTimes(params.createTime)

  return defHttp.get({ url: '/lims/sample-batch/page', params })
}

// 查询样本信息详情
export function getSampleBatch(batchCode: string) {
  return defHttp.get({ url: `/lims/sample-batch/getDetail?batchCode=${batchCode}` })
}

//根据batchCode获取id
export function getSampleBatchId(batchCode: string) {
  return defHttp.get({ url: `/lims/sample-batch/getByBatchCode?batchCode=${batchCode}` })
}

// 删除样本信息
export function deleteSampleBatch(id: number) {
  return defHttp.delete({ url: `/lims/sample-batch/delete?id=${id}` })
}

// 更新自动分析状态
export function updateAnalysisStatus(id: number, analysisStatus: number) {
  return defHttp.get({ url: `/lims/sample-batch/updateAnalysisStatus?id=${id}&analysisStatus=${analysisStatus}` })
}