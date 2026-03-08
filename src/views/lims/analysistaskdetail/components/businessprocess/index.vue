<template>
  <div class="business-process">
    <h2 class="title">业务流程</h2>
    <div class="content_box">
      <!-- 如果流程为空，则显示流程为空 -->
      <div
        v-if="steps.stepslist.length === 0 || isNotShow"
        class="empty-process"
      >
        <span>流程为空</span>
      </div>

      <a-steps progress-dot :current="steps.current" v-else>
        <a-step v-for="(item, index) in steps.stepslist" :key="index">
          <template #title>
            <!-- //出具报告失败
                // 0不是出具报告  
                // 1出具报告成功  
                // 2 是出具报告失败  
                // 3是出具报告中 -->
            <div v-if="isSecondReviewPassed(item) === 2">
              <span style="color: red"> 出具报告失败 </span>
            </div>
            <div v-else-if="isSecondReviewPassed(item) === 3">
              <span> 出具报告中... </span>
            </div>
            <span v-else>
              {{ getStepTitle(item) }}
            </span>
          </template>
          <template #description>
            <div class="step-box">
              <span class="name">{{ item.operator }}</span>
              <span class="job">{{ formatTime(item.operatorTime) }}</span>
            </div>
          </template>
        </a-step>
      </a-steps>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { StepModel } from "./model";
import {
  FindAnalysisReportDetailsModel,
  sampleFlowListModel,
} from "../../model";
import {
  ProcessStatusEnum,
  ProcessStatusEnumMap,
  SampleTypeEnum,
} from "@/enums/customEnum";

// 定义接收的props
const props = defineProps<{
  findAnalysisReportDetails?: FindAnalysisReportDetailsModel;
}>();

const initFlowList = (processStatus: ProcessStatusEnum) => {
  return {
    processStatus,
    id: 0,
    taskId: 0,
    sampleId: 0,
    action: "",
    remark: "",
    operator: "",
    operatorTime: undefined,
    createTime: undefined,
  };
};

const stepsFlowList = [
  initFlowList(ProcessStatusEnum.UNKNOWN),
  initFlowList(ProcessStatusEnum.CREATED),
  initFlowList(ProcessStatusEnum.ANALYZING),
  initFlowList(ProcessStatusEnum.FAILED),
  initFlowList(ProcessStatusEnum.WAIT_RESULT),
  initFlowList(ProcessStatusEnum.RESULT_GENERATED),
  initFlowList(ProcessStatusEnum.FIRST_REVIEW_PASSED),
  initFlowList(ProcessStatusEnum.FIRST_REVIEW_REJECTED),
  initFlowList(ProcessStatusEnum.SECOND_REVIEW_PASSED),
  initFlowList(ProcessStatusEnum.SECOND_REVIEW_REJECTED),
  initFlowList(ProcessStatusEnum.REPORT_ISSUED),
  initFlowList(ProcessStatusEnum.NO_AUDIT),
  initFlowList(ProcessStatusEnum.REPORT_ISSUED_FAILED),
];

/**
 * 流程状态枚举
 * 1:1
 * 2:2,3,4
 * 3:5
 * 4:6,7
 * 5:8,9
 * 6:10
 */
const steps = ref<StepModel>({
  current: 1,
  stepslist: [],
});

// 未知i情况的流程
const isNotShow = ref(false);

// 监听findAnalysisReportDetails变化，更新业务流程
watch(
  () => props.findAnalysisReportDetails,
  (newValue) => {
    // 合并sampleFlowList到stepsFlowList
    if (newValue?.sampleFlowList) {
      // 复制一份初始流程
      const mergedList = stepsFlowList.map((origin) => {
        // 查找是否有同processStatus的实际流程
        const found = newValue.sampleFlowList.find(
          (f) => f.processStatus === origin.processStatus
        );
        return found ? { ...origin, ...found } : origin;
      });

      //未知的情况
      if (
        newValue?.sampleFlowList.length === 0 ||
        mergedList.filter(
          (item) => item.processStatus === ProcessStatusEnum.UNKNOWN
        ).length === 0
      ) {
        isNotShow.value = true;
        return;
      }

      isNotShow.value = false;

      steps.value.stepslist = [
        ...mergedList.filter((item) => {
          if (item.processStatus === ProcessStatusEnum.CREATED) {
            item.processStatus = ProcessStatusEnum.CREATED;
          }
          if (item.processStatus === ProcessStatusEnum.RESULT_GENERATED) {
            item.processStatus = ProcessStatusEnum.RESULT_GENERATED;
          }

          return (
            item.processStatus === ProcessStatusEnum.CREATED ||
            item.processStatus === ProcessStatusEnum.RESULT_GENERATED
          );
        }),
        // 任务分析
        ...taskAnalysis(mergedList),
        // 一审
        ...oneReview(mergedList),
        // 二审
        ...twoReview(mergedList),
        // 出具报告
        ...reportIssued(mergedList),
        // 无需审核
        ...noAudit(mergedList),
      ].sort((a, b) => a.processStatus - b.processStatus);
      // 设置current为最后一个id不为0的下标+1
      const lastIndex = [...steps.value.stepslist]
        .reverse()
        .findIndex((item) => item.id !== 0);
      steps.value.current =
        lastIndex === -1 ? 0 : steps.value.stepslist.length - lastIndex - 1;
    } else {
      steps.value.stepslist = [];
    }
  },
  { immediate: true, deep: true }
);

//一审
function oneReview(mergedList: any) {
  if (isNoAudit()) {
    return [];
  }
  const group = mergedList.filter(
    (item) =>
      item.processStatus === ProcessStatusEnum.FIRST_REVIEW_PASSED ||
      item.processStatus === ProcessStatusEnum.FIRST_REVIEW_REJECTED
  );
  let keep: sampleFlowListModel[] = [];
  if (group.length > 0) {
    const notZero = group.find((item) => item.id !== 0);
    if (notZero) {
      keep = [notZero];
    } else {
      keep = [
        group.find((obj) => {
          obj.processStatus = ProcessStatusEnum.FIRST_REVIEW_PASSED;
          return obj.processStatus === ProcessStatusEnum.FIRST_REVIEW_PASSED;
        })!,
      ];
    }
  }

  return keep;
}

//二审
function twoReview(mergedList: any) {
  if (isNoAudit()) {
    return [];
  }
  const group = mergedList.filter(
    (item) =>
      item.processStatus === ProcessStatusEnum.SECOND_REVIEW_PASSED ||
      item.processStatus === ProcessStatusEnum.SECOND_REVIEW_REJECTED
  );
  let keep: sampleFlowListModel[] = [];
  if (group.length > 0) {
    const notZero = group.find((item) => item.id !== 0);
    if (notZero) {
      keep = [notZero];
    } else {
      keep = [
        group.find((obj) => {
          obj.processStatus = ProcessStatusEnum.SECOND_REVIEW_PASSED;
          return obj.processStatus === ProcessStatusEnum.SECOND_REVIEW_PASSED;
        })!,
      ];
    }
  }

  return keep;
}
//任务分析
function taskAnalysis(mergedList: any) {
  const group4 = mergedList.filter(
    (item) => item.processStatus === ProcessStatusEnum.WAIT_RESULT
  );

  if (group4.length === 1) return [group4[0]];

  const group3 = mergedList.filter(
    (item) => item.processStatus === ProcessStatusEnum.FAILED
  );
  if (group3.length === 1) return [group3[0]];

  const group2 = mergedList.filter(
    (item) => item.processStatus === ProcessStatusEnum.ANALYZING
  );
  if (group2.length === 1) return [group2[0]];

  return [{ processStatus: ProcessStatusEnum.ANALYZING }];
}

//水控无需审核
function noAudit(mergedList: any) {
  if (isNoAudit()) {
    const group = mergedList.filter(
      (item) => item.processStatus === ProcessStatusEnum.NO_AUDIT
    );
    if (group.length === 1) return [group[0]];
  }

  return [];
}

//出具报告
function reportIssued(mergedList: any) {
  if (isNoAudit()) {
    return [];
  }
  let keep: sampleFlowListModel[] = [];
  const group = mergedList.filter(
    (item) =>
      item.processStatus === ProcessStatusEnum.REPORT_ISSUED ||
      item.processStatus === ProcessStatusEnum.REPORT_ISSUED_FAILED
  );
  if (group.length > 0) {
    const notZero = group.find((item) => item.id !== 0);
    if (notZero) {
      keep = [notZero];
    } else {
      keep = [
        group.find((obj) => {
          obj.processStatus = ProcessStatusEnum.REPORT_ISSUED;
          return obj.processStatus === ProcessStatusEnum.REPORT_ISSUED;
        })!,
      ];
    }
  }
  return keep;
}
// 判断是否水控任务
function isNoAudit() {
  return (
    props.findAnalysisReportDetails?.sample?.sampleType ===
    SampleTypeEnum.WATER_CONTROL
  );
}

// 二审通过且没有出具报告
const isSecondReviewPassed = (item: sampleFlowListModel) => {
  // console.log("点击步骤:", item);

  //检查是否已出具报告
  const hasReportIssued =
    item.processStatus === ProcessStatusEnum.REPORT_ISSUED ||
    item.processStatus === ProcessStatusEnum.REPORT_ISSUED_FAILED;

  //  判断是否二审通过
  const isSecondReviewPassed = steps.value.stepslist.some(
    (step) =>
      step.processStatus === ProcessStatusEnum.SECOND_REVIEW_PASSED &&
      step.id !== 0
  );

  // 如果是二审通过且未出具报告，触发出具报告事件
  if (isSecondReviewPassed && hasReportIssued) {
    //出具报告失败
    // 0不是出具报告
    // 1出具报告成功
    // 2 是出具报告失败
    // 3是出具报告中
    if (item.processStatus === ProcessStatusEnum.REPORT_ISSUED_FAILED) {
      return 2;
    } else if (item.id !== 0) {
      return 1;
    } else {
      return 3;
    }
  }
  return 0;
};

// 格式化时间戳为可读的日期时间
function formatTime(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// 获取步骤标题
function getStepTitle(item: sampleFlowListModel) {
  let title = ProcessStatusEnumMap[item.processStatus];
  if (
    (item.processStatus === ProcessStatusEnum.FIRST_REVIEW_PASSED ||
      item.processStatus === ProcessStatusEnum.SECOND_REVIEW_PASSED) &&
    item.id === 0
  ) {
    return title.replace("通过", "");
  }
  return title;
}
</script>

<style scoped lang="less">
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
  padding: 32px 48px;
}

.empty-process {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  color: rgb(0 0 0 / 45%);
  background-color: rgb(0 0 0 / 2%);
  border-radius: 4px;

  span {
    font-size: 14px;
  }
}

.step-icon {
  font-size: 18px;
}

:deep(.ant-steps-item-finish) {
  .step-box {
    color: rgb(0 0 0 / 88%);
  }
}

.step-box {
  position: relative;
  left: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 12px;
  text-align: left;

  .name {
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }

  .job {
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
  }
}
</style>