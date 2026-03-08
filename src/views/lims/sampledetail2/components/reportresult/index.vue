<template>
  <div class="business-process">
    <div class="titleDiv" v-if="showTitle">
      <h2 class="title">批次样本详情</h2>
    </div>
    <div class="content_box">
      <a-row :wrap="false">
        <a-col flex="none" class="result-list">
          <!-- 分析结果目录 -->
          <AnalysisResultCatalog
            :taskDetail="taskDetail"
            @click-node="handleNodeClick"
            @delete-sample-success="deleteSampleSuccess"
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
                :highlightKeyInfo="highlightKeyInfo"
                @highlightChange="highlightChange"
                @nextSample="nextSample"
                @preSample="preSample"
                @updateSampleSuccess="updateSampleSuccess"
              />
            </a-tab-pane>
            
            <!-- && isAuditPass && (isOneAuditing || isTwoAuditing) -->
            <template #rightExtra>
              <a-button style="margin-right: 8px;" @click="viewReportHistory">查看历史检出</a-button>
            </template>
          </a-tabs>
        </a-col>
      </a-row>
    </div>

    <ReportHistoryModal ref="hisRef"/>

  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { CopyOutlined, FileDoneOutlined, FullscreenOutlined, ReconciliationOutlined, ExceptionOutlined } from "@ant-design/icons-vue";
import AnalysisResultCatalog from "../analysisresultcatalog/index.vue";
import ExperimentalInformation from "../experimentalinformation/index.vue";
import ReportHistoryModal from "../../../analysisreportdetail/components/reporthistory/ReportHistoryModal.vue";

import { ProcessStatusEnum, SampleTypeEnum } from "@/enums/customEnum";
import { useUserStore } from "@/store/modules/user";

const confirmLoading = ref(false);
const arcRef = ref<typeof AnalysisResultCatalog>();
const hisRef = ref<typeof ReportHistoryModal>();
const thatReport = ref<any>({});
const props = defineProps<{
  findAnalysisReportDetails?: any;
  taskDetail: any;
  showTitle: Boolean;
  highlightKeyInfo?: Boolean;
  activeKey:string;
}>();

const userStore = useUserStore();

const userId = computed(() => userStore.getUserInfo.user.id);

const emit = defineEmits<{
  (e: "setThatReport", report: any): void;
  (e: "refreshTaskDetail"): void;
  (e: "updateSampleSuccess", value: any): void;
  (e: "highlightChange", value: Boolean): void;
  (e: "tabChange", value: string): void;
}>();

const arcSelect = ref(1);

watch(props.taskDetail, () => {
  const report = props.taskDetail.sampleDOS?.filter(
    (r) => r.id === arcSelect.value
  );
  if (report && report.length > 0) {
    thatReport.value = report[0];
  }
});


const setTaskDetil = (taskDetail) => {
  const report = taskDetail.sampleDOS?.filter((r) => r.id === arcSelect.value);
  if (report && report.length > 0) {
    thatReport.value = report[0];
  }
};

// 处理子组件触发的事件
const handleNodeClick = (id: number) => {
  if (props.taskDetail.sampleDOS && props.taskDetail.sampleDOS.length > 0) {
    arcSelect.value = id;

    // 找到对应ID的报告
    const reportIndex = props.taskDetail.sampleDOS.findIndex(
      (r) => r.id === id
    );
    if (reportIndex !== -1) {
      const report = props.taskDetail.sampleDOS.filter((r) => r.id === id);
      if (report.length > 0) {
        thatReport.value = report[0];
        emit("setThatReport", report[0]);
      }
    }
  }
  // 在这里处理点击逻辑，例如更新状态、跳转页面等
};
//showModal

const deleteSampleSuccess = (id:number) => {
  if (props.taskDetail.sampleDOS && props.taskDetail.sampleDOS.length > 1) {
    nextSample();
  }
  refreshTaskDetail();
}

//上一个样本
const preSample = () => {
  if (props.taskDetail.sampleDOS && props.taskDetail.sampleDOS.length > 0) {
    let idx = props.taskDetail.sampleDOS.findIndex(item => item.id === arcSelect.value);
    idx = idx - 1;
    if(idx < 0) {
      idx = props.taskDetail.sampleDOS.length - 1;
    }
    let selectedReportId = props.taskDetail.sampleDOS[idx].id;
    arcRef?.value?.setSelectIndex(selectedReportId);
    handleNodeClick(selectedReportId);
  }
}

//下一个样本
const nextSample = () => {
  if (props.taskDetail.sampleDOS && props.taskDetail.sampleDOS.length > 0) {
    let idx = props.taskDetail.sampleDOS.findIndex(item => item.id === arcSelect.value);
    idx = idx + 1;
    if(idx >= props.taskDetail.sampleDOS.length) {
      idx = 0;
    }
    let selectedReportId = props.taskDetail.sampleDOS[idx].id;
    arcRef?.value?.setSelectIndex(selectedReportId);
    handleNodeClick(selectedReportId);
  }
}

//样本修改成功
const updateSampleSuccess = (sampleData) => {
  emit("updateSampleSuccess", sampleData);
}

//历史检出
const viewReportHistory = () => {
  const params = {examineeName: props.findAnalysisReportDetails?.examinee.name,
    phone: props.findAnalysisReportDetails?.examinee.phone,
    sampleId: props.findAnalysisReportDetails?.id,
    reportId: 0
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
    width: 280px;
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