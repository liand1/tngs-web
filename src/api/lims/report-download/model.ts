
/**
 * 下载管理信息查询请求参数
 */
export interface ReportDownloadPageReqVO {
  pageNo: number; // 页码，从 1 开始
  pageSize: number; // 每页条数
}

/**
 * 下载管理 Response VO
 */
export interface ReportDownloadRespVO {
  id: number; // 主键ID
  source?: string; 
  taskId?: number; // 
  taskName?: string;
  description?: string;
  downloadUrl?: string;
  createTime: string; // 创建时间
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  list: T[]; // 数据
  total: number; // 总量
}

