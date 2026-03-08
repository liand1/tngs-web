// 自定义任务详情数据
import { ref } from "vue";
import {
  AnalysisTaskDetailModel,
  timelineDataModel,
} from "../analysisprogressdrawer/model";
import { downloadReportModel } from "./components/downloadreport/model";
export const customTaskDetail: AnalysisTaskDetailModel = {
  taskName: "细菌基科组全分析流程-2025021853558674",
  sampleId: "CUSTOM_ID",
  strainId: "CUSTOM_STRAIN",
  genomeData: "CUSTOM_GENOME",
  sampleName: "自定义样本",
  createTime: "2025-02-26 12:00:00",
  startTime: "2025-02-26 12:00:00",
  endTime: "2025-02-26 12:00:00",
  submitter: "李四",
};

export const timelineData: timelineDataModel[] = [
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
