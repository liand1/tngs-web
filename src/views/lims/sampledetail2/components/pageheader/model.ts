export interface TaskDetail {
  taskName: string;
  createTime: string;
  taskType: string;
  testProject: string;
  creator: string;
  qcReport: string;
  parallelSampleCount: number;
  singleThreadCount: string;
  sequenceLength: number;
  analysisProgress: {
    successcount: number;
    allcount: number;
  };
  taskStatus: string;
}
