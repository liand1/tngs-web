import { TimeRangeType } from '@/views/dashboard/analysis/components/model';
import { Dayjs } from 'dayjs';


/**
 * 将科学计数法（如 1e3）转换为常用的指数表达式（如 1×10^3）
 * @param {string} input 输入的数字或字符串
 * @returns {string} 转换后的字符串
 * // 1e3 > 1×10^3 
 */
export function scientificToPower(input: string): string {
  // 先将输入转为字符串
  const str = String(input);
  // 匹配科学计数法
  // 支持正负数、小数、正负指数
  const reg = /^([+-]?\d*\.?\d+)[eE]([+-]?\d+)$/;
  const match = str.match(reg);
  if (match) {
    const base = match[1];
    const exponent = match[2].replace(/^\+/, ''); // 去掉正号
    return `${base}×10^${exponent}`;
  }
  // 如果不是科学计数法，直接返回原字符串
  return str;
}



/**
 * 下载报告 - 支持单个文件下载或多个文件打包下载
 * @param url 单个URL字符串或URL数组或{url,fileName}对象数组
 * @param fileName 文件名(如果是数组将成为zip包名)
 * @returns Promise
 */
export const downloadReport = (
  url: string | Array<string | { url: string, fileName: string }>,
  fileName: string
) => {
  return new Promise((resolve, reject) => {
    try {
      // 处理单个URL的情况
      if (typeof url === 'string') {
        // 使用 fetch API 获取文件的二进制数据
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              throw new Error("网络响应异常");
            }
            return response.blob();
          })
          .then((blob) => {
            // 创建 blob URL
            const blobUrl = URL.createObjectURL(blob);

            // 创建一个临时链接元素
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            link.setAttribute("download", fileName);

            // 设置样式为不可见
            link.style.display = "none";

            // 添加到文档中并点击
            document.body.appendChild(link);
            link.click();

            // 清理
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(blobUrl); // 释放 blob URL
              resolve(true);
            }, 100);
          })
          .catch((error) => {
            console.error("下载文件时出错:", error);
            // 如果通过 fetch 下载失败，回退到原始方法
            fallbackDownload(url, fileName);
            resolve(true);
          });
      }
      // 处理URL数组或对象数组的情况
      else if (Array.isArray(url) && url.length > 0) {
        // 方案1: 使用动态导入JSZip (推荐先安装: npm install jszip)
        import('jszip').then(({ default: JSZip }) => {
          const zip = new JSZip();

          // 创建Promise数组，每个Promise负责下载一个文件
          const promises = url.map((item, index) => {
            // 处理不同的项类型
            const fileUrl = typeof item === 'string' ? item : item.url;
            const zipFileName = typeof item === 'string'
              ? `${index + 1}_${fileUrl.split('/').pop() || `file_${index + 1}`}`
              : item.fileName;

            return fetch(fileUrl)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`下载第${index + 1}个文件失败`);
                }
                return response.blob();
              })
              .then(blob => {
                // 添加到zip，使用自定义文件名或生成的文件名
                zip.file(zipFileName, blob);
                return true;
              })
              .catch(error => {
                console.error(`处理文件 ${fileUrl} 时出错:`, error);
                return false;
              });
          });

          // 等待所有文件处理完成
          Promise.all(promises).then(() => {
            // 生成zip文件
            zip.generateAsync({ type: 'blob' }).then(content => {
              // 下载zip文件
              const blobUrl = URL.createObjectURL(content);
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = fileName.endsWith('.zip') ? fileName : `${fileName}.zip`;
              link.style.display = 'none';
              document.body.appendChild(link);
              link.click();

              // 清理
              setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
                resolve(true);
              }, 100);
            });
          });
        }).catch(error => {
          console.error("JSZip加载失败，请安装JSZip库: npm install jszip", error);

          // 回退方案：逐个下载文件（不打包）
          console.warn("回退到逐个下载文件模式");
          url.forEach((item, index) => {
            const fileUrl = typeof item === 'string' ? item : item.url;
            const downloadFileName = typeof item === 'string'
              ? `${fileName}_${index + 1}`
              : item.fileName;

            // 添加延迟，避免浏览器同时下载太多文件
            setTimeout(() => {
              fallbackDownload(fileUrl, downloadFileName);
            }, index * 500);
          });

          resolve(true);
        });
      } else {
        console.error("无效的URL参数");
        reject(new Error("无效的URL参数"));
      }
    } catch (error) {
      console.error("下载时发生异常:", error);
      reject(error);
    }
  });
};

// 备用下载方法
export const fallbackDownload = (url: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


/**
 * 将日期对象格式化为字符串，格式为 "YYYY-MM-DD HH:mm:ss"
 * @param date 日期对象
 * @returns 格式化后的字符串
 */
export function formatTimeToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 将日期字符串转换为时间
 * @param time 日期字符串
 * @returns 时间 
 * 把开始时间的时分秒转化为00:00:00 和结束时间的时分秒转化为23:59:59 
 */
export function formatTimeToTimes(time: (string | number | Date)[]) {
  if (time && time.length === 2) {
    // 创建时间的开始和结束日期
    let [startDate, endDate] = time;

    if (typeof startDate === 'string' && (startDate.length === 10 || startDate.length === 13) && !isNaN(Number(startDate))) {
      startDate = Number(startDate)
    }
    if (typeof endDate === 'string' && (endDate.length === 10 || endDate.length === 13) && !isNaN(Number(endDate))) {
      endDate = Number(endDate)
    }

    // 设置开始时间为当天的00:00:00
    const startTime = new Date(startDate);
    startTime.setHours(0, 0, 0, 0);

    // 设置结束时间为当天的23:59:59
    const endTime = new Date(endDate);
    endTime.setHours(23, 59, 59, 999);

    return [formatTimeToString(startTime), formatTimeToString(endTime)]
  }
  return time
}



export function getColors() {
  return ["#F24660", "#FABD14", "#71C14A", "#207AC4", "#9E6BC6", "#EF6B19", "#309667", "#62CAF3"]
}



/**
 * 根据时间类型处理日期范围
 * @param timeType 时间类型 ('all' | 'year' | 'month' | 'day')
 * @param dateRange 原始日期范围
 * @returns 处理后的时间戳范围 { startTime: number, endTime: number }
 */
export function processDateRangeByTimeType(
  timeType: TimeRangeType = 'all',
  dateRange?: [Dayjs, Dayjs]
): { startTime: number; endTime: number } {
  let startTime = 0;
  let endTime = 0;

  if (dateRange && dateRange.length === 2) {
    const [startDate, endDate] = dateRange;

    switch (timeType) {
      case 'year':
      case 'all':
        // 年：开始时间为年初1月1日0点0分0秒，结束时间为年尾12月31日23点59分59秒
        startTime = startDate.startOf('year').valueOf();
        endTime = endDate.endOf('year').valueOf();
        break;

      case 'month':
        // 月：开始时间为月初1日0点0分0秒，结束时间为月尾最后一天23点59分59秒
        startTime = startDate.startOf('month').valueOf();
        endTime = endDate.endOf('month').valueOf();
        break;

      case 'day':
        // 日：开始时间为当日0点0分0秒，结束时间为当日23点59分59秒
        startTime = startDate.startOf('day').valueOf();
        endTime = endDate.endOf('day').valueOf();
        break;
      default:
        // 全部或默认：使用原始的日期范围
        startTime = startDate.valueOf();
        endTime = endDate.valueOf();
        break;
    }
  }

  return { startTime, endTime };
}


/**
 * 根据路径获取对象的值
 * @param obj 对象
 * @param path 路径
 * @returns 值
 */
export function getValueByPath(obj: Object, path: string) {
  return path.split('.').reduce((acc, key) => {
    if (acc && key in acc) {
      return acc[key];
    }
    return undefined;
  }, obj);
}

//下载URL
export function downLoadUrl(url: string, fileName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
  }, 100);

}
