import { computed } from "vue";


// 模拟动态加载的时间线数据
export const timelineData = computed(() => {
  return [
    {
      title: "测序数据质量",
      status: "已完成",
      startTime: "2025/03/25 12:23:43",
      endTime: "2025/03/25 12:23:43",
    },
    {
      title: "基因组拼接",
      status: "已完成",
      startTime: "2025/03/25 12:23:43",
      endTime: "2025/03/25 12:23:43",
    },
    {
      title: "物种鉴定",
      status: "已完成",
      startTime: "2025/03/25 12:23:43",
      endTime: "2025/03/25 12:23:43",
    },
    {
      title: "耐药和毒力基因分析",
      status: "已完成",
      startTime: "2025/03/25 12:23:43",
      endTime: "2025/03/25 12:23:43",
    },
    {
      title: "分型分型",
      status: "已完成",
      startTime: "2025/03/25 12:23:43",
      endTime: "2025/03/25 12:23:43",
    },
    {
      title: "综合报告",
      status: "已完成",
      startTime: "2025/03/25 12:23:43",
      endTime: "2025/03/25 12:23:43",
    },
  ];
});