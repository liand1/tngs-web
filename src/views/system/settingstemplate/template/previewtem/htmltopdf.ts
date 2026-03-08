// @ts-ignore
import html2pdf from "html2pdf.js";
import { PdfExportOptions } from "./model";

/**
 * 加载PDF字体
 * 
 * @param pdf jsPDF实例
 * @param fontOptions 字体选项
 * @returns Promise<boolean> 是否成功加载字体
 */
export async function loadPdfFont(
  pdf: any,
  fontOptions: {
    fontPath?: string;
    fontName?: string;
    fontStyle?: string;
    sizeLimit?: number;
  } = {}
): Promise<boolean> {
  try {
    // 默认配置
    const options = {
      fontPath: fontOptions.fontPath || "/fonts/weiruanyahei.ttf",
      fontName: fontOptions.fontName || "MyYaHei",
      fontStyle: fontOptions.fontStyle || "normal",
      sizeLimit: fontOptions.sizeLimit || 50000000 // 50MB
    };

    // 加载字体文件
    const fontResponse = await fetch(options.fontPath);
    if (!fontResponse.ok) {
      console.warn(`字体文件获取失败: ${fontResponse.status}`);
      return false;
    }

    // 获取字体文件二进制数据
    const fontBinary = await fontResponse.arrayBuffer();
    const fontData = new Uint8Array(fontBinary);

    // 检查字体文件大小
    if (fontData.length > options.sizeLimit) {
      console.warn(`字体文件过大 (${(fontData.length / 1024 / 1024).toFixed(2)}MB)，超过限制 (${(options.sizeLimit / 1024 / 1024).toFixed(2)}MB)，跳过自定义字体`);
      return false;
    }

    // 将字体文件转换为base64
    const blob = new Blob([fontData], { type: 'application/octet-stream' });
    const fontBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        // 获取base64字符串，移除开头的"data:application/octet-stream;base64,"
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });

    // 将字体添加到PDF中
    pdf.addFileToVFS(`${options.fontName}.ttf`, fontBase64);
    pdf.addFont(`${options.fontName}.ttf`, options.fontName, options.fontStyle);

    // 设置当前字体
    pdf.setFont(options.fontName);

    console.log(`字体 ${options.fontName} 加载成功`);
    return true;
  } catch (error) {
    console.error('字体加载失败:', error);
    return false;
  }
}

/**
 * 添加页码到PDF文档
 * 
 * @param pdf jsPDF实例
 * @param fontName 字体名称，如果为空使用默认字体
 * @param options 页码选项
 */
export function addPageNumbers(
  pdf: any,
  fontName?: string,
  options?: {
    fontSize?: number;
    xPosition?: number;
    yOffset?: number;
    format?: (pageNum: number, totalPages: number) => string;
    enabled?: boolean;       // 是否启用页码
  }
): void {
  try {
    // 如果显式设置为不启用，则直接返回
    if (options?.enabled === false) {
      return;
    }

    // 获取页数
    const totalPages = pdf.internal.getNumberOfPages();

    // 默认配置
    const defaultOptions = {
      fontSize: 10,
      xPosition: 105, // A4纸张中心位置
      yOffset: 5,     // 距离底部距离
      format: (pageNum: number, total: number) => `第 ${pageNum} 页 / 共 ${total} 页`,
      enabled: true
    };

    // 合并选项
    const mergedOptions = { ...defaultOptions, ...options };

    // 为每一页添加页码
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);

      // 设置字体，如果指定了字体并且存在则使用，否则使用默认字体
      try {
        if (fontName) {
          pdf.setFont(fontName);
        } else {
          pdf.setFont("Helvetica");
        }
      } catch (e) {
        pdf.setFont("Helvetica");
      }

      // 设置字体大小
      pdf.setFontSize(mergedOptions.fontSize);

      // 获取页面高度用于定位页码
      const pageHeight = pdf.internal.pageSize.getHeight();

      // 添加页码文本
      const pageText = mergedOptions.format(i, totalPages);
      pdf.text(
        pageText,
        mergedOptions.xPosition,
        pageHeight - mergedOptions.yOffset,
        { align: 'center' }
      );
    }
  } catch (error) {
    console.error('添加页码失败:', error);
  }
}

/**
 * 导出HTML内容为PDF文档
 * 
 * @param content HTML内容或HTML DOM元素
 * @param options 导出选项
 * @returns Promise<void>
 */
export async function exportToPdf(
  content: HTMLElement | string,
  options: PdfExportOptions = {}
): Promise<void> {
  // 准备HTML元素
  let element: HTMLElement;

  if (typeof content === 'string') {
    // 如果传入的是HTML字符串，创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;
    element = tempContainer;
    // 添加到body但不显示，确保能够正确计算尺寸
    Object.assign(tempContainer.style, {
      position: 'absolute',
      left: '-9999px',
      top: '-9999px'
    });
    document.body.appendChild(tempContainer);
  } else {
    // 如果传入的是DOM元素，直接使用
    element = content;
  }

  try {
    // 默认值
    const defaultOptions: PdfExportOptions = {
      title: '模板文档',
      code: 'TEMPLATE',
      margin: [10, 10, 10, 10],
      filename: `template_${new Date().getTime()}.pdf`,
      orientation: 'portrait',
      font: {
        fontPath: "/fonts/weiruanyahei.ttf",
        fontName: "MyYaHei",
        fontStyle: "normal",
        sizeLimit: 50000000 // 50MB
      },
      footer: {
        enabled: true
      }
    };

    // 合并选项
    const mergedOptions = { ...defaultOptions, ...options };

    // 确保所有图片加载完成
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // 即使图片加载失败也继续导出
        });
      })
    );

    // 设置PDF导出选项
    const pdfOptions = {
      margin: mergedOptions.margin,
      filename: mergedOptions.filename,
      image: mergedOptions.image || { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 1,
        useCORS: true,
        logging: false,
        ...(mergedOptions.html2canvas || {})
      },
      jsPDF: {
        unit: 'mm',
        format: 'a3',
        orientation: mergedOptions.orientation,
        ...(mergedOptions.jsPDF || {}),
        // 增加内存限制相关配置
        hotfixes: ['px_scaling'],
        compress: true,
        precision: 2,
        userUnit: 1.0
      },
      pagebreak: mergedOptions.pagebreak || { mode: ['css', 'legacy'] }  // 支持分页
    };

    // 创建 pdf 实例并进行处理
    try {
      // 初始化worker
      const worker = html2pdf().set(pdfOptions).from(element).toPdf();

      // 处理字体和页脚
      await worker.get('pdf').then(async function (pdf) {
      

        try {
          // 加载自定义字体
          const fontLoaded = await loadPdfFont(pdf, mergedOptions.font);

          // 添加页码（如果启用）
          addPageNumbers(pdf, fontLoaded ? mergedOptions.font?.fontName : undefined, {
            enabled: mergedOptions.footer?.enabled,
            format: mergedOptions.footer?.format
          });

          return pdf;
        } catch (innerError) {
          console.error('PDF处理失败:', innerError);
          // 出错时继续保存基本PDF，不再尝试自定义处理
          return pdf;
        }
      });

      // 保存PDF
      await worker.save();

    } catch (workerError) {
      console.error('PDF生成失败，尝试简化版本:', workerError);

      // 如果上述方法失败，尝试使用简化版本（不添加字体和页码）
      await html2pdf()
        .set({
          ...pdfOptions,
          html2canvas: {
            ...pdfOptions.html2canvas,
            scale: 1 // 降低比例以减少内存使用
          }
        })
        .from(element)
        .save();
    }

    // 清理临时元素
    if (typeof content === 'string' && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    return Promise.resolve();
  } catch (error) {
    console.error('PDF导出失败:', error);

    // 清理临时元素
    if (typeof content === 'string' && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    return Promise.reject(error);
  }
}

/**
 * 导出HTML内容为PDF并生成Blob URL
 * 
 * @param content HTML内容或HTML DOM元素
 * @param options 导出选项
 * @returns Promise<string> Blob URL
 */
export async function htmlToPdfUrl(
  content: HTMLElement | string,
  options: PdfExportOptions = {}
): Promise<string> {
  // 准备HTML元素
  let element: HTMLElement;

  if (typeof content === 'string') {
    // 如果传入的是HTML字符串，创建临时容器
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = content;
    element = tempContainer;
    // 添加到body但不显示，确保能够正确计算尺寸
    Object.assign(tempContainer.style, {
      position: 'absolute',
      left: '-9999px',
      top: '-9999px'
    });
    document.body.appendChild(tempContainer);
  } else {
    // 如果传入的是DOM元素，直接使用
    element = content;
  }


  try {
    // 默认值
    const defaultOptions: PdfExportOptions = {
      title: '模板文档',
      code: 'TEMPLATE',
      margin: [10, 10, 10, 10],
      filename: `template_${new Date().getTime()}.pdf`,
      orientation: 'portrait',
      font: {
        fontPath: "/fonts/weiruanyahei.ttf",
        fontName: "MyYaHei",
        fontStyle: "normal",
        sizeLimit: 50000000 // 50MB
      },
      footer: {
        enabled: true
      }
    };

    // 合并选项
    const mergedOptions = { ...defaultOptions, ...options };

    // 确保所有图片加载完成
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = resolve;
          img.onerror = resolve; // 即使图片加载失败也继续导出
        });
      })
    );

    // 设置PDF导出选项
    const pdfOptions = {
      margin: mergedOptions.margin,
      filename: mergedOptions.filename,
      image: mergedOptions.image || { type: 'jpeg', quality: 1 },
      html2canvas: {
        scale: 1,
        useCORS: true,
        logging: false,
        ...(mergedOptions.html2canvas || {})
      },
      jsPDF: {
        unit: 'mm',
        format: "a4" ,
        orientation: mergedOptions.orientation,
        ...(mergedOptions.jsPDF || {}),
        // 增加内存限制相关配置
        hotfixes: ['px_scaling'],
        compress: true,
        precision: 2,
        userUnit: 1.0
      },
      pagebreak: mergedOptions.pagebreak || { mode: ['css', 'legacy'] }  // 支持分页
    };
    // console.log(JSON.stringify(pdfOptions))

    // 创建 pdf 实例并进行处理
    try {
      // 初始化worker
      const worker = html2pdf().set(pdfOptions).from(element);

      // 获取PDF对象
      const pdf = await worker.toPdf().get('pdf');

      // 处理字体和页脚
      const fontLoaded = await loadPdfFont(pdf, mergedOptions.font);

      // 添加页码（如果启用）
      addPageNumbers(pdf, fontLoaded ? mergedOptions.font?.fontName : undefined, {
        enabled: mergedOptions.footer?.enabled,
        format: mergedOptions.footer?.format
      });

      // 获取PDF Blob数据
      const pdfBlob = pdf.output('blob');

      // 创建Blob URL
      const blobUrl = URL.createObjectURL(pdfBlob);

      // 清理临时元素
      if (typeof content === 'string' && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // 返回Blob URL
      return blobUrl;

    } catch (workerError) {
      console.error('PDF生成失败，尝试简化版本:', workerError);

      // 如果上述方法失败，尝试使用简化版本（不添加字体和页码）
      const pdf = await html2pdf()
        .set({
          ...pdfOptions,
          html2canvas: {
            ...pdfOptions.html2canvas,
            scale: 1 // 降低比例以减少内存使用
          }
        })
        .from(element)
        .toPdf()
        .get('pdf');

      // 获取PDF Blob数据
      const pdfBlob = pdf.output('blob');

      // 创建Blob URL
      const blobUrl = URL.createObjectURL(pdfBlob);

      // 清理临时元素
      if (typeof content === 'string' && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      // 返回Blob URL
      return blobUrl;
    }
  } catch (error) {
    console.error('PDF导出失败:', error);

    // 清理临时元素
    if (typeof content === 'string' && element.parentNode) {
      element.parentNode.removeChild(element);
    }

    return Promise.reject(error);
  }
}

/**
 * 释放PDF的Blob URL
 * 
 * @param url Blob URL
 */
export function releasePdfUrl(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * 导出HTML内容为PDF，支持自定义分页设置
 * 
 * @param content HTML内容或HTML DOM元素
 * @param pagebreakOptions 分页选项
 * @param options 导出选项
 * @returns Promise<void>
 */
export async function exportToPdfWithPagebreaks(
  content: HTMLElement | string,
  pagebreakOptions: {
    mode?: 'css' | 'legacy' | 'avoid-all' | Array<'css' | 'legacy' | 'avoid-all'>;
    before?: string | string[];
    after?: string | string[];
    avoid?: string | string[];
  },
  options: Omit<PdfExportOptions, 'pagebreak'> = {}
): Promise<void> {
  return exportToPdf(content, {
    ...options,
    pagebreak: pagebreakOptions
  });
}

/**
 * 示例：如何使用不同的页面分隔配置
 * 
 * @example
 * 
 * // 1. 避免所有元素的页面分隔，并在ID为page2el的元素前添加分页
 * exportToPdfWithPagebreaks(contentElement, {
 *   mode: 'avoid-all',
 *   before: '#page2el'
 * });
 * 
 * // 2. 启用所有分页模式，无明确元素
 * exportToPdfWithPagebreaks(contentElement, {
 *   mode: ['avoid-all', 'css', 'legacy']
 * });
 * 
 * // 3. 无模式，仅明确元素
 * exportToPdfWithPagebreaks(contentElement, {
 *   before: '.beforeClass',
 *   after: ['#after1', '#after2'],
 *   avoid: 'img'
 * });
 */
