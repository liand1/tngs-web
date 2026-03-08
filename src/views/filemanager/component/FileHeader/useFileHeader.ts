import { computed } from 'vue';
import { message } from 'ant-design-vue';
import { getFileList, searchFiles, transformFileData } from '../../index';
import { FileManagerConfig } from '../../config';

// 定义组件props和emits的类型
interface Props {
  currentPath: string;
  loading: boolean;
  searchLoading: boolean;
  config: FileManagerConfig;
}

type Emits = {
  (e: 'navigate', path: string): void;
  (e: 'refresh'): void;
  (e: 'search', keyword: string): void;
  (e: 'update:loading', value: boolean): void;
  (e: 'update:searchLoading', value: boolean): void;
  (e: 'update:fileList', files: any[]): void;
}

/**
 * 文件管理器头部组件逻辑
 * @param props 组件属性
 * @param emit 事件发射器
 * @returns 组件逻辑和状态
 */
export function useFileHeader(props: Props, emit: Emits) {
  // 计算路径部分
  const pathParts = computed(() => {
    const parts = props.currentPath.split('/').filter(Boolean);
    let fullPath = '';
    return parts.map(part => {
      fullPath += `/${part}`;
      return {
        name: part,
        path: fullPath
      };
    });
  });

  // 导航到指定路径
  function navigateTo(path: string) {
    emit('navigate', path);
  }

  // 获取文件列表
  function fetchFiles() {
    emit('update:loading', true);
    
    getFileList(props.currentPath)
      .then((response) => {
        // 转换后端返回的数据为前端所需格式
        const transformedFiles = transformFileData(response);
        emit('update:fileList', transformedFiles);
      })
      .catch((error) => {
        console.error("获取文件列表失败:", error);
        message.error("获取文件列表失败");
      })
      .finally(() => {
        emit('update:loading', false);
      });
  }

  // 刷新文件列表
  function refreshFiles() {
    if (!props.config.enableRefresh) {
      message.warning('刷新功能已禁用');
      return;
    }
    
    fetchFiles();
    message.success("刷新成功");
  }

  // 搜索文件
  function onSearch(value: string) {
    if (!props.config.enableSearch) {
      message.warning('搜索功能已禁用');
      return;
    }
    
    if (!value) {
      fetchFiles();
      return;
    }
    
    emit('update:searchLoading', true);
    emit('update:loading', true);
    
    searchFiles(value, props.currentPath)
      .then((response) => {
        const transformedFiles = transformFileData(response);
        emit('update:fileList', transformedFiles);
      })
      .catch((error) => {
        console.error("搜索文件失败:", error);
        message.error("搜索文件失败");
      })
      .finally(() => {
        emit('update:searchLoading', false);
        emit('update:loading', false);
      });
  }

  return {
    pathParts,
    navigateTo,
    fetchFiles,
    refreshFiles,
    onSearch
  };
} 