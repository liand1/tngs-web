import { defHttp } from '@/utils/http/axios';
import { HtmlToPdfParams, PdfPreviewOptions } from './model';
import { downloadByData } from '@/utils/file/download';


enum Api {
  HtmlToPdf = '/lims/file-upload/invoice-task-report-pdf',
  HtmlToWord = '/lims/file-upload/download-report-docx',
}

/**
 * HTML生成PDF文件
 * @param params 生成PDF的参数
 * @returns PDF文件数据流
 */
export function invoicePdf(params: HtmlToPdfParams) {
  return defHttp.post<string>(
    {
      url: Api.HtmlToPdf,
      params,
      // responseType: 'blob', // 指定响应类型为blob
    },
    // {
    //   isReturnNativeResponse: true, // 返回原生响应对象
    //   errorMessageMode: 'none', // 错误信息模式
    // }
  );
}

/**
 * HTML生成word文件
 * @param params 生成word的参数
 * @returns word文件数据流
 */
export function invoiceWord(params: HtmlToPdfParams) {
  return defHttp.post<string>(
    {
      url: Api.HtmlToWord,
      params,
      // responseType: 'blob', // 指定响应类型为blob
    },
    // {
    //   isReturnNativeResponse: true, // 返回原生响应对象
    //   errorMessageMode: 'none', // 错误信息模式
    // }
  );
}


/**
 * 处理PDF下载
 * @param params 生成PDF的参数
 * @param options 预览选项
 * @returns 成功返回true，失败返回false
 */
export async function handlePdfDownload(
  params: HtmlToPdfParams,
  options: PdfPreviewOptions = {}
): Promise<boolean> {
  try {
    const response = await invoicePdf(params);
    const blob = new Blob([response], { type: 'application/pdf' });
    const fileName = options.fileName || 'document.pdf';

    if (options.download) {
      // 直接下载
      downloadByData(blob, fileName);
      return true;
    } else if (options.openInNewWindow) {
      // 在新窗口打开
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 100);
      return true;
    } else {
      // 返回blob URL供预览使用
      return true;
    }
  } catch (error) {
    console.error('PDF下载/预览失败:', error);
    return false;
  }
}

/**
 * 预览PDF内容
 * @param params 生成PDF的参数
 * @returns PDF的Blob URL，可用于iframe展示
 */
export async function previewPdf(params: HtmlToPdfParams): Promise<string | null> {
  try {
    const response = await invoicePdf(params);
    const blob = new Blob([response], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('PDF预览失败:', error);
    return null;
  }
}

/**
 * 使用示例:
 * 
 * 1. 直接下载PDF:
 * await handlePdfDownload({
 *   harderHtml: '<header>报告头部</header>',
 *   contentHtml: '<div>报告内容</div>',
 *   footerHtml: '<footer>报告页脚</footer>',
 *   pageNo: 1,
 *   pageSize: 10
 * }, { fileName: '测试报告.pdf', download: true });
 * 
 * 2. 在iframe中预览PDF:
 * const pdfUrl = await previewPdf({
 *   harderHtml: '<header>报告头部</header>',
 *   contentHtml: '<div>报告内容</div>',
 *   footerHtml: '<footer>报告页脚</footer>',
 *   pageNo: 1,
 *   pageSize: 10
 * });
 * 
 * if (pdfUrl) {
 *   // 在iframe中显示
 *   document.getElementById('pdfFrame').src = pdfUrl;
 * }
 */