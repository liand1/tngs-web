
// 扩展父组件传入类型的接口
export interface ExternalLink {
  id: number;
  url?: string;
  iconClass?: string;
  iconSrc?: string;
  title: string;
  hidden?: boolean;
  pinned?: boolean;
  isSwitch?: boolean;
  type?: number;
}

// 定义系统项类型
export interface SystemItem {
  id: number;
  visible?: boolean;
  pinned?: boolean;
  url?: string;
  iconClass?: string;
  iconSrc?: string;
  title: string;
  isSwitch?: boolean;
  type?: number;
}
