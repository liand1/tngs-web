<!-- WAITING = 0, // 待审核
CHECKING = 1, // 审核中
PASSED = 2, // 已通过
REJECTED = 3, // 未通过 -->
<template>
  <div>
    <div class="components-page-header-demo-responsive">
      <a-page-header title="报告详情" :sub-title="taskDetail.name">
        <template #extra>
          <a-button key="3" @click="uploadAnalysisResultTable">
            <DownloadOutlined />
            下载分析结果表
          </a-button>
          <DownloadReport
            :task-detail="taskDetail"
            :updateReportTemplateList="updateReportTemplateList"
            @preview="handlePreview"
            @showSelectModal="showSelectModal"
            v-if="isUploadReport"
          />
          <!-- v-if="isUploadReport"  -->

          <!-- <a-button key="2" @click="showwUpdateTaskModal">编辑</a-button> -->
          <a-button key="3" danger class="under" v-if="isChecking"
            >审核中...</a-button
          >
          <a-popconfirm
            v-if="isToSecondAudit"
            key="1"
            title="是否确定领取二审审核！"
            ok-text="领取"
            cancel-text="取消"
            placement="bottomLeft"
            @confirm="toCreateTask(AuditGetTypeEnum.SECOND_AUDIT)"
          >
            <a-button key="2" type="primary">领取二审</a-button>
          </a-popconfirm>

          <a-popconfirm
            v-if="isToAudit"
            key="1"
            title="是否确定领取一审审核！"
            ok-text="领取"
            cancel-text="取消"
            placement="bottomLeft"
            @confirm="toCreateTask(AuditGetTypeEnum.FIRST_AUDIT)"
          >
            <a-button type="primary">领取审核</a-button>
          </a-popconfirm>
        </template>
        <div class="content">
          <div class="main">
            <a-descriptions
              size="default"
              :column="4"
              class="descriptions_content"
            >
              <!-- 替换为动态渲染 -->
              <a-descriptions-item label="任务名称">{{
                taskDetail.name
              }}</a-descriptions-item>
              <a-descriptions-item label="任务创建人员">{{
                taskDetail.creatorName
              }}</a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{
                  taskDetail.createTime
                    ? useRender.renderDate(taskDetail.createTime)
                    : "-"
                }}</a-descriptions-item
              >
              <a-descriptions-item label="检测项目">
                <!-- {{ CheckTypeEnumMap[taskDetail.type] }} -->
                  {{ taskDetail.typeName }}
              </a-descriptions-item>
              <!-- <a-descriptions-item label="检测项目">{{
                taskDetail.testProject
              }}</a-descriptions-item> -->

              <a-descriptions-item label="质控报告">
                <span
                  v-if="taskDetail.taskStatus === TaskStatusEnum.FAILED"
                  style="color: rgb(255 77 79 / 100%)"
                >
                  分析失败
                </span>

                <span
                  v-else-if="taskDetail.qcStatus === QcStatusEnum.UNKNOWN"
                  style="color: rgb(24 144 255 / 100%)"
                  >待分析完成</span
                >
                <span v-else-if="taskDetail.qcStatus === QcStatusEnum.PASS">
                  合格
                </span>
                <span
                  v-else-if="taskDetail.qcStatus === QcStatusEnum.FAIL"
                  style="color: rgb(255 77 79 / 100%)"
                >
                  不合格（{{ taskDetail.reportQcFailCount }}/{{
                    taskDetail.reportCount
                  }}）
                </span>
                <span v-else-if="taskDetail.qcStatus === QcStatusEnum.WARNING"
                  style="color: #FA9614">
                  预警（{{ taskDetail.reportQcWarningCount }}/{{
                    taskDetail.reportCount
                  }}）
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="分析进度" class="analysis-progress">
                <!-- <a-progress :percent="100" :steps="5" size="small" stroke-color="#52c41a" /> -->
                <a-progress
                  :percent="
                    (taskDetail.reportFinishCount / taskDetail.reportCount) *
                    100
                  "
                  :steps="10"
                  :size="[3, 16]"
                  stroke-color="#34C759"
                  :show-info="false"
                />
                <span>
                  {{ taskDetail.reportFinishCount }} /
                  {{ taskDetail.reportCount }}

                  <!-- <b class="analysisProgress" @click="showDrawer"> [查看]</b> -->
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="并行样本数">
                {{ taskDetail.threadCount }}
              </a-descriptions-item>
              <a-descriptions-item label="单样本线程数">{{
                taskDetail.taskCount
              }}</a-descriptions-item>
              <a-descriptions-item label="测序长度">{{
                taskDetail.seqLength
              }}</a-descriptions-item>
            </a-descriptions>
          </div>
          <div class="extra">
            <div
              :style="{
                display: 'flex',
                width: 'max-content',
                justifyContent: 'flex-end',
              }"
            >
              <!-- :value="taskDetail.taskStatus"  -->
              <a-statistic title="任务状态">
                <template #formatter>
                  <span
                    class="taskStatusSpan"
                    style="color: rgb(24 144 255 / 100%)"
                  >
                    <template
                      v-if="taskDetail.checkStatus === CheckStatusEnum.PASSED"
                    >
                      <span class="analysisreport-green" :class="isUnPass1Audit(taskDetail) ? 'analysisreport-red' : ''">已完成</span>
                    </template>
                    <template v-else>
                      {{
                        taskDetail.oneAuditorId === 0
                          ? "等待"
                          : taskDetail.oneAuditor
                      }}一审中
                    </template>

                    ({{ taskDetail.oneAuditPassCount }}/{{
                      taskDetail.reportCount
                    }})</span
                  >

                  <span
                    class="taskStatusSpan"
                    style="color: rgb(24 144 255 / 100%)"
                  >
                    <template
                      v-if="taskDetail.checkStatus === CheckStatusEnum.PASSED"
                    >
                      <span class="analysisreport-green" :class="isUnPass2Audit(taskDetail) ? 'analysisreport-red' : ''">已完成</span>
                    </template>
                    <template v-else>
                      {{
                        taskDetail.twoAuditorId === 0
                          ? "等待"
                          : taskDetail.twoAuditor
                      }}二审中
                    </template>
                    ({{ taskDetail.twoAuditPassCount }}/{{
                      taskDetail.reportCount
                    }})</span
                  >
                </template>
              </a-statistic>
            </div>
          </div>
        </div>
      </a-page-header>
    </div>

    <!-- 分析进度详情 -->
    <AnalysisProgressDrawer
      ref="apdRef"
      :task-detail="customTaskDetail"
      :timelineData="timelineData"
    />
  </div>
</template>


<script setup lang="ts">
import {
  CheckTypeEnumMap,
  QcStatusEnum,
  CheckStatusEnum,
  AuditGetTypeEnum,
  TaskStatusEnum,
} from "@/enums/customEnum";
import { customTaskDetail, timelineData } from "./index";
import DownloadReport from "./components/downloadreport/index.vue";
import AnalysisProgressDrawer from "../analysisprogressdrawer/index.vue";
import { useRender } from "@/components/Table";
import { computed, ref, watch } from "vue";
import { AnalysisTaskAuditRespVO } from "@/api/lims/analysistask/model";
import { DownloadOutlined } from "@ant-design/icons-vue";
// PDF 预览相关变量

const apdRef = ref<typeof AnalysisProgressDrawer>();
// const filteredReports = ref<any>([]);

// const router = useRouter();
const pop = defineProps<{
  taskDetail: AnalysisTaskAuditRespVO;
  updateReportTemplateList: [];
}>();

import { useUserStore } from "@/store/modules/user";
import { auditGetTask } from "@/api/lims/analysistask";
import message from "@/components/FormDesign/src/utils/message";
import { downLoadUrl } from "@/utils/custom";

const userStore = useUserStore();

const userId = computed(() => userStore.getUserInfo.user.id);

// console.log(pop.taskDetail);

/** 下载状态
 */
const isUploadReport = computed(() => {
  // //已通过
  // if (pop.taskDetail.checkStatus === CheckStatusEnum.PASSED) {
  //   return true;
  // }

  // //只要有个样本通过二审了
  // pop.taskDetail.reportList &&
  //   pop.taskDetail.reportList.forEach((item) => {
  //     if (item.twoAuditStatus === TwoAuditStatusEnum.PASSED) {
  //       return true;
  //     }
  //   });

  return pop.taskDetail.reportList?.some((item) => item.reportFileUrl != null);
});

//是否显示审核中
const isChecking = computed(() => {
  // 状态是审核中
  const checkStatus = pop.taskDetail.checkStatus === CheckStatusEnum.CHECKING;

  // 状态是一审领取了
  // 且一审人是本人
  // 且状态是审核中的
  const isLoading2 =
    pop.taskDetail.oneAuditorId !== 0 &&
    pop.taskDetail.oneAuditorId === Number(userId.value) &&
    checkStatus;

  // 状态是二审领取了（二审领取代表一审是肯定领取了的）
  // 且状态是审核中的
  const isLoading3 = pop.taskDetail.twoAuditorId !== 0 && checkStatus;

  return isLoading2 || isLoading3;
});

//是否显示去审核 去一审
const isToAudit = computed(() => {
  // 状态是一审没有领取
  return (
    pop.taskDetail.oneAuditorId === 0 &&
    pop.taskDetail.taskStatus === TaskStatusEnum.COMPLETED
  );
});

//是否显示去二审
const isToSecondAudit = computed(() => {
  // 状态是二审没有领取
  // 且 一审领取了
  // 且 一审不是本人领取的
  return (
    pop.taskDetail.twoAuditorId === 0 &&
    pop.taskDetail.oneAuditorId !== 0 &&
    pop.taskDetail.oneAuditorId !== Number(userId.value)
  );
});

const uploadAnalysisResultTable = async () => {
  // try {
  //   downloadAnalysisTaskExcel(props.taskDetail.id);

  // }
  try {
    await downLoadUrl(pop.taskDetail.resultFileUrl, pop.taskDetail.name + "分析结果表.xlsx");
    message.success("下载分析结果表成功");
  } catch (e) {
    message.error("下载分析结果表失败");
  }
};

// const showDrawer = () => {
//   apdRef?.value?.showDrawer();
// };

const setTaskName = (name: string) => {
  pop.taskDetail.name = name;
};
// 定义emit事件类型
const emit = defineEmits<{
  (event: "refreshTaskDetail"): void;
  (event: "preview", url: string): void;
  (event: "showSelectModal", report: any): void;
  (event: "goFullScreen", reportId: number): void;
}>();

// 处理预览事件
const handlePreview = (url: string) => {
  // 触发父组件的预览事件
  emit("preview", url);
};

const showSelectModal = (report:any) => {
  emit("showSelectModal", report);
}

const toCreateTask = async (type: AuditGetTypeEnum) => {
  try {
    await auditGetTask({
      taskId: pop.taskDetail.id,
      auditorId: Number(userId.value),
      auditGetType: type,
    });
    message.success("领取成功");
    if (pop.taskDetail.reportList && pop.taskDetail.reportList.length > 0) {
      emit("goFullScreen", pop.taskDetail.reportList[0].id);
    }
  } catch (error) {
    // message.error("领取失败");
  } finally {
    emit("refreshTaskDetail");
  }
};

watch(pop.taskDetail, (newValue) => {
  console.log(newValue);
  // filteredReports.value = newValue.reportList?.filter(
  //     (report) => report.reportFileUrl != null
  //   ) || []
});

// const setTaskDetil = (taskDetail: AnalysisTaskAuditRespVO) => {
//   filteredReports.value = taskDetail.reportList?.filter(
//       (report) => report.reportFileUrl != null
//     ) || []
// };

//一审是否有未通过的报告
const isUnPass1Audit = (record:any) => {
  let flag = false;
  record.reportList.forEach(item => {
    if(item.oneAuditStatus == 4) {
      flag = true;
    }
  })
  return flag;
}

//二审是否有未通过的报告
const isUnPass2Audit = (record:any) => {
  let flag = false;
  record.reportList.forEach(item => {
    if(item.twoAuditStatus == 4) {
      flag = true;
    }
  })
  return flag;
}

defineExpose({
  setTaskName,
  // setTaskDetil,
});
</script>

<style lang="less" scoped>
.components-page-header-demo-responsive {
  @green: #52c41a;
  @red: #ff4d4f;

  .extra {
    padding: 24px 0 0;
    text-align: right;

    .taskStatusSpan {
      display: block;
      font-size: 20px;
      font-weight: bold;
    }
  }

  tr:last-child td {
    padding-bottom: 0;
  }

  .content {
    display: flex;
  }

  .ant-statistic-content {
    font-size: 20px;
    line-height: 28px;
  }

  .descriptions_content {
    padding: 24px;
  }

  :deep(.analysis-progress) {
    .ant-progress-line {
      position: relative;
      top: 4px;
      width: auto;
    }
  }

  .analysisProgress {
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
}

.under {
  cursor: auto;
  background-color: rgb(255 220 220 / 100%) !important;
}

.analysisreport-green {
  color: #52c41a;
}

.analysisreport-red {
  color: #FF4D4F;
}
</style>