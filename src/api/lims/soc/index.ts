import { defHttp } from '@/utils/http/axios'

/**
 * 获取自增芯片名称编号
 * @returns 芯片编号
 */
export function findNewestSocCode() {
  return defHttp.get<string>({ 
    url: '/lims/soc/find-newest-code'
  })
}

// 查询芯片信息列表
export function getSocPage(params) {
  return defHttp.get({ url: '/lims/soc/page', params })
}

// 查询芯片信息详情
export function getSoc(id: number) {
  return defHttp.get({ url: `/lims/soc/get?id=${id}` })
}

// 新增芯片信息
export function createSoc(data) {
  return defHttp.post({ url: '/lims/soc/create', data })
}

// 修改芯片信息
export function updateSoc(data) {
  return defHttp.put({ url: '/lims/soc/update', data })
}

// 删除芯片信息
export function deleteSoc(id: number) {
  return defHttp.delete({ url: `/lims/soc/delete?id=${id}` })
}

// 导出芯片信息 Excel
export function exportSoc(params) {
  return defHttp.download({ url: '/lims/soc/export-excel', params }, '芯片信息.xls')
}
