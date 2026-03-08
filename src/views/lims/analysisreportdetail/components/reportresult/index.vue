<template>
  <div class="business-process">
    <div class="titleDiv" v-if="showTitle">
      <h2 class="title">分析结果报告</h2>
      <div>
        <a-button @click="goFullScreen">全屏模式
          <template #icon>
            <FullscreenOutlined />
          </template>
        </a-button>
      </div>
    </div>
    <div class="content_box">
      <a-row :wrap="false">
        <a-col flex="none" class="result-list">
          <!-- 分析结果目录 -->
          <AnalysisResultCatalog
            :taskDetail="taskDetail"
            @click-node="handleNodeClick"
            ref="arcRef"
          />
        </a-col>

        <a-col flex="auto">
          <a-tabs :activeKey="activeKey" @change="onTabChange">
            <a-tab-pane key="1">
              <template #tab>
                <span class="custom-tab-bar">
                  <CopyOutlined style="margin: 0" />
                  样本/实验信息
                </span>
              </template>

              <!-- 样本/实验信息 -->
              <ExperimentalInformation
                :findAnalysisReportDetails="findAnalysisReportDetails"
                :report="thatReport"
                :isCurrentAudit="isCurrentAudit"
                :isCurrentAgain="isCurrentAgain"
                :highlightKeyInfo="highlightKeyInfo"
                @highlightChange="highlightChange"
                @nextSample="nextSample"
                @preSample="preSample"
                @updateSampleSuccess="updateSampleSuccess"
              />
            </a-tab-pane>
            <a-tab-pane key="2" force-render>
              <template #tab>
                <span class="custom-tab-bar">
                  <FileDoneOutlined style="margin: 0" />
                  检测结果
                </span>
              </template>
              <!-- 检测结果 -->
              <DetectionResult
                :findAnalysisReportDetails="findAnalysisReportDetails"
                :report="thatReport"
                @refreshTaskDetail="refreshTaskDetail"
                :isCurrentAudit="isCurrentAudit"
                :isCurrentAgain="isCurrentAgain"
                @nextSample="nextSample"
                @preSample="preSample"
              />
            </a-tab-pane>

            <a-tab-pane key="3" force-render v-if="thatReport.checkType == 2">
              <template #tab>
                <span class="custom-tab-bar">
                  <ReconciliationOutlined style="margin: 0" />
                  耐药检测结果
                </span>
              </template>
              <!-- 耐药检测结果 -->
              <DetectionNYResult
                :findAnalysisReportDetails="findAnalysisReportDetails"
                :report="thatReport"
                @refreshTaskDetail="refreshTaskDetail"
                :isCurrentAudit="isCurrentAudit"
                :isCurrentAgain="isCurrentAgain"
                @nextSample="nextSample"
                @preSample="preSample"
              />
            </a-tab-pane>

            <a-tab-pane key="4" force-render v-if="thatReport.checkType == 2">
              <template #tab>
                <span class="custom-tab-bar">
                  <ExceptionOutlined style="margin: 0" />
                  热点突变
                </span>
              </template>
              <!-- 热点突变 -->
              <HostgeneResult
                :findAnalysisReportDetails="findAnalysisReportDetails"
                :report="thatReport"
                @nextSample="nextSample"
                @preSample="preSample"
              />
            </a-tab-pane>
            
            <!-- && isAuditPass && (isOneAuditing || isTwoAuditing) -->
            <template #rightExtra>
              <a-button style="margin-right: 8px;" v-if="showPreview" @click="handlePreview">预览报告</a-button>
              <a-button style="margin-right: 8px;" @click="viewReportHistory">查看历史检出</a-button>
              <!-- 一审、二审的审核功能-->
              <a-button
                type="primary"
                v-if="isCheck && isCurrentAudit"
                @click="showAuditReportModal"
                >审核该报告</a-button
              >
              <!-- 重出报告的审核功能-->
              <a-button
                type="primary"
                v-if="isCheck && isCurrentAgain"
                @click="showAgainAuditReportModal"
                :loading="confirmLoading"
                >审核该报告</a-button
              >
              <a-button type="primary" ghost v-if="isCheck && isNotCurrentAgain">
                {{againReportUser}}重出报告中...
              </a-button>

              <a-button
                type="primary"
                v-if="isCheck && canAgainMarkReport"
                @click="againMarkReport"
                :loading="confirmLoading"
                >重出报告</a-button
              >
            </template>
          </a-tabs>
        </a-col>
      </a-row>
    </div>

    <AuditReportModal
      ref="armRef"
      @refreshTaskDetail="refreshTaskDetail"
      @uploadTaskeport="uploadTaskeport"
    />

    <AgainAuditReportModal
      ref="againArmRef"
      @refreshTaskDetail="refreshTaskDetail"
      @auditSuccess="auditReport2"
    />

    <ReportHistoryModal ref="hisRef"/>

  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { CopyOutlined, FileDoneOutlined, FullscreenOutlined, ReconciliationOutlined, ExceptionOutlined } from "@ant-design/icons-vue";
import AnalysisResultCatalog from "../analysisresultcatalog/index.vue";
import ExperimentalInformation from "../experimentalinformation/index.vue";
import DetectionResult from "../detectionresult/index.vue";
import DetectionNYResult from '../detectionNYresult/index.vue';
import HostgeneResult from '../hostgene/index.vue';
import AuditReportModal from "./components/auditreportmodal/AuditReportModal.vue";
import AgainAuditReportModal from "./components/auditreportmodal/AgainAuditReportModal.vue";
import ReportHistoryModal from "../reporthistory/ReportHistoryModal.vue";

import { FindAnalysisReportDetailsModel } from "@/views/lims/analysistaskdetail/model";
import { ProcessStatusEnum, SampleTypeEnum } from "@/enums/customEnum";
import {
  AnalysisReportAuditRespVO,
  AnalysisTaskAuditRespVO,
} from "@/api/lims/analysistask/model";
import { markReport } from "@/api/lims/analysisreport";
import { initReport } from "../..";
import { useUserStore } from "@/store/modules/user";
import { message } from "ant-design-vue";

const confirmLoading = ref(false);
const armRef = ref<typeof AuditReportModal>();
const againArmRef = ref<typeof AgainAuditReportModal>();
const arcRef = ref<typeof AnalysisResultCatalog>();
const hisRef = ref<typeof ReportHistoryModal>();
const thatReport = ref<AnalysisReportAuditRespVO>(initReport);
const props = defineProps<{
  // reportList: AnalysisReportAuditRespVO[];
  findAnalysisReportDetails?: FindAnalysisReportDetailsModel;
  taskDetail: AnalysisTaskAuditRespVO;
  showTitle: Boolean;
  highlightKeyInfo?: Boolean;
  activeKey:string;
}>();

const userStore = useUserStore();

const userId = computed(() => userStore.getUserInfo.user.id);

const emit = defineEmits<{
  (e: "setThatReport", report: AnalysisReportAuditRespVO): void;
  (e: "refreshTaskDetail"): void;
  (e: "uploadTaskeport"): void;
  (e: "goFullScreen", reportId: number): void;
  (event: "preview", url: string): void;
  (e: "auditAgainReport", templateId: number): void;
  (e: "updateSampleSuccess", value: any): void;
  (e: "highlightChange", value: Boolean): void;
  (e: "tabChange", value: string): void;
}>();

const arcSelect = ref(1);

const isCheck = computed(() => {
  // return props.activeKey === "2";
  return true;
});

//一审中
const isOneAuditing = computed(() => {
  return (
    thatReport.value.processStatus === ProcessStatusEnum.RESULT_GENERATED 
    // || thatReport.value.processStatus === ProcessStatusEnum.FIRST_REVIEW_REJECTED
  );
});

//二审中
const isTwoAuditing = computed(() => {
  return (
    thatReport.value.processStatus === ProcessStatusEnum.FIRST_REVIEW_PASSED ||
    thatReport.value.processStatus === ProcessStatusEnum.SECOND_REVIEW_REJECTED ||
    thatReport.value.processStatus === ProcessStatusEnum.FIRST_REVIEW_REJECTED
  );
});

//当前是否处于重出报告中的状态
const isAgainReport = computed(() => {
  return (
    thatReport.value.processStatus === ProcessStatusEnum.APPLY_AGAIN_REPORT_ISSUED
  );
});

//是否是水控
const isWaterControl = computed(() => {
  return thatReport.value.sampleType === SampleTypeEnum.WATER_CONTROL;
});

//是否是一审人
const isOneAuditor = computed(() => {
  return props.taskDetail.oneAuditorId === userId.value;
});

//是否是二审人
const isTwoAuditor = computed(() => {
  return props.taskDetail.twoAuditorId === userId.value;
});

//是否重出报告的人
const isAgainReportAuditor = computed(() => {
  return thatReport.value.againReportUid === userId.value;
});

//非重出报告的人
const isNotAgainReportAuditor = computed(() => {
  return thatReport.value.againReportUid !== userId.value;
});

//当前审核是否是本人
const isCurrentAudit = computed(() => {
  console.log('isOneAuditing.value', isOneAuditing.value);
  console.log('isOneAuditor.value', isOneAuditor.value);
  console.log('isTwoAuditing.value', isTwoAuditing.value);
  console.log('isTwoAuditor.value', isTwoAuditor.value);
  return !isWaterControl.value &&(
    (isOneAuditing.value && isOneAuditor.value) ||
    (isTwoAuditing.value && isTwoAuditor.value)
  );
});

//当前是否重出报告的人
const isCurrentAgain = computed(() => {
  return !isWaterControl.value && (isAgainReport.value && isAgainReportAuditor.value)
});

//当前非重出报告的人 但是是一审或者二审中的一个人
const isNotCurrentAgain = computed(() => {
  return !isWaterControl.value && (isAgainReport.value && isNotAgainReportAuditor.value)
});

//重出报告人
const againReportUser = computed(() => {
  return thatReport.value.againReportUser;
});

//是否可以预览报告
const showPreview = computed(() => {
  return thatReport.value.processStatus == ProcessStatusEnum.REPORT_ISSUED || thatReport.value.processStatus == ProcessStatusEnum.AGAIN_REPORT_ISSUED;
});

//是否可以重出报告，条件：必须已出具报告（成功或者失败）或已重出报告（成功或失败）且 是一审或二审人员
const canAgainMarkReport = computed(() => {
  let status = [ProcessStatusEnum.REPORT_ISSUED, ProcessStatusEnum.REPORT_ISSUED_FAILED, ProcessStatusEnum.AGAIN_REPORT_ISSUED, ProcessStatusEnum.AGAIN_REPORT_ISSUED_FAILED];
  if(status.indexOf(thatReport.value.processStatus) > -1) {
    if(isOneAuditor.value || isTwoAuditor.value) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});

watch(props.taskDetail, () => {
  const report = props.taskDetail.reportList?.filter(
    (r) => r.id === arcSelect.value
  );
  if (report && report.length > 0) {
    thatReport.value = report[0];
  }
});

const uploadTaskeport = () => {
  emit("uploadTaskeport");
};

const auditReport2 = () => {
  emit("refreshTaskDetail");
  emit("auditAgainReport", 0);
}

const goFullScreen = () => {
  emit("goFullScreen", arcSelect.value);
}

//是否是审核人
// const isAuditPass = computed(() => {
//   return (
//     props.taskDetail.oneAuditorId === userId.value ||
//     props.taskDetail.twoAuditorId === userId.value
//   );
// });

const setTaskDetil = (taskDetail: AnalysisTaskAuditRespVO) => {
  console.log("setTaskDetil", taskDetail);
  const report = taskDetail.reportList?.filter((r) => r.id === arcSelect.value);
  if (report && report.length > 0) {
    thatReport.value = report[0];
  }
};

// 处理子组件触发的事件
const handleNodeClick = (id: number) => {
  if (props.taskDetail.reportList && props.taskDetail.reportList.length > 0) {
    arcSelect.value = id;

    // 找到对应ID的报告
    const reportIndex = props.taskDetail.reportList.findIndex(
      (r) => r.id === id
    );
    if (reportIndex !== -1) {
      const report = props.taskDetail.reportList.filter((r) => r.id === id);
      if (report.length > 0) {
        thatReport.value = report[0];
        emit("setThatReport", report[0]);
      }
    }
  }
  // 在这里处理点击逻辑，例如更新状态、跳转页面等
};
//showModal

//上一个样本
const preSample = () => {
  if (props.taskDetail.reportList && props.taskDetail.reportList.length > 0) {
    let idx = props.taskDetail.reportList.findIndex(item => item.id === arcSelect.value);
    idx = idx - 1;
    if(idx < 0) {
      idx = props.taskDetail.reportList.length - 1;
    }
    let selectedReportId = props.taskDetail.reportList[idx].id;
    arcRef?.value?.setSelectIndex(selectedReportId);
    handleNodeClick(selectedReportId);
  }
}

//下一个样本
const nextSample = () => {
  if (props.taskDetail.reportList && props.taskDetail.reportList.length > 0) {
    let idx = props.taskDetail.reportList.findIndex(item => item.id === arcSelect.value);
    idx = idx + 1;
    if(idx >= props.taskDetail.reportList.length) {
      idx = 0;
    }
    let selectedReportId = props.taskDetail.reportList[idx].id;
    arcRef?.value?.setSelectIndex(selectedReportId);
    handleNodeClick(selectedReportId);
  }
}

//样本修改成功
const updateSampleSuccess = (sampleData) => {
  emit("updateSampleSuccess", sampleData);
}

const showAuditReportModal = () => {
  if(!props.findAnalysisReportDetails?.reportCheckSign) {
    message.error("该报告对应的模板未配置好检测者、一审、二审签名,请先完成模板配置");
    return;
  }
  armRef?.value?.showModal(thatReport.value, props.taskDetail, props.findAnalysisReportDetails);
};

const showAgainAuditReportModal = () => {
  againArmRef?.value?.showModal(thatReport.value, props.taskDetail, props.findAnalysisReportDetails);
}

// 处理预览事件
const handlePreview = () => {
  // 触发父组件的预览事件
  emit("preview", thatReport.value.reportFileUrl + "?type=2" || "");
};

const againMarkReport = async () => {
  confirmLoading.value = true;
  try {
    await markReport(thatReport.value.id);
    message.success("成功标记重出报告,现在您可以编辑报告后审核报告完成重出");
  } catch (e) {
    // alert(JSON.stringify(e));
    // message.error("下载分析结果表失败");
  } finally {
    confirmLoading.value = false;
    emit("refreshTaskDetail");
  }
}

//历史检出
const viewReportHistory = () => {
  const params = {examineeName: props.findAnalysisReportDetails?.sample.examinee.name,
    phone: props.findAnalysisReportDetails?.sample.examinee.phone,
    sampleId: props.findAnalysisReportDetails?.sample.id,
    reportId: props.findAnalysisReportDetails?.id
  }
  hisRef?.value?.showModal(params);
}

const refreshTaskDetail = () => {
  emit("refreshTaskDetail");
};

const setSelectIndex = (reportId: number) => {
  arcRef?.value?.setSelectIndex(reportId);
  arcSelect.value = reportId;
}

const highlightChange = (value:Boolean) => {
  emit("highlightChange", value);
}

const onTabChange = (value:string) => {
  emit("tabChange", value);
}

defineExpose({ setTaskDetil, setSelectIndex });

// defineExpose({
//   setActiveKey,
// });
</script>
<style lang="less" scoped>
.business-process {
  margin: 0 20px 16px;
  background-color: #fff;
  border-radius: 8px;

  & > .titleDiv {
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 20px;
    margin: 0;
    line-height: 56px;
    border-bottom: 1px solid rgb(0 0 0 / 6%);
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    color: rgb(0 0 0 / 85%);
  }
}

.content_box {
  padding: 6px 24px;

  .result-list {
    width: 340px;
    margin-right: 16px;
  }

  .custom-tab-bar {
    font-size: 16px;
    font-weight: bold;
  }

  :deep(.ant-tabs-nav) {
    margin: 0;
  }

  .samplename {
    font-size: 16px;
    font-weight: bold;
    line-height: 64px;
  }
}
</style>