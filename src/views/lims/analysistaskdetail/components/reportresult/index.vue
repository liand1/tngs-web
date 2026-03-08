<template>
  <div class="business-process">
    <h2 class="title">分析结果报告</h2>
    <div class="content_box">
      <a-row :wrap="false">
        <a-col flex="none" class="result-list">
          <!-- 分析结果目录 -->
          <AnalysisResultCatalog
            :reportList="reportList"
            @click-node="handleNodeClick"
            ref="arcRef"
          />
        </a-col>

        <a-col flex="auto">
          <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="1">
              <template #tab>
                <span class="custom-tab-bar">
                  <CopyOutlined style="margin: 0" />
                  样本/实验信息
                </span>
              </template>
              <div class="samplename">{{ findAnalysisReportDetails?.sample?.sourceCode }} - [{{ thatReport?.sampleCode }}]</div>
              <!-- 样本/实验信息 -->
              <ExperimentalInformation :findAnalysisReportDetails="findAnalysisReportDetails" />
            </a-tab-pane>
            <a-tab-pane key="2" force-render>
              <template #tab>
                <span class="custom-tab-bar">
                  <FileDoneOutlined style="margin: 0" />
                  检测结果
                </span>
              </template>
        
              <!-- 检测结果 -->
              <DetectionResult :findAnalysisReportDetails="findAnalysisReportDetails" :report="thatReport" />
            </a-tab-pane>
          </a-tabs>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { CopyOutlined, FileDoneOutlined } from "@ant-design/icons-vue";
import AnalysisResultCatalog from "../analysisresultcatalog/index.vue";
import ExperimentalInformation from "../experimentalinformation/index.vue";
import DetectionResult from "../detectionresult/index.vue";
import { ReportListModel } from "@/views/lims/analysistask/model";
import { initReport } from "@/views/lims/analysistaskdetail/index";
import { FindAnalysisReportDetailsModel } from "../../model";

const arcRef = ref<typeof AnalysisResultCatalog>();
const thatReport = ref<ReportListModel>(initReport);
const props = defineProps<{
  reportList: ReportListModel[];
  findAnalysisReportDetails?: FindAnalysisReportDetailsModel;
}>();

const emit = defineEmits<{
  (e: "setThatReport", report: ReportListModel): void;
}>();

const activeKey = ref("1");

const arcSelect = ref(1);

// 处理子组件触发的事件
const handleNodeClick = (id: number) => {
  if (props.reportList && props.reportList.length > 0) {
    arcSelect.value = id;
    // 找到对应ID的报告
    const reportIndex = props.reportList.findIndex((r) => r.id === id);
    if (reportIndex !== -1) {
      const report = props.reportList[reportIndex];
      thatReport.value = report;
      emit("setThatReport", report);
    }
  }
  // 在这里处理点击逻辑，例如更新状态、跳转页面等
};
</script>
<style lang="less" scoped>
.business-process {
  margin: 0 20px 16px;
  background-color: #fff;
  border-radius: 8px;

  & > .title {
    height: 56px;
    padding: 0 20px;
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    line-height: 56px;
    color: rgb(0 0 0 / 85%);
    border-bottom: 1px solid rgb(0 0 0 / 6%);
  }
}

.content_box {
  padding: 24px;

  .result-list {
    width: 300px;
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