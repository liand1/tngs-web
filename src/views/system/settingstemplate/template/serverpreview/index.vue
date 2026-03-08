<template>
  <div v-if="type === previewTypeEnum.VIEW">
    <a-modal v-model:open="open" title="模板预览" width="1000px" :footer="null" :mask="false" :style="style">
      <a-spin :spinning="loading" tip="加载中...">
        <!-- 隐藏元素-用于PDF导出 -->
        <div :style="{
          backgroundColor: 'rgb(243 243 243)',
          height: '700px',
          width: '100%',
          overflow: 'auto',
          padding: '50px 0',
        }">
          <div id="pdf-export-content" class="pdf-export-content" ref="columnsContentRef" :style="{
            width: size.width + 'px',
            backgroundColor: '#fff',
            margin: '0 auto',
          }">
            <div class="pdf-body" v-html="htmlContent"></div>
          </div>

          <iframe v-if="pefUrl" :src="pefUrl" width="100%" height="100%" style="border: none"></iframe>
        </div>
      </a-spin>
    </a-modal>
  </div>

  <div v-else-if="type === previewTypeEnum.DOWNLOAD" id="pdf-export-content" class="pdf-export-content"
    ref="columnsContentRef" :style="{
      width: size.width + 'px',
      backgroundColor: '#fff',
      margin: '0 auto',
      position: 'absolute',
      left: '-99999px',
    }">
    <div class="pdf-body" v-html="htmlContent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
// 导入病原体报告模板组件
import {
  getComtentStyle,
  getTemplateBackCoverContent,
  getTemplateContent,
  getTemplateCoverContent,
} from "../preview/index";
import {
  getDefaultEnabledReportTemplate,
  getReportTemplate,
  getReportTemplateByReportId,
} from "@/api/lims/report-template";
import { inputDomeModel } from "@/views/system/settingstemplatedetail/index.data";
import { getDownloadReportDetails } from "@/api/lims/analysisreport";
import { analysisReportDownloadRespVODemo } from "../preview/data";
import { AnalysisReportDownloadRespVO } from "@/api/lims/analysisreport/model";
import { pageSizeInPixels } from "../previewtem";
import { invoicePdf, invoiceWord } from "@/api/lims/pdf";
import { ReportTemplateBaseVO } from "@/api/lims/report-template/model";
import { previewTypeEnum } from ".";
const props = defineProps<{
  taskId: number;
  sampleId: number;
  style?: Object;
}>();

const type = ref(previewTypeEnum.UNKNOWN);

const htmlContent = ref("");

const pefUrl = ref("");

// 控制Modal显示
const open = ref(false);

// 加载状态
const loading = ref(false);

const downloadLoading = ref(false);

const columnsContentRef = ref<HTMLElement>();

const size = ref(pageSizeInPixels("A4", "portrait"));

// console.log("size", size.value);

const downLoadDataAry: (() => Promise<void>)[] = [];

// 模拟网络请求获取模板数据
const fetchTemplateData = async ({
  id,
  taskId,
  sampleId,
  reportId,
  againReportFlag,
  changeTemplateFlag,
}: {
  id: number;
  taskId?: number;
  sampleId?: number;
  reportId: number;
  againReportFlag?: number;
  changeTemplateFlag: number;
}) => {
  // 显示加载中状态
  loading.value = true;
  downloadLoading.value = true;

  return new Promise(async (resolve) => {
    let res:ReportTemplateBaseVO;
    if(changeTemplateFlag === 1) {
      res = await getReportTemplate(id);
    } else {
      res = await getReportTemplateByReportId(id, reportId);
    }

    const itemsData: inputDomeModel[] = JSON.parse(res.content!);

    let report: AnalysisReportDownloadRespVO;
    try {
      if (
        (taskId === 0 && sampleId === 0) ||
        (taskId === undefined && sampleId === undefined)
      ) {
        report = analysisReportDownloadRespVODemo;
        report.sample.checkType = res.copyType || 1;
      } else {
        report = await getDownloadReportDetails(
          taskId || props.taskId,
          sampleId || props.sampleId
        );
      }
    } catch (error) {
      console.error(error);
      downloadLoading.value = false;
      if (downLoadDataAry.length > 0) {
        downLoadDataAry.shift()?.();
      }
      resolve(null);
      return;
    }
    // const templateType:number = res.copyType || 0;
    // 模拟从服务器获取的数据
    const requestData = {
      id,
      title: `tNGS一步法报告——#${id}`,
      code: `TPL-${id.toString().padStart(4, "0")}`,
      createTime: new Date().toLocaleString(),
      content: getTemplateContent(itemsData, report),
      contentStyle: getComtentStyle(),

      coverContent: getTemplateCoverContent(itemsData, report),
      backCoverContent: getTemplateBackCoverContent(itemsData, report),
    };
    await calculateContentHeight(
      `<div style="height:${size.value.height}px;position: relative;" class="cover-content">${requestData.coverContent}</div>` +
      `<div style="margin:20px;" class="content-html"> ${requestData.content} </div>` +
      `<div style="height:${size.value.height}px;position: relative;" class="back-cover-content">${requestData.backCoverContent}</div>`
    );

    await nextTick();

    loading.value = false;

    const uploadData = {
      harderHtml: replaceC(replaceBr(requestData.coverContent)),
      contentHtml: replaceC(
        replaceBr(
          columnsContentRef.value?.querySelector(".content-html")?.innerHTML ||
          ""
        )
      ),
      contentStyle: requestData.contentStyle,
      footerHtml: replaceC(replaceBr(requestData.backCoverContent)),
      pageNo: 1,
      pageSize: 1,
      reportId: reportId || 0,
      taskId: taskId || 0,
      templateId: id,
      againReportFlag: againReportFlag || 0,
    };

    if (type.value !== previewTypeEnum.VIEW) {
      invoicePdf(uploadData)
        .then((res) => {
          resolve(res);
        })
        .catch((_) => {
          resolve(null);
        });
    }

    downloadLoading.value = false;
    if (downLoadDataAry.length > 0) {
      downLoadDataAry.shift()?.();
    }
  }).catch((err) => {
    console.error(err);
    return Promise.resolve(false);
  });
};

const replaceBr = (html: string) => {
  return html
    .replace(/<br[^>]*>/g, "<br />")
    .replace(/<img([^>]*)>/g, "<img$1 />");
};

const replaceC = (html: string) => {
  return html.replace(/℃/g, "°C");
};

// 计算内容高度问题
const calculateContentHeight = async (html: string) => {
  // 设置HTML内容
  htmlContent.value = html;

  await nextTick();

  //pdf上面边距的设置
  const allMargin = 40;

  const clinicalAdviceDom: HTMLElement = columnsContentRef.value?.querySelector(
    ".clinical-advice"
  ) as HTMLElement;
  const clinicalAdviceDomHeight = clinicalAdviceDom?.offsetHeight;

  const clinicalAdvicePageDom: HTMLElement =
    columnsContentRef.value?.querySelector(
      ".clinical-advice-page"
    ) as HTMLElement;

  const signatureRowDom: HTMLElement = columnsContentRef.value?.querySelector(
    ".signature-row-container"
  ) as HTMLElement;

  const signatureRowDomHeight = 150;
  if (clinicalAdviceDom && signatureRowDom) {
    const allHeight = size.value.height - allMargin;

    if ((clinicalAdviceDomHeight % allHeight) > allHeight - signatureRowDomHeight) {

      console.log("临床建议高度大于页面高度，需要分页");
      signatureRowDom.style.position = "relative";
      signatureRowDom.classList.add("pdf-page-break");
      signatureRowDom.style.height = allHeight + "px";

      clinicalAdvicePageDom.style.height = "auto";
      clinicalAdvicePageDom.style.position = "inherit";
    } else {
      signatureRowDom.style.position = "static";
      signatureRowDom.style.height = "auto";
      signatureRowDom.classList.remove("pdf-page-break");

      clinicalAdvicePageDom.style.height = (Math.ceil(clinicalAdviceDomHeight / allHeight) * allHeight) + "px";
      clinicalAdvicePageDom.style.position = "relative";
    }
  }
};

// 显示模态框
const showModal = async (
  id: number,
  taskId?: number,
  sampleId?: number,
  reportId?: number
) => {
  if (type.value === previewTypeEnum.UNKNOWN) {
    type.value = previewTypeEnum.VIEW;
  }
  open.value = true;

  // 默认设置为加载状态
  loading.value = true;

  // 下载PDF
  return downloadPdf({ id, taskId, sampleId, reportId });
};

//报告模板id
const templateId = ref(0);
const getTemplateId = async (sampleId:number) => {
  const res = await getDefaultEnabledReportTemplate(sampleId);
  templateId.value = res.id!;
  return res.id;
};

//下载PDF
const downloadPdf = async ({
  id,
  taskId,
  sampleId,
  reportId,
  againReportFlag,
}: {
  id?: number;
  taskId?: number;
  sampleId?: number;
  reportId?: number;
  againReportFlag?: number;
}) => {
  if (type.value === previewTypeEnum.UNKNOWN) {
    type.value = previewTypeEnum.DOWNLOAD;
  }
  let changeTemplateFlag = 1;
  if (!id || id === undefined) {
  // if (id === undefined && templateId.value === 0) {
    changeTemplateFlag = 0;
    await getTemplateId(sampleId || 0);
  }

  return new Promise((resolve) => {
    const data = {
      id: id || templateId.value,
      taskId: taskId,
      sampleId: sampleId,
      reportId: reportId,
      againReportFlag: againReportFlag,
      changeTemplateFlag: changeTemplateFlag,
    };

    if (downloadLoading.value) {
      downLoadDataAry.push(async () => {
        const res = await fetchTemplateData(data);
        resolve(res);
      });
    } else {
      // 获取新数据
      fetchTemplateData(data).then((res) => {
        resolve(res);
      });
    }
  });
};

const setOpen = (opens: boolean) => {
  open.value = opens;
};

defineExpose({
  showModal,
  setOpen,
  downloadPdf,
});
</script>
