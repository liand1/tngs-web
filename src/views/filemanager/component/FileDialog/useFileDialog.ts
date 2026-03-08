import { createFolder, renameFile } from '../../index';
import { message } from 'ant-design-vue';
import { FileManagerConfig } from '../../config';

// 定义Props和Emits类型
interface Props {
  newFolderVisible: boolean;
  renameVisible: boolean;
  createFolderLoading: boolean;
  renameLoading: boolean;
  newFolderForm: {
    name: string;
  };
  renameForm: {
    name: string;
    fileId: string;
  };
  currentPath: string;
  fileList: any[];
  config: FileManagerConfig;
}

type Emits = {
  (e: 'update:newFolderVisible', value: boolean): void;
  (e: 'update:renameVisible', value: boolean): void;
  (e: 'update:createFolderLoading', value: boolean): void;
  (e: 'update:renameLoading', value: boolean): void;
  (e: 'create-folder-success'): void;
  (e: 'rename-success'): void;
}

/**
 * 文件对话框组件逻辑
 * @param props 组件属性
 * @param emit 事件发射器
 * @returns 组件逻辑和状态
 */
export function useFileDialog(props: Props, emit: Emits) {
  // 检查文件名是否合法
  function isValidFileName(name: string): boolean {
    // 不能为空或者包含特殊字符
    if (!name.trim() || /[\\/:*?"<>|]/.test(name)) {
      message.error('文件名不能为空或包含特殊字符 \\ / : * ? " < > |');
      return false;
    }
    return true;
  }
  
  // 检查名称是否已存在
  function isNameExists(name: string): boolean {
    const exists = props.fileList.some(file => file.name === name);
    if (exists) {
      message.error(`名称 "${name}" 已存在`);
      return true;
    }
    return false;
  }

  // 创建文件夹
  function handleCreateFolder() {
    if (!props.config.enableCreateFolder) {
      message.warning('创建文件夹功能已禁用');
      emit('update:newFolderVisible', false);
      return;
    }
    
    const name = props.newFolderForm.name;
    
    if (!isValidFileName(name)) {
      return;
    }
    
    if (isNameExists(name)) {
      return;
    }
    
    emit('update:createFolderLoading', true);
    
    createFolder(props.currentPath, name)
      .then(() => {
        message.success(`文件夹 "${name}" 创建成功`);
        emit('update:newFolderVisible', false);
        emit('create-folder-success');
      })
      .catch((error) => {
        console.error('创建文件夹失败:', error);
        message.error('创建文件夹失败');
      })
      .finally(() => {
        emit('update:createFolderLoading', false);
      });
  }

  // 重命名文件
  function handleRename() {
    if (!props.config.enableRename) {
      message.warning('重命名功能已禁用');
      emit('update:renameVisible', false);
      return;
    }
    
    const newName = props.renameForm.name;
    
    if (!isValidFileName(newName)) {
      return;
    }
    
    // 找到要重命名的文件
    const file = props.fileList.find(f => f.id === props.renameForm.fileId);
    if (!file) {
      message.error('找不到要重命名的文件');
      emit('update:renameVisible', false);
      return;
    }
    
    // 如果名称没有变化，直接关闭对话框
    if (file.name === newName) {
      emit('update:renameVisible', false);
      return;
    }
    
    // 检查新名称是否已存在（排除自身）
    if (props.fileList.some(f => f.name === newName && f.id !== file.id)) {
      message.error(`名称 "${newName}" 已存在`);
      return;
    }
    
    emit('update:renameLoading', true);
    
    renameFile(file.path, newName)
      .then(() => {
        message.success(`重命名为 "${newName}" 成功`);
        emit('update:renameVisible', false);
        emit('rename-success');
      })
      .catch((error) => {
        console.error('重命名失败:', error);
        message.error('重命名失败');
      })
      .finally(() => {
        emit('update:renameLoading', false);
      });
  }

  return {
    handleCreateFolder,
    handleRename
  };
} 