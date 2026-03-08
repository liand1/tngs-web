import { defHttp } from '@/utils/http/axios';

/**
 * 创建报告签名信息
 * 
 * @param data 创建参数
 * @returns 报告签名ID
 */
export const createReportSign = (data: any) => {
  return defHttp.post<number>(
    { url: '/lims/report-sign/create', params: data }
  );
};

/**
 * 更新报告签名信息
 * 
 * @param data 更新参数
 * @returns 更新结果
 */
export const updateReportSign = (data: any) => {
  return defHttp.put<boolean>(
    { url: '/lims/report-sign/update', params: data }
  );
};

/**
 * 获得报告签名信息
 * 
 * @param id 报告签名编号
 * @returns 报告签名信息
 */
export const getReportSign = (id: number) => {
  return defHttp.get<any>(
    { url: '/lims/report-sign/get', params: { id } }
  );
};

/**
 * 删除报告签名信息
 * 
 * @param id 报告签名编号
 * @returns 删除结果
 */
export const deleteReportSign = (id: number) => {
  return defHttp.delete<boolean>(
    { url: `/lims/report-sign/delete/${id}`}
  );
};

/**
 * 查询所有报告签名
 */
export const listAllSign = () => {
return defHttp.get(
    { url: '/lims/report-sign/listAll'}
  );
}