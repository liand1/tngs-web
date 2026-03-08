import { QcReportListResultVO } from "@/api/lims/qcreport/model";

// 定义 TypeScript 数据类型
export interface TaskDetailItem {
  title: string;
  resultValue: string;
  standardValue: string;
  status: string;
  timestamp: string;
}

export interface TaskDetailData {
  title: string;
  list: QcReportListResultVO
}