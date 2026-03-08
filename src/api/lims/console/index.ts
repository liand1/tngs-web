import { defHttp } from '@/utils/http/axios';
import { AnalysisTaskConsoleRespVO, SocSmallRespVO, ConsoleMonthStatsRespVO, MyAnalysisTaskConsoleRespVO } from './model';


/**
 * 获得指定条数-待审核分析任务列表 
 * 
 * @param limit 条数
 * @returns 待审核分析任务列表
 */
export const findWaitAuditTaskListByLimit = (limit: number) => {
  return defHttp.get<AnalysisTaskConsoleRespVO[]>(
    { url: '/lims/console/find-wait-audit-task-list', params: { limit } }
  );
};

/**
 * 获得指定条数-未被调用的芯片列表
 * 
 * @param limit 条数
 * @returns 未被调用的芯片列表
 */
export const findNoCallSocListByLimit = (limit: number) => {
  return defHttp.get<SocSmallRespVO[]>(
    { url: '/lims/console/find-no-call-soc-list', params: { limit } }
  );
};

/**
 * 获得指定条数-我创建的任务列表
 * 
 * @param limit 条数
 * @returns 我创建的任务列表
 */
export const findMyTaskListByLimit = (limit: number) => {
  return defHttp.get<MyAnalysisTaskConsoleRespVO[]>(
    { url: '/lims/console/find-my-task-list', params: { limit } }
  );
};

/**
 * 获得月度统计信息
 * 
 * @returns 月度统计信息
 */
export const findMonthStats = () => {
  return defHttp.get<ConsoleMonthStatsRespVO>(
    { url: '/lims/console/find-month-stats' }
  );
};
