<template>
  <div>
    <a-modal
      v-model:open="open"
      :title="props.title"
      :width="1000"
      :height="500"
      :footer="null"
      destroyOnClose
      @cancel="handleCancel"
    >
      <div class="filemanager-container">
        <FileManager @select-folder="onSelectFolder" ref="fileManagerRef" />
        <div class="filemanager-actions">
          <a-button @click="handleCancel">取消</a-button>
          <a-button
            type="primary"
            @click="handleConfirm"
            :loading="confirmLoading"
            :disabled="selectedFolder.length <= 0"
            >确定</a-button
          >
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FileManager from "./index.vue";
import { message } from "ant-design-vue";
import { FileItem } from "./component/FileList/useFileList";

const props = defineProps({
  title: {
    type: String,
    default: "选择芯片文件夹",
  },
});

const emit = defineEmits(["select-folder", "update:open", "cancel"]);

const open = ref(false);
const confirmLoading = ref(false);
const fileManagerRef = ref();
const selectedFolder = ref<FileItem[]>([]);

// 文件夹选择处理函数
const onSelectFolder = (folder: FileItem[]) => {
  if (folder.length > 0) {
    selectedFolder.value = folder;
  } else {
    message.warning("请先选择一个文件或文件夹");
    return;
  }
};

// 确认选择
const handleConfirm = () => {
  confirmLoading.value = true;

  try {
    if (selectedFolder.value.length === 0) {
      message.warning("请先选择一个文件或文件夹");
      confirmLoading.value = false;
      return;
    }

    // 触发选择事件
    emit("select-folder", selectedFolder.value);
    // 关闭模态框
    open.value = false;
  } catch (error) {
    console.error("选择文件出错:", error);
    message.error("选择文件出错，请重试");
  } finally {
    confirmLoading.value = false;
  }
};

// 处理取消事件
const handleCancel = () => {
  emit("cancel");
  selectedFolder.value = [];
  open.value = false;
};

// 显示模态框
const showModal = () => {
  open.value = true;
  selectedFolder.value = [];
};

// 隐藏模态框
const hideModal = () => {
  selectedFolder.value = [];
  open.value = false;
};

// 获取选中数据
const getSelectedData = () => {
  return selectedFolder.value;
};

// 暴露方法
defineExpose({
  showModal,
  hideModal,
  getSelectedData,
});
</script>

<style lang="less" scoped>
.filemanager-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;

  .filemanager-actions {
    display: flex;
    justify-content: flex-end;
    padding: 12px 0;
    margin-top: 16px;

    .ant-btn {
      margin-left: 8px;
    }
  }
}
</style> 