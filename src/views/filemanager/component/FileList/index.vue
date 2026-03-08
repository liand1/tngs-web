<template>
  <div
    class="file-list-container"
    ref="containerRef"
    @mousedown="handleMouseDown"
  >
    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-container">
      <a-spin tip="加载文件中..."></a-spin>
    </div>

    <!-- 文件列表 -->
    <div v-else>
      <!-- 列表视图 -->
      <a-table
        v-if="viewMode === 'list' && config.enableListView"
        :dataSource="fileList"
        :columns="visibleTableColumns"
        :rowKey="(record) => record.id"
        :pagination="false"
        :rowSelection="rowSelection"
        :customRow="customRowHandler"
        :scroll="{ y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <div class="file-name-cell">
              <folder-outlined
                v-if="record.isDirectory"
                class="file-icon folder"
              />
              <file-outlined v-else class="file-icon file" />
              <span class="file-name" @dblclick.stop="openFile(record)">{{
                record.name
              }}</span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'size'">
            {{ formatFileSize(record.size) }}
          </template>
          <template v-if="column.dataIndex === 'modifiedTime'">
            {{ formatDate(record.modifiedTime) }}
          </template>
          <template v-if="column.dataIndex === 'actions'">
            <a-space v-if="filteredRecordActions.length > 0">
              <a-button
                v-for="action in filteredRecordActions"
                :key="action.key"
                type="text"
                @click.stop="() => action.handler(record)"
                :danger="action.danger"
                :loading="getActionLoading(action.key)"
              >
                <template #icon><component :is="action.icon" /></template>
              </a-button>
            </a-space>
          </template>
        </template>

        <!-- 空状态 -->
        <template #emptyText>
          <a-empty description="没有文件" />
        </template>
      </a-table>

      <!-- 网格视图 -->
      <div
        v-else-if="viewMode === 'grid' && config.enableGridView"
        class="file-grid"
      >
        <div
          v-for="file in fileList"
          :key="file.id"
          :data-id="file.id"
          class="file-item"
          :class="{ selected: selectedFilesIds.includes(file.id) }"
          @click="toggleFileSelection(file)"
          @dblclick="openFile(file)"
        >
          <folder-outlined
            v-if="file.isDirectory"
            class="file-icon-large folder"
          />
          <file-outlined v-else class="file-icon-large file" />
          <div class="file-name-grid">{{ file.name }}</div>
        </div>
      </div>
    </div>

    <!-- 拖动选择框 -->
    <div
      v-if="enableMultiSelect"
      class="selection-box"
      :style="{
        left: `${selectionBox.left}px`,
        top: `${selectionBox.top}px`,
        width: `${selectionBox.width}px`,
        height: `${selectionBox.height}px`,
        display: selectionBox.display,
      }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits, computed, ref, watch } from "vue";
import { FileOutlined, FolderOutlined } from "@ant-design/icons-vue";
import { useFileList } from "./useFileList";
import { formatFileSize, formatDate } from "../../index";
import { FileManagerConfig, defaultConfig } from "../../config";

interface FileItemProps {
  id: string;
  name: string;
  isDirectory: boolean;
  size: number;
  modifiedTime: string;
  path: string;
  [key: string]: any;
}

// 定义组件属性
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  viewMode: {
    type: String,
    default: "list",
  },
  fileList: {
    type: Array as () => FileItemProps[],
    default: () => [],
  },
  selectedFilesIds: {
    type: Array as () => string[],
    default: () => [],
  },
  selectedFiles: {
    type: Array as () => FileItemProps[],
    default: () => [],
  },
  deleteLoading: {
    type: Boolean,
    default: false,
  },
  renameLoading: {
    type: Boolean,
    default: false,
  },
  currentPath: {
    type: String,
    required: true,
  },
  config: {
    type: Object as () => FileManagerConfig,
    default: () => defaultConfig,
  },
  enableMultiSelect: {
    type: Boolean,
    default: true,
  },
  showActionColumn: {
    type: Boolean,
    default: true,
  },
});

// 定义组件事件
const emit = defineEmits([
  "selection-change",
  "row-click",
  "open-file",
  "download-file",
  "rename-file",
  "delete-file-success",
  "toggle-selection",
  "update:deleteLoading",
  "update:selectedFilesIds",
  "update:selectedFiles",
  "refresh-files",
]);

// 容器引用
const containerRef = ref<HTMLElement | null>(null);

// 使用组件逻辑
const {
  tableColumns,
  recordActions,
  onSelectionChange,
  openFile,
  toggleFileSelection,
  getActionLoading,
  // 拖动选择相关
  selectionBox,
  startDragSelect,
} = useFileList(props, emit);

// 处理鼠标按下事件
function handleMouseDown(event: MouseEvent) {
  if (containerRef.value) {
    startDragSelect(event, containerRef.value);
  }
}

// 自定义表格行事件处理
function customRowHandler(record: FileItemProps) {
  return {
    onClick: (event: MouseEvent) => {
      // 停止事件冒泡，防止与其他点击事件冲突
      event.stopPropagation();

      // 如果点击的是按钮或链接，不触发选择
      if ((event.target as HTMLElement).closest("button, a")) {
        return;
      }

      // 处理行选择，传递键盘事件 - 无论enableMultiSelect如何，都使用toggleFileSelection
      toggleFileSelection(record, event);
    },
    onDblclick: (event: MouseEvent) => {
      // 防止与文件名双击冲突
      if ((event.target as HTMLElement).classList.contains("file-name")) {
        return;
      }

      // 如果是不是文件夹，则不打开
      if (!record.isDirectory) {
        return;
      }

      // 双击打开文件
      openFile(record);
    },
    // 设置行样式，选中行高亮显示
    class: props.selectedFilesIds.includes(record.id) ? "selected-row" : "",
  };
}

// 根据配置过滤可用的操作
const filteredRecordActions = computed(() => {
  return recordActions.filter((action) => {
    switch (action.key) {
      case "download":
        return props.config.enableDownload;
      case "rename":
        return props.config.enableRename;
      case "delete":
        return props.config.enableDelete;
      case "open":
        return true;
      default:
        return true;
    }
  });
});

// 计算表格列配置，根据显示/隐藏设置
const visibleTableColumns = computed(() => {
  return tableColumns.filter((column) => {
    // 根据 showActionColumn 配置过滤操作列
    if (column.dataIndex === "actions") {
      // 只有当showActionColumn为true且至少有一个操作按钮可用时，才显示操作列
      return props.showActionColumn && filteredRecordActions.value.length > 0;
    }
    return true;
  });
});
watch(props.fileList, () => {
  console.log(props.fileList);
});

// 计算表格行选择配置
const rowSelection = computed(() => {
  if (!props.enableMultiSelect) {
    return null;
  }

  return {
    selectedRowKeys: props.selectedFilesIds,
    onChange: onSelectionChange,
    columnWidth: 40,
  };
});
</script>

<style scoped>
.file-list-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
  user-select: none;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.file-name-cell {
  position: relative;
  align-items: center;
}

.file-icon {
  position: absolute;
  top: 2px;
  left: 0;
  margin-right: 8px;
  font-size: 18px;
}

.file-icon.folder {
  color: #ffc53d;
}

.file-icon.file {
  color: #40a9ff;
}

.file-name {
  display: block;
  padding-left: 24px;
  cursor: pointer;
}

/* 选中行的样式 */
:deep(.selected-row) {
  background-color: #e6f7ff;
}

:deep(.selected-row:hover) {
  background-color: #cbe6ff !important;
}

:deep(.ant-table-row) {
  cursor: pointer;
}

:deep(.ant-table-cell) {
  cursor: pointer;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  transition: all 0.3s;
}

.file-item:hover {
  background-color: #f5f5f5;
}

.file-item.selected {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.file-icon-large {
  margin-bottom: 8px;
  font-size: 48px;
}

.file-icon-large.folder {
  color: #ffc53d;
}

.file-icon-large.file {
  color: #40a9ff;
}

.file-name-grid {
  width: 100%;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 拖动选择框样式 */
.selection-box {
  position: absolute;
  z-index: 100;
  pointer-events: none;
  background-color: rgb(24 144 255 / 10%);
  border: 1px solid rgb(24 144 255 / 45%);
}
</style> 