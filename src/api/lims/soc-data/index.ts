import { UploadTypeEnum } from '@/enums/customEnum';
import { defHttp } from '@/utils/http/axios'

/**
 * 手动上传芯片文件响应接口
 */
export interface SocDataUploadRespVO {
  socId: number; // 芯片ID
  failFiles: string[]; // 上传失败的文件名列表
  succeedFileUrls?: string[]; // 上传成功的文件URL列表
  matchingSamples: Record<string, string>;// 匹配的样本列表
}

/**
 * 手动上传芯片文件参数
 */
export interface ManualUploadSocFilesParams {
  sourcePath?: string; // 芯片原始文件路径
  socId?: string | number; // 芯片Id
  socName?: string; // 芯片名称
  socSourceName?: string; //芯片原名称（用于补充芯片文件使用）
  operateType?: UploadTypeEnum
}

/**
 * 手动上传芯片文件
 * @param params 上传参数
 * @returns 上传结果
 */
export function manualUploadSocFiles(params: ManualUploadSocFilesParams) {
  return defHttp.post<SocDataUploadRespVO>({
    url: '/lims/soc-data/manual-upload-files',
    params, // 普通查询参
    // 文件上传需要以下配置
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // }
  })
} 

/**
 * 自动上传扫描芯片文件
 * 
 * @description 自动扫描配置路径文件
 * @returns {Promise<string>} 上传结果
 */
export function autoUploadSocFiles() {
  return defHttp.post<string>(
    {
      url: '/lims/soc-data/auto-upload-files',
    },
    {
      errorMessageMode: 'message',
    }
  );
} 