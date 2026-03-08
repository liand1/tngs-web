<template>
  <!-- PDF预览组件容器 -->
  <div v-if="isShow" class="preview-pdf-container">
    <!-- 隐藏的预览组件，用于获取PDF数据 -->
    <div style="position: absolute; left: -99999px">
      <Preview
        ref="previewRef"
        :taskId="taskIds"
        :sampleId="sampleIds"
        :style="{ position: 'absolute', left: '-99999px' }"
      />
    </div>

    <!-- PDF预览模态框 -->
    <a-modal
      v-model:open="isShowModal"
      title="报告详情"
      :footer="null"
      width="1300px"
      height="calc(100vh - 20px)"
      :style="{ top: '10px' }"
      :zIndex="1100"
      class="preview-pdf-modal"
      :wrapClassName="'preview-pdf-modal-wrap'"
    >
      <!-- vue-pdf-embed预览模式 -->
      <div class="pdf-preview" v-if="!isIframe">
        <!-- PDF工具栏 -->
        <div class="page-tool">
          <div
            class="page-tool-item"
            @click="lastPage"
            :style="{ opacity: state.pageNum <= 1 ? 0.5 : 1 }"
            :disabled="state.pageNum <= 1"
          >
            上一页
          </div>
          <div
            class="page-tool-item"
            @click="nextPage"
            :style="{ opacity: state.pageNum >= state.numPages ? 0.5 : 1 }"
            :disabled="state.pageNum >= state.numPages"
          >
            下一页
          </div>
          <div class="page-tool-item">
            {{ state.pageNum }}/{{ state.numPages }}
          </div>
          <div class="page-tool-item" @click="zoomIn">
            <i class="icon">+</i> 放大
          </div>
          <div class="page-tool-item" @click="zoomOut">
            <i class="icon">-</i> 缩小
          </div>
          <div class="page-tool-item">
            {{ (state.scale * 100).toFixed(0) }}%
          </div>
          <div class="page-tool-item" @click="downloadPdf">
            <i class="icon">↓</i> 下载
          </div>
        </div>
        <!-- PDF内容区域 -->
        <div class="pdf-wrap" ref="pdfWrapRef">
          <a-spin
            :spinning="loading"
            tip="PDF加载中..."
            size="large"
            class="custom-spin"
          >
            <div
              class="pdf-container"
              :style="{
                transform: `scale(${state.scale})`,
                transformOrigin: 'center top',
              }"
            >
              <vue-pdf-embed
                :source="pdfUrls"
                :page="state.pageNum"
                class="vue-pdf-embed"
                @rendered="onRendered"
              />
            </div>
          </a-spin>
        </div>
      </div>
      <!-- iframe预览模式 -->
      <div class="pdf-preview-iframe" v-else>
        <a-spin
          :spinning="loading"
          tip="生成报告中..."
          size="large"
          class="custom-spin"
        >
        </a-spin>
        <iframe
          ref="myIframe"
          :src="pdfUrls"
          width="100%"
          height="100%"
          v-if="!loading"
        ></iframe>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, ref, nextTick } from "vue";
// 使用 require 语法导入，解决 TypeScript 错误
// @ts-ignore
import VuePdfEmbed from "vue-pdf-embed";

import Preview from "@/views/system/settingstemplate/template/preview/index.vue";

// PDF 容器引用
const pdfWrapRef = ref<HTMLElement | null>(null);
const previewRef = ref<InstanceType<typeof Preview>>();

const myIframe = ref();

// 组件显示状态
const isShow = ref(false);
// 加载状态控制
const loading = ref(false);

// 组件属性定义
const props = defineProps({
  // PDF URL地址
  pdfUrl: {
    type: String,
    required: true,
  },
  // 是否使用iframe模式预览，默认为true
  isIframe: {
    type: Boolean,
    required: false,
    default: true,
  },
  // 任务ID
  taskId: {
    type: Number,
    required: true,
  },
  // 样本ID
  sampleId: {
    type: Number,
    required: true,
  },
});

// 模态框显示状态
const isShowModal = ref(false);

// 任务ID和样本ID
const taskIds = ref(0);
const sampleIds = ref(0);
// PDF URL
const pdfUrls = ref(props.pdfUrl);

// 扩展 Window 接口以支持 pdfjsLib
declare global {
  interface Window {
    pdfjsLib?: {
      getDocument: (src: string) => {
        promise: Promise<{
          numPages: number;
          [key: string]: any;
        }>;
      };
      [key: string]: any;
    };
  }
}

// 组件挂载后的初始化逻辑
onMounted(async () => {
  if (props.isIframe) {
    return;
  }
  // 在组件挂载后，尝试通过 PDF.js 直接加载获取页数
  if (pdfUrls.value) {
    try {
      loading.value = true; // 设置加载状态
      // 使用 setTimeout 延迟检查，确保 rendered 事件有足够时间触发
      setTimeout(() => {
        if (state.numPages === 0) {
          console.log("尝试通过 PDF.js 直接获取页数");
          // 如果全局有 pdfjsLib，使用它加载 PDF
          if (typeof window !== "undefined" && window.pdfjsLib) {
            const pdfjs = window.pdfjsLib;
            pdfjs
              .getDocument(pdfUrls.value)
              .promise.then((pdf) => {
                console.log("PDF.js 加载成功，页数:", pdf.numPages);
                state.numPages = pdf.numPages;
                loading.value = false; // 加载完成
              })
              .catch((err) => {
                console.error("PDF.js 加载失败:", err);
                loading.value = false; // 加载失败
              });
          } else {
            loading.value = false; // 没有 PDF.js 库
          }
        }
      }, 1000);
    } catch (error) {
      console.error("获取 PDF 页数失败:", error);
      loading.value = false; // 加载失败
    }
  }
});

// 初始化任务ID和样本ID
taskIds.value = props.taskId;
sampleIds.value = props.sampleId;

// PDF预览状态
const state = reactive({
  source: pdfUrls.value, // PDF源
  pageNum: 1, // 当前页码
  numPages: 0, // 总页数
  scale: 1, // 缩放比例，初始值为1（100%）
});

// 监听缩放比例变化
watch(
  () => state.scale,
  (newScale) => {
    console.log("缩放比例已更新:", newScale);
  }
);

/**
 * PDF渲染完成回调
 */
function onRendered() {
  loading.value = false;
}

/**
 * 跳转到上一页
 */
function lastPage() {
  if (state.pageNum > 1) {
    state.pageNum -= 1;
  }
}

/**
 * 跳转到下一页
 */
function nextPage() {
  if (state.pageNum < state.numPages) {
    state.pageNum += 1;
  }
}

/**
 * 放大PDF显示
 */
function zoomIn() {
  // 限制最大缩放比例为2倍（200%）
  const newScale = Math.min(2, state.scale + 0.1);
  state.scale = parseFloat(newScale.toFixed(1));
  console.log("放大至", state.scale);
  // 调整滚动位置
  adjustScrollAfterZoom();
}

/**
 * 缩小PDF显示
 */
function zoomOut() {
  // 限制最小缩放比例为0.5倍（50%）
  const newScale = Math.max(0.5, state.scale - 0.1);
  state.scale = parseFloat(newScale.toFixed(1));
  console.log("缩小至", state.scale);
  // 调整滚动位置
  adjustScrollAfterZoom();
}

/**
 * 缩放后调整滚动位置，保持视图中心
 */
function adjustScrollAfterZoom() {
  if (!pdfWrapRef.value) return;

  const container = pdfWrapRef.value;
  // 计算缩放后需要滚动的位置
  const centerY = container.scrollTop + container.clientHeight / 2;
  const scrollRatio = centerY / container.scrollHeight;

  // 使用 setTimeout 以确保在 DOM 更新后调整滚动位置
  setTimeout(() => {
    container.scrollTop =
      container.scrollHeight * scrollRatio - container.clientHeight / 2;
  }, 10);
}

/**
 * 下载PDF文件
 */
function downloadPdf() {
  if (!pdfUrls.value) return;

  try {
    // 使用 fetch API 获取 PDF 文件的二进制数据
    fetch(pdfUrls.value)
      .then((response) => {
        if (!response.ok) {
          throw new Error("网络响应异常");
        }
        return response.blob();
      })
      .then((blob) => {
        // 创建 blob URL
        const blobUrl = URL.createObjectURL(blob);

        // 创建一个临时链接元素
        const link = document.createElement("a");
        link.href = blobUrl;

        // 从URL中提取文件名
        const fileName = pdfUrls.value.split("/").pop() || "document.pdf";
        link.download = fileName;

        // 设置样式为不可见
        link.style.display = "none";

        // 添加到文档中并点击
        document.body.appendChild(link);
        link.click();

        // 清理
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl); // 释放 blob URL
        }, 100);
      })
      .catch((error) => {
        console.error("下载PDF文件时出错:", error);
        // 如果通过 fetch 下载失败，回退到原始方法
        fallbackDownload();
      });
  } catch (error) {
    console.error("下载PDF时发生异常:", error);
    // 如果主方法失败，回退到原始方法
    fallbackDownload();
  }
}

/**
 * 备用下载方法
 */
function fallbackDownload() {
  if (!pdfUrls.value) return;

  // 创建一个临时链接元素
  const link = document.createElement("a");
  link.href = pdfUrls.value;
  // 明确设置 download 属性
  const fileName = pdfUrls.value.split("/").pop() || "document.pdf";
  link.download = fileName;
  link.setAttribute("download", fileName);
  // 移除 target 属性，避免在新标签页打开
  // link.target = '_blank';

  // 模拟点击
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
}

/**
 * 设置组件显示状态和加载PDF
 * @param options 配置选项
 * @param options.isShows 是否显示组件
 * @param options.pdfUrl 可选，直接设置PDF URL
 * @param options.taskId 可选，任务ID
 * @param options.sampleId 可选，样本ID
 */
const setIsShow = async (options: {
  isShows: boolean;
  pdfUrl?: string;
  taskId?: number;
  sampleId?: number;
}): Promise<string | undefined> => {
  isShow.value = options.isShows;
  isShowModal.value = true;

  let PdfUrl = options.pdfUrl;

  // 如果直接提供了PDF URL，则直接使用
  if (options.pdfUrl) {
    pdfUrls.value = options.pdfUrl;
  } else {
    // 否则通过taskId和sampleId获取PDF
    if (options.taskId) {
      taskIds.value = options.taskId;
    }
    if (options.sampleId) {
      sampleIds.value = options.sampleId;
    }
    await nextTick();

    loading.value = true; // 开始加载 PDF

    const res = await previewRef.value?.updatePDF(
      taskIds.value,
      sampleIds.value
    );
    pdfUrls.value = res || "";
    loading.value = false;

    PdfUrl = res;
  }

  // 关闭预览组件
  previewRef.value?.setOpen(false);

  return PdfUrl;
};

const refresh = async () => {
  await nextTick();
  // 2. 通过重新设置src来刷新iframe
  const currentUrl = pdfUrls.value
  pdfUrls.value = '' // 先清空
  setTimeout(() => {
    pdfUrls.value = currentUrl // 添加时间戳避免缓存
  }, 10)
}

// 导出方法
defineExpose({
  setIsShow,
  refresh,
});
</script>

<style scoped lang="less">
/* PDF预览区域样式 */
.pdf-preview {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px 0;
  background: #e9e9e9;
}

/* iframe预览模式样式 */
.pdf-preview-iframe {
  width: 100%;
  height: 100%;

  iframe {
    border: none;
  }
}

/* PDF容器样式 */
.pdf-wrap {
  display: flex;
  flex: 1;
  justify-content: center;
  height: calc(100vh - 120px);
  margin-top: 10px;
  overflow: auto;
}

/* PDF缩放容器样式 */
.pdf-container {
  display: inline-block;
  transition: transform 0.2s ease;
}

/* vue-pdf-embed组件样式 */
.vue-pdf-embed {
  box-sizing: border-box;
  width: 515px;
  margin: 0 auto;
  text-align: center;
  border: 1px solid #e5e5e5;
}

/* 自定义加载中样式 */
.custom-spin {
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 300px;
}

/* PDF工具栏样式 */
.page-tool {
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  margin: 0 auto;
  color: white;
  background: rgb(66 66 66);
  border-radius: 19px;
}

/* 工具栏项目样式 */
.page-tool-item {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 8px 15px;
  padding-left: 10px;
  cursor: pointer;
}

/* 图标样式 */
.icon {
  font-size: 16px;
  font-style: normal;
  font-weight: bold;
}
</style>

<style lang="less">
/* 模态框样式 - 使用全局样式确保高度正确 */
.preview-pdf-modal-wrap {
  /* 外层容器 */
  & > div {
    /* 模态框容器 */
    & > div {
      height: 100%;

      /* 模态框内容区 */
      .ant-modal-content {
        height: 100%;
      }
    }

    /* 模态框主体区域 */
    .ant-modal-body {
      height: calc(100vh - 68px);
    }
  }
}
</style>