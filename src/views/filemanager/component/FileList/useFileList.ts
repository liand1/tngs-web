import {
  EyeOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined
} from "@ant-design/icons-vue";
import { deleteFiles } from '../../index';
import { message } from "ant-design-vue";
import { FileManagerConfig } from '../../config';
import { ref } from 'vue';

// 定义Props和Emits类型
export interface FileItem {
  id: string;
  name: string;
  isDirectory: boolean;
  size: number;
  modifiedTime: string;
  path: string;
}

interface Props {
  loading: boolean;
  viewMode: string;
  fileList: FileItem[];
  selectedFilesIds: string[];
  selectedFiles: FileItem[];
  deleteLoading: boolean;
  renameLoading: boolean;
  currentPath: string;
  config: FileManagerConfig;
  enableMultiSelect: boolean;
}

type Emits = {
  (e: 'selection-change', selectedKeys: string[]): void;
  (e: 'row-click', record: FileItem): void;
  (e: 'open-file', file: FileItem): void;
  (e: 'download-file', file: FileItem): void;
  (e: 'rename-file', file: FileItem): void;
  (e: 'delete-file-success'): void;
  (e: 'toggle-selection', file: FileItem): void;
  (e: 'update:deleteLoading', value: boolean): void;
  (e: 'update:selectedFilesIds', value: string[]): void;
  (e: 'update:selectedFiles', value: FileItem[]): void;
  (e: 'refresh-files'): void;
}

/**
 * 文件列表组件逻辑
 * @param props 组件属性
 * @param emit 事件发射器
 * @returns 组件逻辑和状态
 */
export function useFileList(props: Props, emit: Emits) {
  // 记录最后选择的文件索引，用于Shift多选
  const lastSelectedIndex = ref(-1);

  // 拖动选择相关状态
  const isDragging = ref(false);
  const startPoint = ref({ x: 0, y: 0 });
  const currentPoint = ref({ x: 0, y: 0 });
  const selectionBox = ref({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    display: 'none'
  });
  
  // 文件元素位置缓存
  const fileItemRects = ref<Map<string, DOMRect>>(new Map());

  // 表格列配置
  const tableColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: FileItem, b: FileItem) => a.name.localeCompare(b.name)
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      sorter: (a: FileItem, b: FileItem) => a.size - b.size
    },
    {
      title: '修改时间',
      dataIndex: 'modifiedTime',
      key: 'modifiedTime',
      width: 180,
      sorter: (a: FileItem, b: FileItem) => new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime()
    },
    {
      title: '操作',
      dataIndex: 'actions',
      key: 'actions',
      width: 150
    }
  ];

  // 文件行操作菜单配置
  const recordActions = [
    {
      key: 'open',
      icon: EyeOutlined,
      handler: (file: FileItem) => openFile(file)
    },
    {
      key: 'download',
      icon: DownloadOutlined,
      handler: (file: FileItem) => {
        if (!props.config.enableDownload) {
          message.warning('下载功能已禁用');
          return;
        }
        emit('download-file', file);
      }
    },
    {
      key: 'rename',
      icon: EditOutlined,
      handler: (file: FileItem) => {
        if (!props.config.enableRename) {
          message.warning('重命名功能已禁用');
          return;
        }
        emit('rename-file', file);
      }
    },
    {
      key: 'delete',
      icon: DeleteOutlined,
      handler: (file: FileItem) => {
        if (!props.config.enableDelete) {
          message.warning('删除功能已禁用');
          return;
        }
        deleteFile(file);
      },
      danger: true
    }
  ];

  // 表格选择变更
  function onSelectionChange(selectedRowKeys: string[]) {
    emit('update:selectedFilesIds', selectedRowKeys);
    
    // 更新选中的文件对象
    const selectedFiles = props.fileList.filter(file => 
      selectedRowKeys.includes(file.id)
    );
    emit('update:selectedFiles', selectedFiles);
  }

  // 表格行点击事件
  function onRowClick(record: FileItem) {
    // 调用toggleFileSelection实现选择逻辑
    toggleFileSelection(record);
  }

  // 打开文件
  function openFile(file: FileItem) {
    
    if (file.isDirectory) {
      emit('open-file', file);
    }
  }

  // 切换文件选择
  function toggleFileSelection(file: FileItem, event?: MouseEvent) {
    if (!props.enableMultiSelect) {
      // 当不支持多选时，执行单选逻辑
      // 选中当前点击的文件，而不是直接打开
      const selectedFilesIds = [file.id];
      const selectedFiles = [file];
      
      // 更新选中ID和文件
      emit('update:selectedFilesIds', selectedFilesIds);
      emit('update:selectedFiles', selectedFiles);
      
      return;
    }
    
    // 创建选中文件ID数组的副本
    let selectedFilesIds = [...props.selectedFilesIds];
    const currentIndex = props.fileList.findIndex(f => f.id === file.id);
    
    // 处理键盘多选
    if (event) {
      // Ctrl/Command键按下 - 切换单个文件选择状态
      if (event.ctrlKey || event.metaKey) {
        const index = selectedFilesIds.indexOf(file.id);
        if (index === -1) {
          selectedFilesIds.push(file.id);
        } else {
          selectedFilesIds.splice(index, 1);
        }
        // 更新最后选择的索引
        lastSelectedIndex.value = currentIndex;
      } 
      // Shift键按下 - 连续选择
      else if (event.shiftKey && lastSelectedIndex.value !== -1 && lastSelectedIndex.value !== currentIndex) {
        // 计算选择范围
        const start = Math.min(lastSelectedIndex.value, currentIndex);
        const end = Math.max(lastSelectedIndex.value, currentIndex);
        
        // 选择范围内的所有文件
        const rangeIds = props.fileList.slice(start, end + 1).map(f => f.id);
        
        // 合并选择
        selectedFilesIds = Array.from(new Set([...selectedFilesIds, ...rangeIds]));
      } 
      // 普通点击 - 单选
      else {
        selectedFilesIds = [file.id];
        lastSelectedIndex.value = currentIndex;
      }
    } 
    // 没有键盘事件的普通点击或拖选
    else {
      const index = selectedFilesIds.indexOf(file.id);
      if (index === -1) {
        selectedFilesIds.push(file.id);
      } else {
        selectedFilesIds.splice(index, 1);
      }
      // 更新最后选择的索引
      lastSelectedIndex.value = currentIndex;
    }
    
    // 更新选中ID
    emit('update:selectedFilesIds', selectedFilesIds);
    
    // 更新选中的文件对象
    const selectedFiles = props.fileList.filter(f => 
      selectedFilesIds.includes(f.id)
    );
    emit('update:selectedFiles', selectedFiles);
  }

  // 删除文件
  function deleteFile(file: FileItem) {
    if (!props.config.enableDelete) {
      message.warning('删除功能已禁用');
      return;
    }
    
    // 更新loading状态
    emit('update:deleteLoading', true);
    
    deleteFiles([file.path])
      .then(() => {
        message.success(`已删除: ${file.name}`);
        emit('refresh-files'); // 刷新文件列表
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
      case 'rename':
        return props.renameLoading;
      case 'delete':
        return props.deleteLoading;
      default:
        return false;
    }
  }
  
  // 开始拖动选择
  function startDragSelect(event: MouseEvent, containerRef: HTMLElement) {
    if (!props.enableMultiSelect) return;
    
    // 只有左键点击才触发
    if (event.button !== 0) return;
    
    // 防止与其他点击事件冲突
    if ((event.target as HTMLElement).closest('.file-item, .ant-table-row, a, button')) {
      return;
    }
    
    isDragging.value = true;
    
    // 获取容器相对位置
    const containerRect = containerRef.getBoundingClientRect();
    
    // 记录起始点相对于容器的位置
    startPoint.value = {
      x: event.clientX - containerRect.left,
      y: event.clientY - containerRect.top
    };
    
    currentPoint.value = { ...startPoint.value };
    
    // 初始化选择框
    updateSelectionBox();
    
    // 缓存所有文件项的位置
    cacheFileItemRects(containerRef);
    
    // 添加事件监听
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDragSelect);
    
    // 如果没有按下Ctrl/Command或Shift键，则清除原有选择
    if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      emit('update:selectedFilesIds', []);
      emit('update:selectedFiles', []);
    }
  }
  
  // 鼠标移动更新选择框
  function onMouseMove(event: MouseEvent) {
    if (!isDragging.value) return;
    
    const containerEl = document.querySelector('.file-manager-content') as HTMLElement;
    if (!containerEl) return;
    
    const containerRect = containerEl.getBoundingClientRect();
    
    // 更新当前点相对于容器的位置
    currentPoint.value = {
      x: Math.max(0, Math.min(event.clientX - containerRect.left, containerRect.width)),
      y: Math.max(0, Math.min(event.clientY - containerRect.top, containerRect.height))
    };
    
    // 更新选择框
    updateSelectionBox();
    
    // 更新选中的文件
    updateSelectedFiles(event);
  }
  
  // 停止拖动选择
  function stopDragSelect() {
    isDragging.value = false;
    
    // 隐藏选择框
    selectionBox.value.display = 'none';
    
    // 移除事件监听
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDragSelect);
  }
  
  // 更新选择框位置和大小
  function updateSelectionBox() {
    // 计算选择框的位置和大小
    const left = Math.min(startPoint.value.x, currentPoint.value.x);
    const top = Math.min(startPoint.value.y, currentPoint.value.y);
    const width = Math.abs(currentPoint.value.x - startPoint.value.x);
    const height = Math.abs(currentPoint.value.y - startPoint.value.y);
    
    // 更新选择框样式
    selectionBox.value = {
      left,
      top,
      width,
      height,
      display: isDragging.value ? 'block' : 'none'
    };
  }
  
  // 缓存所有文件项的位置
  function cacheFileItemRects(containerRef: HTMLElement) {
    fileItemRects.value.clear();
    
    // 获取所有文件项元素
    const fileItems = containerRef.querySelectorAll('.file-item');
    const tableRows = containerRef.querySelectorAll('.ant-table-row');
    
    // 处理网格视图的文件项
    fileItems.forEach((item) => {
      const fileId = item.getAttribute('data-id');
      if (fileId) {
        const rect = item.getBoundingClientRect();
        const containerRect = containerRef.getBoundingClientRect();
        
        // 转换为相对于容器的位置
        const relativeRect = new DOMRect(
          rect.left - containerRect.left,
          rect.top - containerRect.top,
          rect.width,
          rect.height
        );
        
        fileItemRects.value.set(fileId, relativeRect);
      }
    });
    
    // 处理表格视图的行
    tableRows.forEach((row) => {
      const fileId = row.getAttribute('data-row-key');
      if (fileId) {
        const rect = row.getBoundingClientRect();
        const containerRect = containerRef.getBoundingClientRect();
        
        // 转换为相对于容器的位置
        const relativeRect = new DOMRect(
          rect.left - containerRect.left,
          rect.top - containerRect.top,
          rect.width,
          rect.height
        );
        
        fileItemRects.value.set(fileId, relativeRect);
      }
    });
  }
  
  // 更新选中的文件
  function updateSelectedFiles(event?: MouseEvent) {
    if (!isDragging.value) return;
    
    // 获取选择框
    const selBox = {
      left: selectionBox.value.left,
      top: selectionBox.value.top,
      right: selectionBox.value.left + selectionBox.value.width,
      bottom: selectionBox.value.top + selectionBox.value.height
    };
    
    // 计算与选择框相交的文件
    const newSelectedIds: string[] = [];
    
    fileItemRects.value.forEach((rect, fileId) => {
      const fileBox = {
        left: rect.left,
        top: rect.top,
        right: rect.left + rect.width,
        bottom: rect.top + rect.height
      };
      
      // 检查是否相交
      if (
        selBox.left <= fileBox.right &&
        selBox.right >= fileBox.left &&
        selBox.top <= fileBox.bottom &&
        selBox.bottom >= fileBox.top
      ) {
        newSelectedIds.push(fileId);
      }
    });
    
    // 处理键盘多选
    let selectedIds: string[] = [];
    
    if (event && (event.ctrlKey || event.metaKey || event.shiftKey)) {
      // 合并选择
      selectedIds = Array.from(new Set([...props.selectedFilesIds, ...newSelectedIds]));
    } else {
      // 替换选择
      selectedIds = newSelectedIds;
    }
    
    // 更新选中状态
    emit('update:selectedFilesIds', selectedIds);
    
    // 更新选中的文件对象
    const selectedFiles = props.fileList.filter(f => 
      selectedIds.includes(f.id)
    );
    emit('update:selectedFiles', selectedFiles);
  }

  return {
    tableColumns,
    recordActions,
    onSelectionChange,
    onRowClick,
    openFile,
    toggleFileSelection,
    deleteFile,
    getActionLoading,
    // 拖动选择相关
    isDragging,
    selectionBox,
    startDragSelect,
    onMouseMove,
    stopDragSelect
  };
} 