import { DocStatusEnum, DocTypeEnum } from "@/enums/customEnum";

/**
 * 文档中心分页查询参数
 */
export interface DocCenterPageReqVO {
  /**
   * 文档标题
   */
  title?: string;
  
  /**
   * 文档内容
   */
  content?: string;
  
  /**
   * 文档类型（1：使用手册；2：审核相关；3：数据相关）
   */
  type?: DocTypeEnum;
  
  /**
   * 文档状态（0：关闭；1：正常；）
   */
  status?: DocStatusEnum;
  
  /**
   * 创建时间
   */
  createTime?: string;
  
  /**
   * 页码，从 1 开始
   */
  pageNo: number;
  
  /**
   * 每页条数，最大值为 10000
   */
  pageSize: number;
}

/**
 * 文档中心响应VO
 */
export interface DocCenterRespVO {
  /**
   * 文档ID
   */
  id: number;
  
  /**
   * 文档标题
   */
  title: string;
  
  /**
   * 文档内容
   */
  content: string;
  
  /**
   * 文档类型（1：使用手册；2：审核相关；3：数据相关）
   */
  type: DocTypeEnum;
  
  /**
   * 文档状态（0：关闭；1：正常；）
   */
  status: DocStatusEnum;
  
  /**
   * 创建时间
   */
  createTime: string;
}




/**
 * 文档中心信息
 */
export interface DocCenterVO {
  /**
   * 文档ID
   */
  id?: number;
  
  /**
   * 文档标题
   */
  title: string;
  
  /**
   * 文档内容
   */
  content: string;
  
  /**
   * 文档类型（1：使用手册；2：审核相关；3：数据相关）
   */
  type: DocTypeEnum;
  
  /**
   * 文档状态（0：关闭；1：正常；）
   */
  status: DocStatusEnum;
  
  /**
   * 创建时间
   */
  createTime?: string;
  
  /**
   * 更新时间
   */
  updateTime?: string;
}

/**
 * 更新文档中心请求参数
 */
export interface UpdateDocCenterReqVO {
  /**
   * 文档ID
   */
  id?: number;
  
  /**
   * 文档标题
   */
  title: string;
  
  /**
   * 文档内容
   */
  content: string;
  
  /**
   * 文档类型（1：使用手册；2：审核相关；3：数据相关）
   */
  type: DocTypeEnum;
  
  /**
   * 文档状态（0：关闭；1：正常；）
   */
  status: DocStatusEnum;
} 