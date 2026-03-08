<template>
  <div class="analysisReportTable">
    <BasicTable @register="registerTable" :pagination="{ pageSize: 50 }">
      <template #tableTitle>
        <div class="toolbar">
          <div class="samplename" style="min-width: 180px">
            {{ findAnalysisReportDetails?.sample?.examineeName }} - [{{
              report?.sampleCode
            }}]
          </div>
          <div>
            <a-button type="primary" ghost @click="preSample">上一个样本</a-button>
            <a-button type="primary" ghost style="margin-left: 4px;" @click="nextSample">下一个样本</a-button>
          </div>
        </div>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts" setup>
import {
  columns,
} from "./hostgene.data";
import { useI18n } from "@/hooks/web/useI18n";
import { BasicTable, useTable } from "@/components/Table";
import { useGo } from "@/hooks/web/usePage";
import { getAnalysisGeneHostPage } from "@/api/lims/analysisgeneresult";
import { ref } from "vue";
import { FindAnalysisReportDetailsModel } from "@/views/lims/analysistaskdetail/model";
import {
  AnalysisReportAuditRespVO,
} from "@/api/lims/analysistask/model";
defineOptions({ name: "HostGene" });

const { t } = useI18n();

const props = defineProps<{
  /** 查找分析报告详情模型 */
  findAnalysisReportDetails?: FindAnalysisReportDetailsModel;
  /** 报告 */
  report?: AnalysisReportAuditRespVO;
}>();

const emit = defineEmits<{
  (e: "refreshTaskDetail"): void;
  (e: "preSample"): void;
  (e: "nextSample"): void;
}>();

const [registerTable, { reload }] = useTable({
  title: "热点突变",
  api: getAnalysisGeneHostPage,
  columns,
  showIndexColumn: false,
  useSearchForm: false,
  showTableSetting: true,
  // actionColumn: {
  //   width: 140,
  //   title: t("common.action"),
  //   dataIndex: "action",
  //   fixed: "right",
  // },
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

const preSample = () => {
  emit("preSample");
}

const nextSample = () => {
  emit("nextSample");
}

</script>

<style lang="less" scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
}
.samplename {
  font-size: 16px;
  font-weight: bold;
  line-height: 64px;
  margin-right: 8px;
}

.analysisReportTable {
  :deep(.ant-table-wrapper) {
    padding: 0;
  }

  :deep(.ant-table-title) {
    padding: 0 !important;
    line-height: 64px;

    .shengxiang-basic-title {
      padding: 0;
      font-size: 16px;
      font-weight: bold;
    }

    .shengxiang-basic-table-header__toolbar {
      padding: 0;
    }
  }
}

.detecion-table {
  .detecion-data-table {
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
            &:has(.current) {
              background-color: #ffdcdc !important;
            }

            &:has(.water) {
              background-color: #bae7ff !important;
            }

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
    :deep(.table-striped) td {
      background-color: #ffffff;
    }
    :deep(.light) {
      color: red;
    }
  }

  :deep(.ant-table-cell-ellipsis) {
    word-wrap: break-word !important;
  }

  // { label: '未知', value: 0 },
  // { label: '未知', value: 0 },
  //       { label: '主报告', value: 1 },
  //       { label: '疑似致病菌（灰区）', value: 2 },
  //       { label: '不展示', value: 3 },
  //       { label: '不展示（背景）', value: 4 },
  :deep(.ant-table-row) {
    .ant-table-cell {
      /* 给包含指定子元素的父元素设置样式 */
      &:has(.child),
      &:has(.child_1) {
        background-color: rgb(211 247 207 / 100%);
      }

      &:has(.child_0),
      &:has(.child_2) {
        background-color: #e8e8e8;
      }

      &:has(.child_4),
      &:has(.child_3) {
        color: #e61f42;
        background-color: #ffeded;
      }
    }
  }
}

.subtypeclass {
  width: 100px !important; /* 固定宽度 */
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出的内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}

</style>