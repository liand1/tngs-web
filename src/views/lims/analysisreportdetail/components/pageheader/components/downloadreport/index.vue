<template>
  <div class="download-report-container">
    <a-drawer
      v-model:open="visible"
      placement="right"
      trigger="click"
      :width="500"
      :title="`报告下载-${taskDetail.name}`"
      overlay-class-name="download-report-popover"
      :auto-adjust-overflow="true"
      :get-popup-container="(triggerNode) => triggerNode.parentNode"
    >
      <!-- <template #title>
        <a-row class="header-row">
          <a-col :span="8" class="header-col"> 报告下载 </a-col>
          <a-col
            :span="8"
            class="header-col"
            :offset="8"
            style="text-align: right"
          >
            <CloseOutlined @click="closeModal" />
          </a-col>
        </a-row>
      </template> -->
      <div class="report-download">
        <!-- 提示信息 -->
        <div class="tip">二审通过后的样本，将按照样本字段【送检单位】选择匹配的模板生成结果报告。</div>
        
        <div>选择下载格式</div>
        <div style="margin-bottom: 12px;">
          <a-checkbox-group v-model:value="fileTypes" name="checkboxgroup" :options="plainOptions" />
        </div>

        <div>选择需要下载的报告</div>
        <!-- <div class="tip">预览均为pdf格式，样本报告如需修改点击修改模板</div> -->
        <div class="tip">预览均为pdf格式</div>
        <!-- 复选框列表 -->
        <a-checkbox
          v-model:checked="selectAll"
          @change="handleSelectAll"
          class="checkbox-all"
        >
          全部
        </a-checkbox>
        <a-checkbox-group
          v-model:value="selectedReports"
          class="checkbox-group"
        >
          <div v-if="filteredReports.length === 0" class="no-data">
            <a-empty description="暂无可下载的报告" />
          </div>
          <div
            v-else
            v-for="report in filteredReports"
            :key="report.id"
            class="checkbox-item"
          >
            <a-checkbox :value="report.sampleId.toString()">
              <div class="report-item">
                <span class="report-name">{{ report.sampleCode }}</span>
                <span>
                  <a-spin v-if="filterReportId(report.id)"></a-spin>
                <a-button
                  v-else
                  type="link"
                  @click="showTemplate(report)"
                  >修改模板</a-button>
                <a-button
                  type="link"
                  @click="previewReport(report.reportFileUrl)"
                  >预览</a-button>
                </span>
              </div>
            </a-checkbox>
          </div>
        </a-checkbox-group>
      </div>
      <!-- 按钮组 -->
        <template #footer>
          <div class="button-group">
            <a-button @click="closeModal">取消</a-button>
            <a-button type="primary" @click="confirmAndDownload"
              >确认并下载</a-button
            >
          </div>
        </template>
    </a-drawer>
    <!-- <a-button
      key="3"
      @click="uploadAnalysisResultTable"
      style="margin-right: 8px"
    >
      <DownloadOutlined />
      下载分析结果表
    </a-button> -->
    <a-button key="3" @click="toggleVisible">
      <DownloadOutlined />
      下载报告
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { message } from "ant-design-vue";

import { AnalysisTaskAuditRespVO } from "@/api/lims/analysistask/model";
import { downLoadUrl } from "@/utils/custom";
import { FileResponseTypeEnum } from "@/enums/customEnum";
import { exportPdfPreviewReport } from "@/api/lims/analysisreport";

const plainOptions = [
  { label: 'PDF格式', value: 'pdf' },
  { label: 'Word格式', value: 'word' },
];

const props = defineProps<{
  taskDetail: AnalysisTaskAuditRespVO;
  updateReportTemplateList: [];
  // filteredReports: [];
}>();

// 定义 emit 来触发父组件的预览函数
const emit = defineEmits(["preview", "showSelectModal"]);

// 全选状态
const selectAll = ref(false);

//下载格式
const fileTypes = ref<string[]>(['pdf', 'word']);

// 选中的报告
const selectedReports = ref<string[]>([]);

// Popover 可见状态
const visible = ref<boolean>(false);

// 切换 Popover 可见状态
const toggleVisible = () => {
  visible.value = !visible.value;
};

// 获取已通过二审的报告
const filteredReports = computed(() => {
  return (
    props.taskDetail.reportList?.filter(
      (report) => report.reportFileUrl != null
    ) || []
  );
  // 如果需要过滤二审通过的报告，请取消下面注释并导入 TwoAuditStatusEnum
});

const filterReportId = (id:number) => {
  let idx = props.updateReportTemplateList.findIndex(item => item === id);
  return idx > -1;
};


// 预览报告 - 通过emit触发父组件的预览功能
const previewReport = (reportFileUrl: string | undefined) => {
  if (!reportFileUrl) {
    message.warning("报告文件URL为空");
    return;
  }

  const pdfUrl = `${reportFileUrl}?type=${FileResponseTypeEnum.PREVIEW}`;

  emit("preview", pdfUrl);
};

const showTemplate = (report:any) => {
  // spinning.value = true;
  // markReport(report.id).then(() => {
    emit("showSelectModal", report);
  // }).finally(() => {
    // spinning.value = false;
  // })
}

// 全选功能
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedReports.value =
      filteredReports.value?.map((report) => report.sampleId.toString()) || [];
  } else {
    selectedReports.value = [];
  }
};

// 确认并下载
const confirmAndDownload = async () => {
  if (selectedReports.value.length === 0) {
    message.warning("请选择至少一个报告");
    return;
  }
  if(fileTypes.value.length === 0) {
    message.warning("请选择至少一种下载格式");
    return;
  }
  console.log(selectedReports.value);
  message.success(`已确认并下载${selectedReports.value.length}个报告`);

  // 导出指定pdf预览报告
  const res = await exportPdfPreviewReport(
    props.taskDetail.id,
    selectedReports.value.join(","),
    fileTypes.value.join(","),
  );

  if (res) {
    downLoadUrl(res, props.taskDetail.name + "报告.zip");
    message.success("下载成功");
  } else {
    message.error("下载失败");
  }

  // const reportFileUrls: { url: string; fileName: string }[] = [];

  // selectedReports.value.forEach((reportId) => {
  //   const report = props.taskDetail.reportList?.find(
  //     (report) => report.id.toString() === reportId
  //   );
  //   if (report && report.reportFileUrl) {
  //     reportFileUrls.push({
  //       url: report.reportFileUrl,
  //       fileName: report.sampleCode + "-报告.pdf",
  //     });
  //   }
  // });
  // if (reportFileUrls && reportFileUrls.length > 0) {
  //   downloadReport(reportFileUrls, props.taskDetail.name + "报告.zip");
  // }

  closeModal();
};

// 关闭模态框
const closeModal = () => {
  visible.value = false;
};
</script>

<style lang="less" scoped>
.download-report-container {
  display: inline-block;
}

.report-download {
  box-sizing: border-box;
  // width: 400px;
  // padding: 12px;

  .tip {
    font-size: 13px;
    margin-bottom: 12px;
    padding-top: 8px;
    color: #999;
  }

  // .checkbox-all {
  // }

  .checkbox-group {
    width: 100%;
    //max-height: 200px;
    margin: 12px 0 0 12px;
    overflow-y: auto;

    :deep(label) {
      position: relative;
      flex: 1;
      width: 100%;

      & > span:last-child {
        display: flex;
        flex: 1;
        justify-content: space-between;
        overflow: hidden;
      }
    }

    .no-data {
      padding: 24px 0;
      text-align: center;
    }

    .checkbox-item {
      width: 100%;
      margin-bottom: 8px;

      .report-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .report-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 64px;
  // border-top: 1px solid rgb(240 240 240 / 100%);

  .ant-btn {
    margin-right: 8px;
  }
}

.header-row {
  padding: 0 24px;
  line-height: 56px;
  border-bottom: 1px solid rgb(240 240 240 / 100%);

  .header-col {
    font-size: 16px;
    font-weight: normal;
  }
}

:deep(.download-report-popover) {
  padding: 0 !important;
}
</style>