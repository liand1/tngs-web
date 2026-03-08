export interface GrowCardItem {
  icon: string
  title: string
  value: number
  total: number
  color: string
  action: string
}

export const growCardList: GrowCardItem[] = [
  {
    title: '访问数',
    icon: 'visit-count|svg',
    value: 2000,
    total: 120000,
    color: 'green',
    action: '月',
  },
  {
    title: '成交额',
    icon: 'total-sales|svg',
    value: 20000,
    total: 500000,
    color: 'blue',
    action: '月',
  },
  {
    title: '下载数',
    icon: 'download-count|svg',
    value: 8000,
    total: 120000,
    color: 'orange',
    action: '周',
  },
  {
    title: '成交数',
    icon: 'transaction|svg',
    value: 5000,
    total: 50000,
    color: 'purple',
    action: '年',
  },
]


// 工具提示格式化函数
export const toolTipFormatter = (params: any, isTotal: boolean = true) => {
  if (!params || !Array.isArray(params) || params.length === 0) {
    return '';
  }

  // 获取当前时间点
  const timeLabel = params[0].axisValue;

  // 计算总计值 - 简化访问方式
  let total = 0;
  params.forEach((param: any) => {
    // 直接访问value字段（对于dataset系列）
    if (typeof param.value[param.seriesIndex + 1] === 'number') {
      total += param.value[param.seriesIndex + 1];
    }
    // 兼容其他情况
    else if (typeof param.value === 'number') {
      total += param.value;
    }
  });

  // 构建提示文本
  let tooltipText = `<div style="margin-bottom: 5px;font-size:12px; color:#000000D9;margin-bottom:8px;font-weight:bold">${timeLabel}</div>`;

  // 添加每个系列的数据
  params.forEach((param: any) => {
    // 提取数值 - 简化访问
    let value;
    if (typeof param.value[param.seriesIndex + 1] === 'number') {
      value = param.value[param.seriesIndex + 1];
    } else if (typeof param.value === 'number') {
      value = param.value;
    } else {
      value = 0;
    }

    const formattedValue = value.toLocaleString();
    tooltipText += `<div style="display: flex; align-items: center; margin: 5px 0;font-size:12px; color:#000000D9;min-width: 150px;justify-content: space-between;">
      <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background-color: ${param.color}; margin-right: 5px;"></span>
      <span style="flex: auto;">${param.seriesName}: </span>
      <span>${formattedValue}</span>
    </div>`;
  });

  // 添加总计（加粗显示）
  if (isTotal) {
    tooltipText += `<div style="display: flex;font-size:12px;font-weight: bold; margin: 5px 0 5px 12px; color: #333;150px;justify-content: space-between;">
    <span>总计:</span> <span>${total.toLocaleString()}</span></div>`;
  }

  return tooltipText;
}



// 导出图片功能
export const downloadImage = (fileName = '耐药基因统计图', chart: echarts.ECharts) => {
  if (!chart) {
    console.error('图表实例不存在，无法导出');
    return null;
  }

  try {
    // 获取当前时间戳，用于文件名
    const now = new Date();
    const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;

    // 完整文件名
    const fullFileName = `${fileName}_${timestamp}.png`;

    // 获取图表的base64图片URL
    const url = chart.getDataURL({
      type: 'png',
      backgroundColor: '#ffffff',
      pixelRatio: 2, // 提高导出图片的分辨率
    });

    // 创建一个下载链接
    const link = document.createElement('a');
    link.download = fullFileName;
    link.href = url;

    // 模拟点击下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return url;
  } catch (error) {
    console.error('导出图表图片出错:', error);
    return null;
  }
};