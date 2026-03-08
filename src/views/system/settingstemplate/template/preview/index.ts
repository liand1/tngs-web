import { createVNode, reactive, render, RendererElement, RendererNode, VNode } from "vue";
import template01 from "../template/contents/template01.vue";
import template02 from "../template/contents/template02.vue";
import { inputDomeModel } from "@/views/system/settingstemplatedetail/index.data";
import coverTemplate from "../template/cover.vue";
import backCoverTemplate from "../template/backcover.vue";
import { AnalysisReportDownloadRespVO } from "@/api/lims/analysisreport/model";
// 模板数据
export const templateData = reactive({
  id: 0,
  title: "",
  code: "",
  coverContent: "",
  backCoverContent: "",
  content: "",
});

export const contentStyle = {
  default: ` <style>
          /* 响应式设计 */
          .report-container {
            width: 100% !important;
            max-width: 210mm;
            margin: 0 auto;
            padding: 0 !important;
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
            margin-bottom: 25px;
            font-size: 11px;
            table-layout: fixed;
            border-spacing: 0;
            border-collapse: collapse;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          
            tr{
                page-break-inside: avoid;
                page-break-after: auto;
            }


          th,
          td {
            padding: 2px;
            text-align: left;
            vertical-align: middle;
            border-right: 0.5px solid #b0c4de;
            border-bottom: 0.5px solid #b0c4de;
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

          .signature-item {
            float: left;
            width: 24.9%;
          }

          .signature-row {
            position: absolute;
            bottom: 0;
            width: 100%;
          }

          /* 特定表格样式 */
          .info-table {
            margin-bottom: 25px;
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
            margin-bottom: 25px;
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
        </style>`
}

// 获取模板中间内容样式
export const getComtentStyle = (templateId = 1) => {
  if (templateId === 1) {
    return contentStyle.default
  }
  return ""
}


// 获取模板中间内容
export const getTemplateContent = (itemsData: inputDomeModel[], report: AnalysisReportDownloadRespVO) => {
  // 创建一个容器元素
  const container = document.createElement("div");
  const checkType = report.sample.checkType;
  // 创建Vue组件的虚拟节点
  const vnode = createVNode(checkType == 1 ? template01 : template02, { itemsData, report });

  // 将虚拟节点渲染到容器中
  render(vnode, container);
  // 获取组件的HTML内容
  return container.innerHTML
}




// 获取模板封面内容
export const getTemplateCoverContent = (itemsData: inputDomeModel[], report: AnalysisReportDownloadRespVO) => {
  const container = document.createElement("div");
  const checkType = report.sample.checkType;
  const vnode = createVNode(coverTemplate, { itemsData, type: checkType, report })
  render(vnode, container);
  return container.innerHTML
}



// 获取模板封底内容
export const getTemplateBackCoverContent = (itemsData: inputDomeModel[], report: AnalysisReportDownloadRespVO) => {
  const container = document.createElement("div");
  const checkType = report.sample.checkType;
  const vnode = createVNode(backCoverTemplate, { itemsData, type: checkType })
  render(vnode, container);
  return container.innerHTML
}