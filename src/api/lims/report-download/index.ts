import { defHttp } from '@/utils/http/axios';
import { ReportDownloadRespVO, ReportDownloadPageReqVO } from './model';

/**
 * 获得下载管理分页
 * 
 * @param params 查询参数
 * @returns 下载管理分页结果
 */
export const getReportDownloadPage = (params: ReportDownloadPageReqVO) => {
  return defHttp.get<PageResult<ReportDownloadRespVO>>(
    { url: '/lims/report-download/page', params }
  );
};
