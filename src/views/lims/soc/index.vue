<script lang="ts" setup>
import SocModal from "./SocModal.vue";
import QcSettingModal from "./components/qcsetting/QcSettingModal.vue";
import TaskDetailsModal from "./components/taskdetails/TaskDetailsModal.vue";
import { columns, searchFormSchema, socDataColumns } from "./soc.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { useModal } from "@/components/Modal";
import { IconEnum } from "@/enums/appEnum";
import { BasicTable, TableAction, useTable } from "@/components/Table";
import { deleteSoc, getSocPage } from "@/api/lims/soc";
import { onMounted, ref, computed, onUnmounted } from "vue";
import {
  createTypeOptions,
  fetchDictData,
  handleSelectSchemas,
  callStatusOptions,
} from ".";
import {
  QcStatusEnum,
  SampleRelationStatusEnumMap,
  FileIntegrityCheckStatusEnum,
  UploadTypeEnum,
  MD5IntegrityStatusEnum,
  UserRoleEnum,
} from "@/enums/customEnum";
import { FileTextOutlined, FileSyncOutlined } from "@ant-design/icons-vue";
import { useGo } from "@/hooks/web/usePage";
// import { useRoute } from "vue-router";
import SocUpdateModal from "./components/socupdate/index.vue";
import FileManagerModal from "@/views/filemanager/filemanagermdal.vue";
import { FileItem } from "@/views/filemanager/component/FileList/useFileList";
import { autoUploadSocFiles, manualUploadSocFiles } from "@/api/lims/soc-data";
import { debounce } from "lodash-es";
// import dayjs from "dayjs";
import { getUserInfo } from "@/api/base/user";
import { formatTimeToTimes } from "@/utils/custom";

defineOptions({ name: "Soc" });
const go = useGo();
const { t } = useI18n();
const { createMessage } = useMessage();
const [registerModal] = useModal();
const suRef = ref<InstanceType<typeof SocUpdateModal>>();
const fileManagerRef = ref<InstanceType<typeof FileManagerModal>>();

// 定时刷新定时器
let autoRefreshTimer: number | null = null;

// 是否是列表打开的文件管理器
const isOpenFileManager = ref(true);
const openFileRecod = ref<any>({});

const isShowSocSetting = ref(false);

// 处理文件夹选择事件
const handleSelectFolder = async (files: FileItem[]) => {
  // console.log("选择文件:", files);
  if (isOpenFileManager.value && Object.keys(openFileRecod.value).length > 0) {
    try {
      await manualUploadSocFiles({
        sourcePath: files[0].path,
        socId: openFileRecod.value.id,
        socName: openFileRecod.value.socName,
        socSourceName: openFileRecod.value.sourceName,
        operateType: UploadTypeEnum.MANUAL_UPLOAD_COMPLETE_SOC,
      });
      reload();
      createMessage.success("文件补充中。");
    } catch (error) {
      console.log(error);
      createMessage.error("上传补充失败，请重试");
    }
  } else {
    suRef.value?.addFolder(files);
  }
};

// 打开文件管理器
const openFileManager = () => {
  isOpenFileManager.value = false;
  fileManagerRef.value?.showModal();
};

// 在组件挂载时获取字典数据
onMounted(() => {
  fetchDictData();

  // 设置60秒定时刷新
  startAutoRefresh();

  getUserInfos();
});

// 组件卸载时清除定时器
onUnmounted(() => {
  stopAutoRefresh();
});

// 开始自动刷新
const startAutoRefresh = () => {
  stopAutoRefresh(); // 确保先清除之前的定时器

  // 设置定时器，每60秒刷新一次数据
  autoRefreshTimer = window.setInterval(() => {
    // console.log('执行60秒定时刷新');
    reload();
  }, 60 * 1000);
};

// 停止自动刷新
const stopAutoRefresh = () => {
  if (autoRefreshTimer !== null) {
    clearInterval(autoRefreshTimer);
    autoRefreshTimer = null;
  }
};

// const route = useRoute();
// const socId = route.params.socId;

const open = ref(false);

const reportAddress = ref("");
const reportBlobUrl = computed(() => {
  if (!reportAddress.value) return "";
  const blob = new Blob([reportAddress.value], { type: "text/html" });
  return URL.createObjectURL(blob);
});
const [registerTable, { reload }] = useTable({
  title: "芯片管理",
  api: (args) => {
    if (args.createTime && args.createTime.length === 2) {
      args.createTime = formatTimeToTimes(args.createTime);

      // 将日期范围转换为时间戳
      // const startTime = dayjs(args.downDeviceTime[0]).valueOf();
      // const endTime = dayjs(args.downDeviceTime[1]).valueOf();
      // args.downDeviceStartTime = startTime;
      // args.downDeviceEndTime = endTime;
      // delete args.downDeviceTime;

      // console.log(args.downDeviceTime);
    }

    return getSocPage(Object.assign(args, { isGetSocData: 1 }));
  },
  columns: columns.map((col) => {
    // 处理创建来源字段
    if (col.dataIndex === "createType") {
      return {
        ...col,
        customRender: ({ text }) => {
          const option = createTypeOptions.value.find(
            (opt) => opt.value === text.toString()
          );
          return option ? option.label : text;
        },
      };
    }

    if (col.dataIndex === "callStatus") {
      return {
        ...col,
        customRender: ({ text }) => {
          const option = callStatusOptions.value.find(
            (opt) => opt.value === text.toString()
          );
          return option ? option.label : text;
        },
      };
    }
    if (col.dataIndex === "sampleReStatus") {
      return {
        ...col,
        customRender: ({ text }) => {
          return SampleRelationStatusEnumMap[Number(text)] || text;
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
      span: 18, // 占满整行
      style: { textAlign: "right", marginBottom: "10px" }, // 按钮右对齐，底部添加间距
    },
    showAdvancedButton: false,
  },
  useSearchForm: true,
  showTableSetting: true,
  actionColumn: {
    width: 140,
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

const qcRef = ref<typeof QcSettingModal>();

const tdRef = ref<typeof TaskDetailsModal>();

function handleCreate() {
  suRef?.value?.showModal();
}

const handleSyncFile = debounce(async () => {
  try {
    await autoUploadSocFiles();
    createMessage.success("同步芯片文件中，稍后刷新页面");
  } catch (error) {
    // createMessage.error("同步芯片文件失败");
  }
}, 500);

// function handleEdit(record: Recordable) {
//   openModal(true, { record, isUpdate: true });
// }

function handleCreateAnalysis(record: Recordable) {
  // openModal(true, { record, isUpdate: true });
  go("/lims/analysis-task/0/" + record.id);
}

async function qcSettingModal() {
  qcRef?.value?.showModal();
}

async function handleDelete(record: Recordable) {
  await deleteSoc(record.id);
  createMessage.success(t("common.delSuccessText"));
  reload();
}

function taskdetailsModal(id: number, name: string) {
  tdRef?.value?.showModal(id, name);
}

function handleReportAddress(text: string) {
  reportAddress.value = text;
  open.value = true;
}

// 在模态框关闭时释放blob URL
function handleModalClose() {
  if (reportBlobUrl.value) {
    URL.revokeObjectURL(reportBlobUrl.value);
    reportAddress.value = "";
  }
}

async function handleSelectFile(record: any) {
  try {
    await manualUploadSocFiles({
      socId: record.id,
      socName: record.socName,
      socSourceName: record.sourceName,
      operateType: UploadTypeEnum.AUTO_UPLOAD_COMPLETE_SOC,
    });
    reload();
    createMessage.success("文件补充中。");
  } catch (error) {
    console.log(error);
    createMessage.error("上传补充失败，请重试");
  }
}

function handleSupplementFile(record: any) {
  isOpenFileManager.value = true;
  openFileRecod.value = record;
  fileManagerRef?.value?.showModal();
}

async function getUserInfos() {
  const res = await getUserInfo();
  // console.log(res);
  if (
    res.roles.includes(UserRoleEnum.SUPER_ADMIN) ||
    res.roles.includes(UserRoleEnum.SYSTEM_ADMIN)
  ) {
    isShowSocSetting.value = true;
  }
}
</script>
<template>
  <div>
    <BasicTable @register="registerTable" :pagination="{ pageSize: 50 }" class="soc-table">
      <!-- 自定义展开行 -->
      <template #expandedRowRender="{ record }">
        <a-table :dataSource="record.dataList" :columns="socDataColumns" class="soc-data-table" :pagination="false">
          <template #fileName="{ text, record }">
            <a-tooltip class="ttp">
              <template #title>{{
                record.fileAddress.lastIndexOf("/") === -1
                  ? record.fileAddress
                  : record.fileAddress.substring(
                    0,
                    record.fileAddress.lastIndexOf("/")
                  )
              }}</template>
              {{ text }}
            </a-tooltip>
          </template>
          <template #integrityStatus="{ text }">
            <template v-if="text === MD5IntegrityStatusEnum.COMPLETE">
              <span>完整</span>
            </template>
            <template v-else-if="text === MD5IntegrityStatusEnum.INCOMPLETE">
              <span style="color: rgb(255 77 79 / 100%)">不完整</span>
            </template>
            <template v-else>
              <span>无需验证</span>
            </template>
          </template>
        </a-table>
      </template>

      <template #toolbar>
        <a-button v-if="isShowSocSetting" danger v-auth="['lims:soc:create']" @click="qcSettingModal">
          芯片数据质控设置
        </a-button>
        <a-button danger v-auth="['lims:soc:create']" @click="handleSyncFile">
          同步芯片文件
        </a-button>
        <a-button type="primary" v-auth="['lims:soc:create']" :preIcon="IconEnum.ADD" @click="handleCreate">
          上传新增数据
        </a-button>

        <!-- <a-button v-auth="['lims:soc:export']" :preIcon="IconEnum.EXPORT" @click="handleExport">
          {{ t('action.export') }}
        </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              label: '创建分析',
              auth: 'lims:soc:update',
              onClick: handleCreateAnalysis.bind(null, record),
            },
          ]" :drop-down-actions="record.fileVerifyStatus === FileIntegrityCheckStatusEnum.FAILED
                ? [
                  {
                    danger: true,
                    label: '补充文件',
                    auth: 'lims:soc:delete',
                    onClick: handleSupplementFile.bind(null, record),
                  },
                  {
                    danger: true,
                    label: t('action.delete'),
                    auth: 'lims:soc:delete',
                    popConfirm: {
                      title: t('common.delMessage'),
                      placement: 'left',
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]
                : [
                  {
                    danger: true,
                    label: t('action.delete'),
                    auth: 'lims:soc:delete',
                    popConfirm: {
                      title: t('common.delMessage'),
                      placement: 'left',
                      confirm: handleDelete.bind(null, record),
                    },
                  },
                ]
              " />
        </template>
      </template>

      <template #reportAddress="{ text }">
        <a v-if="text != null && text.length > 0" style="color: rgb(24 144 255 / 100%)" @click="handleReportAddress(text)">
          [查看报告]
        </a>
        <span v-else style=" color: rgb(217 217 217);">[查看报告]</span>
      </template>

      <template #qcStatus="{ text, record }">
        <!-- <span style="color: rgb(255 77 79 / 100%)"
          >不合格<FileTextOutlined
            class="icon-success"
            @click="taskdetailsModal"
        /></span> -->
        <span v-if="text === QcStatusEnum.UNKNOWN || record.reportAddress == null || record.reportAddress.length <= 0">-</span>
        <span v-else-if="text === QcStatusEnum.PASS">合格
          <FileTextOutlined class="icon-success" @click="taskdetailsModal(record.id, record.socName)" />
        </span>
        <span v-else-if="text === QcStatusEnum.FAIL" style="color: rgb(255 77 79 / 100%)">不合格
          <FileTextOutlined class="icon-success" @click="taskdetailsModal(record.id, record.socName)" />
        </span>
        <span v-else-if="text === QcStatusEnum.WARNING" style="color: #FA9614">预警
          <FileTextOutlined class="icon-success" @click="taskdetailsModal(record.id, record.socName)" />
        </span>
      </template>

      <template #fileVerifyStatus="{ text, record }">
        <template v-if="text === FileIntegrityCheckStatusEnum.FAILED">
          <span style="color: rgb(255 77 79 / 100%)">缺失({{ record.integrityPassCount }}/{{
            record.integrityCount
          }})</span>
          <FileSyncOutlined class="icon-success" @click="handleSelectFile(record)" />
        </template>
        <template v-else-if="text === FileIntegrityCheckStatusEnum.PASSED">
          <span>完整({{ record.integrityPassCount }}/{{
            record.integrityCount
          }})</span>
        </template>
        <template v-else-if="text === FileIntegrityCheckStatusEnum.CHECKING">
          <span style="color: rgb(24 144 255)">效验中({{ record.integrityPassCount }}/{{
            record.integrityCount
          }})...
          </span>
        </template>
        <template v-else>
          <span>等待效验 </span>
        </template>
      </template>
    </BasicTable>
    <SocModal @register="registerModal" @success="reload()" />

    <QcSettingModal ref="qcRef" />
    <!-- 质控弹窗 -->
    <TaskDetailsModal ref="tdRef" />

    <a-modal v-model:open="open" wrap-class-name="full-modal" width="100%" title="芯片报告" @close="handleModalClose"
      :footer="null">
      <iframe :src="reportBlobUrl" frameborder="0" style="width: 100%; height: 100%"></iframe>
    </a-modal>

    <SocUpdateModal ref="suRef" @open-file-manager="openFileManager" @success="reload()" />

    <FileManagerModal ref="fileManagerRef" @select-folder="handleSelectFolder" />
  </div>
</template>

<style lang="less" scoped>
.icon-success {
  margin-left: 8px;
  color: rgb(0 0 0 / 25%);
}

.soc-table {
  :deep(.ant-table-expanded-row-level-1) {
    &>.ant-table-cell {
      padding: 0 !important;
    }

    .ant-table-expanded-row-fixed {
      padding: 0 !important;
      margin: 0 !important;

      // .ant-table-cell{
      //   padding: 0 !important;
      // }

      &>.ant-table-wrapper {
        // padding: 0 !important;
      }
    }
  }

  .soc-data-table {
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

<style lang="less">
.full-modal {
  .ant-modal {
    top: 0;
    max-width: 100%;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }

  .ant-modal-body {
    flex: 1;
  }
}

.ttp {
  display: block;
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>
