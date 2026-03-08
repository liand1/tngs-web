/**
 * 模板预览组件相关类型定义
 * 统一管理所有接口和类型定义，便于维护和复用
 */

/**
 * 页面样式类型定义
 * 用于设置预览模板的纸张类型和方向
 */
export interface PageStyleType {
  /** 纸张类型，支持A3、A4、B3、B4 */
  paperSize: "A3" | "A4" | "B3" | "B4";
  /** 纸张方向，portrait(纵向)或landscape(横向) */
  orientation: "portrait" | "landscape";
}

/**
 * 模板信息接口
 * 包含模板的基本信息
 */
export interface TemplateInfoType {
  /** 模板ID */
  id: number;
  /** 模板标题 */
  title: string;
  /** 模板代码 */
  code: string;
  /** 封面内容HTML */
  coverContent?: string;
  /** 封底内容HTML */
  backCoverContent?: string;
}

/**
 * 分页控制配置接口
 * 控制分页功能的显示和行为
 */
export interface PaginationConfigType {
  /** 是否显示翻页功能 */
  show: boolean;
  /** 是否在页面底部显示页码信息 */
  showPageInfo: boolean;
}

/**
 * 自动播放配置接口
 * 控制自动播放功能的显示和行为
 */
export interface AutoplayConfigType {
  /** 是否显示自动播放按钮 */
  show: boolean;
  /** 自动播放间隔（毫秒） */
  interval: number;
}

/**
 * 页面箭头配置接口
 * 控制页面两侧翻页箭头的显示和样式
 */
export interface PageArrowsConfigType {
  /** 是否显示页面两侧翻页箭头 */
  show: boolean;
  /** 翻页箭头大小 */
  size: number;
  /** 翻页箭头距离边缘距离 */
  edgeDistance: number;
  /** 翻页箭头图标大小 */
  iconSize: number;
}

/**
 * 页面尺寸接口
 * 定义页面的像素尺寸
 */
export interface PageSizeType {
  /** 页面宽度（像素） */
  width: number;
  /** 页面高度（像素） */
  height: number;
}

/**
 * PDF导出选项接口
 * 定义PDF导出的各种配置选项
 */
export interface PdfExportOptions {
  /** 文档标题 */
  title?: string;
  /** 模板代码 */
  code?: string;
  /** 页边距 [上, 右, 下, 左] 单位mm */
  margin?: [number, number, number, number];
  /** 文件名 */
  filename?: string;
  /** 纸张方向 portrait-纵向 landscape-横向 */
  orientation?: 'portrait' | 'landscape';
  /** 图片相关配置 */
  image?: {
    /** 图片类型 */
    type: 'jpeg' | 'png' | 'webp';
    /** 图片质量，范围0-1 */
    quality?: number;
  };
  /** html2canvas配置选项 */
  html2canvas?: {
    /** 渲染比例，影响清晰度 */
    scale?: number;
    /** dpi */
    letterRendering?: boolean;
    /** 是否启用跨域图片支持 */
    useCORS?: boolean;
    /** 是否启用日志输出 */
    logging?: boolean;
    /** 克隆回调函数，用于处理文档内容 */
    onclone?: (clonedDoc: Document) => void;
  };
  /** jsPDF配置选项 */
  jsPDF?: {
    /** 单位类型 */
    unit?: 'pt' | 'px' | 'mm' | 'cm' | 'in';
    /** 纸张格式 */
    format?: 'a0' | 'a1' | 'a2' | 'a3' | 'a4' | 'a5' | 'a6' | 'a7' | 'a8' | 'a9' | 'a10';
    /** 纸张方向 */
    orientation?: 'portrait' | 'landscape';
    /** 是否启用热修复 */
    hotfixes?: string[];
  };
  /** 分页配置选项 */
  pagebreak?: {
    /** 分页模式 */
    mode?: 'css' | 'legacy' | 'avoid-all' | Array<'css' | 'legacy' | 'avoid-all'>;
    /** 在指定元素前分页 */
    before?: string | string[];
    /** 在指定元素后分页 */
    after?: string | string[];
    /** 避免在指定元素内分页 */
    avoid?: string | string[];
  };
  /** 字体配置 */
  font?: {
    /** 字体文件路径，默认为 "/fonts/weiruanyahei.ttf" */
    fontPath?: string;
    /** 字体名称，默认为 "MyYaHei" */
    fontName?: string;
    /** 字体样式，默认为 "normal" */
    fontStyle?: string;
    /** 字体文件大小限制，单位字节，默认为 50MB */
    sizeLimit?: number;
  };
  /** 页脚配置 */
  footer?: {
    /** 是否显示页脚，默认为 true */
    enabled?: boolean;
    /** 自定义页脚格式 */
    format?: (pageNum: number, totalPages: number) => string;
  };
}

/**
 * 模板数据接口
 * 用于存储模板的响应式数据
 */
export interface TemplateDataType {
  /** 模板ID */
  id: number;
  /** 模板标题 */
  title: string;
  /** 模板代码 */
  code: string;
  /** 创建时间 */
  createTime: string;
}

/**
 * 初始化参数接口
 * 用于初始化预览组件
 */
export interface InitParamsType {
  /** 模板ID */
  id?: number;
  /** 模板标题 */
  title?: string;
  /** 模板代码 */
  code?: string;
  /** HTML内容 */
  htmlContent: string;
}

/**
 * 导出状态接口
 * 用于保存导出前的状态
 */
export interface ExportStateType {
  /** 当前页码 */
  currentPage: number;
  /** 是否自动播放 */
  autoplay: boolean;
}

/**
 * 预览配置接口
 * 用于获取预览组件的当前配置
 */
export interface PreviewConfigType {
  /** 模板信息 */
  templateInfo: TemplateDataType;
  /** 分页配置 */
  pagination: PaginationConfigType;
  /** 自动播放配置 */
  autoplay: AutoplayConfigType;
  /** 页面箭头配置 */
  pageArrows: PageArrowsConfigType;
  /** 页面样式配置 */
  pageStyle: PageStyleType;
}

/**
 * 自动播放控制器接口
 * 提供自动播放的控制方法
 */
export interface AutoplayControllerType {
  /** 开始自动播放 */
  start: () => void;
  /** 停止自动播放 */
  stop: () => void;
} 