<template>
  <div class="operation_log_box">
    <h2 class="title">操作日志</h2>
    <a-table
      :dataSource="sampleLogList"
      :columns="columns"
      bordered
      class="operation_log_table"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'result'">
          <a style="color: 'blue'">{{ record.result }}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { columns } from "./index";
import {
  getLimsLogPage,
  LimsLogRespVO,
  LimsLogTypeEnum,
} from "@/api/lims/operatelog";
const sampleLogList = ref<LimsLogRespVO[]>([]);
const props = defineProps<{
  bizId: string;
}>();

onMounted(() => {});

const getSampleLogList = async (batchCode: string) => {
  const res = await getLimsLogPage({
    type: LimsLogTypeEnum.SAMPLE,
    bizId: props.bizId,
    traceId: batchCode,
    pageNo: 1,
    pageSize: 100,
  });
  sampleLogList.value = res.list;
};

const setSampleCode = (batchCode: string) => {
  getSampleLogList(batchCode);
};

defineExpose({
  setSampleCode,
});
</script>

<style lang="less" scoped>
.operation_log_box {
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

  .operation_log_table {
    padding: 24px;
  }

  // 调整表格样式
  :deep(.ant-table) {
    border-radius: 8px;

    th,
    td {
      padding: 8px 16px;
    }

    th {
      background-color: #f5f5f5;
    }
  }
}
</style>