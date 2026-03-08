import { Component } from 'vue';

/**
 * 侧边栏导航项配置
 */
export interface SidebarNavItem {
  path: string;     // 导航路径
  title: string;    // 导航标题
  icon: Component;  // 导航图标组件
  divider?: boolean; // 是否在此项后添加分隔线
}

/**
 * 文件管理器功能配置
 * 通过设置不同功能的启用状态来控制文件管理器的功能
 */
export interface FileManagerConfig {
  // 核心功能
  enableSearch: boolean;    // 是否启用搜索功能
  enableRefresh: boolean;   // 是否启用刷新功能

  // 文件操作功能
  enableUpload: boolean;    // 是否启用上传功能
  enableDownload: boolean;  // 是否启用下载功能
  enableCreateFolder: boolean; // 是否启用创建文件夹功能
  enableRename: boolean;    // 是否启用重命名功能
  enableCopy: boolean;      // 是否启用复制功能
  enableCut: boolean;       // 是否启用剪切功能
  enablePaste: boolean;     // 是否启用粘贴功能
  enableDelete: boolean;    // 是否启用删除功能

  // 显示设置
  enableGridView: boolean;  // 是否启用网格视图
  enableListView: boolean;  // 是否启用列表视图

  // 侧边栏配置
  sidebarNavs?: SidebarNavItem[]; // 自定义侧边栏导航项
  enableTrash?: boolean;     // 是否启用回收站功能
  enableAddNav?: boolean;    // 是否启用添加导航功能
  enableEditNav?: boolean;   // 是否启用编辑导航功能

  // 界面区域显示/隐藏配置
  showSidebar?: boolean;     // 是否显示左侧导航栏
  showHeader?: boolean;      // 是否显示顶部栏
  showToolbar?: boolean;     // 是否显示文件操作工具栏
  showMultiSelect?: boolean; // 是否启用文件列表的多选功能
  showActionColumn?: boolean; // 是否显示文件列表的操作列
}

// 默认配置 - 所有功能都启用
export const defaultConfig: FileManagerConfig = {
  enableSearch: false,
  enableRefresh: false,

  enableUpload: false,
  enableDownload: false,
  enableCreateFolder: false,
  enableRename: false,
  enableCopy: false,
  enableCut: false,
  enablePaste: false,
  enableDelete: false,

  enableGridView: true,
  enableListView: true,

  // 默认启用回收站和导航管理
  enableTrash: true,
  enableAddNav: true,
  enableEditNav: true,

  // 默认显示所有界面区域
  showSidebar: false,
  showHeader: true,
  showToolbar: true,
  showMultiSelect: false,
  showActionColumn: false
};

// 检查配置是否合法 - 至少一种视图必须启用
export function validateConfig(config: FileManagerConfig): FileManagerConfig {
  const validatedConfig = { ...config };

  // 确保至少启用一种视图模式
  if (!config.enableGridView && !config.enableListView) {
    validatedConfig.enableListView = true;
  }

  return validatedConfig;
} 