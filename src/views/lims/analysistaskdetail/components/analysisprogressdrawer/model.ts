
// 定义 TypeScript 数据模型
export interface AnalysisTaskDetailModel {
  taskName: string;
  sampleId: string;
  strainId: string;
  genomeData: string;
  sampleName: string;
  createTime: string;
  startTime: string;
  endTime: string;
  submitter: string;a
}



export interface timelineDataModel {
  title: string;
  status: string;
  startTime: string;
  endTime: string;
}