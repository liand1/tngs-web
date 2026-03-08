<template>
  <!-- PDF预览组件容器 -->
  <div class="preview-pdf-container">
    <!-- 隐藏的预览组件，用于获取PDF数据 -->
    <div style="position: absolute; left: -99999px">
      <Preview ref="previewRef" :taskId="0" :sampleId="0" />
    </div>

    <!-- PDF预览模态框 -->
    <!-- <a-modal
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
      {{ taskExecuteing }}
    </a-modal> -->

    <!-- <div
      style="position: fixed; top: 100px; right: 50px"
      class="alert-container"
    >
      <Alert
        :message="`报告生成中，还剩下${executeTaskList.length}个报告生成中`"
        type="warning"
        show-icon
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
// 使用 require 语法导入，解决 TypeScript 错误
// @ts-ignore
import VuePdfEmbed from "vue-pdf-embed";

import Preview from "@/views/system/settingstemplate/template/preview/index.vue";
import { updateAnalysisReportFileUrl } from "@/api/lims/analysisreport";
import { Alert } from "ant-design-vue";

interface ExecuteTaskOptions {
  taskId: number;
  sampleId: number;
  reportId: number;
}

const previewRef = ref<InstanceType<typeof Preview>>();

// 组件显示状态
const isShow = ref(false);

// 模态框显示状态
const isShowModal = ref(false);

//任务执行中
const taskExecuteing = ref(false);

const executeTaskList = ref<ExecuteTaskOptions[]>([]);

/**
 * 设置组件显示状态和加载PDF
 * @param options 配置选项
 * @param options.isShows 是否显示组件
 * @param options.pdfUrl 可选，直接设置PDF URL
 * @param options.taskId 可选，任务ID
 * @param options.sampleId 可选，样本ID
 * @param options.reportId 可选，报告ID
 */
const setIsShow = async (options: {
  isShows: boolean;
  taskId: number;
  sampleId: number;
  reportId: number;
}) => {
  isShow.value = options.isShows;
  isShowModal.value = true;

  if (taskExecuteing.value) {
    executeTaskList.value.push({
      taskId: options.taskId,
      sampleId: options.sampleId,
      reportId: options.reportId,
    });
  } else {
    taskExecuteing.value = true;
    await executeTask(options.taskId, options.sampleId, options.reportId);
    taskExecuteing.value = false;
  }
};

const executeTask = async (
  taskId: number,
  sampleId: number,
  reportId: number
) => {
  try {
    const url = await previewRef.value?.updatePDF(taskId, sampleId);

    if (url && url.length > 0) {
      await updateAnalysisReportFileUrl(reportId, url);
    }
  } catch (error) {
    console.error("更新报告文件URL失败:", error);
  }

  if (executeTaskList.value.length > 0) {
    const nextTask = executeTaskList.value.shift();
    if (nextTask) {
      await executeTask(nextTask.taskId, nextTask.sampleId, nextTask.reportId);
    }
  }
};

const emit = defineEmits(["ready"]);

onMounted(() => {
  emit("ready", {
    setIsShow,
  });
});

// 导出方法
defineExpose({
  setIsShow,
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