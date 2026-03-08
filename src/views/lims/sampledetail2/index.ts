import { AnalysisReportAuditRespVO, AnalysisTaskAuditRespVO } from "@/api/lims/analysistask/model";
import { CheckStatusEnum, CheckTypeEnum, OneAuditStatusEnum, ProcessStatusEnum, QcStatusEnum, SampleStatusEnum, SampleTypeEnum, SexEnum, SourceTypeEnum, TaskStatusEnum, TwoAuditStatusEnum } from "@/enums/customEnum";

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
