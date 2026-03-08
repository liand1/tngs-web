<template>
  <a-drawer
    v-model:open="open"
    class="custom-class"
    root-class-name="root-class-name"
    :root-style="{ color: 'blue' }"
    title="XPGL20250302001质控详情"
    placement="right"
    :width="700"
    :footer-style="{ textAlign: 'right' }"
    @after-open-change="afterOpenChange"
  >
    <div>
      <div class="descriptions">
        <a-descriptions
          :column="2"
          :title="taskDetail.taskName"
          :label-style="{
            color: 'rgb(0 0 0 / 45%)',
          }"
          :content-style="{
            marginRight: '16px',
          }"
        >
          <a-descriptions-item label="样本编号">
            {{ taskDetail.sampleId }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ taskDetail.createTime }}
          </a-descriptions-item>
          <a-descriptions-item label="菌株编号">
            {{ taskDetail.strainId }}
          </a-descriptions-item>
          <a-descriptions-item label="开始时间">
            {{ taskDetail.startTime }}
          </a-descriptions-item>
          <a-descriptions-item label="基因组数据">
            {{ taskDetail.genomeData }}
          </a-descriptions-item>
          <a-descriptions-item label="结束时间">
            {{ taskDetail.endTime }}
          </a-descriptions-item>
          <a-descriptions-item label="样本名称">
            {{ taskDetail.sampleName }}
          </a-descriptions-item>
          <a-descriptions-item label="提交人">
            {{ taskDetail.submitter }}
          </a-descriptions-item>
        </a-descriptions>
      </div>

      <!-- 添加 Timeline -->
      <div class="timeline-container">
        <a-timeline mode="left">
          <a-timeline-item
            v-for="(item, index) in timelineData"
            :key="index"
            :color="'red'"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.status }}</p>
            <span>{{ item.startTime }} - {{ item.endTime }}</span>
          </a-timeline-item>
        </a-timeline>
      </div>
    </div>

    <template #footer>
      <a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
    </template>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { AnalysisTaskDetailModel, timelineDataModel } from "./model";
// import { timelineData } from "./index";

const open = ref<boolean>(false);

// 定义 props，接收动态数据
defineProps<{
  taskDetail: AnalysisTaskDetailModel;
  timelineData: timelineDataModel[];
}>();

const afterOpenChange = (bool: boolean) => {
  console.log("open", bool);
};

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};

defineExpose({
  showDrawer,
});
</script>

<style lang="less" scoped>
.timeline-container {
  margin: 24px 0 0 48px;

  .ant-timeline {
    &-item {
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
      }

      p {
        margin: 0 0 5px;
        // color: rgb(0 0 0 / 65%);
      }

      span {
        display: block;
        margin-bottom: 24px;
        color: rgb(0 0 0 / 45%);
      }
    }
  }

  :deep(.ant-timeline-item:last-child) {
    padding: 0;
  }
}
</style>