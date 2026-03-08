import { defHttp } from '@/utils/http/axios'

/**
 * 操作日志类型枚举
 */
export enum LimsLogTypeEnum {
  OTHER = 0,           // 其他
  SAMPLE = 1,          // 样本
  CHIP = 2,            // 芯片
  ANALYSIS_TASK = 3,   // 分析任务
  RESULT_REPORT = 4    // 结果报告
}

/**
 * 操作日志响应对象
 */
export interface LimsLogRespVO {
  id: number;           // 日志编号
  type: string;         // 操作类型
  userName: string;     // 操作人
  subType: string;      // 操作
  action?: string;      // 事件描述
  extra?: string;       // 备注
  createTime: number;   // 操作时间
  transMap?: Record<string, any>; // 扩展数据
  success: string; //操作结果
}

/**
 * 操作日志分页查询参数
 */
export interface LimsLogPageReqVO {
  type?: LimsLogTypeEnum; // 操作类型
  pageNo?: number; // 页码
  pageSize?: number; // 每页条数
  bizId?: string; 
  traceId?: string
}

/**
 * 查看操作日志分页列表
 * @param params - 查询参数
 * @returns 分页结果
 */
export function getLimsLogPage(params: LimsLogPageReqVO) {
  return defHttp.get<PageResult<LimsLogRespVO>>({
    url: '/lims/log-record/page',
    params
  })
}
