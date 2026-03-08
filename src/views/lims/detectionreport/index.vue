<script lang="ts" setup>
import AnalysisReportModal from "./detectionReportModal.vue";
import { columns, searchFormSchema } from "./detectionReport.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { useModal } from "@/components/Modal";
import { BasicTable, TableAction, useTable } from "@/components/Table";

import {
  exportAnalysisResult,
  exportAnalysisCheckoutResult,
  getCheckOutResultPage,
} from "@/api/lims/analysisresult";
import dayjs from "dayjs";
import { onMounted, ref } from "vue";
import { useGo } from "@/hooks/web/usePage";
import { formatTimeToTimes } from "@/utils/custom";
// import { exportAnalysisReport } from "@/api/lims/analysisreport";

defineOptions({ name: "AnalysisReport" });

const { t } = useI18n();
const { createMessage } = useMessage();
const [registerModal] = useModal();

// 准备默认查询参数 - 最近两个月
const defaultTimeStart = dayjs().subtract(1, "month");
const defaultTimeEnd = dayjs();
const go = useGo();

let isFirst = true;

function levellingReadsCustomRender(text: string) {
  //右括号去掉
  if (!isNaN(Number(text))) {
    return Number(text) <= 1 ? 1 : Math.round(Number(text))
  }

  const reads = text.slice(0, text.indexOf('('))
  const mutationRate = text.slice(text.indexOf('('))
  return Number(reads) > 1 ? `${Math.round(reads as unknown as number)}${mutationRate}` : `1${mutationRate}`
}
// 搜索前预处理，验证时间范围
function beforeSearch(params) {

  if (isFirst) {
    isFirst = false;
    // 如果没有设置时间范围，使用默认范围
    // params.checkOutStartTime = defaultTimeStart.valueOf();
    // params.checkOutEndTime = defaultTimeEnd.valueOf();

    [params.checkOutStartTime, params.checkOutEndTime] = formatTimeToTimes([
      defaultTimeStart,
      defaultTimeEnd,
    ]);
    params.checkOutStartTime = new Date(params.checkOutStartTime).getTime();
    params.checkOutEndTime = new Date(params.checkOutEndTime).getTime();
  }
  // if (params.checkOutStartTime && params.checkOutEndTime) {
  //   getForm().setFieldsValue({
  //     checkOutTime: [
  //       dayjs(Number(params.checkOutStartTime)).toDate(),
  //       dayjs(Number(params.checkOutEndTime)).toDate(),
  //     ],
  //   });
  // }




  return params;
}

const [registerTable, { getForm, reload }] = useTable({
  title: "检出查询列表",

  api: (args) => {
    // 使用自定义预处理
    const params = beforeSearch({ ...args });
    if (params.checkOutStartTime && params.checkOutEndTime) {
      const [checkOutStartTime, checkOutEndTime] = formatTimeToTimes([
        params.checkOutStartTime,
        params.checkOutEndTime,
      ]);

      // console.log(checkOutStartTime, checkOutEndTime);


      params.checkOutStartTime = new Date(checkOutStartTime).getTime();
      params.checkOutEndTime = new Date(checkOutEndTime).getTime();
    }



    return getCheckOutResultPage(params);
  },
  columns,
  useSearchForm: true,
  showTableSetting: true,
  showIndexColumn: false,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    rowProps: {
      gutter: [0, 20],
    },
    // 设置默认值
    fieldMapToTime: [
      [
        "checkOutTime",
        ["checkOutStartTime", "checkOutEndTime"],
        "x", // 使用时间戳格式
      ],
    ],
    // 重要：将按钮位置设置为顶部
    // 操作按钮组的配置
    actionColOptions: {
      span: 24, // 占满整行
      style: { textAlign: "right", marginBottom: "10px" }, // 按钮右对齐，底部添加间距
    },
    showAdvancedButton: false,
  },
  immediate: false, // 组件加载时不立即请求

  tableSetting: {
    // 是否显示刷新按钮
    redo: false,
    // 是否显示尺寸调整按钮
    size: true,
    // 是否显示字段调整按钮
    setting: true,
    // 是否显示全屏按钮
    fullScreen: false,
    //是否显示搜搜按钮
    form: false,
  },

  actionColumn: {
    width: 155,
    title: t("common.action"),
    dataIndex: "action",
    fixed: "right",
  },
});

// 组件挂载后，设置表单默认值并加载数据
onMounted(() => {
  // 设置表单默认时间范围
  getForm().setFieldsValue({
    checkOutTime: [defaultTimeStart.toDate(), defaultTimeEnd.toDate()],
  });
  // 加载数据
  reload();
});

// function handleEdit(record: Recordable) {
//   openModal(true, { record, isUpdate: true });
// }
// function handleCreate() {
//   openModal(true, { isUpdate: false });
// }

// async function handleExport() {
//   createConfirm({
//     title: t("common.exportTitle"),
//     iconType: "warning",
//     content: t("common.exportMessage"),
//     async onOk() {
//       await exportAnalysisReport(getForm().getFieldsValue());
//       createMessage.success(t("common.exportSuccessText"));
//     },
//   });
// }

// async function handleDelete(record: Recordable) {
//   await deleteAnalysisReport(record.id);
//   createMessage.success(t("common.delSuccessText"));
//   reload();
// }

function handleOpenTaskDetails(record: Recordable) {
  go(`/lims/analysis-task/detail/${record.taskId}`);
  console.log(record);
}

function handleOpenSampleDetails(record: Recordable) {
  go(`/sample/detail/${record.batchCode}/${record.sampleId}`);
  console.log(record);
}

const selectedRowKeysRf = ref<(string | number)[]>([]);
function handleDownload() {
  // const params: any = {
  //   type: 1,
  //   time: [0, 0],
  //   sampleIds: [],
  // };

  // if (selectedRowKeysRf.value.length === 0) {
  //   const { checkOutStartTime, checkOutEndTime } = getForm().getFieldsValue();

  //   params.time = [Number(checkOutStartTime), Number(checkOutEndTime)];
  //   params.type = 1;
  // } else {
  //   params.sampleIds = selectedRowKeysRf.value;
  //   params.type = 2;
  // }
  let params = getForm().getFieldsValue();
  if (params.checkOutStartTime && params.checkOutEndTime) {
    const [checkOutStartTime, checkOutEndTime] = formatTimeToTimes([
      params.checkOutStartTime,
      params.checkOutEndTime,
    ]);

    // console.log(checkOutStartTime, checkOutEndTime);


    params.checkOutStartTime = new Date(checkOutStartTime).getTime();
    params.checkOutEndTime = new Date(checkOutEndTime).getTime();
  }

  // exportAnalysisResult(getForm().getFieldsValue());
  exportAnalysisCheckoutResult(params);
  //接口请求
  console.log(params);
}

// const rowSelection = ref({
//   checkStrictly: false,
//   onChange: (selectedRowKeys: (string | number)[]) => {
//     selectedRowKeysRf.value = selectedRowKeys;
//   },
// });
</script>
<template>
  <div>
    <BasicTable @register="registerTable" :pagination="{ pageSize: 50 }" rowKey="id">
      <template #toolbar>
        <div style="height: 32px"></div>
        <!-- <a-button>导出Excel</a-button> -->
        <a-button
          danger
          v-auth="['lims:analysis-report:create']"
          @click="handleDownload"
        >
          下载当前查询结果
        </a-button>
        <!--   <a-button
            :preIcon="IconEnum.ADD"
          v-auth="['lims:analysis-report:export']"
          :preIcon="IconEnum.EXPORT"
          @click="handleExport"
        >
          {{ t("action.export") }}
        </a-button> -->
        <!-- <a-button
          danger
          v-auth="['lims::analysis-report:create']"
          @click="handleOpenTaskSetting"
        >
          下载当前查询结果
        </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              // icon: IconEnum.EDIT,
              label: '查看样本',
              auth: 'lims:analysis-report:update',
              onClick: handleOpenSampleDetails.bind(null, record),
            },
            {
              // icon: IconEnum.EDIT,
              label: '查看任务',
              auth: 'lims:analysis-report:update',
              onClick: handleOpenTaskDetails.bind(null, record),
            },
            // {
            //   icon: IconEnum.EDIT,
            //   label: t('action.edit'),
            //   auth: 'lims:analysis-report:update',
            //   onClick: handleEdit.bind(null, record),
            // },
            // {
            //   icon: IconEnum.DELETE,
            //   danger: true,
            //   label: t('action.delete'),
            //   auth: 'lims:analysis-report:delete',
            //   popConfirm: {
            //     title: t('common.delMessage'),
            //     placement: 'left',
            //     confirm: handleDelete.bind(null, record),
            //   },
            // },
          ]" />
        </template>
      </template>

      <template #pathogenGeneName="{ column, record }">
        <input :value="record.pathogenGeneName" />
      </template>

      <template #levellingReads="{ text }">
        <a-tooltip placement="top">
          <template #title>
            <span>{{ text }}</span>
          </template>
          {{ levellingReadsCustomRender(text) }}
        </a-tooltip>
      </template>
    </BasicTable>
    <AnalysisReportModal @register="registerModal" @success="reload()" />
  </div>
</template>
