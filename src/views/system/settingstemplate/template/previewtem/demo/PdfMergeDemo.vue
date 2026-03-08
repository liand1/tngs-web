<template>
  <div>
    <a-button type="primary" @click="handleMergePdf">合并PDF文件</a-button>
    <a-upload
      v-model:file-list="fileList"
      :before-upload="beforeUpload"
      :multiple="true"
      accept=".pdf"
    >
      <a-button>选择PDF文件</a-button>
      <template #tip>
        <div class="ant-upload-hint">请选择多个PDF文件进行合并</div>
      </template>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PDFDocument } from "pdf-lib";
import { message } from "ant-design-vue";
import type { UploadProps } from "ant-design-vue";

const fileList = ref<any[]>([]);

// 上传前校验
const beforeUpload: UploadProps["beforeUpload"] = (file) => {
  if (file.type !== "application/pdf") {
    message.error("只能上传PDF文件!");
    return false;
  }
  return true;
};

// 合并PDF文件
const handleMergePdf = async (fileLists: any[]) => {
  if (fileList.value.length + fileLists.length < 2) {
    message.warning("请至少选择两个PDF文件进行合并!");
    return;
  }

  try {
    // 创建一个新的PDF文档
    const mergedPdf = await PDFDocument.create();

    // 读取所有选中的PDF文件
    const pdfPromises = [...fileList.value, ...fileLists].map((file) => {
      return new Promise<ArrayBuffer>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file.originFileObj);
      });
    });

    // 等待所有PDF文件读取完成
    const pdfBuffers = await Promise.all(pdfPromises);

    // 将每个PDF文件添加到合并的PDF文档中
    for (const pdfBytes of pdfBuffers) {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // 保存合并后的PDF文件
    const mergedPdfBytes = await mergedPdf.save();

    // 创建一个Blob对象
    const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

    // 创建一个下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "合并文件.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    message.success("PDF合并成功!");
  } catch (error) {
    console.error("PDF合并失败:", error);
    message.error("PDF合并失败，请重试!");
  }
};
</script>

<style scoped>
.ant-upload-hint {
  margin-top: 8px;
  color: rgb(0 0 0 / 45%);
}
</style>
