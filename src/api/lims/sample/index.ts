import { defHttp } from '@/utils/http/axios'
import { SampleSocRespVO } from './model'
import { useRender } from '@/components/Table';
import { formatTimeToTimes } from '@/utils/custom';

// 查询样本信息列表
export function getSamplePage(params) {
  // 处理创建时间范围，确保日期范围包含整天
  params.createTime = formatTimeToTimes(params.createTime)

  return defHttp.get({ url: '/lims/sample/page', params })
}

// 查询样本信息详情
export function getSample(id: number) {
  return defHttp.get({ url: `/lims/sample/get?id=${id}` })
}

// 新增样本信息
export function createSample(data) {
  return defHttp.post({ url: '/lims/sample/create', data })
}

// 修改样本信息
export function updateSample(data) {
  return defHttp.put({ url: '/lims/sample/update', data })
}

// 删除样本信息
export function deleteSample(id: number) {
  return defHttp.delete({ url: `/lims/sample/delete?id=${id}` })
}


export function deleteSamples(ids: number[]) {
  return defHttp.post({ url: `/lims/sample/batch-delete`, data: { sampleIds: ids } })
}

// 导出样本信息 Excel
export function exportSample(params) {
  return defHttp.download({ url: '/lims/sample/export-excel', params }, '样本信息.xls')
}

// 获取样本批次列表
export function getSampleBatchPage() {
  return defHttp.get({ url: '/lims/sample/list-batch-list' })
}

// 批量创建样本信息
export function createBatch(data) {
  return defHttp.post({ url: '/lims/sample/create-batch', data })
}

/**
 * 获取自增样本批次编号
 * @returns CommonResult<string>
 */
export function findNewestBatchCode() {
  return defHttp.get<string>({
    url: '/lims/sample/find-newest-batch-code'
  })
}

/**
 * 根据批次编号匹配样本信息列表
 * @param batchCode 批次编号
 * @returns 样本芯片匹配信息列表
 */
export function findMatchingSampleList(batchCode: string) {
  return defHttp.get<SampleSocRespVO[]>({
    url: '/lims/sample/find-matching-sample-list',
    params: { batchCode }
  })
}
