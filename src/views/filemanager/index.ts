import { defHttp } from '@/utils/http/axios';

import {
  mockGetFileList,
  mockUploadFile,
  mockCreateFolder,
  mockRenameFile,
  mockDeleteFiles,
  mockCopyFiles,
  mockMoveFiles,
  mockSearchFiles
} from './mock';
import { FilesInfoRespVO } from '@/api/lims/fileupload/model';

// 是否使用模拟数据
const useMock = true;

enum Api {
  GetFileList = '/file-manager/list',
  UploadFile = '/file-manager/upload',
  DownloadFile = '/file-manager/download',
  CreateFolder = '/file-manager/create-folder',
  RenameFile = '/file-manager/rename',
  DeleteFile = '/file-manager/delete',
  CopyFile = '/file-manager/copy',
  MoveFile = '/file-manager/move',
  SearchFiles = '/file-manager/search',
}

/**
 * 获取文件列表
 * @param path 当前路径
 * @returns 文件列表
 */
export function getFileList(path: string) {
  if (useMock) {
    return mockGetFileList(path);
  }

  return defHttp.get<FilesInfoRespVO[]>({
    url: Api.GetFileList,
    params: { path },
  });
}

/**
 * 上传文件
 * @param file 文件对象
 * @param path 上传路径
 * @returns 上传结果
 */
export function uploadFile(file: File, path: string) {
  if (useMock) {
    return mockUploadFile(file, path);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path);

  return defHttp.post<FilesInfoRespVO>({
    url: Api.UploadFile,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 下载文件
 * @param filePath 文件路径
 * @returns 下载链接
 */
export function getDownloadUrl(filePath: string) {
  // 模拟环境下生成一个假的下载链接（实际不会下载任何文件）
  if (useMock) {
    return `#/mock-download?path=${encodeURIComponent(filePath)}`;
  }

  return `${import.meta.env.VITE_GLOB_API_URL}${Api.DownloadFile}?path=${encodeURIComponent(filePath)}`;
}

/**
 * 创建文件夹
 * @param path 当前路径
 * @param folderName 文件夹名称
 * @returns 创建结果
 */
export function createFolder(path: string, folderName: string) {
  if (useMock) {
    return mockCreateFolder(path, folderName);
  }

  return defHttp.post<FilesInfoRespVO>({
    url: Api.CreateFolder,
    data: { path, folderName },
  });
}

/**
 * 重命名文件或文件夹
 * @param path 文件路径
 * @param newName 新名称
 * @returns 重命名结果
 */
export function renameFile(path: string, newName: string) {
  if (useMock) {
    return mockRenameFile(path, newName);
  }

  return defHttp.post<FilesInfoRespVO>({
    url: Api.RenameFile,
    data: { path, newName },
  });
}

/**
 * 删除文件或文件夹
 * @param paths 文件路径数组
 * @returns 删除结果
 */
export function deleteFiles(paths: string[]) {
  if (useMock) {
    return mockDeleteFiles(paths);
  }

  return defHttp.post({
    url: Api.DeleteFile,
    data: { paths },
  });
}

/**
 * 复制文件
 * @param srcPaths 源文件路径数组
 * @param destPath 目标路径
 * @returns 复制结果
 */
export function copyFiles(srcPaths: string[], destPath: string) {
  if (useMock) {
    return mockCopyFiles(srcPaths, destPath);
  }

  return defHttp.post({
    url: Api.CopyFile,
    data: { srcPaths, destPath },
  });
}

/**
 * 移动文件
 * @param srcPaths 源文件路径数组
 * @param destPath 目标路径
 * @returns 移动结果
 */
export function moveFiles(srcPaths: string[], destPath: string) {
  if (useMock) {
    return mockMoveFiles(srcPaths, destPath);
  }

  return defHttp.post({
    url: Api.MoveFile,
    data: { srcPaths, destPath },
  });
}

/**
 * 搜索文件
 * @param keyword 关键词
 * @param path 搜索路径
 * @returns 搜索结果
 */
export function searchFiles(keyword: string, path?: string) {
  if (useMock) {
    return mockSearchFiles(keyword, path);
  }

  return defHttp.get<FilesInfoRespVO[]>({
    url: Api.SearchFiles,
    params: { keyword, path },
  });
}

/**
 * 转换后端返回的文件数据为前端显示所需的格式
 * @param files 后端返回的文件数据
 * @returns 前端格式的文件数据
 */
export function transformFileData(files: FilesInfoRespVO[]): FilesInfoRespVO[] {
  if (!files) return []
  return files.map((file, index) => {

    const normalizedPath = file.path ? file.path.split('\\').join('/') : file.path;
    console.log(normalizedPath)
    return {
      id: index.toString(),
      name: file.name,
      isDirectory: file.isDirectory,
      size: file.size,
      modifiedTime: file.modifiedTime,
      path: normalizedPath,
    };
  });
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
}

/**
 * 格式化日期
 * @param date 日期字符串
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleString();
}
