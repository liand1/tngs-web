import { getAnalysisReportDetail } from "@/api/lims/analysistask";
import { ProcessStatusEnum, QcStatusEnum, SampleStatusEnum, CheckTypeEnum, SampleTypeEnum, SourceTypeEnum, SexEnum } from "@/enums/customEnum";
import { FindAnalysisReportDetailsModel } from "./model";
import { ReportListModel } from "../analysistask/model";


export const initReport:ReportListModel = {
  id: 0,
  taskId: 0,
  sampleId: 0,
  sampleCode: "",
  processStatus: ProcessStatusEnum.UNKNOWN,
  qcStatus: QcStatusEnum.UNKNOWN,
  startTime: 0,
  finisTime: 0,
  createTime: 0,
  checkType: CheckTypeEnum.OTHER,
  sampleStatus: SampleStatusEnum.UNANALYZED,
  putLrBatch: "",
  socDataFileSize: "",
  sampleRemarks: ""
}


export const initReportDetail: FindAnalysisReportDetailsModel = {
  id: 0,
  taskId: 0,
  sampleId: 0,
  sampleCode: "",
  processStatus: ProcessStatusEnum.UNKNOWN,
  qcStatus: QcStatusEnum.UNKNOWN,
  finisTime: 0,
  createTime: 0,
  sample: {
    batchCode: "",
    sourceCode: "",
    sampleCode: "",
    failSafeTag: "",
    sampleType: SampleTypeEnum.OTHER,
    checkType: CheckTypeEnum.OTHER,
    waterControl: "",
    i7Code: "",
    i5Code: "",
    sampleVolume: 0,
    samplingDate: 0,
    subHospital: "",
    subRoom: "",
    subDoctor: "",
    createType: SourceTypeEnum.UNKNOWN,
    sampleStatus: SampleStatusEnum.UNANALYZED,
    examineeName: "",
    clinicalResult: {
      diagnosis: "",
      result: "",
      wbc: 0,
      lym: 0,
      gr: 0,
      crp: 0,
      pct: 0,
      focusPathogen: "",
      nucleicAcidConc: 0,
      libraryConc: 0,
      getLrBatch: "",
      putLrBatch: "",
      onDeviceLr: "",
      getTechnician: "",
      putTechnician: "",
      remark: "",
    },
    examinee: {
      name: "",
      sex: SexEnum.UNKNOWN,
      age: 0,
      patientNumber: "",
      phone: "",
      bed: "",
    }
  },
  sampleFlowList: [],
  resultList: [],
  startTime: 0
}

//获得分析报告详情
export const getReportDetail = async (taskId: string, sampleId: string): Promise<FindAnalysisReportDetailsModel> => {
  const res = await getAnalysisReportDetail({ taskId, sampleId })
  return res
}
