<template>
  <div>
    <!-- 顶部的任务详情 -->
    <PageHeader
      ref="headerRef"
      :taskDetail="taskDetail"
      :updateReportTemplateList="updateReportTemplateList"
      @refreshTaskDetail="refreshTaskDetail"
      @preview="handlePreview"
      @showSelectModal="showSelectModal"
      @goFullScreen="goFullScreen"
    />

    <!-- 业务流程 -->
    <BusinessProcess
      :findAnalysisReportDetails="findAnalysisReportDetails"
      @uploadTaskeport="uploadTaskeport"
    />

    <!-- 分析结果报告 -->
    <ReportResult
      ref="rrRef"
      :taskDetail="taskDetail"
      :findAnalysisReportDetails="findAnalysisReportDetails"
      :showTitle="true"
      :highlightKeyInfo="highlightKeyInfo"
      :activeKey="activeKey"
      @setThatReport="setThatReport"
      @refreshTaskDetail="refreshTaskDetail"
      @uploadTaskeport="uploadTaskeport"
      @preview="handlePreview"
      @auditAgainReport="auditReport2"
      @updateSampleSuccess="updateSampleSuccess"
      @goFullScreen="goFullScreen"
      @highlightChange="highlightChange"
      @tabChange="tabChange"
    />

    <!-- 操作日志 -->
    <OperationLog ref="operationLogRef" />

    <!-- 报告下载-->
    <PreviewPDF
      ref="previewPDFRef"
      :pdfUrl="previewUrl"
      :taskId="taskId"
      :sampleId="sampleId"
    />

    <!-- 下载PDF -->
    <ServerPreview ref="serverPreviewRef" :taskId="0" :sampleId="0" />

    <div class="download-pdf-tips" v-if="remainingDownloadCount > 0">
      <a-alert
        :message="`报告生成中，请不要切换页面,剩余生成数量：${remainingDownloadCount}`"
        banner
      />
    </div>

    <!-- 创建模板 -->
    <SelectTemplateModal
      ref="templateRef"
      @update-template-selection="updateReportTemplate"
    />

    <FullResultModal ref="fullResultRef" 
      :taskDetail="taskDetail"
      :findAnalysisReportDetails="findAnalysisReportDetails"
      :highlightKeyInfo="highlightKeyInfo"
      :activeKey="activeKey"
      @setThatReport="setThatReport"
      @refreshTaskDetail="refreshTaskDetail"
      @uploadTaskeport="uploadTaskeport"
      @preview="handlePreview"
      @auditAgainReport="auditReport2"
      @updateSampleSuccess="updateSampleSuccess"
      @highlightChange="highlightChange"
      @tabChange="tabChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getAnalysisAuditTask } from "@/api/lims/analysistask"; // 假设接口路径
import PageHeader from "./components/pageheader/index.vue";
import BusinessProcess from "./components/businessprocess/index.vue";
import ReportResult from "./components/reportresult/index.vue";
import OperationLog from "./components/operationlog/index.vue";
import { initReport, initReportDetail, taskDetail } from ".";
import { AnalysisReportAuditRespVO } from "@/api/lims/analysistask/model";
import { getReportDetail } from "../analysistaskdetail";
import { FindAnalysisReportDetailsModel } from "../analysistaskdetail/model";
import PreviewPDF from "@/components/PreviewPDF/index.vue";
import FullResultModal from "./components/reportresult/fullResultModal.vue";
import SelectTemplateModal from "./components/template/SelectTemplateModal.vue";
// import { updateAnalysisReportFileUrl } from "@/api/lims/analysisreport";
import ServerPreview from "@/views/system/settingstemplate/template/serverpreview/index.vue";
// import BatchDownload from "@/components/PreviewPDF/batchdownload.vue";

// import { mountVueComponent } from "@/utils/mountVueComponent";
import { ReportTemplateBaseVO } from "@/api/lims/report-template/model";
import { mitt } from '@/utils/mitt'
import { message } from "ant-design-vue";
const route = useRoute();
const taskIds = route.params.id as string; // 从路由中获取任务ID
const loading = ref(true);
const operationLogRef = ref<typeof OperationLog>();
const rrRef = ref<typeof ReportResult>();
const headerRef = ref<typeof PageHeader>();
const templateRef = ref<typeof SelectTemplateModal>();
const previewPDFRef = ref<InstanceType<typeof PreviewPDF>>();
const fullResultRef = ref<typeof FullResultModal>();
const previewUrl = ref("");
const taskId = ref(parseInt(taskIds));
const sampleId = ref(0);
const highlightKeyInfo = ref<Boolean>(true);
const activeKey = ref<string>("1");
//剩余下载数量
const remainingDownloadCount = ref(0);
const updateReportTemplateList = ref([]);

const sampleEmitter = mitt();

const serverPreviewRef = ref<InstanceType<typeof ServerPreview>>();
//当前选中的样本数据
const thatReport = ref<AnalysisReportAuditRespVO>(initReport);

const findAnalysisReportDetails =
  ref<FindAnalysisReportDetailsModel>(initReportDetail);

// 方法一：使用ref直接引用模板中的组件（推荐）
// const batchDownloadRef = ref<InstanceType<typeof BatchDownload>>();

// const batchDownloadFunctionObj: any = {};

// 方法二：如果确实需要动态创建组件
onMounted(async () => {
  await refreshTaskDetail(true);

  // try {
  //   const previewPdfContainerBatch = document.getElementById(
  //     "preview-pdf-container-batch"
  //   );

  //   if (previewPdfContainerBatch) {
  //     mountVueComponent(BatchDownload, {
  //       container: previewPdfContainerBatch,
  //       props: {
  //         // someProp: "value",
  //         onReady: ({ setIsShow }) => {
  //           batchDownloadFunctionObj.setIsShow = setIsShow;
  //           // setTimeout(() => {
  //           //   batchDownload(
  //           //     findAnalysisReportDetails.value.taskId,
  //           //     findAnalysisReportDetails.value.sampleId,
  //           //     thatReport.value.id
  //           //   );
  //           // }, 500);
  //         },
  //       },
  //       onReady: (instance) => {
  //         batchDownloadRef.value = instance;
  //         // 成功拿到组件实例后，调用其方法
  //         // instance.batchDownload?.(
  //         //   findAnalysisReportDetails.value.taskId,
  //         //   findAnalysisReportDetails.value.sampleId,
  //         //   thatReport.value.id
  //         // );
  //       },
  //     });
  //   } else {
  //     console.error("找不到容器元素 preview-pdf-container-batch");
  //   }
  // } catch (error) {
  //   console.error("获取容器元素失败:", error);
  // }

  // 自动批量下载的逻辑改为只执行一次，而不是每500ms执行
  // setTimeout(() => {
  //   batchDownload(
  //     findAnalysisReportDetails.value.taskId,
  //     findAnalysisReportDetails.value.sampleId,
  //     thatReport.value.id
  //   );
  // }, 500);
});

const refreshTaskDetail = async (isfirst: boolean = false) => {
  try {
    const res = await getAnalysisAuditTask(parseInt(taskId.value));
    // debugger;
    taskDetail.value = res;

    // 如果有报告列表且不为空，设置第一个报告为当前选中报告
    if (isfirst) {
      thatReport.value = res?.reportList?.[0] || initReport;

      if (
        taskDetail.value.reportList &&
        taskDetail.value.reportList.length > 0 &&
        taskDetail.value.reportList[0].id
      ) {
        operationLogRef.value?.setTaskId(
          taskDetail.value.reportList[0].id,
          taskIds
        );
      }
    }

    if (res.reportList && res.reportList.length > 0) {
      await setThatReport(thatReport.value);
    }

    rrRef.value?.setTaskDetil(taskDetail.value);
    fullResultRef.value?.setTaskDetil(taskDetail.value);
    // headerRef.value?.setTaskDetil(taskDetail.value);

    loading.value = false;
  } catch (error) {
    console.error("获取任务详情失败:", error);
    loading.value = false;
  }
};

//调整当前选中的样本数据
const setThatReport = async (report?: AnalysisReportAuditRespVO) => {
  if (report) {
    thatReport.value = report;
    console.log("选中的报告:", report);
    operationLogRef.value?.setTaskId(report.id, taskIds);

    if(report.checkType == 1 && (activeKey.value == '3' || activeKey.value == '4')) {
      activeKey.value = '1';
    }
  }

  try {
    // 获取选中报告的详细信息
    const reportDetail = await getReportDetail(
      thatReport.value.taskId.toString(),
      thatReport.value.sampleId.toString()
    );

    // 更新报告详情
    findAnalysisReportDetails.value = reportDetail;
    console.log("报告详情:", reportDetail);

    // 这里可以更新其他UI组件或处理报告详情数据
    rrRef.value?.setSelectIndex(report?.id);
    
  } catch (error) {
    console.error("获取报告详情失败:", error);
  }
};

const handlePreview = (url: string) => {
  previewUrl.value = url;
  previewPDFRef.value?.setIsShow({
    isShows: true,
    pdfUrl: url,
  });
};

//上传分析结果表
// 生成报告
const uploadTaskeport = async () => {
  // debugger;
  // const url = await previewPDFRef.value?.setIsShow({
  //   isShows: true,
  //   taskId: findAnalysisReportDetails.value.taskId,
  //   sampleId: findAnalysisReportDetails.value.sampleId,
  // });

  // if (url && url.length > 0) {
  //   await updateAnalysisReportFileUrl(thatReport.value.id, url);

  //   await nextTick();

  //   await refreshTaskDetail();
  // }
  remainingDownloadCount.value++;
  serverPreviewRef.value
    ?.downloadPdf({
      taskId: findAnalysisReportDetails.value.taskId,
      sampleId: findAnalysisReportDetails.value.sampleId,
      reportId: thatReport.value.id,
    })
    .then((res: boolean) => {
      if (res) {
        message.success("报告生成成功");
      }
    })
    .catch((err: any) => {
      console.error("报告生成失败:", err);
    })
    .finally(() => {
      remainingDownloadCount.value--;

      refreshTaskDetail();
    });
};

/**
 * 弹出选择模板弹框
 */
const showSelectModal = (report:any) => {
  templateRef.value?.showModal(report.templateId, report.id, report.checkType);
}

/**
 * 审核重出报告
 */
const auditReport2 = async () => {
remainingDownloadCount.value++;
  serverPreviewRef.value
    ?.downloadPdf({
      taskId: findAnalysisReportDetails.value.taskId,
      sampleId: findAnalysisReportDetails.value.sampleId,
      reportId: thatReport.value.id,
      againReportFlag: 1,
    })
    .then((res: boolean) => {
      if (res) {
        message.success("重出报告成功");
      }
    })
    .catch((err: any) => {
      console.error("重出报告失败:", err);
    })
    .finally(() => {
      remainingDownloadCount.value--;

      refreshTaskDetail();
      //预览pdf的iframe需要刷新
      previewPDFRef.value?.refresh();
    });
}

// 修改模板
const updateReportTemplate = async (templateId:number, reportId:number) => {
  remainingDownloadCount.value++;
  updateReportTemplateList.value.push(reportId);
  serverPreviewRef.value
    ?.downloadPdf({
      id: templateId,
      taskId: findAnalysisReportDetails.value.taskId,
      sampleId: findAnalysisReportDetails.value.sampleId,
      reportId: reportId,
      againReportFlag: 1,
    })
    .then((res: boolean) => {
      if (res) {
        message.success("报告成功重新生成");
      }
    })
    .catch((err: any) => {
      console.error("报告重新生成失败:", err);
    })
    .finally(() => {
      remainingDownloadCount.value--;
      let updateReportList = [...updateReportTemplateList.value];
      let idx = updateReportList.findIndex(item => item === reportId);
      if(idx > -1) {
        updateReportList.splice(idx, 1);
      }
      updateReportTemplateList.value = [...updateReportList];
      refreshTaskDetail();
      //预览pdf的iframe需要刷新
      previewPDFRef.value?.refresh();
    });
};

const updateSampleSuccess = async (sampleData) => {
  let reportList = taskDetail.value.reportList;
  if(reportList && reportList.length > 0) {
    let idx = reportList.findIndex(item => item.sampleId == sampleData.id);
    if(idx > -1) {
      reportList[idx].examineeName = sampleData.examinee.name;
    }
  }
  taskDetail.value.reportList = reportList;
  // findAnalysisReportDetails.value.sample = sampleData;
  // findAnalysisReportDetails.value.sample.examineeName = sampleData.examinee.name;
  // findAnalysisReportDetails.value.sample.examinee.name = sampleData.examinee.name;

  try {
    // 获取选中报告的详细信息
    const reportDetail = await getReportDetail(
      thatReport.value.taskId.toString(),
      thatReport.value.sampleId.toString()
    );

    // 更新报告详情
    findAnalysisReportDetails.value = reportDetail;
    console.log("报告详情:", reportDetail);
  } catch (error) {
    console.error("获取报告详情失败:", error);
  }
}

const goFullScreen = (reportId: number) => {
  fullResultRef.value?.showModal(reportId);
}

const highlightChange = (value:Boolean) => {
  highlightKeyInfo.value = value;
}

const tabChange = (value:string) => {
  activeKey.value = value;
}

onMounted(() => {
  sampleEmitter.on('sample-update-success', (sampleData) => {
    console.log('sampleData', sampleData);
  })
});


// onMounted(() => {
//   setInterval(() => {
//     uploadTaskeport();
//   }, 1000);
// });

// 下载PDF
// const downloadPdf = (item: ReportTemplateBaseVO) => {
//   serverPreviewRef.value
//     ?.downloadPdf({
//       taskId: findAnalysisReportDetails.value.taskId,
//       sampleId: findAnalysisReportDetails.value.sampleId,
//       reportId: thatReport.value.id,
//     })
//     .then((res: boolean) => {
//       if (res) {
//         message.success("下载成功");
//       }
//     });
// };

// const batchDownload = async (
//   taskId: number,
//   sampleId: number,
//   reportId: number
// ) => {
//   batchDownloadFunctionObj?.setIsShow({
//     isShows: true,
//     taskId: taskId,
//     sampleId: sampleId,
//     reportId: reportId,
//   });
// };
</script>




<style lang="less" scoped>
.download-pdf-tips {
  position: fixed;
  top: 8px;
  left: 50%;
  z-index: 1001;
  transform: translateX(-50%);
}
</style>