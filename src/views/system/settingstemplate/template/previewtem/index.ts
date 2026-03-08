/**
 * 模板预览相关工具函数
 * 包含DPI计算、页面尺寸转换、页面计算、内容处理等功能
 */
import { PDFDocument } from "pdf-lib";
import { exportToPdf, htmlToPdfUrl } from "./htmltopdf";
import { PageSizeType, PdfExportOptions } from "./model";
import message from "@/components/FormDesign/src/utils/message";
import { defHttp } from "@/utils/http/axios";
import { useGlobSetting } from "@/hooks/setting";
import { UploadImageResult } from "@/views/system/usermanualsettings";


/**
 * 获取当前设备的DPI值
 * 用于计算精确的物理尺寸
 * 
 * @returns {number} DPI值，默认为96
 */
export function getDPI(): number {
  if (typeof window === "undefined") return 96;

  // 创建一个1英寸的元素来测量DPI
  const div = document.createElement("div");
  div.style.width = "1in";
  div.style.height = "1in";
  div.style.position = "absolute";
  div.style.left = "-100%";
  div.style.top = "-100%";
  document.body.appendChild(div);

  // 测量实际像素尺寸
  const dpi = div.offsetWidth;
  document.body.removeChild(div);

  return dpi || 96; // 如果测量失败，返回默认值96
}

function mmToPixel(mm, dpi) {
  // 1 inch = 25.4 mm
  var inches = mm / 25.4;
  var pixels = inches * dpi;
  return Math.round(pixels);
}

export const ptToPx = (size: { width: number, height: number }, orientation: "portrait" | "landscape") => {
  const dpi = getDPI();

  const mmToPixel = 96 / 25.4; // 1英寸=25.4毫米
  let width = Math.round(size.width * mmToPixel);
  let height = Math.round(size.height * mmToPixel);

  if (orientation === "landscape") {
    [width, height] = [height, width];
  }

  return { width, height };
};

/**
 * 根据纸张类型计算像素尺寸
 * 
 * @param {string} pageSize - 纸张类型，支持A3、A4、B3、B4
 * @param {string} orientation - 纸张方向，portrait(纵向)或landscape(横向)
 * @returns {{width: number, height: number}} 纸张的像素尺寸
 */
export function pageSizeInPixels(
  pageSize: "A3" | "A4" | "B3" | "B4" = "A4",
  orientation: "portrait" | "landscape" = "portrait",
  dpi: number = 96
): { width: number; height: number } {
  const sizes = {
    A3: { width: 297, height: 420 },
    A4: { width: 210, height: 296.8 },
    B3: { width: 364, height: 515 },
    B4: { width: 257, height: 364 },
  };

  const size = sizes[pageSize] || sizes.A4;
  const mmToPixel = dpi / 25.4;

  let width = Math.round(size.width * mmToPixel);
  let height = Math.round(size.height * mmToPixel);

  if (orientation === "landscape") {
    [width, height] = [height, width];
  }

  return { width, height };
}

/**
 * 计算HTML内容的页数
 * 
 * @param {string} content - HTML内容
 * @param {PageSizeType} pageSize - 页面尺寸，单位为像素
 * @param {number} footerHeight - 页脚高度，单位为像素，默认为40
 * @returns {Promise<number>} 计算得到的页数
 */
export function calculateContentPageCount(
  content: string,
  pageSize: PageSizeType,
  footerHeight: number = 40
): Promise<number> {
  return new Promise((resolve) => {
    if (!content) {
      resolve(1);
      return;
    }

    // 创建临时容器计算内容高度
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = content;

    // 设置关键样式，模拟实际页面环境
    Object.assign(tempContainer.style, {
      position: "absolute",
      visibility: "hidden",
      width: `${pageSize.width - 80}px`, // 减去左右padding
      left: "-9999px",
      top: "-9999px",
      fontSize: "14px",
      lineHeight: "1.5",
      fontFamily: "Arial, sans-serif",
      padding: "0",
      margin: "0",
      overflow: "visible",
      maxWidth: "100%",
    });

    // 添加到body以获取准确尺寸
    document.body.appendChild(tempContainer);

    // 短暂延迟，确保DOM计算准确
    setTimeout(() => {
      try {
        const contentHeight = tempContainer.scrollHeight;
        const pageHeight = pageSize.height - 180 - footerHeight; // 减去页眉页脚和边距空间

        // 计算页数，向上取整确保内容不会被截断
        const calculatedPages = Math.max(1, Math.ceil(contentHeight / pageHeight));

        console.log(
          "计算页数 - 内容高度:",
          contentHeight,
          "页面高度:",
          pageHeight,
          "计算页数:",
          calculatedPages
        );

        // 移除临时容器
        document.body.removeChild(tempContainer);

        resolve(calculatedPages);
      } catch (error) {
        console.error("计算页数出错:", error);
        // 粗略估算页数 - 每3000个字符约一页
        const roughEstimate = Math.max(1, Math.ceil(content.length / 3000));
        resolve(roughEstimate);
      }
    }, 100);
  });
}

/**
 * 为HTML内容准备PDF导出选项
 * 
 * @param {HTMLElement} contentElement - 包含HTML内容的DOM元素
 * @param {TemplateInfoType} templateInfo - 模板信息
 * @returns {PdfExportOptions} PDF导出选项
 */
export function preparePdfExportOptions(
  contentElement: HTMLElement,
  templateInfo: { title?: string; code?: string }
): PdfExportOptions {

  let enabled = false
  let margin: [number, number, number, number] = [20, 20, 20, 20]
  //如果是封面、封底，则不显示分页 
  // contentElement的类名包含cover-page或back-cover-page
  if (contentElement.classList.contains('cover-page') || contentElement.classList.contains('back-cover-page')) {
    enabled = false
    margin = [0, 0, 0, 0]
  }

  // 设置PDF导出选项
  return {
    margin,
    filename: `${templateInfo.title || "template"}_${new Date().getTime()}.pdf`,
    // 设置分页规则
    pagebreak: {
      mode: ['css', 'legacy'] as Array<'css' | 'legacy' | 'avoid-all'>,
      // 避免在图片和段落处分页
      avoid: ['img', 'p', '.avoid-break', 'table'],
      before: ['.before-break'],
      after: ['.after-break']
    },
    // 配置字体
    font: {
      fontPath: "/fonts/weiruanyahei.ttf",
      fontName: "MyYaHei",
      fontStyle: "normal"
    },
    // 启用页脚
    footer: {
      enabled,
      // 自定义页脚格式
      format: (pageNum, total) => `第 ${pageNum} 页 / 共 ${total} 页`
    },
    // 优化图片设置
    image: {
      type: 'jpeg',
      quality: 1
    },
    html2canvas: {
      // 提高图片渲染质量
      scale: 2,
      letterRendering: true,   // ✅ 提高文字精度（部分场景）
      useCORS: true,
      // 确保不会在元素中间断开
      onclone: (clonedDoc) => {


        // 处理图片，防止分页时被切割
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          img.style.pageBreakInside = 'avoid';
          img.style.breakInside = 'avoid';
          img.classList.add('avoid-break');

          // 如果图片已经加载完毕，确保导出时能正确显示
          if (img.complete) {
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
          }
        });

        // 处理段落，防止分页时被切割
        const paragraphs = clonedDoc.querySelectorAll('p');
        paragraphs.forEach(p => {
          p.style.pageBreakInside = 'avoid';
          p.style.breakInside = 'avoid';

          // 为较短的段落添加避免分页的类
          if (p.offsetHeight < 200) { // 只对高度合理的段落应用
            p.classList.add('avoid-break');
          }
        });

      }
    },
    jsPDF: {
      unit: 'px',
      hotfixes: ['px_scaling'],
      format: "a4",
      putOnlyUsedFonts: true
    }
  };
}

/**
 * 导出HTML元素为PDF
 * 
 * @param {HTMLElement} contentElement - 包含HTML内容的DOM元素
 * @param {TemplateInfoType} templateInfo - 模板信息
 * @returns {Promise<void>} 导出结果
 */
export async function exportElementToPdf(
  contentElement: HTMLElement,
  templateInfo: { title?: string; code?: string }
): Promise<String | undefined> {
  if (!contentElement) {
    throw new Error("内容元素不存在");
  }

  // 保存原始样式
  const originalContainerStyle = contentElement.style.cssText;

  try {
    // 设置导出容器样式
    contentElement.style.cssText = `
      width: 100%;
      height: auto;
      column-count: 1;
      column-gap: 0;
      overflow: visible;
    `;

    // 准备PDF导出选项
    const pdfOptions = preparePdfExportOptions(contentElement, templateInfo);

    // 导出PDF
    await exportToPdf(contentElement, pdfOptions);

    return Promise.resolve(undefined);
  } finally {
    // 清理添加的图片包装
    const wrappers = contentElement.querySelectorAll('.img-wrapper.avoid-break');
    wrappers.forEach(wrapper => {
      const parent = wrapper.parentElement;
      if (parent) {
        // 将包装内的图片移回到原来的位置
        while (wrapper.firstChild) {
          parent.insertBefore(wrapper.firstChild, wrapper);
        }
        // 删除空的包装元素
        parent.removeChild(wrapper);
      }
    });

    // 恢复图片的原始类名
    const imgElements = contentElement.querySelectorAll('img');
    imgElements.forEach(img => {
      img.classList.remove('avoid-break');
    });

    // 恢复原始样式
    contentElement.style.cssText = originalContainerStyle;

    // 移除分页标记
    const pageBreakClasses = contentElement.querySelectorAll('[class*="page-break-before-"]');
    pageBreakClasses.forEach(el => {
      const classList = el.classList;
      for (let i = 0; i < classList.length; i++) {
        if (classList[i].startsWith('page-break-before-')) {
          classList.remove(classList[i]);
          i--; // 由于移除了一个类，需要调整索引
        }
      }
    });
  }
}

/**
 * 创建自动播放控制器
 * 
 * @param {Function} nextPageFn - 翻到下一页的函数
 * @param {number} interval - 自动播放间隔，单位毫秒，默认5000
 * @returns {{start: Function, stop: Function}} 控制器对象
 */
export function createAutoplayController(
  nextPageFn: () => void,
  interval: number = 5000
): { start: () => void; stop: () => void } {
  let timer: number | null = null;

  return {
    start: () => {
      if (timer) {
        clearInterval(timer);
      }
      timer = window.setInterval(nextPageFn, interval);
    },
    stop: () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }
  };
}

/**
 * 导出HTML元素为PDF URL
 * 将HTML内容转换为PDF并返回Blob URL
 * 
 * @param {HTMLElement} contentElement - 包含HTML内容的DOM元素
 * @param {TemplateInfoType} templateInfo - 模板信息
 * @returns {Promise<string>} PDF的Blob URL
 */
export async function exportToPdfUrl(
  contentElement: HTMLElement,
  templateInfo: { title?: string; code?: string }
): Promise<string> {
  if (!contentElement) {
    throw new Error("内容元素不存在");
  }

  // 保存原始样式
  const originalContainerStyle = contentElement.style.cssText;

  try {

    // 准备PDF导出选项
    const pdfOptions = preparePdfExportOptions(contentElement, templateInfo);

    // 使用htmlToPdfUrl函数导出为URL
    const blobUrl = await htmlToPdfUrl(contentElement, pdfOptions);

    // 将URL转换为Blob对象后再合并
    try {
      // 获取Blob数据
      const response = await fetch(blobUrl);
      if (!response.ok) throw new Error('获取PDF数据失败');
      const pdfBlob = await response.blob();

      return blobUrl;
    } catch (err) {
      console.error('PDF合并准备失败:', err);
      message.error('PDF合并准备失败，请重试!');
    }

    return blobUrl;
  } finally {
    // 清理添加的图片包装
    const wrappers = contentElement.querySelectorAll('.img-wrapper.avoid-break');
    wrappers.forEach(wrapper => {
      const parent = wrapper.parentElement;
      if (parent) {
        // 将包装内的图片移回到原来的位置
        while (wrapper.firstChild) {
          parent.insertBefore(wrapper.firstChild, wrapper);
        }
        // 删除空的包装元素
        parent.removeChild(wrapper);
      }
    });

    // 恢复图片的原始类名
    const imgElements = contentElement.querySelectorAll('img');
    imgElements.forEach(img => {
      img.classList.remove('avoid-break');
    });

    // 恢复原始样式
    contentElement.style.cssText = originalContainerStyle;

    // 移除分页标记
    const pageBreakClasses = contentElement.querySelectorAll('[class*="page-break-before-"]');
    pageBreakClasses.forEach(el => {
      const classList = el.classList;
      for (let i = 0; i < classList.length; i++) {
        if (classList[i].startsWith('page-break-before-')) {
          classList.remove(classList[i]);
          i--; // 由于移除了一个类，需要调整索引
        }
      }
    });
  }
}

// 合并PDF文件
const handleMergePdf = async (fileLists: any[]) => {
  if (fileLists.length < 2) {
    message.warning("请至少选择两个PDF文件进行合并!");
    return;
  }

  try {
    // 创建一个新的PDF文档
    const mergedPdf = await PDFDocument.create();

    // 读取所有选中的PDF文件
    const pdfPromises = fileLists.map((file) => {
      return new Promise<ArrayBuffer>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file.originFileObj);
      });
    });

    // 等待所有PDF文件读取完成
    const pdfBuffers = await Promise.all(pdfPromises);

    // 将每个PDF文件添加到合并的PDF文档中
    for (const pdfBytes of pdfBuffers) {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // 保存合并后的PDF文件
    const mergedPdfBytes = await mergedPdf.save();

    // 创建一个Blob对象
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    //把blob转成File
    const mergedPdfFile = new File([blob], '"报告文件.pdf"', { type: "application/pdf" });

    // 创建一个下载链接
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "合并文件.pdf";
    // document.body.appendChild(a);
    // a.click();
    // a.remove();
    // window.URL.revokeObjectURL(url);
    const res = await uploadImage(mergedPdfFile);
    return Promise.resolve(res.url);
  } catch (error) {
    console.error("PDF合并失败:", error);
    message.error("PDF合并失败，请重试!");
  }
};

/**
 * 导出HTML元素为PDF并合并多个PDF文件
 * 
 * @param {HTMLElement[]} contentElements - 包含HTML内容的DOM元素数组
 * @param {TemplateInfoType} templateInfo - 模板信息
 * @param {string} outputFileName - 输出文件名，默认为"合并文件.pdf"
 * @returns {Promise<String>} 
 */
export async function exportAndMergePdfs(
  contentElements: HTMLElement[],
  templateInfo: { title?: string; code?: string },
  outputFileName: string = "合并文件.pdf"
): Promise<string | undefined> {
  if (!contentElements || contentElements.length === 0) {
    throw new Error("内容元素不存在");
  }

  try {
    // 处理单个元素的情况
    if (contentElements.length === 1) {
      await exportElementToPdf(contentElements[0], templateInfo);
      return undefined;
    }

    // 存储PDF文件
    const pdfFiles: Array<{ originFileObj: File }> = [];

    // 导出每个HTML元素为PDF
    for (let i = 0; i < contentElements.length; i++) {
      const contentElement = contentElements[i];
      // message.info(`正在处理第 ${i + 1}/${contentElements.length} 个文档...`);

      try {
        // 生成PDF URL
        const blobUrl = await exportToPdfUrl(contentElement, templateInfo);

        // 获取Blob数据
        const response = await fetch(blobUrl);
        if (!response.ok) throw new Error('获取PDF数据失败，请重新生成');
        const pdfBlob = await response.blob();

        // 保存为File对象
        pdfFiles.push({
          originFileObj: new File(
            [pdfBlob],
            `${templateInfo.title || "template"}_${i + 1}.pdf`,
            { type: "application/pdf" }
          )
        });

        // 释放URL资源
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error(`处理第 ${i + 1} 个文档时出错:`, error);
        // message.error(`处理第 ${i + 1} 个文档失败`);
        message.error(`PDF导出失败，请重新生成`);
      }
    }

    // 检查是否有足够的PDF文件进行合并
    if (pdfFiles.length === 0) {
      message.error("获取PDF数据失败，请重新生成");
      return undefined;
    } else if (pdfFiles.length === 1) {
      // 只有一个文件时，直接下载
      const file = pdfFiles[0].originFileObj;
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = outputFileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      const res = await uploadImage(file);

      message.success("PDF导出成功!");

      return res.url;
    }

    // 合并PDF文件
    // message.info("正在合并PDF文件...");
    return await handleMergePdfs(pdfFiles, outputFileName);
    // message.success("PDF导出完成!");
  } catch (error) {
    console.error("PDF导出失败:", error);
    message.error("PDF导出失败，请重试!");
  }
}

/**
 * 合并多个PDF文件并下载
 * 与handleMergePdf类似，但作为独立函数暴露，便于重用
 * 
 * @param {Array<{originFileObj: File}>} pdfFiles - 要合并的PDF文件数组
 * @param {string} outputFileName - 输出文件名
 * @returns {Promise<void>}
 */
export async function handleMergePdfs(
  pdfFiles: Array<{ originFileObj: File }>,
  outputFileName: string = "报告文件.pdf"
): Promise<string | undefined> {
  if (pdfFiles.length < 2) {
    message.warning("请至少提供两个PDF文件进行合并!");
    return;
  }

  try {
    // 创建一个新的PDF文档
    const mergedPdf = await PDFDocument.create();

    // 读取所有选中的PDF文件
    const pdfPromises = pdfFiles.map((file) => {
      return new Promise<ArrayBuffer>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file.originFileObj);
      });
    });

    // 等待所有PDF文件读取完成
    const pdfBuffers = await Promise.all(pdfPromises);

    // 将每个PDF文件添加到合并的PDF文档中
    for (const pdfBytes of pdfBuffers) {
      try {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      } catch (error) {
        console.error("生成PDF页面时出错:", error);
      }
    }

    // 保存合并后的PDF文件
    const mergedPdfBytes = await mergedPdf.save();

    // 创建一个Blob对象
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    //把blob转成File
    const mergedPdfFile = new File([blob], outputFileName, { type: "application/pdf" });
    // 创建一个下载链接
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = outputFileName;
    // document.body.appendChild(a);
    // a.click();
    // a.remove();
    // window.URL.revokeObjectURL(url);

    const res = await uploadImage(mergedPdfFile);
    return Promise.resolve(res.url);
  } catch (error) {
    console.error("PDF导出失败:", error);
    message.error("PDF导出失败，请重试!");
    return Promise.reject(error);
  }
}



/**
 * 上传图片到服务器
 * @param file 图片文件
 * @returns 返回包含url的Promise
 */
export function uploadImage(file: File): Promise<UploadImageResult> {
  const { uploadUrl = '' } = useGlobSetting();
  // 创建表单数据
  const formData = new FormData();
  formData.append('file', file);
  // 可以添加额外参数
  formData.append('biz', 'doc'); // 业务标识

  return new Promise((resolve, reject) => {
    if (!uploadUrl) {
      reject(new Error('未配置上传URL'));
      return;
    }

    defHttp.uploadFile(
      {
        url: uploadUrl,
        // 可以添加上传进度处理
        // onUploadProgress: (e) => {
        //   const percent = Math.floor((e.loaded / e.total) * 100);
        //   console.log(`上传进度: ${percent}%`);
        // },
      },
      {
        file: file,
      }
    ).then((res: any) => {


      const data = res?.data;
      // 根据实际后端接口返回格式进行处理
      if (data && data.code === 0) {
        // 如果返回数据格式可能是 { code: 0, data: { url: '...' } }
        resolve({
          url: data.data,
          // name: file.name,
          // size: file.size,
          // type: file.type
        });
      } else {
        reject(new Error('上传成功但返回数据格式不正确'));
      }
    }).catch((err) => {
      reject(err);
    });
  });
}
