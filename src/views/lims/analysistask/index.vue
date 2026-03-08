<script lang="ts" setup>
import AnalysisTaskModal from "./AnalysisTaskModal.vue";
import TaskSettingModal from "./components/tasksetting/TaskSettingModal.vue";
import TaskDetailsModal from "@/components/lims/taskdetails/TaskDetailsModal.vue";
import CreateTaskModal from "./components/createTask/CreateTaskModal.vue";
import SelectSampleModal from "./components/selectsample/SelectSampleModal.vue";
import SelectSocModal from "./components/selectsoc/SelectSocModal.vue";
import FileManagerModal from "@/views/filemanager/filemanagermdal.vue";
import { FileItem } from "@/views/filemanager/component/FileList/useFileList";
import {
  columns,
  searchFormSchema,
  analysisDataColumns,
} from "./analysisTask.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { useModal } from "@/components/Modal";
import { IconEnum } from "@/enums/appEnum";
import { BasicTable, TableAction, useTable } from "@/components/Table";
import {
  deleteAnalysisTask,
  getAnalysisTaskPage,
} from "@/api/lims/analysistask";
import { FileTextOutlined } from "@ant-design/icons-vue";

import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { handleSelectSchemas, fetchDictData, taskTypeOptions } from "./index";
import { useGo } from "@/hooks/web/usePage";
import {
  QcStatusEnum as QcStatusEnumType,
  QcTypeEnum,
  TaskStatusEnum as TaskStatusEnumType,
  TaskStatusEnumMap,
  QcStatusEnumMap,
  SampleTypeEnum,
  UserRoleEnum,
} from "@/enums/customEnum";
import { ReportListModel, SocToCreateTaskModel } from "./model";
import { findQcReportByObjectId } from "@/api/lims/qcreport";
import { TaskDetailData } from "@/components/lims/taskdetails/model";
import { SampleSocRespVO } from "@/api/lims/sample/model";
import { getUserInfo } from "@/api/base/user";
const route = useRoute();
const { socId, sampleId, taskId } = route.params as {
  socId: string;
  sampleId: string;
  taskId: string;
};

const SocToCreateTaskModelList: SocToCreateTaskModel = {
  sampleId: Number(sampleId),
  socId: Number(socId),
  taskId: Number(taskId),
};

const taskDetailData = ref<TaskDetailData>({
  title: "质控详情",
  list: [],
});

const go = useGo();

defineOptions({ name: "AnalysisTask" });

// 将枚举值定义为常量以便在模板中使用
const QcStatusEnum = QcStatusEnumType;
const TaskStatusEnum = TaskStatusEnumType;

const { t } = useI18n();
const { createMessage } = useMessage();
const [registerModal] = useModal();

const tsRef = ref<typeof TaskSettingModal>();

const tdRef = ref<typeof TaskDetailsModal>();

const crRef = ref<typeof CreateTaskModal>();

const ssRef = ref<typeof SelectSampleModal>();

const scRef = ref<typeof SelectSocModal>();

const fmRef = ref<typeof FileManagerModal>();

const isShowSocSetting = ref(false);
async function getUserInfos() {
  const res = await getUserInfo();
  console.log(res);
  if (res.roles.includes(UserRoleEnum.SUPER_ADMIN) || res.roles.includes(UserRoleEnum.SYSTEM_ADMIN)) {
    isShowSocSetting.value = true;
  }
}

const timer = ref();

// const timeri = ref(1);

// 在组件挂载时获取字典数据
onMounted(() => {
  fetchDictData();
  if (socId || sampleId || taskId) {
    createTaskModal();
    // console.log(socId, sampleId);
  }

  getUserInfos();
  
});

onUnmounted(() => {
  if(timer.value) {
    clearInterval(timer.value);
  }
})

const [registerTable, { reload, getForm, setTableData, getPaginationRef, updateTableDataRecord }] = useTable({
  title: "分析管理列表",
  rowKey: 'id',
  api: getAnalysisTaskPage,
  afterFetch: (result) => {
    autoRefresh(result);
    return result;
  },
  columns: columns.map((col) => {
    // 处理任务类型字段
    if (col.dataIndex === "type") {
      return {
        ...col,
        customRender: ({ text }) => {
          const option = taskTypeOptions.value.find(
            (opt) => opt.value === text.toString()
          );
          return option ? option.label : text;
        },
      };
    }

    return col;
  }),
  showIndexColumn: false,
  formConfig: {
    labelWidth: 120,
    schemas: handleSelectSchemas(searchFormSchema),
    rowProps: {
      gutter: [0, 20],
    },
    actionColOptions: {
      span: 8, // 占满整行
      style: { textAlign: "right", marginBottom: "10px" }, // 按钮右对齐，底部添加间距
    },
    showAdvancedButton: false,
  },
  useSearchForm: true,
  showTableSetting: true,
  actionColumn: {
    width: 180,
    title: t("common.action"),
    dataIndex: "action",
    fixed: "right",
  },
  tableSetting: {
    // 是否显示刷新按钮
    redo: true,
    // 是否显示尺寸调整按钮
    size: true,
    // 是否显示字段调整按钮
    setting: true,
    // 是否显示全屏按钮
    fullScreen: false,
    //是否显示搜搜按钮
    form: false,
  },
});

// function handleCreate() {
//   openModal(true, { isUpdate: false });
// }

function handleEdit(record: Recordable) {
  createTaskModal({
    sampleId: 0,
    socId: 0,
    taskId: record.id,
  });
  // openModal(true, { record, isUpdate: true });
}

function handleDetail(record: Recordable) {
  // console.log(record)

  go({
    name: `AnalysisTaskDetailToId`,
    params: { id: record.id }, // 替换为实际ID
  });
}

// async function handleExport() {
//   createConfirm({
//     title: t("common.exportTitle"),
//     iconType: "warning",
//     content: t("common.exportMessage"),
//     async onOk() {
//       await exportAnalysisTask(getForm().getFieldsValue());
//       createMessage.success(t("common.exportSuccessText"));
//     },
//   });
// }

function taskSettingModal() {
  tsRef?.value?.showModal();
}

// function taskdetailsModal() {
//   tdRef?.value?.showModal();
// }

function createTaskModal(obj?: SocToCreateTaskModel) {
  crRef?.value?.showModal(obj || SocToCreateTaskModelList);
}

function createTaskModalNoData() {
  crRef?.value?.showModal();
}

function selectSampleModal() {
  ssRef?.value?.showModal();
}

function selectSocModal() {
  scRef?.value?.showModal();
}

async function handleDelete(record: Recordable) {
  await deleteAnalysisTask(record.id);
  createMessage.success(t("common.delSuccessText"));
  reload();
}

function setSelectSample(data: any, appendFlag: boolean) {
  crRef?.value?.setSelectSample(data, appendFlag);
}

// 更新样本选择状态
function updateSampleSelection(id: number) {
  // 更新SelectSampleModal中的选中状态
  ssRef?.value?.updateSelection(id);
}

// 更新样本文件数据
function updateSampleData(data: { sampleData: SampleSocRespVO[] }) {
  // 更新SelectSampleModal中的样本数据
  ssRef?.value?.updateSampleData(data);
}

function setSelectSoc(data: any) {
  crRef?.value?.setSelectSoc(data);
}

// 打开文件管理器
function openFileManager() {
  fmRef?.value?.showModal();
}

// 处理文件选择
function handleSelectFolder(files: FileItem[]) {
  crRef?.value?.setSelectedFiles(files);
}

async function taskdetailsModal(record: ReportListModel) {
  // 根据id获取质控记录
  const qcReportList = await findQcReportByObjectId(
    record.id,
    QcTypeEnum.ANALYSIS_TASK,
    1
  );
  tdRef?.value?.showModal(`${record.sampleCode} 质控详情`, qcReportList);
}

const autoRefresh = async (result) => {
  if(timer.value) {
    clearInterval(timer.value);
  }
  let needReresh = false;
  for(let i = 0; i < result.length; i++) {
    let rowData = result[i];
    updateTableDataRecord(rowData.id, rowData);
    if(rowData.taskStatus == TaskStatusEnum.CREATED || rowData.taskStatus == TaskStatusEnum.WAITING 
      || rowData.taskStatus == TaskStatusEnum.ANALYZING || rowData.qcStatus == QcStatusEnum.UNKNOWN) {
      needReresh = true;
      break;
    }
  }
  if(!needReresh) {
    return;
  }
  timer.value = setInterval(() => {
    const pagination = getPaginationRef();
    let params = getForm().getFieldsValue();
    params.pageNo = pagination.current;
    params.pageSize = pagination.pageSize;
    getAnalysisTaskPage(params).then(res => {
      // setTableData(res.list);
      let hasAnalysisIn = false;
      for(let i = 0; i < res.list.length; i++) {
        let rowData = res.list[i];
        updateTableDataRecord(rowData.id, rowData);
        if(rowData.taskStatus == TaskStatusEnum.CREATED || rowData.taskStatus == TaskStatusEnum.WAITING 
          || rowData.taskStatus == TaskStatusEnum.ANALYZING || rowData.qcStatus == QcStatusEnum.UNKNOWN) {
          hasAnalysisIn = true;
          break;
        }
      }
      if(!hasAnalysisIn) {
        clearInterval(timer?.value);
      }
    })
    // timeri.value += 1;
  }, 2000)
}

// 任务状态特殊显示
const taskStatusRenderColor = (text: number) => {
  switch (text) {
    case TaskStatusEnum.ANALYZING:
      return "rgb(24 144 255 / 100%)";
    case TaskStatusEnum.COMPLETED:
      return "rgb(82 196 26 / 100%)";
    case TaskStatusEnum.FAILED:
      return "rgb(250 140 22 / 100%)";
    default:
      return "";
  }
};
</script>
<template>
  <div>
    <BasicTable
      @register="registerTable"
      :pagination="{ pageSize: 50 }"
      class="anaysistask-table"
    >
      <!-- 自定义展开行 -->
      <template #expandedRowRender="{ record }">
        <a-table
          :dataSource="record.reportList"
          :columns="analysisDataColumns"
          class="anaysistask-data-table"
          :pagination="false"
        >
          <template #qcStatus="{ text, record }">
            <span v-if="record.sampleType === SampleTypeEnum.WATER_CONTROL">
              -
            </span>

            <span v-else-if="text === QcStatusEnum.UNKNOWN">-</span>
            <span
              v-else-if="text === QcStatusEnum.PASS"
              style="color: rgb(82 196 26)"
              >合格<FileTextOutlined
                class="icon-success"
                @click="taskdetailsModal(record)"
            /></span>
            <span
              v-else-if="text === QcStatusEnum.FAIL"
              style="color: rgb(255 77 79 / 100%)"
              >不合格<FileTextOutlined
                class="icon-success"
                @click="taskdetailsModal(record)"
            /></span>
            <span
              v-else-if="text === QcStatusEnum.WARNING"
              style="color: #FA9614"
              >预警<FileTextOutlined
                class="icon-success"
                @click="taskdetailsModal(record)"
            /></span>
          </template>
        </a-table>
      </template>

      <template #toolbar>
        <!-- <a-button danger v-auth="['lims:soc:create']" @click="taskdetailsModal">
          质控详情案例
        </a-button> -->

        <a-button
          danger
          v-auth="['lims:soc:create']"
          @click="taskSettingModal"
          v-if="isShowSocSetting"
        >
          分析任务质控设置
        </a-button>

        <a-button
          type="primary"
          v-auth="['lims:analysis-task:create']"
          :preIcon="IconEnum.ADD"
          @click="createTaskModalNoData"
        >
          创建分析任务
        </a-button>
        <!-- <a-button
          v-auth="['lims:analysis-task:export']"
          :preIcon="IconEnum.EXPORT"
          @click="handleExport"
        >
          {{ t("action.export") }}
        </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                // icon: IconEnum.EDIT,
                label: '重建任务',
                auth: 'lims:analysis-task:update',
                onClick: handleEdit.bind(null, record),
              },
              {
                // icon: IconEnum.EDIT,
                label: '查看',
                auth: 'lims:analysis-task:update',
                onClick: handleDetail.bind(null, record),
              },
              {
                // icon: IconEnum.DELETE,
                danger: true,
                label: t('action.delete'),
                auth: 'lims:analysis-task:delete',
                popConfirm: {
                  title: t('common.delMessage'),
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>

      <!-- 质控结果特殊显示 -->
      <template #qcStatus="{ text, record }">
        <span
          v-if="record.taskStatus === TaskStatusEnum.FAILED"
          style="color: rgb(255 77 79 / 100%)"
        >
          分析失败
        </span>

        <span
          v-else-if="text === QcStatusEnum.UNKNOWN"
          style="color: rgb(24 144 255 / 100%)"
          >{{ QcStatusEnumMap[text] }}</span
        >
        <span
          v-else-if="text === QcStatusEnum.PASS"
          style="color: rgb(82 196 26)"
          >{{ QcStatusEnumMap[text] }}
        </span>
        <span
          v-else-if="text === QcStatusEnum.FAIL"
          style="color: rgb(255 77 79 / 100%)"
        >
          {{ QcStatusEnumMap[text] }}（{{ record.reportQcFailCount }}/{{
            record.reportCount
          }}）
        </span>
        <span
          v-else-if="text === QcStatusEnum.WARNING"
          style="color: #FA9614"
          >{{ QcStatusEnumMap[text] }}（{{ record.reportQcWarningCount }}/{{
            record.reportCount
          }}）
        </span>
      </template>

      <!-- 任务状态特殊显示 -->
      <template #taskStatus="{ text }">
        <span v-if="text === TaskStatusEnum.ANALYZING">
          <a-spin style="margin-right: 8px;"/>{{ TaskStatusEnumMap[text] }}
        </span>
        <span v-else
          :style="{
            color: taskStatusRenderColor(text),
          }"
          >{{ TaskStatusEnumMap[text] }}</span
        >
      </template>

      <!-- 分析进度 -->
      <template #analysisProgress="{ record }">
        <div class="analysis-progress">
          <a-progress
            :percent="(record.reportFinishCount / record.reportCount) * 100"
            :steps="10"
            :size="[3, 16]"
            stroke-color="#34C759"
            :show-info="false"
          />
          <span>
            {{ record.reportFinishCount }} /
            {{ record.reportCount }}
          </span>
        </div>
      </template>
    </BasicTable>
    <AnalysisTaskModal @register="registerModal" @success="reload()" />
    <!-- 分析任务质控设置 -->
    <TaskSettingModal ref="tsRef" />
    <!-- 质控弹窗 -->
    <TaskDetailsModal ref="tdRef" :data="taskDetailData" />

    <!-- 创建分析任务 -->
    <CreateTaskModal
      ref="crRef"
      @open-sample-modal="selectSampleModal"
      @open-soc-modal="selectSocModal"
      @open-file-manager="openFileManager"
      @update-sample-selection="updateSampleSelection"
      @update-sample-data="updateSampleData"
      @success="reload()"
    />

    <!-- 选择样本 -->
    <SelectSampleModal
      ref="ssRef"
      @setSelectSample="setSelectSample"
      @update-selection="updateSampleSelection"
      :sampleId="Number(sampleId)"
      :socId="Number(socId)"
      :taskId="Number(taskId)"
    />

    <!-- 选择芯片 -->
    <SelectSocModal ref="scRef" @setSelectSoc="setSelectSoc" :socId="socId" />

    <!-- 文件管理器 -->
    <FileManagerModal ref="fmRef" @select-folder="handleSelectFolder" />
  </div>
</template>

<style lang="less" scoped>
.icon-success {
  margin-left: 8px;
  color: rgb(0 0 0 / 25%);
}

:deep(.analysis-progress) {
  .ant-progress-line {
    position: relative;
    top: 4px;
    width: auto;
  }
}

.anaysistask-table {
  :deep(.ant-table-expanded-row-level-1) {
    & > .ant-table-cell {
      padding: 0 !important;
    }

    .ant-table-expanded-row-fixed {
      padding: 0 !important;
      margin: 0 !important;

      & > .ant-table-wrapper {
        // padding: 0 !important;
      }
    }
  }

  .anaysistask-data-table {
    :deep(.ant-table) {
      // padding: 0 24px!important;
      margin: 0 !important;
      background-color: rgb(250 250 250 / 100%) !important;

      .ant-table-row {
        margin: 0 10px !important;
      }

      .ant-table-thead {
        .ant-table-cell {
          padding: 5px 2px;
          background-color: rgb(241 241 241 / 100%) !important;

          &:first-child {
            padding-left: 50px !important;
          }

          &:last-child {
            padding-right: 10px !important;
          }
        }
      }

      .ant-table-tbody {
        .ant-table-row {
          .ant-table-cell {
            &:first-child {
              padding-left: 50px !important;
            }

            &:last-child {
              padding-right: 10px !important;
            }
          }
        }
      }
    }
  }
}
</style>