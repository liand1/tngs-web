import { AnalysisReportAuditRespVO, AnalysisTaskAuditRespVO } from "@/api/lims/analysistask/model";
import { CheckStatusEnum, CheckTypeEnum, OneAuditStatusEnum, ProcessStatusEnum, QcStatusEnum, SampleStatusEnum, SampleTypeEnum, SexEnum, SourceTypeEnum, TaskStatusEnum, TwoAuditStatusEnum } from "@/enums/customEnum";
import { ref } from "vue";
import { FindAnalysisReportDetailsModel } from "../analysistaskdetail/model";

export const taskDetail = ref<AnalysisTaskAuditRespVO>({
  id: 0,
  type: 0,
  socId: 0,
  threadCount: 0,
  taskCount: 0,
  seqLength: 0,
  taskStatus: TaskStatusEnum.CREATED,
  qcStatus: QcStatusEnum.UNKNOWN,
  checkStatus: CheckStatusEnum.WAITING,
  startTime: 0,
  endTime: 0,
  createTime: "",
  reportCount: 0,
  reportQcFailCount: 0,
  reportQcWarningCount: 0,
  reportFinishCount: 0
});

export const initReportDetail: FindAnalysisReportDetailsModel = {
  id: 0,
  taskId: 0,
  sampleId: 0,
  sampleCode: "",
  processStatus: ProcessStatusEnum.UNKNOWN,
  qcStatus: QcStatusEnum.UNKNOWN,
  startTime: 0,
  finisTime: 0,
  createTime: 0,
  sample: {
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
      remark: ""
    },
    examinee: {
      name: "",
      sex: SexEnum.MAN,
      age: 0,
      patientNumber: "",
      phone: "",
      bed: ""
    }
  },
  sampleFlowList: [],
  resultList: []
};

export const initReport: AnalysisReportAuditRespVO = {
  id: 0,
  taskId: 0,
  sampleId: 0,
  sampleCode: "",
  processStatus: ProcessStatusEnum.UNKNOWN,
  qcStatus: QcStatusEnum.UNKNOWN,
  createTime: "",
  checkType: CheckTypeEnum.OTHER,
  sampleStatus: SampleStatusEnum.UNANALYZED,
  oneAuditStatus: OneAuditStatusEnum.NO_AUDIT,
  twoAuditStatus: TwoAuditStatusEnum.NO_AUDIT
};
