import { defHttp } from '@/utils/http/axios';
import { ReportTemplateUpdateReqVO, ReportTemplateCreateReqVO, ReportTemplatePageReqVO, ReportTemplateExportReqVO, ReportTemplateBaseVO } from './model';


/**
 * 创建报告模版信息
 * 
 * @param data 创建参数
 * @returns 创建的报告模版ID
 */
export const createReportTemplate = (data: ReportTemplateCreateReqVO) => {
  return defHttp.post<number>(
    { url: '/lims/report-template/create', params: data }
  );
};

/**
 * 更新报告模版信息
 * 
 * @param data 更新参数
 * @returns 更新结果
 */
export const updateReportTemplate = (data: ReportTemplateUpdateReqVO) => {
  return defHttp.put<boolean>(
    { url: '/lims/report-template/update', params: data }
  );
};

/**
 * 获得报告模版信息分页
 * 
 * @param params 查询参数
 * @returns 报告模版信息分页结果
 */
export const getReportTemplatePage = (params: ReportTemplatePageReqVO) => {
  return defHttp.get<PageResult<ReportTemplateBaseVO>>(
    { url: '/lims/report-template/page', params }
  );
};

/**
 * 获得报告模版信息
 * 
 * @param id 报告模版编号
 * @returns 报告模版信息
 */
export const getReportTemplate = (id: number) => {
  return defHttp.get<ReportTemplateBaseVO>(
    { url: '/lims/report-template/get', params: { id } }
  );
};

/**
 * 获得报告模版信息(签名需重置跟着报告)
 * 
 * @param id 报告模版编号
 * @returns 报告模版信息
 */
export const getReportTemplateByReportId = (id: number, reportId: number) => {
  return defHttp.get<ReportTemplateBaseVO>(
    { url: '/lims/report-template/get-by-reportId', params: { id, reportId } }
  );
};

/**
 * 获得默认启用的报告模版信息
 * 
 * @returns 报告模版信息
 */
export const getDefaultEnabledReportTemplate = (sampleId:number) => {
  return defHttp.get<ReportTemplateBaseVO>(
    { url: '/lims/report-template/get-default-start', params: { sampleId } }
  );
};


/**
 * 导出报告模版信息 Excel
 * 
 * @param params 导出参数
 */
export const exportReportTemplateExcel = (params: ReportTemplateExportReqVO) => {
  return defHttp.download({
    url: '/lims/report-template/export-excel',
    params,
    method: 'get'
  });
};

/**
 * 删除报告模版信息
 * 
 * @param id 报告模版编号
 * @returns 删除结果
 */
export const deleteReportTemplate = (id: number) => {
  return defHttp.delete<boolean>(
    { url: `/lims/report-template/delete/${id}`}
  );
};

/**
 * 设置指定模版为默认模版
 * 
 * @param id 报告模版编号
 * @returns 设置结果
 */
export const setDefaultTemplate = (id: number) => {
  return defHttp.post<boolean>(
    { url: '/lims/report-template/settings-default?id=' + id }
  );
};

/**
 * 查询所有启用的报告
 */
export const listAllEnabled = (checkType:number) => {
return defHttp.get(
    { url: `/lims/report-template/listAllEnabled?checkType=${checkType}`}
  );
}