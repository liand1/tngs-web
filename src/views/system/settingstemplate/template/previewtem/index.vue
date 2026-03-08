<template>
  <div
    class="template-preview-container"
    :style="{ minWidth: `${pageSize.width + 20}px` }"
  >
    <a-spin :spinning="loading">
      <div class="controls-wrapper" v-if="pagination.show">
        <div class="controls-container">
          <!-- 分页控制 -->
          <pagination-control
            :show="pagination.show"
            :current-page="currentPage"
            :total-pages="getAdjustedTotalPages()"
            :show-page-info="pagination.showPageInfo"
            :show-footer="false"
            @prev-page="prevPage"
            @next-page="nextPage"
            @page-change="setCurrentPage"
            ref="paginationRef"
          />

          <!-- 自动播放控制 -->
          <autoplay-control
            :show="autoplay.show"
            :interval="autoplay.interval"
            :total-pages="getAdjustedTotalPages()"
            :current-page="currentPage"
            @page-change="setCurrentPage"
            @autoplay-change="handleAutoplayChange"
            ref="autoplayRef"
          />

          <!-- PDF导出按钮 -->
          <pdf-export-button
            :title="templateData.title"
            :code="templateData.code"
            :disabled="!htmlContent"
            :is-empty="!htmlContent"
            :before-export="prepareExport"
            :after-export="cleanupAfterExport"
            @export-start="isExporting = true"
            @export-complete="isExporting = false"
            :update-data="updateDatas"
            ref="exportRef"
          />
        </div>
      </div>

      <!-- 改为单页容器 -->
      <div class="single-page-container" ref="pagesContainer">
        <!-- 封面页 -->
        <div
          v-if="coverContent"
          class="a4-page cover-page"
          :style="{
            width: `${pageSize.width}px`,
            height: `${pageSize.height}px`,
            display: currentPage === 1 ? 'flex' : 'none',
            padding: '0px',
            backgroundColor: 'none',
          }"
          ref="coverPageRef"
        >
          <div class="template-content">
            <div class="preview-content">
              <div v-html="coverContent"></div>
            </div>
          </div>
        </div>

        <!-- 主内容页 -->
        <div
          class="a4-page"
          :style="{
            width: `${pageSize.width}px`,
            height: `${pageSize.height + 40}px`,
            display: isMainContentVisible ? 'flex' : 'none',
            padding: '40px 40px 0 40px',
            margin: '10px',
          }"
        >
          <div class="template-content">
            <div v-if="!htmlContent" class="empty-content">暂无预览数据</div>
            <div v-else class="preview-content">
              <!-- 基于CSS columns的分页内容容器 -->
              <div class="columns-container">
                <!-- 内容容器，所有内容都在这个容器中 -->
                <div
                  ref="columnsContentRef"
                  class="columns-content"
                  v-html="htmlContent"
                  :style="{
                    left: `calc((${
                      pageSize.width - 80
                    }px + 40px) * (1 - ${getAdjustedMainContentPage()}))`,
                    columnCount: totalPageCount,
                    columnWidth: `${pageSize.width - 80}px`,
                  }"
                ></div>
              </div>

              <!-- 隐藏元素-用于PDF导出 -->
              <div
                id="pdf-export-content"
                class="pdf-export-content"
                :style="{
                  display: 'none',
                }"
                ref="pdfExportRef"
              >
                <div class="pdf-body" v-html="htmlContent"></div>
              </div>
            </div>
          </div>

          <div class="template-footer" ref="columnsFooterRef">
            <!-- 移除页脚分页控件 -->
            <div class="page-info" v-if="pagination.show">
              第 {{ getDisplayPageNumber() }} 页 / 共
              {{ getAdjustedTotalPages() }} 页
            </div>
          </div>
        </div>

        <!-- 封底页 -->
        <div
          v-if="backCoverContent"
          class="a4-page back-cover-page"
          :style="{
            width: `${pageSize.width}px`,
            height: `${pageSize.height}px`,
            display: currentPage === getAdjustedTotalPages() ? 'flex' : 'none',
            padding: '0px',
            backgroundColor: 'none',
          }"
          ref="backCoverPageRef"
        >
          <div class="template-content">
            <div class="preview-content">
              <div v-html="backCoverContent"></div>
            </div>
          </div>
        </div>

        <!-- 页面翻页箭头组件 -->
        <page-arrows
          v-if="pagination.show && pageArrows.show"
          :show="true"
          :current-page="currentPage"
          :total-pages="getAdjustedTotalPages()"
          :size="pageArrows.size"
          :edge-distance="pageArrows.edgeDistance"
          :icon-size="pageArrows.iconSize"
          @prev-page="prevPage"
          @next-page="nextPage"
          @page-change="setCurrentPage"
          ref="pageArrowsRef"
        />
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  nextTick,
} from "vue";
import { pageSizeInPixels, calculateContentPageCount } from "./index";
import {
  PageStyleType,
  PaginationConfigType,
  AutoplayConfigType,
  PageArrowsConfigType,
} from "./model";

// 导入组件
import PaginationControl from "./components/PaginationControl.vue";
import AutoplayControl from "./components/AutoplayControl.vue";
import PdfExportButton from "./components/PdfExportButton.vue";
import PageArrows from "./components/PageArrows.vue";

// 定义组件的props
const props = defineProps({
  // 模板信息
  templateInfo: {
    type: Object,
    default: {
      id: 0,
      title: "",
      code: "",
      coverContent: "",
      backCoverContent: "",
    },
  },

  // 分页控制相关配置
  pagination: {
    type: Object as () => PaginationConfigType,
    default: () => ({
      // 是否显示翻页功能
      show: true,
      // 是否在页面底部显示页码信息
      showPageInfo: true,
    }),
  },

  // 自动播放控制相关配置
  autoplay: {
    type: Object as () => AutoplayConfigType,
    default: () => ({
      // 是否显示自动播放按钮
      show: true,
      // 自动播放间隔（毫秒）
      interval: 5000,
    }),
  },

  // 页面箭头相关配置
  pageArrows: {
    type: Object as () => PageArrowsConfigType,
    default: () => ({
      // 是否显示页面两侧翻页箭头
      show: true,
      // 翻页箭头大小
      size: 32,
      // 翻页箭头距离边缘距离
      edgeDistance: 10,
      // 翻页箭头图标大小
      iconSize: 20,
    }),
  },

  // 页面样式相关配置
  pageStyle: {
    type: Object as () => PageStyleType,
    default: () => ({
      // 纸张类型
      paperSize: "A4",
      // 纸张方向
      orientation: "portrait",
    }),
    validator: (val: PageStyleType) => {
      const { paperSize, orientation } = val;
      return (
        ["A3", "A4", "B3", "B4"].includes(paperSize) &&
        ["portrait", "landscape"].includes(orientation)
      );
    },
  },
  updateData: {
    type: Function as () => any,
    default: (_: boolean) => ({}),
  },
  updatePDF: {
    type: Function as PropType<() => any>,
    default: () => {},
  },
});

const updateDatas = props.updateData;

// 页面尺寸
const pageSize = ref({
  width: 595.28,
  height: 841.89,
});

// 加载状态
const loading = ref(false);
// 导出状态
const isExporting = ref(false);
// 当前页
const currentPage = ref(1);
// 总页数 - 根据内容和页面大小计算
const totalPageCount = ref(1);
// 自动播放
const autoplay = ref(false);
// 页面容器引用
const pagesContainer = ref<HTMLElement | null>(null);

// 内容容器引用
const columnsContentRef = ref<HTMLElement | null>(null);

// 页脚
const columnsFooterRef = ref<HTMLElement | null>(null);

// PDF导出内容区域
const pdfExportRef = ref<HTMLElement | null>(null);

// 组件引用
const paginationRef = ref<InstanceType<typeof PaginationControl>>();
const autoplayRef = ref<InstanceType<typeof AutoplayControl>>();
const exportRef = ref<InstanceType<typeof PdfExportButton>>();
const pageArrowsRef = ref<typeof PageArrows | null>(null);

// 模板数据
const templateData = reactive({
  id: props.templateInfo.id || 0,
  title: props.templateInfo.title || "",
  code: props.templateInfo.code || "",
  createTime: new Date().toLocaleString(),
});

// HTML内容
const htmlContent = ref<string>("");
// 封面HTML内容
const coverContent = ref<string>(props.templateInfo.coverContent || "");
// 封底HTML内容
const backCoverContent = ref<string>(props.templateInfo.backCoverContent || "");
// 是否显示封面
const showCover = ref<boolean>(!!props.templateInfo.coverContent);
// 是否显示封底
const showBackCover = ref<boolean>(!!props.templateInfo.backCoverContent);

// 封面页引用
const coverPageRef = ref<HTMLElement | null>(null);
// 封底页引用
const backCoverPageRef = ref<HTMLElement | null>(null);

// 计算是否应该显示主内容
const isMainContentVisible = computed(() => {
  // 如果当前页是第一页且有封面，则不显示主内容
  if (currentPage.value === 1 && coverContent.value) {
    return false;
  }

  // 如果当前页是最后一页且有封底，则不显示主内容
  if (currentPage.value === getAdjustedTotalPages() && backCoverContent.value) {
    return false;
  }

  // 其他情况显示主内容
  return true;
});

// 获取调整后的页数（包含封面和封底）
const getAdjustedTotalPages = () => {
  let pages = totalPageCount.value;
  if (coverContent.value) pages++;
  if (backCoverContent.value) pages++;
  return pages;
};

// 获取显示的页码
const getDisplayPageNumber = () => {
  return currentPage.value;
};

// 获取调整后的主内容页码（用于计算内容偏移）
const getAdjustedMainContentPage = () => {
  // 如果有封面且当前页大于1，则内容页码需要减1
  return coverContent.value ? currentPage.value - 1 : currentPage.value;
};

// 初始化页面尺寸和设置事件监听
onMounted(() => {
  // 安全获取页面样式属性
  const paperSize = (props.pageStyle as any).paperSize || "A4";
  const orientation = (props.pageStyle as any).orientation || "portrait";

  const size = pageSizeInPixels(
    paperSize as any,
    orientation as "portrait" | "landscape"
  );

  if (size) {
    pageSize.value = size;
  }

  // 如果props中提供了初始内容，则自动初始化
  if (props.templateInfo) {
    // 设置模板基本信息
    setTemplateInfo({
      id: props.templateInfo.id,
      title: props.templateInfo.title,
      code: props.templateInfo.code,
    });

    // 计算初始内容的页数（如果已经设置了内容）
    if (htmlContent.value) {
      calculatePageCount();
    }
  }
});

// 组件销毁前清除定时器和事件监听
onBeforeUnmount(() => {
  if (autoplayRef.value) {
    autoplayRef.value.stopAutoplay();
  }
});

// 计算内容页数
const calculatePageCount = async () => {
  if (htmlContent.value) {
    // 使用新的页数计算函数
    const pageCount = await calculateContentPageCount(
      htmlContent.value,
      pageSize.value
    );

    // 设置基本内容的页数
    totalPageCount.value = pageCount;

    // 触发更新所有页数相关的组件
    updateAllPageControls();
  } else {
    totalPageCount.value = 1;
  }

  // 检查当前页是否在有效范围内
  validateCurrentPage();
};

// 更新所有分页控件
const updateAllPageControls = () => {
  if (paginationRef.value) {
    // 强制刷新分页控件
    paginationRef.value.$forceUpdate?.();
  }
  if (autoplayRef.value) {
    // 强制刷新自动播放控件
    autoplayRef.value.$forceUpdate?.();
  }
  if (pageArrowsRef.value) {
    // 强制刷新翻页箭头控件
    pageArrowsRef.value.$forceUpdate?.();
  }
};

// 确保当前页在有效范围内
const validateCurrentPage = () => {
  const totalPages = getAdjustedTotalPages();
  if (currentPage.value > totalPages) {
    currentPage.value = totalPages;
  }
};

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// 下一页
const nextPage = () => {
  const totalPages = getAdjustedTotalPages();
  if (currentPage.value < totalPages) {
    currentPage.value++;
  } else if (autoplay.value) {
    // 如果是自动播放模式且已到最后一页，则回到第一页
    currentPage.value = 1;
  }
};

// 设置当前页
const setCurrentPage = (page: number) => {
  const totalPages = getAdjustedTotalPages();
  if (page >= 1 && page <= totalPages) {
    currentPage.value = page;
  }
};

// 处理自动播放状态变化
const handleAutoplayChange = (value: boolean) => {
  autoplay.value = value;
};

// 准备导出PDF
const prepareExport = async () => {
  // 设置全局加载状态
  loading.value = true;

  // 保存当前状态和临时容器的引用变量
  let tempContainer: HTMLElement | null = null;

  const savedState = {
    currentPage: currentPage.value,
    autoplay: autoplay.value,
    showCover: showCover.value,
    showBackCover: showBackCover.value,
  };

  // 准备导出元素
  if (exportRef.value) {
    let contentElements: HTMLElement[] = [];

    // 创建封面元素的副本（如果有）
    if (coverContent.value && coverPageRef.value) {
      // 创建封面的深度克隆
      const coverClone = coverPageRef.value.cloneNode(true) as HTMLElement;
      // 修改克隆元素样式，确保在PDF中正确显示
      coverClone.style.display = "block";
      const coverWidth = pageSize.value.width;
      const coverHeight = pageSize.value.height;
      coverClone.style.width = `${coverWidth}px`;
      coverClone.style.height = `${coverHeight}px`;
      coverClone.style.margin = "0";
      coverClone.style.padding = "0px";
      coverClone.style.boxSizing = "border-box";
      contentElements.push(coverClone);
    }

    // 创建主内容元素
    if (pdfExportRef.value) {
      // 创建主内容的深度克隆
      const contentClone = pdfExportRef.value.cloneNode(true) as HTMLElement;
      // 修改主内容样式
      contentClone.style.display = "block";
      contentElements.push(contentClone);
    }

    // 创建封底元素的副本（如果有）
    if (backCoverContent.value && backCoverPageRef.value) {
      // 创建封底的深度克隆
      const backCoverClone = backCoverPageRef.value.cloneNode(
        true
      ) as HTMLElement;
      // 修改克隆元素样式
      backCoverClone.style.display = "block";
      const backWidth = pageSize.value.width;
      const backHeight = pageSize.value.height;
      backCoverClone.style.width = `${backWidth}px`;
      backCoverClone.style.height = `${backHeight}px`;
      backCoverClone.style.margin = "0";
      backCoverClone.style.padding = "0";
      backCoverClone.style.boxSizing = "border-box";
      contentElements.push(backCoverClone);
    }

    // 添加临时元素到文档中便于导出
    tempContainer = document.createElement("div");
    tempContainer.id = "pdf-export-container";
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "-9999px";
    tempContainer.style.visibility = "hidden";
    tempContainer.style.padding = "0px";
    tempContainer.style.margin = "0px";
    // 将克隆的元素添加到临时容器
    contentElements.forEach((el) => tempContainer!.appendChild(el));
    document.body.appendChild(tempContainer);

    // 在返回之前记录一下临时容器
    console.log(
      "临时导出容器创建成功，元素数量:",
      tempContainer.childElementCount
    );

    // 如果只有一个元素，则直接导出
    if (contentElements.length === 1) {
      exportRef.value?.setContentElement(contentElements[0]);
    } else {
      // 多个元素时使用合并导出
      exportRef.value?.setContentElements(
        Array.from(tempContainer.children) as HTMLElement[]
      );
    }
  }

  return { savedState, tempContainer };
};

// 清理导出后状态
const cleanupAfterExport = async (result?: {
  savedState: any;
  tempContainer: HTMLElement | null;
}) => {
  // 延迟关闭加载状态，确保用户感知到操作完成
  loading.value = false;

  if (result) {
    const { savedState, tempContainer } = result;

    // 恢复状态
    if (savedState) {
      currentPage.value = savedState.currentPage;
      autoplay.value = savedState.autoplay;
      showCover.value = savedState.showCover;
      showBackCover.value = savedState.showBackCover;
    }

    // 清除临时容器
    if (tempContainer && document.body.contains(tempContainer)) {
      console.log("清理临时导出容器");
      document.body.removeChild(tempContainer);
    }
  }
};

// 设置HTML内容
const setContent = async (content: string) => {
  try {
    console.log("setContent被调用, 内容长度:", content?.length);
    if (!content) {
      console.warn("传入的HTML内容为空");
      htmlContent.value = "";
      totalPageCount.value = 1;
      currentPage.value = 1;
      loading.value = false;
      return;
    }

    loading.value = true;

    // 停止任何可能正在进行的自动播放
    if (autoplayRef.value) {
      autoplayRef.value.stopAutoplay();
    }
    autoplay.value = false;

    // 重置当前页
    currentPage.value = 1;

    // 设置HTML内容
    htmlContent.value = content;

    // 计算页数
    await calculatePageCount();

    // 标记加载完成
    loading.value = false;
  } catch (error) {
    console.error("设置内容时出错:", error);
    totalPageCount.value = 1;
    loading.value = false;
  }
};

// 设置模板信息
const setTemplateInfo = (info: {
  id?: number;
  title?: string;
  code?: string;
  coverContent?: string;
  backCoverContent?: string;
}) => {
  if (info.id) templateData.id = info.id;
  if (info.title) templateData.title = info.title;
  if (info.code) templateData.code = info.code;

  // 设置封面和封底内容
  if (info.coverContent !== undefined) {
    setCoverContent(info.coverContent);
  }

  if (info.backCoverContent !== undefined) {
    setBackCoverContent(info.backCoverContent);
  }
};

// 设置封面内容
const setCoverContent = (content: string) => {
  const hadCoverBefore = !!coverContent.value;
  coverContent.value = content;
  showCover.value = !!content;

  // 如果封面状态改变，需要更新分页控件
  if (hadCoverBefore !== !!content) {
    updateAllPageControls();
  }

  validateCurrentPage();
};

// 设置封底内容
const setBackCoverContent = (content: string) => {
  const hadBackCoverBefore = !!backCoverContent.value;
  backCoverContent.value = content;
  showBackCover.value = !!content;

  // 如果封底状态改变，需要更新分页控件
  if (hadBackCoverBefore !== !!content) {
    updateAllPageControls();
  }

  validateCurrentPage();
};

// 初始化组件
const init = async (params: {
  id?: number;
  title?: string;
  code?: string;
  htmlContent: string;
  coverContent?: string;
  backCoverContent?: string;
}) => {
  console.log("init方法被调用, 内容长度:", params.htmlContent?.length);

  // 清除之前的自动播放
  if (autoplayRef.value) {
    autoplayRef.value.stopAutoplay();
  }
  autoplay.value = false;

  // 清空之前的数据并设置新数据
  Object.assign(templateData, {
    id: params.id || props.templateInfo.id || 0,
    title: params.title || props.templateInfo.title || "",
    code: params.code || props.templateInfo.code || "",
    createTime: new Date().toLocaleString(),
  });

  // 重置页面状态
  htmlContent.value = "";
  coverContent.value = "";
  backCoverContent.value = "";
  showCover.value = false;
  showBackCover.value = false;
  currentPage.value = 1;
  loading.value = true;

  try {
    // 设置HTML内容
    if (params.htmlContent) {
      // 设置HTML内容
      htmlContent.value = params.htmlContent;

      await nextTick();

      //pdf上面边距的设置
      const allMargin = 40;

      const clinicalAdviceDom: HTMLElement =
        columnsContentRef.value?.querySelector(
          ".clinical-advice"
        ) as HTMLElement;
      const clinicalAdviceDomHeight = clinicalAdviceDom?.offsetHeight;

      const clinicalAdvicePageDom: HTMLElement =
        pdfExportRef.value?.querySelector(
          ".clinical-advice-page"
        ) as HTMLElement;

      const signatureRowDom: HTMLElement = pdfExportRef.value?.querySelector(
        ".signature-row-container"
      ) as HTMLElement;
      // const signatureRowDomHeight = signatureRowDom?.offsetHeight;
      const signatureRowDomHeight = 150;
      // const signatureRowDomHeight = signatureRowDom?.offsetHeight;
      if (clinicalAdviceDom && signatureRowDom) {
        const allHeight = pageSize.value.height - allMargin;

        console.log(
          allHeight,
          clinicalAdviceDomHeight,
          signatureRowDomHeight,
          clinicalAdviceDom?.offsetHeight
        );

        if (clinicalAdviceDomHeight > allHeight - signatureRowDomHeight) {
          console.log("临床建议高度大于页面高度，需要分页");
          signatureRowDom.style.position = "relative";
          signatureRowDom.classList.add("before-break");
          signatureRowDom.style.height = allHeight + "px";

          clinicalAdvicePageDom.style.height = "auto";
          clinicalAdvicePageDom.style.position = "inherit";
        } else {
          signatureRowDom.style.position = "static";
          signatureRowDom.style.height = "auto";
          signatureRowDom.classList.remove("before-break");

          clinicalAdvicePageDom.style.height = allHeight + "px";
          clinicalAdvicePageDom.style.position = "relative";
        }

        console.log("临床建议和签名栏存在", clinicalAdviceDom, signatureRowDom);
      }

      // 计算页数
      await calculatePageCount();
    }

    // 设置封面内容，优先使用参数中的，其次使用props中的
    const cover =
      params.coverContent !== undefined
        ? params.coverContent
        : props.templateInfo.coverContent;

    if (cover) {
      coverContent.value = cover;
      showCover.value = true;
    }

    // 设置封底内容，优先使用参数中的，其次使用props中的
    const backCover =
      params.backCoverContent !== undefined
        ? params.backCoverContent
        : props.templateInfo.backCoverContent;

    if (backCover) {
      backCoverContent.value = backCover;
      showBackCover.value = true;
    }

    // 标记加载完成
    loading.value = false;
  } catch (error) {
    console.error("初始化失败:", error);
    loading.value = false;
  }
};

// 导出组件方法
defineExpose({
  // 初始化和内容控制
  init,
  setContent,
  setTemplateInfo,
  setCoverContent,
  setBackCoverContent,

  // PDF导出
  exportPdf: () => exportRef.value?.exportPdf(),

  // 页面导航
  prevPage,
  nextPage,
  setCurrentPage,
  getCurrentPage: () => currentPage.value,
  getTotalPages: () => getAdjustedTotalPages(),

  // 自动播放控制
  startAutoplay: () => autoplayRef.value?.startAutoplay(),
  stopAutoplay: () => autoplayRef.value?.stopAutoplay(),

  // 封面和封底控制
  showCover: (show: boolean) => {
    showCover.value = show;
    validateCurrentPage();
  },
  showBackCover: (show: boolean) => {
    showBackCover.value = show;
    validateCurrentPage();
  },

  // 获取当前配置
  getConfig: () => ({
    templateInfo: {
      ...templateData,
      coverContent: coverContent.value,
      backCoverContent: backCoverContent.value,
    },
    pagination: {
      show: props.pagination.show,
      showPageInfo: props.pagination.showPageInfo,
    },
    autoplay: { show: props.autoplay.show, interval: props.autoplay.interval },
    pageArrows: { ...props.pageArrows },
    pageStyle: {
      paperSize: (props.pageStyle as any).paperSize,
      orientation: (props.pageStyle as any).orientation,
    },
  }),
});
</script>

<style lang="less" scoped>
.template-preview-container {
  display: flex;
  flex-direction: column;
  min-height: 600px;
  padding: 20px 0;
  overflow: auto;
  background-color: #f0f2f5;
}

.controls-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 10%);
}

.controls-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  padding: 10px 0;
}

.single-page-container {
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.a4-page {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  overflow: hidden;
  background-color: white;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  transition: all 0.3s ease;
}

.cover-page,
.back-cover-page {
  margin: 0 20px;

  .template-content {
    height: 100%;

    .preview-content {
      height: 100%;

      > div {
        height: 100%;
      }
    }
  }
}

.template-content {
  position: relative;
  flex: 1;
  overflow: hidden;

  .empty-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    font-size: 16px;
    color: #bfbfbf;
  }

  .preview-content {
    position: relative;
    height: 100%;
    overflow: hidden;

    .columns-container {
      position: relative;
      height: 100%;
      overflow: hidden;

      &::before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        width: 1px;
        content: "";
        background: transparent;
      }
    }

    .columns-content {
      position: relative;
      column-gap: 40px;
      height: 100%;
      transition: left 0.3s ease;
      column-fill: auto;
      column-rule: 1px solid #f0f0f0;
    }
  }
}

.template-footer {
  padding-top: 0;
  margin: 40px 0 15px;
  text-align: center;
  // border-top: 1px solid #e8e8e8;

  .page-info {
    font-size: 12px;
    // color: #8c8c8c;
  }
}
</style>
