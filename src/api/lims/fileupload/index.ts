import { defHttp } from '@/utils/http/axios';
import { FilesInfoRespVO } from './model';

enum Api {
  FilePathList = '/lims/file-upload/find-file-path-list',
}

/**
 * 获取文件路径列表
 * @param filePath 文件路径
 * @returns 文件及文件夹信息列表
 */
export const getFilePathList = (filePath: string) => {
  // 对文件路径进行URL编码
  const encodedFilePath = encodeURIComponent(filePath);


  return defHttp.get<FilesInfoRespVO[]>(
    {
      url: Api.FilePathList,
      params: { filePath: encodedFilePath },
    }
  );
};
