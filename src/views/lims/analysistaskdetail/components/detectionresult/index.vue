<template>
  <div class="report-result-table">
    <BasicTable @register="registerTable" rowKey="id" :scroll="{ x: 3600, y: 700 }" bordered :pagination="false"
      class="detecion-table" v-model:expandedRowKeys="expandedRowKeys" @expand="handleExpand">
      <template #tableTitle>
        <div class="samplename">
          {{ findAnalysisReportDetails?.sample?.sourceCode }} - [{{
            report?.sampleCode
          }}]
        </div>
      </template>

      <template #expandedRowRender="{ record }">
        <div style="width: 100%">
          <a-spin v-if="loadingKeys.includes(record.id)" />
          <a-table v-else class="detecion-data-table" :columns="subColumns[record.id]"
            :data-source="subDataMap[record.id]" :pagination="false" size="small" row-key="key" bordered
            :scroll="{ x: 1000, y: 700 }">
            <template #bodyCell="{ column, text }">
              <template v-if="keysObj.current.includes(column.dataIndex)">
                <span class="this-sample-code current">{{ text }}</span>
              </template>
              <template v-else-if="keysObj.water.includes(column.dataIndex)">
                <span class="this-sample-code water">{{ text }}</span>
              </template>
            </template>
          </a-table>
        </div>
      </template>
      <!-- rgba(211, 247, 207, 1) -->
      <template #byLabel="{ text }">
        <span :class="'child_' + text">{{ byLabelMap[text] }}</span>
      </template>

      <template #initialByLabel="{ text }">
        <span :class="'child_' + text">{{ byLabelMap[text] }}</span>
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
  </div>
</template>

<script setup lang="ts">
import {
  byLabelMap,
  columns as rawColumns,
  pathogenTypeMap,
  expandedRowKeys,
  loadingKeys,
  subColumns,
  subDataMap,
  handleExpand,
  keysObj,
} from "./index";
import { FindAnalysisReportDetailsModel } from "../../model";
import { BasicTable, useTable } from "@/components/Table";
import { watch } from "vue";
import { ReportListModel } from "@/views/lims/analysistask/model";

const props = defineProps<{
  findAnalysisReportDetails?: FindAnalysisReportDetailsModel;
  report?: ReportListModel;
}>();
const columns = rawColumns.map((col: any) => {
  col.width = col.width || 140;
  if (col.dataIndex === "pathogenType") {
    return {
      ...col,

      customRender: ({ text }) => pathogenTypeMap[text] ?? text,
    };
  }
  // 可继续添加其他枚举字段映射
  col.align = "center";

  return col;
});

function levellingReadsCustomRender(text: string) {
  //右括号去掉
  if (!isNaN(Number(text))) {
    return Number(text) <= 1 ? 1 : Math.round(Number(text))
  }

  const reads = text.slice(0, text.indexOf('('))
  const mutationRate = text.slice(text.indexOf('('))
  
  return Number(reads) > 1 ? `${Math.round(reads as unknown as number)}${mutationRate}` : `1${mutationRate}`
}

const [registerTable, { setTableData }] = useTable({
  api: async () => {
    return {
      list: [],
      total: 0,
    };
  },
  columns,
  showIndexColumn: false,
  formConfig: {
    labelWidth: 120,
    rowProps: {
      gutter: [0, 20],
    },
  },
  useSearchForm: false,
  showTableSetting: true,
  actionColumn: {
    width: 1,
    title: "",
    dataIndex: "action",
    fixed: "right",
  },
  tableSetting: {
    // 是否显示刷新按钮
    redo: false,
    // 是否显示尺寸调整按钮
    size: false,
    // 是否显示字段调整按钮
    setting: false,
    // 是否显示全屏按钮
    fullScreen: false,
    //是否显示搜搜按钮
    form: false,
  },
});

watch(
  () => props.findAnalysisReportDetails?.resultList,
  (newVal) => {
    newVal && setTableData(newVal);
    keysObj.value = {
      current: [],
      water: [],
    };
    subColumns.value = [];
    subDataMap.value = [];
  }
);

// 生成带customRender的columns
</script>

<style lang="less" scoped>
.report-result-table {
  // margin: 20px;
}

.ant-table {
  font-size: 14px;

  .ant-table-thead>tr>th {
    font-weight: bold; // 表头字体加粗
    color: #333; // 表头文字颜色
    background-color: #f0f0f0; // 表头背景色
  }

  .ant-table-tbody>tr>td {
    padding: 8px 16px; // 单元格内边距
  }
}

.detecion-table {
  :deep(.ant-table-expanded-row-level-1) {
    &>.ant-table-cell {
      padding: 0 !important;
    }

    .ant-table-expanded-row-fixed {
      padding: 0 !important;
      margin: 0 !important;
    }
  }

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
  }

  :deep(.ant-table-title) {
    padding: 0 !important;
  }

  :deep(.shengxiang-basic-table-header__toolbar) {
    padding: 0 !important;
  }

  :deep(.ant-table-wrapper) {
    padding: 0 !important;
  }

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

.samplename {
  height: 64px;
  font-size: 16px;
  font-weight: bold;
  line-height: 64px;
}
</style>