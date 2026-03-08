<template>
  <div>
    <div class="title">
      <h2>下载管理</h2>
    </div>
    <a-card title="下载列表" style="margin: 0 12px">
      <a-table
        :columns="columns"
        :data-source="reportDownloadList"
        :loading="loading"
        :pagination="false"
        bordered
        @change="handleTableChange"
        >
        <template #bodyCell="{ column, record }" >
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="downloadPDF(record)">下载</a-button>
          </template>
          <template v-if="column.key === 'status'">
            <a-button type="link" style="color: #1890FF;">成功</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

  </div>
</template>

<script setup lang="ts">
import { getReportDownloadPage } from "@/api/lims/report-download";
import { ReportDownloadRespVO } from "@/api/lims/report-download/model";
import { ref, onMounted, reactive } from "vue";
import { downLoadUrl } from "@/utils/custom";
import { useMessage } from "@/hooks/web/useMessage";
import { columns } from './index.data'

const { createMessage } = useMessage();

// 版本列表数据
const reportDownloadList = ref<ReportDownloadRespVO[]>([]);
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ["10", "20", "50", "100"],
});

// 处理表格变化（分页、排序、筛选）
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadData();
};

//下载报告
const downloadPDF = async (record: Recordable) => {
  createMessage.info("下载中...");
  downLoadUrl(record.downloadUrl, record.taskName + "-报告.pdf");
  createMessage.success("下载成功");
};

// 加载版本数据
const loadData = async () => {
  loading.value = true;

  const res = await getReportDownloadPage({
    pageNo: 1,
    pageSize: 10,
  });

  reportDownloadList.value = res.list;

  loading.value = false;
  // 真实项目中应该调用API
  // getreportDownloadList({
  //   page: pagination.current,
  //   pageSize: pagination.pageSize,
  // }).then(res => {
  //   reportDownloadList.value = res.data.list;
  //   pagination.total = res.data.total;
  //   loading.value = false;
  // }).catch(() => {
  //   loading.value = false;
  // });
};

// 组件挂载后加载数据
onMounted(() => {
  loadData();
});
</script>

<style scoped lang="less">
.ant-btn-link {
  padding: 0;
}

.title {
  margin: 0 0 20px 24px;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  h3 {
    font-size: 16px;
  }
}
</style>