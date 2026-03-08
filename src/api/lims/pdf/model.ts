/**
 * HTML转PDF参数
 */
export interface HtmlToPdfParams {

  harderHtml?: string;

  contentHtml?: string;

  footerHtml?: string;

  harderStyle?: string;

  contentStyle?: string;

  footerStyle?: string;

  //报告id
  reportId: number;

  //任务id
  taskId: number;

  /**
   * 页码，从 1 开始
   */
  pageNo: number | string;

  /**
   * 每页条数，最大值为 10000
   */
  pageSize: number | string;
}

/**
 * PDF预览参数
 */
export interface PdfPreviewOptions {
  /**
   * 文件名，默认为 'document.pdf'
   */
  fileName?: string;

  /**
   * 是否直接下载，默认为false（预览）
   */
  download?: boolean;

  /**
   * 是否在新窗口打开，默认为false
   */
  openInNewWindow?: boolean;
}