import { FilesInfoRespVO } from '@/api/lims/fileupload/model';
import { FileType } from './model';

// 模拟文件数据
const mockFiles: Record<string, FilesInfoRespVO[]> = {};

// 模拟API函数
// 获取文件列表
export function mockGetFileList(path: string): Promise<FilesInfoRespVO[]> {
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizePath = path.endsWith('/') ? path.slice(0, -1) : path;
      const files = mockFiles[normalizePath || '/'] || [];
      resolve([...files]);
    }, 300);
  });
}

// 上传文件
export function mockUploadFile(file: File, path: string): Promise<FilesInfoRespVO> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newFile: FilesInfoRespVO = {
        id: '0',
        name: file.name,
        isDirectory: false,
        size: file.size,
        modifiedTime: new Date().toISOString(),
        path: `${path}/${file.name}`,
      };

      // 将文件添加到模拟数据中
      const normalizePath = path.endsWith('/') ? path.slice(0, -1) : path;
      if (!mockFiles[normalizePath]) {
        mockFiles[normalizePath] = [];
      }
      mockFiles[normalizePath].push(newFile);

      resolve(newFile);
    }, 500);
  });
}

// 创建文件夹
export function mockCreateFolder(path: string, folderName: string): Promise<FilesInfoRespVO> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizePath = path.endsWith('/') ? path.slice(0, -1) : path;
      const newFolder: FilesInfoRespVO = {
        id: '0',
        name: folderName,
        isDirectory: true,
        size: 0,
        modifiedTime: new Date().toISOString(),
        path: `${normalizePath}/${folderName}`,
      };

      // 将文件夹添加到模拟数据中
      if (!mockFiles[normalizePath]) {
        mockFiles[normalizePath] = [];
      }
      mockFiles[normalizePath].push(newFolder);

      // 为新文件夹创建空的文件列表
      mockFiles[newFolder.path!] = [];

      resolve(newFolder);
    }, 300);
  });
}

// 重命名文件或文件夹
export function mockRenameFile(path: string, newName: string): Promise<FilesInfoRespVO> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 找到文件所在的目录
      const lastSlashIndex = path.lastIndexOf('/');
      const dirPath = path.substring(0, lastSlashIndex);
      const oldName = path.substring(lastSlashIndex + 1);
      const normalizeDirPath = dirPath === '' ? '/' : dirPath;

      // 在目录中找到文件
      const dirFiles = mockFiles[normalizeDirPath];
      if (!dirFiles) {
        reject(new Error('文件所在目录不存在'));
        return;
      }

      const fileIndex = dirFiles.findIndex(f => f.name === oldName);
      if (fileIndex === -1) {
        reject(new Error('文件不存在'));
        return;
      }

      // 更新文件名和路径
      const file = { ...dirFiles[fileIndex] };
      file.name = newName;
      file.path = `${normalizeDirPath}/${newName}`;

      // 更新模拟数据
      dirFiles[fileIndex] = file;

      // 如果是文件夹，需要更新其中的文件路径和文件夹映射
      if (file.isDirectory) {
        const oldPath = path;
        const newPath = file.path;

        // 更新文件夹映射
        if (mockFiles[oldPath]) {
          mockFiles[newPath] = mockFiles[oldPath];
          delete mockFiles[oldPath];
        }
      }

      resolve(file);
    }, 300);
  });
}

// 删除文件或文件夹
export function mockDeleteFiles(paths: string[]): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      paths.forEach(path => {
        // 找到文件所在的目录
        const lastSlashIndex = path.lastIndexOf('/');
        const dirPath = path.substring(0, lastSlashIndex);
        const fileName = path.substring(lastSlashIndex + 1);
        const normalizeDirPath = dirPath === '' ? '/' : dirPath;

        // 在目录中找到文件并删除
        const dirFiles = mockFiles[normalizeDirPath];
        if (dirFiles) {
          const fileIndex = dirFiles.findIndex(f => f.name === fileName);
          if (fileIndex !== -1) {
            dirFiles.splice(fileIndex, 1);

            // 如果是文件夹，需要删除其中的所有文件
            if (path in mockFiles) {
              delete mockFiles[path];
            }
          }
        }
      });

      resolve();
    }, 300);
  });
}

// 复制文件
export function mockCopyFiles(srcPaths: string[], destPath: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const normalizeDestPath = destPath.endsWith('/') ? destPath.slice(0, -1) : destPath;

      // 确保目标目录存在
      if (!mockFiles[normalizeDestPath]) {
        mockFiles[normalizeDestPath] = [];
      }

      srcPaths.forEach(srcPath => {
        // 找到源文件所在的目录
        const lastSlashIndex = srcPath.lastIndexOf('/');
        const srcDirPath = srcPath.substring(0, lastSlashIndex);
        const fileName = srcPath.substring(lastSlashIndex + 1);
        const normalizeSrcDirPath = srcDirPath === '' ? '/' : srcDirPath;

        // 在源目录中找到文件
        const srcDirFiles = mockFiles[normalizeSrcDirPath];
        if (srcDirFiles) {
          const fileIndex = srcDirFiles.findIndex(f => f.name === fileName);
          if (fileIndex !== -1) {
            const srcFile = srcDirFiles[fileIndex];

            // 创建文件副本
            const newFile: FilesInfoRespVO = {
              ...srcFile,
              modifiedTime: new Date().toISOString(),
              path: `${normalizeDestPath}/${fileName}`,
            };

            // 添加到目标目录
            mockFiles[normalizeDestPath].push(newFile);

            // 如果是文件夹，需要递归复制其中的文件
            if (srcFile.isDirectory && mockFiles[srcFile.path!]) {
              mockFiles[newFile.path!] = [...mockFiles[srcFile.path!]].map(f => ({
                ...f,
                path: f.path!.replace(srcFile.path!, newFile.path!),
              }));
            }
          }
        }
      });

      resolve();
    }, 500);
  });
}

// 移动文件
export function mockMoveFiles(srcPaths: string[], destPath: string): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 先复制文件
      mockCopyFiles(srcPaths, destPath)
        .then(() => {
          // 再删除源文件
          return mockDeleteFiles(srcPaths);
        })
        .then(() => {
          resolve();
        });
    }, 500);
  });
}

// 搜索文件
export function mockSearchFiles(keyword: string, path?: string): Promise<FilesInfoRespVO[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const searchPath = path || '/';
      const normalizePath = searchPath.endsWith('/') ? searchPath.slice(0, -1) : searchPath;
      let results: FilesInfoRespVO[] = [];

      // 递归搜索函数
      const searchInPath = (currentPath: string) => {
        const files = mockFiles[currentPath] || [];

        // 在当前目录中搜索匹配的文件
        files.forEach(file => {
          if (file.name.toLowerCase().includes(keyword.toLowerCase())) {
            results.push(file);
          }

          // 如果是文件夹，递归搜索
          if (file.isDirectory) {
            searchInPath(file.path!);
          }
        });
      };

      // 开始搜索
      searchInPath(normalizePath === '' ? '/' : normalizePath);

      resolve(results);
    }, 500);
  });
}

// 辅助函数：根据文件类型判断FileType
function getFileTypeFromFile(file: File): FileType {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 图片类型
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
    return FileType.Image;
  }

  // 视频类型
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(extension)) {
    return FileType.Video;
  }

  // 音频类型
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(extension)) {
    return FileType.Audio;
  }

  // 文档类型
  if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'csv'].includes(extension)) {
    return FileType.Document;
  }

  // 压缩文件类型
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
    return FileType.Archive;
  }

  // 默认文件类型
  return FileType.File;
}
