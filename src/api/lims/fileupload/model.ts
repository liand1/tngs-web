
/**
 * 管理后台 - 文件夹及文件信息 Response VO
 */
export interface FilesInfoRespVO {
  /**
   * 文件夹及文件ID
   */
  id: string;
  
  /**
   * 文件夹及文件名称
   */
  name: string;
  
  /**
   * 是否文件夹
   */
  isDirectory: boolean;
  
  /**
   * 属性大小
   */
  size?: number;
  
  /**
   * 最近修改时间
   */
  modifiedTime?: string;
  
  /**
   * 所在路径
   */
  path?: string;
} 