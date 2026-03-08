/**
 * 报告模版信息参数
 */
export interface ReportTemplateBaseVO {
  id?: number; // 主键ID
  name?: string; // 模版名称
  content?: string; // 模版内容，以json格式存储
  status?: number; // 模版状态（0：未启用；1：启用；）
  remark?: string; // 备注
  createTime?: string; // 创建时间
  deletedTime?: string; // 删除时间
  subHospital?: string; //送检单位
  type?: number;//1：简单模版；2：自定义模版；3:包括送检单位的自定义模板
  copyType?: number;//模板复制对象（1：简单模版；2：自定义模版；）
}

/**
 * 报告模版信息更新请求参数
 */
export type ReportTemplateUpdateReqVO = ReportTemplateBaseVO;

/**
 * 报告模版信息创建请求参数
 */
export type ReportTemplateCreateReqVO = ReportTemplateBaseVO;

/**
 * 报告模版信息查询请求参数
 */
export interface ReportTemplatePageReqVO {
  name?: string; // 模版名称
  content?: string; // 模版内容，以json格式存储
  status?: string; // 模版状态（0：未启用；1：启用；）
  createTime?: string; // 创建时间
  deletedTime?: string; // 删除时间
  pageNo: number; // 页码，从 1 开始
  pageSize: number; // 每页条数
}

/**
 * 报告模版导出 Excel 请求参数
 */
export interface ReportTemplateExportReqVO extends Omit<ReportTemplatePageReqVO, 'pageNo' | 'pageSize'> {
  // 导出请求参数与查询参数基本相同，只是不需要分页参数
}

