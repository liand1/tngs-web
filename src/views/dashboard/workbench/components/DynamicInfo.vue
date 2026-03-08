<template>
  <div class="dynamic-info">
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="报告审核">
        <a-spin :spinning="loading">
          <a-row
            v-for="(item, index) in reportList"
            :key="index"
            class="report-row"
            type="flex"
          >
            <a-col flex="auto" class="report-col info-col">
              <div class="report-title">
                {{ item.taskReportName }}
              </div>
              <div class="report-info">
                <span>创建人员: {{ item.creatorName }}</span>
                <span v-if="item.oneAuditor"
                  >一审人员: {{ item.oneAuditor }}</span
                >
              </div>
            </a-col>
            <a-col class="report-col status-col">
              <a-tag :color="getAnalysisStatusColor(item.taskStatus)">
                {{ getTaskStatusText(item, item.taskStatus) }}
              </a-tag>
              <span class="report-time">{{
                useRender.renderDate(item.updateTime)
              }}</span>
            </a-col>
            <a-col class="report-col btn-col">
              <a-button danger size="small" @click="handleAudit(item)">
                去审核
              </a-button>
            </a-col>
          </a-row>
          <a-empty v-if="reportList.length === 0" description="暂无数据" />
        </a-spin>
      </a-tab-pane>
      <a-tab-pane key="2" tab="我创建的分析">
        <a-spin :spinning="loading">
          <a-row
            v-for="(item, index) in myAnalysisList"
            :key="index"
            class="report-row"
            type="flex"
          >
            <a-col flex="auto" class="report-col info-col">
              <div class="report-title">
                {{ item.name }}
              </div>
              <div class="report-info">
                <span>创建人员: {{ item.creatorName }}</span>
              </div>
            </a-col>
            <a-col class="report-col status-col">
              <a-tag
                :color="
                  getAnalysisStatusColor(item.taskStatus, item.checkStatus)
                "
              >
                {{
                  getMyTaskStatusText(item, item.taskStatus, item.checkStatus)
                }}
              </a-tag>
              <span class="report-time">{{
                useRender.renderDate(item.updateTime)
              }}</span>
            </a-col>
            <a-col class="report-col btn-col">
              <a-button danger size="small" @click="handleView(item)">
                去查看
              </a-button>
            </a-col>
          </a-row>
          <a-empty v-if="myAnalysisList.length === 0" description="暂无数据" />
        </a-spin>
      </a-tab-pane>

      <template #rightExtra>
        <a-button
          type="link"
          style="color: rgb(153 153 153 / 100%)"
          @click="handleViewMore"
          >查看全部</a-button
        >
      </template>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {
  AnalysisTaskTypeEnumMap,
  CheckStatusEnum,
  TaskStatusEnum,
  TaskStatusEnumMap,
} from "@/enums/customEnum";
import { useRender } from "@/components/Table/src/hooks/useRender";
import {
  findMyTaskListByLimit,
  findWaitAuditTaskListByLimit,
} from "@/api/lims/console";
import {
  AnalysisTaskConsoleRespVO,
  MyAnalysisTaskConsoleRespVO,
} from "@/api/lims/console/model";
import { useGo } from "@/hooks/web/usePage";

// 标签页活动key
const activeKey = ref("1");

// // 报告数据接口
// interface ReportItem {
//   id: string;
//   title: string;
//   creator: string;
//   reviewer?: string;
//   status: ProcessStatusEnum;
//   time: string;
// }

// // 分析数据接口
// interface AnalysisItem {
//   id: string;
//   title: string;
//   creator: string;
//   status: TaskStatusEnum;
//   time: string;
// }

// 加载状态
const loading = ref(true);

// 审核报告列表
const reportList = ref<AnalysisTaskConsoleRespVO[]>([]);

// 我的分析列表
const myAnalysisList = ref<MyAnalysisTaskConsoleRespVO[]>([]);

const go = useGo();

// 0：等待分析；1：分析中；2：已完成分析；3：分析失败；）

// // 获取流程状态文本
// function getProcessStatusText(status: ProcessStatusEnum): string {
//   return ProcessStatusEnumMap[status] || "未知状态";
// }

// 获取任务状态文本
function getTaskStatusText(
  item: AnalysisTaskConsoleRespVO | MyAnalysisTaskConsoleRespVO,
  status: TaskStatusEnum
): string {
  if (item.oneAuditorId !== 0) {
    return "审核中";
  }

  return TaskStatusEnumMap[status] || "未知状态";
}

//我的分析任务状态文本
function getMyTaskStatusText(
  item: AnalysisTaskConsoleRespVO | MyAnalysisTaskConsoleRespVO,
  status: TaskStatusEnum,
  checkStatus: CheckStatusEnum
): string {
  if (checkStatus === CheckStatusEnum.CHECKING) {
    return "审核中";
  }

  if (checkStatus === CheckStatusEnum.PASSED) {
    return "已通过";
  }

  if (checkStatus === CheckStatusEnum.REJECTED) {
    return "未通过";
  }

  if (item.oneAuditorId !== 0) {
    return "审核中";
  }

  return TaskStatusEnumMap[status] || "未知状态";
}

// // 获取报告状态颜色
// function getReportStatusColor(status: ProcessStatusEnum): string {
//   // 审核未通过状态使用红色
//   if (
//     status === ProcessStatusEnum.FIRST_REVIEW_REJECTED ||
//     status === ProcessStatusEnum.SECOND_REVIEW_REJECTED
//   ) {
//     return "red";
//   }

//   // 其他报告状态使用绿色
//   return "green";
// }

// 获取分析任务状态颜色
function getAnalysisStatusColor(
  status: TaskStatusEnum,
  checkStatus?: CheckStatusEnum
): string {
  if (checkStatus) {
    if (
      checkStatus === CheckStatusEnum.PASSED ||
      checkStatus === CheckStatusEnum.CHECKING
    ) {
      return "green";
    }
    if (checkStatus === CheckStatusEnum.REJECTED) {
      return "red";
    }
  }

  // 分析失败状态使用红色
  if (status === TaskStatusEnum.FAILED) {
    return "red";
  }

  // 分析中状态使用蓝色
  if (status === TaskStatusEnum.ANALYZING) {
    return "blue";
  }

  // 等待分析状态使用橙色
  if (status === TaskStatusEnum.WAITING) {
    return "orange";
  }

  // 其他状态使用绿色
  return "green";
}

// 审核操作
function handleAudit(item: AnalysisTaskConsoleRespVO) {
  go(`/analysis-report/detail/${item.taskId}`);
}

// 查看操作
function handleView(item: MyAnalysisTaskConsoleRespVO) {
  go(`/analysis-report/detail/${item.id}`);
}

// 查看更多
function handleViewMore() {
  go("/analysis-report");
}

// 模拟从API加载数据
async function loadData() {
  loading.value = true;

  //待审核分析任务列表
  const resAuditTask = await findWaitAuditTaskListByLimit(5);

  //创建的任务列表
  const resMyTaskList = await findMyTaskListByLimit(5);

  reportList.value = resAuditTask;

  myAnalysisList.value = resMyTaskList;

  loading.value = false;
}

// 组件挂载后加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped lang="less">
.dynamic-info {
  padding: 8px 24px;
  background-color: #fff;
  border-radius: 8px;

  :deep(.ant-tabs-tab-btn) {
    font-size: 16px !important;
  }

  :deep(.ant-tabs-nav) {
    &::before {
      border-bottom: none;
    }
  }
}

.tabs-extra-demo-button {
  margin-right: 16px;
}

.ant-row-rtl .tabs-extra-demo-button {
  margin-right: 0;
  margin-left: 16px;
}

.report-row {
  padding: 12px 12px 12px 4px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;

  .report-col {
    padding: 0 12px;
  }

  .info-col {
    overflow: hidden;
  }

  .status-col {
    display: flex;
    align-items: center;

    .report-time {
      margin-left: 12px;
      font-size: 12px;
      color: rgb(0 0 0 / 45%);
      white-space: nowrap;
    }
  }

  .btn-col {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .report-title {
    margin-bottom: 8px;
    overflow: hidden;
    font-size: 14px;
    font-weight: 500;
    color: rgb(0 0 0 / 85%);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .report-info {
    font-size: 12px;
    color: rgb(0 0 0 / 45%);

    span {
      margin-right: 16px;
      white-space: nowrap;
    }
  }
}
</style>