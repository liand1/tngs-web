/**
 * 系统版本信息参数
 */
export interface SystemVersionBaseVO {
  id?: number; // 主键ID
  versionNumber?: string; // 版本号
  updateContent?: string; // 更新内容
  deletedTime: string; // 删除时间
}

/**
 * 系统版本信息更新请求参数
 */
export type SystemVersionUpdateReqVO = SystemVersionBaseVO;

/**
 * 系统版本信息创建请求参数
 */
export type SystemVersionCreateReqVO = SystemVersionBaseVO;

/**
 * 系统版本信息查询请求参数
 */
export interface SystemVersionPageReqVO {
  versionNumber?: string; // 版本号
  updateContent?: string; // 更新内容
  createTime?: string; // 创建时间
  deletedTime?: string; // 删除时间
  pageNo: number; // 页码，从 1 开始
  pageSize: number; // 每页条数
}

/**
 * 系统版本信息 Response VO
 */
export interface SystemVersionRespVO {
  id: number; // 主键ID
  versionNumber?: string; // 版本号
  updateContent?: string; // 更新内容
  createTime: string; // 创建时间
  deletedTime: string; // 删除时间
}

/**
 * 系统版本导出 Excel 请求参数
 */
export interface SystemVersionExportReqVO extends Omit<SystemVersionPageReqVO, 'pageNo' | 'pageSize'> {
  // 导出请求参数与查询参数基本相同，只是不需要分页参数
}

/**
 * 分页结果
 */
export interface PageResult<T> {
  list: T[]; // 数据
  total: number; // 总量
}

