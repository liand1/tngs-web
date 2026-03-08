import { defHttp } from '@/utils/http/axios';
import { SystemVersionUpdateReqVO, SystemVersionCreateReqVO, SystemVersionPageReqVO, SystemVersionRespVO, SystemVersionExportReqVO } from './model';

/**
 * 创建系统版本信息
 * 
 * @param data 创建参数
 * @returns 创建的系统版本ID
 */
export const createSystemVersion = (data: SystemVersionCreateReqVO) => {
  return defHttp.post<number>(
    { url: '/lims/system-version/create', params: data }
  );
};

/**
 * 更新系统版本信息
 * 
 * @param data 更新参数
 * @returns 更新结果
 */
export const updateSystemVersion = (data: SystemVersionUpdateReqVO) => {
  return defHttp.put<boolean>(
    { url: '/lims/system-version/update', params: data }
  );
};

/**
 * 获得系统版本信息分页
 * 
 * @param params 查询参数
 * @returns 系统版本信息分页结果
 */
export const getSystemVersionPage = (params: SystemVersionPageReqVO) => {
  return defHttp.get<PageResult<SystemVersionRespVO>>(
    { url: '/lims/system-version/page', params }
  );
};

/**
 * 获得系统版本信息
 * 
 * @param id 系统版本编号
 * @returns 系统版本信息
 */
export const getSystemVersion = (id: number) => {
  return defHttp.get<SystemVersionRespVO>(
    { url: '/lims/system-version/get', params: { id } }
  );
};

/**
 * 导出系统版本信息 Excel
 * 
 * @param params 导出参数
 */
export const exportSystemVersionExcel = (params: SystemVersionExportReqVO) => {
  return defHttp.download({
    url: '/lims/system-version/export-excel',
    params,
    method: 'get'
  });
};

/**
 * 删除系统版本信息
 * 
 * @param id 系统版本编号
 * @returns 删除结果
 */
export const deleteSystemVersion = (id: number) => {
  return defHttp.delete<boolean>(
    { url: '/lims/system-version/delete', params: { id } }
  );
};
