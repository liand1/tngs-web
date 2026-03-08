import { defHttp } from '@/utils/http/axios';

/**
 * 获取分页
 * @param params 查询参数
 * @returns 分析任务审核分页数据
 */
export function getAnalysisGeneHostPage(params) {
  return defHttp.get<any>({
    url: '/lims/analysis-gene-result/pageHost',
    params
  })
}

/**
 * 审核-变更分析结果报告区域
 * @param params 包含报告ID列表和报告区域标签
 * @returns 变更操作结果
 */
export function updateAuditResultByLabel(params: {
  resultIds: number[]; // 报告ID列表
  byLabel: number; // 报告区域标签
}) {
  return defHttp.put<boolean>({
    url: `/lims/analysis-gene-result/audit-update-by-label`,
    params
  });
}

/**
 * 复制耐药基因分析结果
 * @param params 耐药基因分析结果数据
 * @returns 新创建的耐药基因结果ID
 */
export function copyAnalysisGeneResult(params: any) {
  return defHttp.post<number>({
    url: `/lims/analysis-gene-result/copy-result`,
    params
  });
}

/**
 * 删除耐药分析结果
 * @param id 耐药分析结果ID
 * @returns 删除耐药基因结果
 */
export function deleteAnalysisGeneResult(id: number) {
  return defHttp.delete<boolean>({
    url: `/lims/analysis-gene-result/delete?id=${id}`
  });
}

/**
 * 修改-复制分析结果
 * @param params 查询参数
 * @returns 分析结果列表
 */
export function updateCopyAnalysisGeneResult(params: any) {
  return defHttp.put<boolean>({
    url: `/lims/analysis-gene-result/update`,
    params
  });
}

/**
 * 根据病原体名-获得指定任务耐药基因 检测对比结果列表
 * @param taskId 
 * @param pathogenName 
 * @param sampleId 
 * @returns 
 */
export function findGeneResultListByName(taskId: number, drugGene: string, sampleId: string) {
  return defHttp.get<any[]>({
    url: '/lims/analysis-gene-result/find-list-by-drugGene',
    params: { taskId, drugGene, sampleId },
  });
}