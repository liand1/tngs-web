/**
 * 组件库通用工具函数
 * 
 * 包含：
 * 1. 日期格式化工具（formatDateRange, formatDateToChartTime, getCurrentYearDateRange）
 * 2. 日期选择器工具（getDateFormat, getPlaceholder, getPickerType）
 * 3. 图表工具（handleExportImage）
 * 4. 组合式API（useChartDataLoader, useTimeRangeHandler, useResetHandler）
 */

import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { ref } from 'vue';
import type { Dayjs } from 'dayjs';
import type { TimeRangeType, DateRangeType } from './model';
import { downloadImage } from '../data';
//@ts-ignore
import html2canvas from "html2canvas";
/**
 * 格式化日期范围为字符串格式
 * @param dateRange 日期范围对象
 * @returns 格式化后的日期范围字符串数组
 */
export const formatDateRange = (dateRange: [Dayjs, Dayjs]): DateRangeType => {
  return [
    dateRange[0].format('YYYY-MM-DD'),
    dateRange[1].format('YYYY-MM-DD'),
  ];
};

/**
 * 获取当前年份的默认日期范围
 * @returns 当前年份的1月1日到12月31日日期范围
 */
export const getCurrentYearDateRange = (): [Dayjs, Dayjs] => {
  const currentYear = new Date().getFullYear();
  return [
    dayjs(`2025-01-01`),
    dayjs(),
  ];
};

// 导出图表为图片 - 将整个组件截图为一张图片
export const downloadImageCanvas = async (fileName = "样本统计图", element: HTMLElement, aLLHiddenElements?: HTMLElement[]) => {
  if (!element) {
    console.error("图表容器未初始化，无法导出");
    return false;
  }

  try {
    // 保存需要隐藏元素的原始状态
    const hiddenElements: { element: HTMLElement; originalDisplay: string }[] = [];

    // 临时隐藏指定元素
    if (aLLHiddenElements && aLLHiddenElements.length > 0) {
      aLLHiddenElements.forEach(el => {
        const htmlEl = el as HTMLElement;
        hiddenElements.push({
          element: htmlEl,
          originalDisplay: htmlEl.style.display
        });
        htmlEl.style.display = 'none';
      });
    }

    // 获取当前时间戳，用于文件名
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

    // 完整文件名
    const fullFileName = `${fileName}_${timestamp}.png`;

    // 使用html2canvas将DOM元素转换为Canvas
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2, // 提高截图质量
      useCORS: true, // 允许跨域图片
      logging: false,
      allowTaint: true,
    });

    // 恢复隐藏的元素
    hiddenElements.forEach(item => {
      item.element.style.display = item.originalDisplay;
    });

    // 转换Canvas为图片URL
    const url = canvas.toDataURL("image/png");

    // 创建一个下载链接
    const link = document.createElement("a");
    link.download = fullFileName;
    link.href = url;

    // 模拟点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error("导出图表图片出错:", error);
    return false;
  }
};

/**
 * 处理导出图表为图片
 * @param chartRef 图表组件引用
 * @param chartTitle 导出图片的标题
 * @param hideSelectors 需要隐藏的元素选择器数组
 */
export const handleExportImage = async (chartRef: any, chartTitle: string) => {
  if (!chartRef) {
    message.error('图表组件未初始化');
    return false;
  }

  try {
    message.loading({ content: '正在生成图片...', key: 'exportImage' });

    // 兼容旧版，使用downloadImage方法
    const result = await downloadImage(chartTitle, chartRef);
    if (result) {
      message.success({ content: '图片导出成功', key: 'exportImage' });
      return true;
    }

    message.error({ content: '图片导出失败', key: 'exportImage' });
    return false;
  } catch (error) {
    console.error('导出图片出错:', error);
    message.error({ content: '导出图片失败，请稍后重试', key: 'exportImage' });
    return false;
  }
};

/**
 * 将日期对象格式化为图表使用的时间字符串格式
 * @param date 日期对象
 * @param timeType 时间类型
 * @returns 格式化后的时间字符串
 */
export const formatDateToChartTime = (
  date: Dayjs,
  timeType: TimeRangeType
): string => {
  if (timeType === 'month') {
    return date.format('YYYY年MM月');
  } else if (timeType === 'day') {
    return date.format('YYYY年MM月DD日');
  } else if (timeType === 'year') {
    return date.format('YYYY年');
  } else {
    return date.format('YYYY-MM-DD');
  }
};

/**
 * 创建通用的图表数据加载状态和处理函数
 * @returns 返回包含加载状态和事件处理函数的对象
 */
export const useChartDataLoader = () => {
  // 加载状态
  const isLoading = ref(true);

  // 处理数据加载完成事件
  const handleDataLoaded = () => {
    isLoading.value = false;
  };

  // 处理数据加载中事件
  const handleDataLoading = () => {
    isLoading.value = true;
  };

  // 设置延时关闭加载状态（用于在图表数据更新后给渲染预留时间）
  const finishLoading = () => {
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  };

  return {
    isLoading,
    handleDataLoaded,
    handleDataLoading,
    finishLoading
  };
};

/**
 * 创建通用的时间范围处理函数
 * @param fetchDataCallback 获取数据的回调函数
 * @returns 返回包含时间范围状态和事件处理函数的对象
 */
export const useTimeRangeHandler = (fetchDataCallback: () => void) => {
  // 时间范围类型选择
  const timeRangeType = ref<TimeRangeType>("all");

  const defaultDateRange = ref<[Dayjs, Dayjs]>([dayjs(`2025-01-01`), dayjs()]);

  // 处理时间类型变化
  const handleTimeTypeChange = (value: TimeRangeType,range: [Dayjs, Dayjs]) => {
    defaultDateRange.value = range;
    timeRangeType.value = value;
    console.log("时间类型变更为:", value);

    // 加载数据
    fetchDataCallback();
  };

  // 处理日期范围变化
  const handleDateRangeChange = (dates: [Dayjs, Dayjs]) => {
    defaultDateRange.value = dates;
    console.log(
      "日期范围变更为:",
      dates.map((d) => d.format("YYYY-MM-DD"))
    );

    // 加载数据
    fetchDataCallback();
  };

  return {
    timeRangeType,
    defaultDateRange,
    handleTimeTypeChange,
    handleDateRangeChange
  };
};

/**
 * 创建通用的筛选重置处理函数
 * @param resetCallback 重置回调函数
 * @returns 返回重置处理函数
 */
export const useResetHandler = (resetCallback: () => void) => {
  // 处理筛选条件重置
  const handleReset = () => {
    resetCallback();
    console.log("所有筛选条件已重置");
  };

  return {
    handleReset
  };
};

/**
 * 根据时间类型获取日期选择器的类型
 * @param timeType 时间类型
 * @returns 对应的选择器类型
 */
export const getPickerType = (timeType: TimeRangeType) => {
  if (timeType === "year") {
    return "year";
  } else if (timeType === "month") {
    return "month";
  } else {
    return "date";
  }
};

/**
 * 根据时间类型获取日期格式
 * @param timeType 时间类型
 * @returns 对应的日期格式
 */
export const getDateFormat = (timeType: TimeRangeType) => {
  if (timeType === "year") {
    return "YYYY";
  } else if (timeType === "month") {
    return "YYYY-MM";
  } else {
    return "YYYY-MM-DD";
  }
};

/**
 * 根据时间类型获取日期选择器的占位提示文本
 * @param timeType 时间类型
 * @returns 对应的占位提示文本数组
 */
export const getPlaceholder = (timeType: TimeRangeType) => {
  if (timeType === "year") {
    return ["开始年份", "结束年份"];
  } else if (timeType === "month") {
    return ["开始月份", "结束月份"];
  } else {
    return ["开始日期", "结束日期"];
  }
};
