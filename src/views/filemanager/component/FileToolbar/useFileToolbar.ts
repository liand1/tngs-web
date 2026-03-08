import {
  DownloadOutlined,
  EditOutlined,
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { 
  uploadFile, 
  getDownloadUrl, 
  copyFiles, 
  moveFiles, 
  deleteFiles 
} from '../../index';
import { FileManagerConfig } from '../../config';

// 定义Props和Emits类型
interface Props {
  hasSelection: boolean;
  viewMode: string;
  uploadLoading: boolean;
  createFolderLoading: boolean;
  copyLoading: boolean;
  moveLoading: boolean;
  deleteLoading: boolean;
  renameLoading: boolean;
  hasCopiedFiles: boolean;
  currentPath: string;
  selectedFiles: any[];
  clipboardFiles: any;
  fileList: any[];
  config: FileManagerConfig;
}

type Emits = {
  (e: 'upload'): void;
  (e: 'createFolder'): void;
  (e: 'download-selected'): void;
  (e: 'rename-selected'): void;
  (e: 'copy-selected'): void;
  (e: 'cut-selected'): void;
  (e: 'paste'): void;
  (e: 'delete-selected'): void;
  (e: 'view-mode-change', mode: string): void;
  (e: 'update:uploadLoading', value: boolean): void;
  (e: 'update:copyLoading', value: boolean): void;
  (e: 'update:moveLoading', value: boolean): void;
  (e: 'update:deleteLoading', value: boolean): void;
  (e: 'update:selectedFiles', value: any[]): void;
  (e: 'update:selectedFilesIds', value: string[]): void;
  (e: 'update:clipboardFiles', value: any): void;
  (e: 'update:hasCopiedFiles', value: boolean): void;
  (e: 'refresh-files'): void;
}

/**
 * 文件工具栏组件逻辑
 * @param props 组件属性
 * @param emit 事件发射器
 * @returns 组件逻辑和状态
 */
export function useFileToolbar(props: Props, emit: Emits) {
  // 文件操作菜单配置
  const fileActions = [
    {
      key: 'download',
      title: '下载',
      icon: DownloadOutlined,
      handler: () => {
        if (!props.hasSelection || !props.config.enableDownload) return;
        downloadSelected();
      }
    },
    {
      key: 'rename',
      title: '重命名',
      icon: EditOutlined,
      handler: () => {
        if (!props.hasSelection || !props.config.enableRename) return;
        emit('rename-selected');
      },
      disabled: () => !props.hasSelection
    },
    {
      key: 'copy',
      title: '复制',
      icon: CopyOutlined,
      handler: () => {
        if (!props.hasSelection || !props.config.enableCopy) return;
        copySelected();
      }
    },
    {
      key: 'cut',
      title: '剪切',
      icon: ScissorOutlined,
      handler: () => {
        if (!props.hasSelection || !props.config.enableCut) return;
        cutSelected();
      }
    },
    {
      key: 'paste',
      title: '粘贴',
      icon: SnippetsOutlined,
      handler: () => {
        if (!props.hasCopiedFiles || !props.config.enablePaste) return;
        paste();
      },
      disabled: () => !props.hasCopiedFiles
    },
    {
      key: 'delete',
      title: '删除',
      icon: DeleteOutlined,
      handler: () => {
        if (!props.hasSelection || !props.config.enableDelete) return;
        deleteSelected();
      }
    }
  ];

  // 上传文件
  function upload() {
    if (!props.config.enableUpload) {
      message.warning('上传功能已禁用');
      return;
    }
    
    // 创建一个文件输入元素
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files || files.length === 0) return;
      
      emit('update:uploadLoading', true);
      
      // 上传所有选择的文件
      let completedCount = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        uploadFile(file, props.currentPath)
          .then(() => {
            message.success(`上传文件 ${file.name} 成功`);
            // 计数上传完成的文件
            completedCount++;
            // 所有文件都上传完成后刷新文件列表
            if (completedCount === files.length) {
              emit('refresh-files');
              emit('update:uploadLoading', false);
            }
          })
          .catch((error) => {
            console.error(`上传文件 ${file.name} 失败:`, error);
            message.error(`上传文件 ${file.name} 失败`);
            completedCount++;
            if (completedCount === files.length) {
              emit('update:uploadLoading', false);
            }
          });
      }
    };
    
    input.click();
  }

  // 创建文件夹
  function createFolder() {
    if (!props.config.enableCreateFolder) {
      message.warning('创建文件夹功能已禁用');
      return;
    }
    
    emit('createFolder');
  }

  // 下载文件
  function downloadFile(file: any) {
    if (!props.config.enableDownload) {
      message.warning('下载功能已禁用');
      return;
    }
    
    window.open(getDownloadUrl(file.path), '_blank');
    message.success(`下载文件: ${file.name}`);
  }

  // 下载选中的文件
  function downloadSelected() {
    if (!props.config.enableDownload) {
      message.warning('下载功能已禁用');
      return;
    }
    
    props.selectedFiles.forEach(file => {
      if (!file.isDirectory) {
        downloadFile(file);
      }
    });
  }

  // 复制选中的文件
  function copySelected() {
    if (!props.config.enableCopy) {
      message.warning('复制功能已禁用');
      return;
    }
    
    if (!props.selectedFiles.length) return;
    
    emit('update:clipboardFiles', {
      files: [...props.selectedFiles],
      operation: "copy",
    });
    
    emit('update:hasCopiedFiles', true);
    message.success(`已复制 ${props.selectedFiles.length} 个文件`);
  }

  // 剪切选中的文件
  function cutSelected() {
    if (!props.config.enableCut) {
      message.warning('剪切功能已禁用');
      return;
    }
    
    if (!props.selectedFiles.length) return;
    
    emit('update:clipboardFiles', {
      files: [...props.selectedFiles],
      operation: "cut",
    });
    
    emit('update:hasCopiedFiles', true);
    message.success(`已剪切 ${props.selectedFiles.length} 个文件`);
  }

  // 粘贴文件
  function paste() {
    if (!props.config.enablePaste) {
      message.warning('粘贴功能已禁用');
      return;
    }
    
    if (!props.clipboardFiles) return;
    
    const { files, operation } = props.clipboardFiles;
    const paths = files.map((file: any) => file.path);
    
    if (operation === "copy") {
      // 复制操作
      emit('update:copyLoading', true);
      
      copyFiles(paths, props.currentPath)
        .then(() => {
          message.success(`已复制 ${files.length} 个文件`);
          emit('refresh-files');
        })
        .catch((error) => {
          console.error("复制文件失败:", error);
          message.error("复制文件失败");
        })
        .finally(() => {
          emit('update:copyLoading', false);
        });
    } else {
      // 剪切操作
      emit('update:moveLoading', true);
      
      moveFiles(paths, props.currentPath)
        .then(() => {
          message.success(`已移动 ${files.length} 个文件`);
          emit('update:clipboardFiles', null);
          emit('update:hasCopiedFiles', false);
          emit('refresh-files');
        })
        .catch((error) => {
          console.error("移动文件失败:", error);
          message.error("移动文件失败");
        })
        .finally(() => {
          emit('update:moveLoading', false);
        });
    }
  }

  // 删除选中的文件
  function deleteSelected() {
    if (!props.config.enableDelete) {
      message.warning('删除功能已禁用');
      return;
    }
    
    if (!props.selectedFiles.length) return;
    
    const paths = props.selectedFiles.map(file => file.path);
    
    emit('update:deleteLoading', true);
    
    deleteFiles(paths)
      .then(() => {
        message.success(`已删除 ${paths.length} 个文件`);
        emit('update:selectedFiles', []);
        emit('update:selectedFilesIds', []);
        emit('refresh-files');
      })
      .catch((error) => {
        console.error("删除文件失败:", error);
        message.error("删除文件失败");
      })
      .finally(() => {
        emit('update:deleteLoading', false);
      });
  }

  // 获取操作的loading状态
  function getActionLoading(key: string): boolean {
    switch (key) {
      case 'download':
        return false; // 下载是在新窗口中进行的，不需要loading状态
      case 'rename':
        return props.renameLoading;
      case 'copy':
        return props.copyLoading;
      case 'cut':
        return false; // 剪切只是标记，不涉及API调用
      case 'paste':
        return props.moveLoading || props.copyLoading;
      case 'delete':
        return props.deleteLoading;
      default:
        return false;
    }
  }

  // 切换视图模式
  function onViewModeChange(value: string) {
    const allowedViewMode = props.config.enableListView && props.config.enableGridView;
    if (!allowedViewMode) {
      message.warning('视图切换功能已禁用');
      return;
    }
    
    // 检查是否允许切换到目标视图模式
    if (value === 'list' && !props.config.enableListView) {
      message.warning('列表视图已禁用');
      return;
    }
    
    if (value === 'grid' && !props.config.enableGridView) {
      message.warning('网格视图已禁用');
      return;
    }
    
    emit('view-mode-change', value);
  }

  return {
    fileActions,
    upload,
    createFolder,
    downloadFile,
    downloadSelected,
    copySelected,
    cutSelected,
    paste,
    deleteSelected,
    getActionLoading,
    onViewModeChange
  };
} 