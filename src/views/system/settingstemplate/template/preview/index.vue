<template>
  <div>
    <a-modal v-model:open="open" title="模板预览" width="1000px" :footer="null" :mask="false" :style="style">
      <a-spin :spinning="loading" tip="加载中...">
        <div>
          <PreviewTem ref="previewRef" :templateInfo="templateData" :updateData="updateData" :updatePDF="updatePDF" />
        </div>
      </a-spin>
    </a-modal>

    <!-- <PreviewTem
      ref="previewRef"
      :templateInfo="templateData"
      :updateData="updateData"
      :updatePDF="updatePDF"
      style="position: absolute; left: -99999px"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import PreviewTem from "../previewtem/index.vue";
// 导入病原体报告模板组件
import {
  getTemplateBackCoverContent,
  getTemplateContent,
  getTemplateCoverContent,
  templateData,
} from ".";
import {
  getDefaultEnabledReportTemplate,
  getReportTemplate,
} from "@/api/lims/report-template";
import { inputDomeModel } from "@/views/system/settingstemplatedetail/index.data";
import { getDownloadReportDetails } from "@/api/lims/analysisreport";
import { analysisReportDownloadRespVODemo } from "./data";
import { AnalysisReportDownloadRespVO } from "@/api/lims/analysisreport/model";
const props = defineProps<{
  taskId: number;
  sampleId: number;
  style?: Object;
}>();

// 控制Modal显示
const open = ref(false);

// 加载状态
const loading = ref(false);

// 当前页
const currentPage = ref(1);
// 自动播放
const autoplay = ref(false);

// 预览组件引用
const previewRef = ref<InstanceType<typeof PreviewTem>>();

// 模拟网络请求获取模板数据
const fetchTemplateData = async (
  id: number,
  taskId?: number,
  sampleId?: number
) => {
  // 显示加载中状态
  loading.value = true;
  templateData.id = id;

  const res = await getReportTemplate(id);

  const itemsData: inputDomeModel[] = JSON.parse(res.content!);

  let report: AnalysisReportDownloadRespVO;
  if (taskId === 0 && sampleId === 0) {
    report = analysisReportDownloadRespVODemo;
    report.sample.checkType = res.copyType || 1;
  } else {
    report = await getDownloadReportDetails(
      taskId || props.taskId,
      sampleId || props.sampleId
    );
  }

  // 模拟从服务器获取的数据
  const requestData = {
    id,
    title: `tNGS一步法报告——#${id}`,
    code: `TPL-${id.toString().padStart(4, "0")}`,
    createTime: new Date().toLocaleString(),
    content: `
       ${getTemplateContent(itemsData, report)}
        
        <style>
          /* 响应式设计 */
          .report-container {
            width: 100% !important;
            max-width: 210mm;
            margin: 0 auto;
            padding: 0 !important;
            font-family: "微软雅黑";
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
          }

.report-title {
  margin-bottom: 20px;
  text-align: center;
}

.report-title h1 {
  padding-bottom: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #0056b3;
  border-bottom: 1px solid #0056b3;
}

ol {
  padding: 0 10px 0 20px;
}

table {
  width: 100%;
  margin-top: 25px;
  font-size: 11px;
  table-layout: fixed;
  border-spacing: 0;
  border-collapse: collapse;
  break-inside: avoid;
  page-break-inside: avoid;
}

th,
td {
  padding: 2px;
  text-align: left;
  vertical-align: middle;
  border-right: 0.5px solid #b0c4de;
  border-bottom: 0.5px solid #b0c4de;
}

tr{
    page-break-inside: avoid;
    page-break-after: auto;
}

th:first-child,
td:first-child {
  border-left: 0.5px solid #b0c4de;
}

.table-center th,
.table-center td {
  text-align: center;
}

.td-first-item {
  border-left: none !important;
}

th {
  font-weight: bold;
  background-color: #f0f8ff;
}

.header-row {
  font-size: 12px;
  border: none !important;
}

.header-row th {
  padding: 8px;
  font-size: 14px;
  color: white;
  text-align: center;
  background-color: #06c;
  border-color: #06c !important;
}

.sub-header {
  font-weight: bold;
  text-align: left;
  background-color: #e6f2ff;
}

.section-header {
  font-weight: bold;
  background-color: #e6f7ff;
}

.label {
  width: 120px;
  font-weight: bold;
}

.note {
  padding: 10px;
  font-size: 11px;
  color: #666;
  text-align: left !important;
  background-color: #f9f9f9;
}

.signature-row-container {
  position: relative;
  min-height: 150px;
}

.signature-row {
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;

  /* background: red; */
}

/* 特定表格样式 */
.info-table {
  margin-top: 25px;
}

.result-table,
.drug-resistance-table,
.mutation-table,
.negative-table,
.clinical-advice,
.quality-control,
.test-description,
.references,
.pathogen-detail-table,
.resistance-gene-table,
.mutation-detail-table {
  margin-top: 25px;
}

.highlight-cell {
  font-weight: bold;
  color: #f00;
  background: rgb(255 245 245);
}

.pdf-page-break {
  position: relative;
  display: block;
  page-break-before: always;
  break-before: page; /* 针对新标准 */
}
        </style>
      `,
    coverContent: getTemplateCoverContent(itemsData, report),
    backCoverContent: getTemplateBackCoverContent(itemsData, report),
  };

  console.log(requestData);

  // 更新数据
  Object.assign(templateData, requestData);

  // 获取病原体报告的HTML
  await nextTick();

  await previewRef.value?.init({
    id: requestData.id,
    title: requestData.title,
    code: requestData.code,
    htmlContent: requestData.content,
    coverContent: requestData.coverContent,
    backCoverContent: requestData.backCoverContent,
  });
  loading.value = false;
};

// 显示模态框
const showModal = async (id: number, taskId?: number, sampleId?: number) => {
  console.log("预览模板ID:", id);
  open.value = true;

  // 默认设置为加载状态
  loading.value = true;

  // 清除之前的自动播放
  autoplay.value = false;

  // 清空之前的数据
  Object.assign(templateData, {
    id: 0,
    title: "",
    code: "",
    createTime: "",
    content: "",
  });

  currentPage.value = 1;

  // 获取新数据
  await fetchTemplateData(id, taskId, sampleId);
};

//打印PDF前的获取数据
const updateData = async (_: boolean) => {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
};

//打印PDF
const updatePDF = async (
  taskId?: number,
  sampleId?: number
): Promise<string | undefined> => {
  //获取选中的id
  const res = await getDefaultEnabledReportTemplate(sampleId || 0);
  await showModal(res.id!, taskId, sampleId);

  return previewRef.value?.exportPdf();
};

const setOpen = (opens: boolean) => {
  open.value = opens;
};

defineExpose({
  showModal,
  updatePDF,
  setOpen,
});
</script>
