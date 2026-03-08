<template>
  <div>
    <!-- 顶部的任务详情 -->
    <PageHeader :taskDetail="taskDetail" />

    <!-- 业务流程 -->
    <BusinessProcess :findAnalysisReportDetails="findAnalysisReportDetails" />

    <!-- 分析结果报告 -->
    <ReportResult
      ref="reportResultRef"
      :reportList="taskDetail.reportList"
      :findAnalysisReportDetails="findAnalysisReportDetails"
      @setThatReport="setThatReport"
    />

    <!-- 操作日志 -->
    <OperationLog ref="operationLogRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { getAnalysisTaskDetail } from "@/api/lims/analysistask"; // 假设接口路径
import PageHeader from "./components/pageheader/index.vue";
import BusinessProcess from "./components/businessprocess/index.vue";
import ReportResult from "./components/reportresult/index.vue";
import OperationLog from "./components/operationlog/index.vue";
import { GetAnalysisTaskModel, ReportListModel } from "../analysistask/model";
import {
  CheckTypeEnum,
  ExcavateDeeplyEnum,
  TaskStatusEnum,
  QcStatusEnum,
  CheckStatusEnum,
} from "@/enums/customEnum";
import { getReportDetail, initReport, initReportDetail } from ".";
import { FindAnalysisReportDetailsModel } from "./model";

const reportResultRef = ref();

const route = useRoute();

const taskId = route.params.id as string; // 从路由中获取任务ID

const loading = ref(true);

const operationLogRef = ref();

//当前选中的样本数据
const thatReport = ref<ReportListModel>(initReport);
// 正确初始化所有必填字段
const taskDetail = ref<GetAnalysisTaskModel>({
  id: 0,
  name: "",
  type: CheckTypeEnum.OTHER,
  socId: 0,
  threadCount: 0,
  taskCount: 0,
  seqLength: 0,
  excavateDeeply: ExcavateDeeplyEnum.NO,
  taskStatus: TaskStatusEnum.WAITING,
  qcStatus: QcStatusEnum.UNKNOWN,
  checkStatus: CheckStatusEnum.WAITING,
  startTime: 0,
  endTime: 0,
  schedule: "",
  creator: "",
  creatorName: "",
  createTime: "0",
  reportCount: 0,
  reportQcFailCount: 0,
  reportQcWarningCount: 0,
  reportFinishCount: 0,
  reportList: [],
});

const findAnalysisReportDetails =
  ref<FindAnalysisReportDetailsModel>(initReportDetail);

const timer = ref();
// 在组件挂载时发起接口请求
onMounted(async () => {
  await fetchTaskDetail();
  if (
    taskDetail.value.reportList &&
    taskDetail.value.reportList.length > 0 &&
    taskDetail.value.reportList[0].id
  ) {
    operationLogRef.value.setTaskId(taskDetail.value.reportList[0].id, taskId);
  }
  if(taskDetail.value.taskStatus == TaskStatusEnum.COMPLETED || taskDetail.value.taskStatus == TaskStatusEnum.WAITING || taskDetail.value.taskStatus == TaskStatusEnum.ANALYZING) {
    timer.value = setInterval(async () => {
      const res = await getAnalysisTaskDetail(parseInt(taskId));
      taskDetail.value = res;
    }, 2000);
  }
});

onUnmounted(() => {
  clearInterval(timer?.value);
})

// 获取任务详情的函数
const fetchTaskDetail = async () => {
  try {
    loading.value = true;
    const res = await getAnalysisTaskDetail(parseInt(taskId));
    taskDetail.value = res;

    // 如果有报告列表且不为空，设置第一个报告为当前选中报告
    if (res.reportList && res.reportList.length > 0) {
      await setThatReport(res.reportList[0]);
    }

    loading.value = false;
  } catch (error) {
    console.error("获取任务详情失败:", error);
    loading.value = false;
  }
};

//调整当前选中的样本数据
const setThatReport = async (report: ReportListModel) => {
  thatReport.value = report;
  console.log("选中的报告:", report);
  operationLogRef.value.setTaskId(report.id, taskId);
  try {
    // 获取选中报告的详细信息
    const reportDetail = await getReportDetail(
      report.taskId.toString(),
      report.sampleId.toString()
    );

    // 更新报告详情
    findAnalysisReportDetails.value = reportDetail;

    console.log("报告详情:", reportDetail);

    // 这里可以更新其他UI组件或处理报告详情数据
  } catch (error) {
    console.error("获取报告详情失败:", error);
  }
};
</script>

<style lang="less" scoped>
</style>