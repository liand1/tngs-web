<template>
  <div class="pdf-export-button">
    <a-button
      type="primary"
      :disabled="disabled || isExporting"
      @click="handleExportPdf"
      class="export-btn"
    >
      <template #icon>
        <download-outlined />
      </template>
      {{ isExporting ? "导出中..." : "导出PDF" }}
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { DownloadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { exportAndMergePdfs, exportElementToPdf } from "../index";

const props = defineProps({
  // 模板标题
  title: {
    type: String,
    default: "",
  },
  // 模板代码
  code: {
    type: String,
    default: "",
  },
  // 禁用状态
  disabled: {
    type: Boolean,
    default: false,
  },
  // 内容是否为空
  isEmpty: {
    type: Boolean,
    default: true,
  },
  // 导出前回调函数
  beforeExport: {
    type: Function,
    default: null,
  },
  // 导出后回调函数
  afterExport: {
    type: Function,
    default: null,
  },
  // 要导出的内容元素
  contentElement: {
    type: Object as () => HTMLElement | null,
    default: null,
  },
  updateData: {
    type: Function as () => any,
    default: (_: boolean) => ({}),
  },
});

const emit = defineEmits([
  "export-start",
  "export-success",
  "export-error",
  "export-complete",
]);

// 导出状态
const isExporting = ref(false);

// 导出内容元素
const contentElementRef = ref<HTMLElement | null>(null);
// 多个导出内容元素
const contentElementsRef = ref<HTMLElement[]>([]);

// 设置导出内容元素
const setContentElement = (element: HTMLElement) => {
  contentElementRef.value = element;
  contentElementsRef.value = []; // 清空多元素引用
};

// 设置多个导出内容元素
const setContentElements = (elements: HTMLElement[]) => {
  contentElementsRef.value = elements;
  contentElementRef.value = null; // 清空单元素引用
};

// 处理PDF导出
const handleExportPdf = async (): Promise<string | undefined> => {
  return new Promise(async (resolve, reject) => {
    if (isExporting.value || props.disabled || props.isEmpty) return;

    isExporting.value = true;
    emit("export-start");

    // message.loading({
    //   content: "正在生成PDF，请稍候...",
    //   key: "exportPdf",
    //   duration: 0,
    // });

    await props.updateData(true);

    // 预导出回调返回数据
    let beforeExportRurnData = {};
    // 调用预导出回调
    if (props.beforeExport) {
      beforeExportRurnData = await props.beforeExport();
    }

    setTimeout(async () => {
      try {
        // 检查是否有多个内容元素
        if (contentElementsRef.value && contentElementsRef.value.length > 0) {
          // 使用多元素导出
          const imgUrl = await exportAndMergePdfs(
            contentElementsRef.value,
            {
              title: props.title,
              code: props.code,
            },
            `${props.title || "document"}.pdf`
          );

          resolve(imgUrl || undefined);
        } else {
          // 获取要导出的DOM元素 - 优先使用内部引用，其次使用props，最后尝试querySelector
          const contentElement =
            contentElementRef.value ||
            props.contentElement ||
            (document.querySelector("#pdf-export-content") as HTMLElement);
          if (!contentElement) {
            throw new Error("导出内容不存在");
          }

          // 单元素导出
          await exportElementToPdf(contentElement, {
            title: props.title,
            code: props.code,
          });
        }

        resolve(undefined);

        // 导出成功 resolve(imgUrl);
        emit("export-success");
        message.success({
          content: "PDF导出完成！",
          key: "exportPdf",
          duration: 2,
        });
      } catch (error) {
        console.error("PDF导出失败:", error);
        emit("export-error", error);

        reject(error);

        message.error({
          content: "PDF导出失败，请重试",
          key: "exportPdf",
          duration: 2,
        });
      } finally {
        isExporting.value = false;
        // 调用导出后回调
        if (props.afterExport) {
          await props.afterExport(beforeExportRurnData);
        }
        emit("export-complete");
      }
    }, 300);
  });
};

defineExpose({
  exportPdf: handleExportPdf,
  isExporting: () => isExporting.value,
  setContentElement,
  setContentElements,
});
</script>

<style lang="less" scoped>
.pdf-export-button {
  display: inline-flex;
  align-items: center;
  height: 100%;
  margin-left: 20px;

  .export-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style> 