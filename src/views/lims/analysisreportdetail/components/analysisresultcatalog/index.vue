<template>
  <div class="arc_box">
    <h2 class="title">分析结果目录</h2>
    <a-list
      class="listbox"
      size="small"
      :data-source="taskDetail.reportList"
      :bordered="false"
      :split="false"
    >
      <template #renderItem="{ item }">
        <a-list-item
          class="listitem"
          :class="{ 'active-item': selectIndex === item.id }"
        >
          <a-row :wrap="false" class="listitem-row">
            <a-col
              class="leftcol"
              @click="handleItemClick(item.id)"
            >
              <!-- <FileOutlined style="margin-right: 8px" /> -->
              <a-tooltip>
                <template #title>
                  {{ item.sampleCode }}
                </template>
                <span class="samplename" style="padding-left: 2px">{{
                  item.sampleCode
                }}</span>
              </a-tooltip>
            </a-col>

            <a-col class="examineeName" @click="handleItemClick(item.id)">
              {{ item.examineeName || '&nbsp;' }}
            </a-col>

            <a-col
              class="rightcol"
              style="cursor: pointer"
              v-if="item.sampleType !== SampleTypeEnum.WATER_CONTROL"
              @click="taskdetailsModal(item.id, item.sampleCode)"
            >
              <FileTextOutlined v-if="item.qcStatus === QcStatusEnum.PASS" />
              <FileExclamationOutlined
                style="color: #ff4d4f"
                v-else-if="item.qcStatus === QcStatusEnum.FAIL"
              />
              <FileExclamationOutlined
                style="color: #FA9614"
                v-else-if="item.qcStatus === QcStatusEnum.WARNING"
              />
            </a-col>

            <a-col
              class="rightcol"
              v-else
            >
            </a-col>

            <a-col class="rightcol audit" v-if="item.sampleType !== SampleTypeEnum.WATER_CONTROL">
              <span
                v-if="item.oneAuditStatus === OneAuditStatusEnum.WAITING"
                style="color: #bfbfbf"
              >
                待审
              </span>
              <span
                v-else-if="item.oneAuditStatus === OneAuditStatusEnum.PASSED"
                style="color: #52c41a"
              >
                通过
              </span>

              <span
                v-else-if="item.oneAuditStatus === OneAuditStatusEnum.REJECTED"
                style="color: #ff4d4f"
              >
                未通过
              </span>
            </a-col>

            <a-col
              class="rightcol"
              v-else
            >
            </a-col>

            <a-col class="rightcol audit" v-if="item.sampleType !== SampleTypeEnum.WATER_CONTROL">
              <span
                v-if="item.twoAuditStatus === TwoAuditStatusEnum.WAITING"
                style="color: #bfbfbf"
              >
                待审
              </span>
              <span
                v-else-if="item.twoAuditStatus === TwoAuditStatusEnum.PASSED"
                style="color: #52c41a"
              >
                通过
              </span>

              <span
                v-else-if="item.twoAuditStatus === TwoAuditStatusEnum.REJECTED"
                style="color: #ff4d4f"
              >
                未通过
              </span>
            </a-col>

            <a-col
              class="rightcol"
              v-else
            >
            </a-col>
          </a-row>
        </a-list-item>
      </template>
      <template #header>
        <a-row :wrap="false">
          <a-col class="leftcol" style="padding-left: 2px">样本编号</a-col>

          <a-col class="examineeName">姓名</a-col>

          <a-col class="rightcol">质控</a-col>

          <a-col class="rightcol audit">一审</a-col>

          <a-col class="rightcol audit">二审</a-col>
        </a-row>
      </template>
    </a-list>
  </div>

  <TaskDetailsModal ref="tdRef" :data="taskDetailData" />
</template>

<script setup lang="ts">
import {
  FileOutlined,
  FileExclamationOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons-vue";
import TaskDetailsModal from "@/components/lims/taskdetails/TaskDetailsModal.vue";
import { defineProps, defineEmits, ref, watch } from "vue";
import { taskDetailData } from "./index";
import {
  QcTypeEnum,
  QcStatusEnum,
  OneAuditStatusEnum,
  TwoAuditStatusEnum,
  SampleTypeEnum,
} from "@/enums/customEnum";
import { AnalysisTaskAuditRespVO } from "@/api/lims/analysistask/model";
import { findQcReportByObjectId } from "@/api/lims/qcreport";
const tdRef = ref<typeof TaskDetailsModal>();
// 定义 props，接收 treeData
const props = defineProps<{
  taskDetail: AnalysisTaskAuditRespVO;
  // reportList: AnalysisReportAuditRespVO[];
}>();
// 定义 emit，用于向父组件发送事件
const emit = defineEmits<{
  (event: "click-node", node: any): void;
}>();

//当前选中的批次编号
const selectIndex = ref(-1);

const getSelectIndex = () => {
  return selectIndex.value;
};

const setSelectIndex = (index:number) => {
  selectIndex.value = index;
};

const handleItemClick = (index: number) => {
  if (selectIndex.value === index) {
    return;
  }
  selectIndex.value = index;
  emit("click-node", index);
};

async function taskdetailsModal(id: number, sampleCode: string) {
  // 根据id获取质控记录
  const qcReportList = await findQcReportByObjectId(
    id,
    QcTypeEnum.ANALYSIS_TASK,
    2
  );

  tdRef?.value?.showModal(sampleCode + " 质控详情", qcReportList);
}

watch(
  () => props.taskDetail,
  (newtaskDetail) => {
    console.log("analysisresultcatalog index page", newtaskDetail);
    if (selectIndex.value === -1 && newtaskDetail!.reportList!.length > 0) {
      selectIndex.value = newtaskDetail!.reportList![0].id;
      emit("click-node", newtaskDetail!.reportList![0].id);
    }
  }
);

defineExpose({
  getSelectIndex,
  setSelectIndex,
});
</script>

<style lang="less" scoped>
.arc_box {
  width: 340px;

  .title {
    height: 48px;
    margin: 0;
    font-size: 16px;
    line-height: 48px;
  }

  .listbox {
    padding: 8px;
    background-color: #fafafa;
    border: 1px solid #0000001a;
    border-radius: 4px;

    :deep(.ant-list-items) {
      max-height: 742px;
      overflow-y: auto;
      padding-top: 8px;
      padding-bottom: 12px;
    }
    :deep(.ant-list-item) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  .listitem {
    // padding: 4px 2px;
    border-radius: 4px;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  .listitem-row {
    width: 100%;
  }

  .rightcol {
    align-content: center;
    width: 40px;
    // margin-left: 16px;
    text-align: center;
  }

  .audit {
    width: 50px;
  }

  .samplename {
    position: absolute;
    right: 0;
    left: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 110px;
  }

  .leftcol {
    // padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    text-align: left;
    width: 110px;
    // &:hover {
    //   background-color: #f0f0f0;
    // }
  }

  .examineeName {
    cursor: pointer;
    border-radius: 4px;
    text-align: left;
    width: 80px;
  }

  .active-item {
    background-color: #ffdcdc !important; /* 高亮背景色 */
  }
}
</style>