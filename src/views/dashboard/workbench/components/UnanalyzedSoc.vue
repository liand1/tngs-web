<template>
  <a-card title="未分析的芯片数据" class="unanalyzed-soc">
    <template #extra>
      <a-button
        type="link"
        style="color: rgb(153 153 153 / 100%)"
        @click="handleViewAll"
        >查看全部</a-button
      ></template
    >
    <a-spin :spinning="loading">
      <a-row
        v-for="(item, index) in reportList"
        :key="index"
        class="report-row"
        type="flex"
      >
        <a-col flex="auto" class="report-col info-col">
          <div class="report-title">{{ item.socName }}</div>
          <div class="report-info">
            <span>芯片原名称: {{ item.sourceName }}</span>
          </div>
        </a-col>
        <a-col class="report-col status-col">
          <a-tag :color="getReportStatusColor(item.qcStatus || 0)">
            {{ getProcessStatusText(item.qcStatus || 0) }}
          </a-tag>
          <span class="report-time">{{
            useRender.renderDate(item.createTime)
          }}</span>
        </a-col>
        <a-col class="report-col btn-col">
          <a-button danger size="small" @click="handleAudit(item)">
            创建分析
          </a-button>
        </a-col>
      </a-row>
      <a-empty v-if="reportList.length === 0" description="暂无数据" />
    </a-spin>
  </a-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { QcStatusEnumMap, QcStatusEnum } from "@/enums/customEnum";
import { findNoCallSocListByLimit } from "@/api/lims/console";
import { SocSmallRespVO } from "@/api/lims/console/model";
import { useRender } from "@/components/Table/src/hooks/useRender";
import { useGo } from "@/hooks/web/usePage";

const go = useGo();

// 加载状态
const loading = ref(true);

// 审核报告列表
const reportList = ref<SocSmallRespVO[]>([]);

// 获取流程状态文本
function getProcessStatusText(status: QcStatusEnum): string {
  return QcStatusEnumMap[status] || "未知状态";
}

// 获取报告状态颜色
function getReportStatusColor(status: QcStatusEnum): string {
  // 审核未通过状态使用红色
  if (status === QcStatusEnum.FAIL) {
    return "red";
  }

  // 其他报告状态使用绿色
  return "green";
}

// 审核操作
function handleAudit(item: SocSmallRespVO) {
  go(`/lims/analysis-task/0/${item.id}`);
}

// 模拟从API加载数据
async function loadData() {
  loading.value = true;

  const res = await findNoCallSocListByLimit(5);

  reportList.value = res;

  loading.value = false;
}

// 组件挂载后加载数据
onMounted(() => {
  loadData();
});

function handleViewAll() {
  go("/soc");
}
</script>

<style scoped lang="less">
.unanalyzed-soc {
  border: none;

  :deep(.ant-card-head) {
    border-bottom: none;
  }

  :deep(.ant-card-body) {
    padding: 0 24px;
  }
}

.dynamic-info {
  padding: 8px 24px;
  background-color: #fff;
  border-radius: 8px;
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