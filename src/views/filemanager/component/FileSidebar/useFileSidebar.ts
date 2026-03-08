import {
  HomeOutlined,
  FileOutlined,
  PictureOutlined,
  PlaySquareOutlined,
  SoundOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FolderOutlined,
  CloudOutlined,
  StarOutlined
} from "@ant-design/icons-vue";
import { computed } from 'vue';
import { FileManagerConfig, SidebarNavItem } from '../../config';

// 定义Props和Emits类型
interface Props {
  currentPath: string;
  config: FileManagerConfig;
}

type Emits = {
  (e: 'navigate', path: string): void;
  (e: 'delete-nav', nav: SidebarNavItem, index: number): void;
  (e: 'add-nav', nav: SidebarNavItem): void;
  (e: 'edit-nav', nav: SidebarNavItem, index: number): void;
}

/**
 * 文件管理器侧边栏组件逻辑
 * @param props 组件属性
 * @param emit 事件发射器
 * @returns 组件逻辑和状态
 */
export function useFileSidebar(props: Props, emit: Emits) {
  // 默认侧边栏导航项
  const defaultNavs: SidebarNavItem[] = [
    { 
      path: '/', 
      title: '主页', 
      icon: HomeOutlined 
    },
    { 
      path: '/documents', 
      title: '文档', 
      icon: FileOutlined 
    },
    { 
      path: '/pictures', 
      title: '图片', 
      icon: PictureOutlined 
    },
    { 
      path: '/video', 
      title: '视频', 
      icon: PlaySquareOutlined 
    },
    { 
      path: '/music', 
      title: '音乐', 
      icon: SoundOutlined 
    },
    { 
      path: '/download', 
      title: '下载', 
      icon: DownloadOutlined,
      divider: true
    }
  ];

  // 回收站导航项
  const trashNav: SidebarNavItem = {
    path: '/trash',
    title: '回收站',
    icon: DeleteOutlined
  };

  // 默认路径列表，用于判断是否为默认导航项（不可删除）
  const defaultPaths = defaultNavs.concat(trashNav).map(nav => nav.path);

  // 可用的图标组件
  const iconComponents = {
    HomeOutlined,
    FileOutlined,
    FolderOutlined,
    PictureOutlined,
    PlaySquareOutlined,
    SoundOutlined,
    DownloadOutlined,
    DeleteOutlined,
    CloudOutlined,
    StarOutlined
  };

  // 计算最终的导航列表
  const sidebarNavs = computed(() => {
    // 使用自定义导航或默认导航
    const navItems = props.config.sidebarNavs || defaultNavs;
    
    // 如果启用回收站且不在自定义导航中已包含回收站
    if (props.config.enableTrash && !navItems.some(nav => nav.path === '/trash')) {
      return [...navItems, trashNav];
    }
    
    return navItems;
  });

  // 导航到指定路径
  function navigateTo(path: string) {
    emit('navigate', path);
  }

  return {
    sidebarNavs,
    navigateTo,
    defaultPaths,
    iconComponents
  };
} 