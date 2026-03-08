<template>
  <div>
    <div class="components-page-header-demo-responsive">
      <a-page-header title="报告详情" :sub-title="taskDetail.name">
        <template #extra>
          <a-button key="2" @click="showwUpdateTaskModal">编辑</a-button>
          <!-- <a-button key="2" @click="showwUpdateTaskModal">编辑</a-button> -->
          <a-button key="1" type="primary" @click="toCreateTask"
            >重建分析</a-button
          >
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
              <a-descriptions-item label="任务类型">
                {{ CheckTypeEnumMap[taskDetail.type] }}
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
              <a-statistic
                title="任务状态"
                :value="TaskStatusEnumMap[taskDetail.taskStatus]"
                :valueStyle="{
                  color:
                    taskDetail.taskStatus === TaskStatusEnum.ANALYZING
                      ? 'rgb(24 144 255 / 100%)'
                      : taskDetail.taskStatus === TaskStatusEnum.COMPLETED
                      ? 'rgb(82 196 26 / 100%)'
                      : taskDetail.taskStatus === TaskStatusEnum.FAILED
                      ? 'rgba(250, 140, 22, 1)'
                      : '',
                }"
              />
            </div>
          </div>
        </div>
      </a-page-header>
    </div>

    <!-- 分析进度详情 -->
    <!-- <AnalysisProgressDrawer
      ref="apdRef"
      :task-detail="customTaskDetail"
      :timelineData="timelineData"
    /> -->

    <!-- 编辑任务名称 -->
    <UpdateTaskModal ref="utmRef" @setTaskName="setTaskName" />
  </div>
</template>


<script setup lang="ts">
// import AnalysisProgressDrawer from "../analysisprogressdrawer/index.vue";
import UpdateTaskModal from "./components/updatetaskname/UpdateTaskModal.vue";
import {
  QcStatusEnum,
  TaskStatusEnumMap,
  CheckTypeEnumMap,
} from "@/enums/customEnum";
import { ref } from "vue";
import { GetAnalysisTaskModel } from "@/views/lims/analysistask/model";
import { TaskStatusEnum } from "@/enums/customEnum";
import { useGo } from "@/hooks/web/usePage";
import { useRender } from "@/components/Table";
// const apdRef = ref<typeof AnalysisProgressDrawer>();

const utmRef = ref<typeof UpdateTaskModal>();
const go = useGo();
const pop = defineProps<{
  taskDetail: GetAnalysisTaskModel;
}>();

// const showDrawer = () => {
//   apdRef?.value?.showDrawer();
// };

const showwUpdateTaskModal = () => {
  utmRef?.value?.showModal(pop.taskDetail.id, pop.taskDetail.name);
};

const setTaskName = (name: string) => {
  pop.taskDetail.name = name;
};

const toCreateTask = () => {
  go("/lims/analysis-task/0/0/" + pop.taskDetail.id);
};

defineExpose({
  setTaskName,
});
</script>

<style lang="less" scoped>
.components-page-header-demo-responsive {
  @green: #52c41a;
  @red: #ff4d4f;

  .extra {
    padding: 36px 0 0;
    text-align: right;

    // :deep(.ant-statistic) {
    //   .ant-statistic-content-value {
    //     color: @green;
    //   }
    // }
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
</style>