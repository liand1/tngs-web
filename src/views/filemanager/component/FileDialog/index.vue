<template>
  <div>
    <!-- 新建文件夹对话框 -->
    <a-modal
      :visible="newFolderVisible"
      @update:visible="emit('update:newFolderVisible', $event)"
      title="新建文件夹"
      :maskClosable="false"
      @ok="handleCreateFolder"
      :confirmLoading="createFolderLoading"
    >
      <a-form>
        <a-form-item label="文件夹名称">
          <a-input
            v-model:value="newFolderForm.name"
            placeholder="请输入文件夹名称"
            :maxLength="50"
            ref="folderNameInput"
            @pressEnter="handleCreateFolder"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 重命名对话框 -->
    <a-modal
      :visible="renameVisible"
      @update:visible="emit('update:renameVisible', $event)"
      title="重命名"
      :maskClosable="false"
      @ok="handleRename"
      :confirmLoading="renameLoading"
    >
      <a-form>
        <a-form-item label="新名称">
          <a-input
            v-model:value="renameForm.name"
            placeholder="请输入新名称"
            :maxLength="50"
            ref="renameInput"
            @pressEnter="handleRename"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useFileDialog } from './useFileDialog';
import { FileManagerConfig, defaultConfig } from '../../config';

const folderNameInput = ref(null);
const renameInput = ref(null);

const props = defineProps({
  newFolderVisible: {
    type: Boolean,
    default: false
  },
  renameVisible: {
    type: Boolean,
    default: false
  },
  createFolderLoading: {
    type: Boolean,
    default: false
  },
  renameLoading: {
    type: Boolean,
    default: false
  },
  newFolderForm: {
    type: Object,
    default: () => ({ name: '' })
  },
  renameForm: {
    type: Object,
    default: () => ({ name: '', fileId: '' })
  },
  currentPath: {
    type: String,
    required: true
  },
  fileList: {
    type: Array,
    default: () => []
  },
  config: {
    type: Object as () => FileManagerConfig,
    default: () => defaultConfig
  }
});

const emit = defineEmits([
  'update:newFolderVisible',
  'update:renameVisible',
  'update:createFolderLoading',
  'update:renameLoading',
  'create-folder-success',
  'rename-success'
]);

// 使用对话框逻辑
const { handleCreateFolder, handleRename } = useFileDialog({
  ...props,
  newFolderForm: props.newFolderForm as { name: string },
  renameForm: props.renameForm as { name: string, fileId: string }
}, emit);

// 当新建文件夹对话框显示时，聚焦名称输入框
watch(() => props.newFolderVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      if (folderNameInput.value) {
        (folderNameInput.value as any).focus();
      }
    }, 100);
  }
});

// 当重命名对话框显示时，聚焦名称输入框
watch(() => props.renameVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      if (renameInput.value) {
        (renameInput.value as any).focus();
      }
    }, 100);
  }
});
</script> 