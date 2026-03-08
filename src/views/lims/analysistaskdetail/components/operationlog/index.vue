<template>
  <div class="operation-log">
    <h2 class="title">操作日志</h2>
    <div class="content_box">
      <div v-if="loading" class="loading-container">
        <a-spin />
      </div>
      <a-table v-else :columns="columns" :data-source="operationLogList">
        <template #success="{ text }">
          <span style="color: #1890ff">{{ text }}</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "./index";
import {
  getLimsLogPage,
  LimsLogRespVO,
  LimsLogTypeEnum,
} from "@/api/lims/operatelog";

const loading = ref(true);

const operationLogList = ref<LimsLogRespVO[]>([]);

const taskId = ref<number>(0);

const traceId = ref<number>(0);

onMounted(() => {
  loading.value = false;
});

const setTaskId = async (id: number, traceIds: number) => {
  loading.value = true;
  taskId.value = id;
  traceId.value = traceIds;
  await getOperationLogList(id);
  loading.value = false;
};

const getOperationLogList = async (id: number) => {
  if (id === 0) return;
  const res = await getLimsLogPage({
    bizId: id.toString(),
    traceId: traceId.value.toString(),
    type: LimsLogTypeEnum.RESULT_REPORT,
    pageSize: 1000,
  });
  operationLogList.value = res.list;
};

defineExpose({
  setTaskId,
});
</script>

<style scoped lang="less">
.operation-log {
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
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
}
</style>