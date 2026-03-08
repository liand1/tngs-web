<template>
  <div class="arc_box">
    <h2 class="title">分析结果目录</h2>
    <a-list
      class="listbox"
      size="small"
      :data-source="reportList"
      :bordered="false"
      :split="false"
    >
      <template #renderItem="{ item }">
        <a-list-item
          class="listitem"
          :class="{ 'active-item': selectIndex === item.id }"
        >
          <a-row :wrap="false" style="width: 100%">
            <a-col
              flex="auto"
              class="leftcol"
              @click="handleItemClick(item.id)"
            >
              <FileOutlined style="margin-right: 8px" />
              <span class="samplename">{{ item.sampleCode }}</span>
            </a-col>

            <a-col
              flex="none"
              class="rightcol"
              style="cursor: pointer"
              v-if="item.sampleType !== SampleTypeEnum.WATER_CONTROL"
              @click="taskdetailsModal(item.id, item.sampleCode)"
            >
              <!-- <FileTextOutlined /> -->

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
          </a-row>
        </a-list-item>
      </template>
      <template #header>
        <a-row :wrap="false">
          <a-col flex="auto">样本编号</a-col>

          <a-col flex="none" class="rightcol">质控</a-col>
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
} from "@ant-design/icons-vue";
import TaskDetailsModal from "@/components/lims/taskdetails/TaskDetailsModal.vue";
import { defineProps, defineEmits, ref, watch } from "vue";
import { ReportListModel } from "@/views/lims/analysistask/model";
import { QcStatusEnum, QcTypeEnum, SampleTypeEnum } from "@/enums/customEnum";
import { findQcReportByObjectId } from "@/api/lims/qcreport";
const tdRef = ref<typeof TaskDetailsModal>();
// 定义 props，接收 treeData
const props = defineProps<{
  reportList: ReportListModel[];
}>();
const taskDetailData = {
  title: "质控详情",
  list: [],
};
// 定义 emit，用于向父组件发送事件
const emit = defineEmits<{
  (event: "click-node", node: any): void;
}>();

//当前选中的批次编号
const selectIndex = ref(-1);

const getSelectIndex = () => {
  return selectIndex.value;
};

const handleItemClick = (index: number) => {
  if (selectIndex.value === index) {
    return;
  }
  selectIndex.value = index;
  emit("click-node", index);
};
watch(
  () => props.reportList,
  (newReportList) => {
    if (selectIndex.value === -1 && newReportList.length > 0) {
      selectIndex.value = newReportList[0].id;
      emit("click-node", newReportList[0].id);
    }
  }
);

async function taskdetailsModal(id: number, sampleCode: string) {
  // 根据id获取质控记录
  const qcReportList = await findQcReportByObjectId(
    id,
    QcTypeEnum.ANALYSIS_TASK,
    1
  );

  tdRef?.value?.showModal(sampleCode + " 质控详情", qcReportList);
}

defineExpose({
  getSelectIndex,
  // setThatReport,
});
</script>

<style lang="less" scoped>
.arc_box {
  width: 300px;

  .title {
    height: 48px;
    margin: 0;
    font-size: 16px;
    line-height: 48px;
  }

  .listbox {
    padding: 12px;
    background-color: #fafafa;
    border: 1px solid #0000001a;
    border-radius: 4px;

    :deep(.ant-list-items) {
      max-height: 742px;
      overflow-y: auto;
    }
  }

  .listitem {
    padding: 4px 2px;
    border-radius: 4px;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  .rightcol {
    align-content: center;
    width: 30px;
    margin-left: 16px;
    text-align: center;
  }

  .samplename {
    position: absolute;
    right: 0;
    left: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .leftcol {
    padding: 4px;
    cursor: pointer;

    // &:hover {
    //   background-color: #f0f0f0;
    // }
  }

  .active-item {
    background-color: #ffdcdc !important; /* 高亮背景色 */
  }
}
</style>