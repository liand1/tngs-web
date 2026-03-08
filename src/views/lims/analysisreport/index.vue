<template>
  <div>
    <BasicTable @register="registerTable" :pagination="{ pageSize: 50 }">
      <!-- 自定义展开行 -->
      <template #expandedRowRender="{ record }">
        <a-table
          :dataSource="record.reportList"
          :columns="analysisReportDataColumns"
          class="anaysistask-data-table"
          :pagination="false"
          :scroll="{ y: 300 }"
        >
          <template #action="{ record }">
            <TableAction
              :style="{}"
              :actions="[
                {
                  label: '下载报告',
                  auth: 'lims:analysis-report:update',
                  onClick: downloadPDF.bind(null, record),
                  disabled: !record.reportFileUrl,
                },
              ]"
            />
          </template>

          <!-- 质控结果特殊显示 -->
          <template #qcStatus="{ text, record }">
            <span v-if="record.sampleType === SampleTypeEnum.WATER_CONTROL">
              -
            </span>
            <span
              v-else-if="text === QcStatusEnum.UNKNOWN"
              style="color: rgb(24 144 255 / 100%)"
              >{{ QcStatusEnumMap[text] }}</span
            >
            <span
              v-else-if="text === QcStatusEnum.PASS"
              style="color: rgb(82 196 26)"
            >
              {{ QcStatusEnumMap[text] }}
            </span>
            <span
              v-else-if="text === QcStatusEnum.FAIL"
              style="color: rgb(255 77 79 / 100%)"
            >
              {{ QcStatusEnumMap[text] }}
            </span>
            <span
              v-else-if="text === QcStatusEnum.WARNING"
              style="color: #FA9614"
            >
              {{ QcStatusEnumMap[text] }}
            </span>

            <span
              v-if="record.sampleType !== SampleTypeEnum.WATER_CONTROL"
              style="margin-left: 10px; cursor: pointer"
              @click="taskdetailsModal(record.id, record.sampleCode)"
            >
              <FileTextOutlined v-if="record.qcStatus === QcStatusEnum.PASS" />
              <FileExclamationOutlined
                style="color: #ff4d4f"
                v-else-if="record.qcStatus === QcStatusEnum.FAIL"
              />
              <FileExclamationOutlined
                style="color: #FA9614"
                v-else-if="record.qcStatus === QcStatusEnum.WARNING"
              />
            </span>
          </template>
        </a-table>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '下载报告',
                auth: 'lims:analysis-report:update',
                onClick: downloadPDFAll.bind(null, record),
                disabled: !record.reportList.some(
                  (item) => item.reportFileUrl != null
                ),
              },
              {
                label: '查看',
                auth: 'lims:analysis-report:update',
                onClick: lookReport.bind(null, record),
              },
            ]"
          />
        </template>
      </template>

      <!-- 任务状态特殊显示 -->
      <template #taskStatus="{ text }">
        <span
          :style="{
            color: taskStatusRenderColor(text),
          }"
          >{{ TaskStatusEnumMap[text] }}</span
        >
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
        >
          {{ QcStatusEnumMap[text] }}
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
        >
          {{ QcStatusEnumMap[text] }}（{{ record.reportQcWarningCount }}/{{
            record.reportCount
          }}）
        </span>
      </template>

      <!-- 审核状态特殊显示 -->
      <template #checkStatus="{ text, record }">
        <!-- <span
          :style="{
            color: checkStatusRenderColor(text),
          }"
          >{{
            // 圆点
            "● " + CheckStatusEnumMap[text]
          }}</span
        > -->
        <div>
          <div v-if="isWaitAudit(record)" class="analysisreport-blue">待审核</div>
          <template v-else>
            <div class="analysisreport-blue" :class="isUnPass1Audit(record) ? 'analysisreport-red' : (isAllPass1Audit(record) ? 'analysisreport-green' : '')" >
              一审完成({{finishedOneAudit(record)}}/{{ record.reportList.length }})
            </div>
            <div class="analysisreport-blue" :class="isUnPass2Audit(record) ? 'analysisreport-red' : (isAllPass2Audit(record) ? 'analysisreport-green' : '')" >
              二审完成({{finishedTwoAudit(record)}}/{{ record.reportList.length }})
            </div>
          </template>
        </div>
      </template>
    </BasicTable>
    <AnalysisReportModal @register="registerModal" @success="reload()" />

    <TaskDetailsModal ref="tdRef" :data="taskDetailData" />
  </div>
</template>

<script lang="ts" setup>
import AnalysisReportModal from "./AnalysisReportModal.vue";
import {
  columns,
  searchFormSchema,
  analysisReportDataColumns,
} from "./analysisReport.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useModal } from "@/components/Modal";
import { BasicTable, TableAction, useTable } from "@/components/Table";
import { useGo } from "@/hooks/web/usePage";
import { getAnalysisAuditTaskPage } from "@/api/lims/analysistask";
import TaskDetailsModal from "@/components/lims/taskdetails/TaskDetailsModal.vue";
import {
  TaskStatusEnum,
  TaskStatusEnumMap,
  QcStatusEnum,
  QcStatusEnumMap,
  CheckStatusEnum,
  CheckStatusEnumMap,
  QcTypeEnum,
  SampleTypeEnum,
} from "@/enums/customEnum";
const tdRef = ref<typeof TaskDetailsModal>();
import {
  FileTextOutlined,
  FileExclamationOutlined,
} from "@ant-design/icons-vue";
import { downloadReport, downLoadUrl } from "@/utils/custom";
import { findQcReportByObjectId } from "@/api/lims/qcreport";
import { ref } from "vue";
import { useMessage } from "@/hooks/web/useMessage";
import { downLoadFile } from "@/api/infra/file";
const go = useGo();
const { createMessage } = useMessage();
defineOptions({ name: "AnalysisReport" });

const { t } = useI18n();
const [registerModal] = useModal();

const [registerTable, { reload }] = useTable({
  title: "分析报告列表",
  api: getAnalysisAuditTaskPage,
  columns,
  showIndexColumn: false,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    rowProps: {
      gutter: [0, 20],
    },
    actionColOptions: {
      span: 24, // 占满整行
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
});

const taskDetailData = {
  title: "质控详情",
  list: [],
};

//下载报告
const downloadPDF = async (record: Recordable) => {
  createMessage.info("下载中...");
  downLoadUrl(record.reportFileUrl, record.sampleCode + "-报告.pdf");
  createMessage.success("下载成功");
};

//下载所有报告
const downloadPDFAll = async (record: Recordable) => {
  createMessage.info("下载中...");
  downLoadUrl(record.reportFileUrl, record.name + "-报告.pdf");
  // const reportFileUrls: { url: string; fileName: string }[] = [];
  // record.reportList
  //   .filter((item) => item.reportFileUrl != null)
  //   .forEach((item) => {
  //     reportFileUrls.push({
  //       url: item.reportFileUrl,
  //       fileName: item.sampleCode + "-报告.pdf",
  //     });
  //   });
  // if (reportFileUrls && reportFileUrls.length > 0) {
  //   await downloadReport(reportFileUrls, record.name + "报告.zip");
  // }
  createMessage.success("下载成功");
};
//查看报告
const lookReport = (record: Recordable) => {
  go({
    name: `AnalysisReportDetailToId`,
    params: { id: record.id }, // 替换为实际ID
  });
  //
};

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

// 审核状态特殊显示
const checkStatusRenderColor = (text: string) => {
  switch (Number(text)) {
    case CheckStatusEnum.WAITING:
      return "#1890FF";
    case CheckStatusEnum.CHECKING:
      return "#1890FF";
    case CheckStatusEnum.PASSED:
      return "#52C41A";
    case CheckStatusEnum.REJECTED:
      return "#FF4D4F";

    default:
      return "";
  }
};

//是否是待审核
const isWaitAudit = (record:any) => {
  if(!record.oneAuditorId && !record.twoAuditorId) {
    return true;
  }
  return false;
}

//一审是否有未通过的报告
const isUnPass1Audit = (record:any) => {
  let flag = false;
  record.reportList.forEach(item => {
    if(item.oneAuditStatus == 4) {
      flag = true;
    }
  })
  return flag;
}

//二审是否有未通过的报告
const isUnPass2Audit = (record:any) => {
  let flag = false;
  record.reportList.forEach(item => {
    if(item.twoAuditStatus == 4) {
      flag = true;
    }
  })
  return flag;
}

//一审是否全部通过
const isAllPass1Audit = (record:any) => {
  let flag = true;
  record.reportList.forEach(item => {
    if(item.processStatus < 6) {
      flag = false;
    }
  })
  return flag;
}

//二审是否全部通过
const isAllPass2Audit = (record:any) => {
  let flag = true;
  record.reportList.forEach(item => {
    if(item.processStatus < 8) {
      flag = false;
    }
  })
  return flag;
}

//一审完成数量
const finishedOneAudit = (record:any) => {
  let num = 0;
  record.reportList.forEach(item => {
    if(item.processStatus >= 6) {
      num++;
    }
  })
  return num;
}

//二审完成数量
const finishedTwoAudit = (record:any) => {
  let num = 0;
  record.reportList.forEach(item => {
    if(item.processStatus >= 8) {
      num++;
    }
  })
  return num;
}

async function taskdetailsModal(id: number, sampleCode: string) {
  // 根据id获取质控记录
  const qcReportList = await findQcReportByObjectId(
    id,
    QcTypeEnum.ANALYSIS_TASK,
    2
  );

  tdRef?.value?.showModal(sampleCode + " 质控详情", qcReportList);
}
</script>



<style lang="less" scoped>
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

        .ant-table-cell-fix-right {
          background-color: rgb(250 250 250 / 100%) !important;
        }
      }
    }
  }
}
.analysisreport-blue {
  color: #1890FF;
}
.analysisreport-red {
  color: #FF4D4F;
}
.analysisreport-green {
  color: #52C41A;
}
</style>