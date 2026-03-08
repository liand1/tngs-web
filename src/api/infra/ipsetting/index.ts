import { defHttp } from '@/utils/http/axios'

// 新增任务
export function updateIp(data: {ip: string}) {
  return defHttp.post({ url: '/lims/settingIp/update', data })
}