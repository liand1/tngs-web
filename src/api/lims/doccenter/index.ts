import { defHttp } from '@/utils/http/axios'
import { DocCenterVO, UpdateDocCenterReqVO, DocCenterPageReqVO, DocCenterRespVO } from './model'

/**
 * 获取文档中心分页列表
 * @param params 查询参数
 * @returns 文档中心分页列表
 */
export function getDocCenterPage(params: DocCenterPageReqVO) {
  return defHttp.get<PageResult<DocCenterRespVO>>({ 
    url: '/lims/doc-center/page',
    params 
  })
}

/**
 * 获取文档中心详情
 * @param id 文档ID
 * @returns 文档中心详情
 */
export function getDocCenter(id: number) {
  return defHttp.get<DocCenterVO>({ 
    url: `/lims/doc-center/get`, 
    params: { id } 
  })
}

/**
 * 创建文档中心
 * @param data 创建参数
 * @returns 是否成功
 */
export function createDocCenter(data: UpdateDocCenterReqVO) {
  return defHttp.post<boolean>({ 
    url: '/lims/doc-center/create', 
    data 
  })
}

/**
 * 更新文档中心
 * @param data 更新参数
 * @returns 是否成功
 */
export function updateDocCenter(data: UpdateDocCenterReqVO) {
  return defHttp.put<boolean>({ 
    url: '/lims/doc-center/update', 
    data 
  })
}

/**
 * 删除文档中心
 * @param id 文档ID
 * @returns 是否成功
 */
export function deleteDocCenter(id: number) {
  return defHttp.delete<boolean>({ 
    url: `/lims/doc-center/delete?id=${id}` 
  })
}
