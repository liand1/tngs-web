<template>
  <div class="analysisReportTable">
    <BasicTable @register="registerTable" bordered :pagination="false" v-model:expandedRowKeys="expandedRowKeys"
      @expand="handleExpand" :row-selection="isCurrentAudit || isCurrentAgain ? rowSelection : null" :scroll="{ x: dataLength == 0 ? 2600 : 'max-content', y: 700 }"
      class="detecion-table">
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
      <template #toolbar>
        <template v-if="isCurrentAudit || isCurrentAgain">
          <a-button v-auth="['lims:analysis-report:update']" @click="handleChangeByLabel(ByLabelEnum.MAIN_REPORT)">
            转为主报告
          </a-button>
          <a-button v-auth="['lims:analysis-report:update']" @click="handleChangeByLabel(ByLabelEnum.SUSPECT)">
            转为疑似病原体
          </a-button>
          <a-button v-auth="['lims:analysis-report:update']" @click="handleChangeByLabel(ByLabelEnum.HIDDEN)">
            不在报告中展示
          </a-button>
        </template>
      </template>

      <!-- 自定义展开行 -->
      <template #expandedRowRender="{ record }">
        <div>
          <a-spin v-if="loadingKeys.includes(record.id)" />
          <a-table v-else class="detecion-data-table" :columns="subColumns[record.id]"
            :data-source="subDataMap[record.id]" :pagination="false" size="small" row-key="key" bordered
            :scroll="{ x: 1000, y: 700 }"
            :row-class-name="(_record, index) => (index % 2 !== 1 ? 'table-striped' : null)"
            >
            <template #bodyCell="{ column, text }">
              <template v-if="keysObj.current.includes(column.dataIndex)">
                <span class="this-sample-code current" :class="!isNaN(text) && text > 0 ? 'light' : ''">{{ text }}</span>
              </template>
              <template v-else-if="keysObj.water.includes(column.dataIndex)">
                <span class="this-sample-code water" :class="!isNaN(text) && text > 0 ? 'light' : ''">{{ text }}</span>
              </template>
              <template v-else>
                <span :class="!isNaN(text) && text > 0 ? 'light' : ''">{{ text }}</span>
              </template>
            </template>
          </a-table>
        </div>
      </template>
      <!-- v-if="isCurrentAudit" -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action' && (isCurrentAudit || isCurrentAgain)">
          <TableAction :actions="[
            {
              label: '编辑',
              auth: 'lims:analysis-report:update',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '复制',
              auth: 'lims:analysis-report:update',
              onClick: copyReport.bind(null, record),
            },
            {
              label: '删除',
              auth: 'lims:analysis-report:update',
              onClick: handleDelete.bind(null, record),
            },
          ]" />
        </template>
      </template>

      <!-- rgba(211, 247, 207, 1) -->
      <template #byLabel="{ text }">
        <span :class="'child_' + text">{{ byLabelMap[text] }}</span>
      </template>

      <template #initialByLabel="{ text }">
        <span :class="'child_' + text">{{ byLabelMap[text] }}</span>
      </template>

      <template #subtype="{ text }">
        <a-tooltip>
          <template #title>{{ text }}</template>
          <span class="subtypeclass">{{ text.length > 15 ? `${text.substring(0, 15)}...` : text}}</span>
        </a-tooltip>
      </template>

      <template #levellingReads="{ text }">
        <a-tooltip placement="top">
          <template #title>
            <span>{{ text }}</span>
          </template>
          {{ levellingReadsCustomRender(text) }}
        </a-tooltip>
      </template>

      <template #pathogenCnSname="{ text, record }">
        <a-tooltip>
          <template #title>{{ record.pathogenComments }}</template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>

      <template #levellingReads_tbl="{ text, record }">
        <span :class="'child_' + text">{{ levellingReads_tblRende(record) }}</span>
      </template>

    </BasicTable>

    <IndexModal @register="registerModal" @success="emit('refreshTaskDetail')" />
  </div>
</template>
<script lang="ts" setup>
import { columns } from "./index.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { useModal } from "@/components/Modal";
import { BasicTable, TableAction, useTable } from "@/components/Table";
import IndexModal from "./indexModal.vue";
import { FindAnalysisReportDetailsModel } from "@/views/lims/analysistaskdetail/model";
import {
  AnalysisReportAuditRespVO,
  resultListModel,
} from "@/api/lims/analysistask/model";
import {
  subColumns,
  subDataMap,
  loadingKeys,
  keysObj,
  handleExpand,
  expandedRowKeys,
} from "./index";
import { byLabelMap } from "./index.data";
import { ref, watch } from "vue";
import {
  updateAuditResultByLabel,
  copyAnalysisResult,
  deleteAnalysisResult,
} from "@/api/lims/analysisresult";
import {
  ByLabelEnum,
  ByLabelEnumMap,
  PathogenTypeEnum,
} from "@/enums/customEnum";
import { Modal } from "ant-design-vue";

const props = defineProps<{
  /** 查找分析报告详情模型 */
  findAnalysisReportDetails?: FindAnalysisReportDetailsModel;
  /** 报告 */
  report?: AnalysisReportAuditRespVO;
  /** 是否是当前审核人 */
  isCurrentAudit?: boolean;
  /** 是否重出报告的人 */
  isCurrentAgain?: boolean;
}>();

const emit = defineEmits<{
  (e: "refreshTaskDetail"): void;
  (e: "preSample"): void;
  (e: "nextSample"): void;
}>();

const dataLength = ref(0);

const { t } = useI18n();
const { createMessage } = useMessage();
const [registerModal, { openModal }] = useModal();

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
    labelWidth: 150,
    rowProps: {
      gutter: [0, 20],
    },
  },
  useSearchForm: false,
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

function handleEdit(record: Recordable) {
  openModal(true, { record, isUpdate: true });
}


function levellingReadsCustomRender(text: string) {
  //右括号去掉
  if (!isNaN(Number(text))) {
    return Number(text) <= 1 ? 1 : Math.round(Number(text))
  }

  // const reads = text.slice(0, text.indexOf('('))
  // const mutationRate = text.slice(text.indexOf('('))
  const reads = text.toString().replace(/\([^)]*%\)/g, '').trim();
  return Number(reads) > 1 ? `${Math.round(reads as unknown as number)}` : `1`
}

function levellingReads_tblRende(record: Recordable) {
  if(!record.levellingReads) {
    return '';
  }
  const match = record.levellingReads.toString().match(/\(([^)]*%)\)/);
  return match ? match[1] : '-'; // 如果有匹配，返回括号内的百分比，否则返回空字符串
}

//删除
async function handleDelete(record: Recordable) {
  Modal.confirm({
    title: "操作确认",
    content: `确定要删除该条结果吗？`,
    okText: "确认",
    cancelText: "取消",
    async onOk() {
      try {
        // 先调用删除API
        await deleteAnalysisResult(record.id);

        // 然后刷新父组件
        emit("refreshTaskDetail");

        // 显示成功消息
        createMessage.success(`删除成功`);
      } catch (error) {
        console.error("删除失败:", error);
        createMessage.error("删除失败，请重试");
      }
    },
  });
}

const reportIds = ref<number[]>([]);

const rowSelection = ref({
  checkStrictly: false,
  onChange: (_: (string | number)[], selectedRows: any[]) => {
    reportIds.value = selectedRows.map((item) => item.id);
  },
});

watch(
  () => props.findAnalysisReportDetails?.resultList,
  (newVal) => {
    newVal && setTableData(newVal);
    dataLength.value = newVal ? newVal.length : 0;
    keysObj.value = {
      current: [],
      water: [],
    };
    subColumns.value = [];
    subDataMap.value = [];
  }
);

//复制
async function copyReport(record: resultListModel) {
  Modal.confirm({
    title: "操作确认",
    content: `确定要复制该条结果吗？`,
    okText: "确认",
    cancelText: "取消",
    async onOk() {
      try {
        // 生成4位随机数
        // const randomNum = Math.floor(1000 + Math.random() * 9000);
        const newResult = {
          ...record,
          pathogenCnSname: record.pathogenCnSname + `（删除括号内内容）`,
          pathogenSourceCnSname: record.pathogenCnSname,
        };
        // 使用传入的record，复制所有必要的字段
        await copyAnalysisResult(newResult);

        emit("refreshTaskDetail");

        createMessage.success(`复制结果成功`);
      } catch (error) {
        console.error("复制失败:", error);
        createMessage.error("复制结果失败，请重试");
      }
    },
  });
}

const handleChangeByLabel = async (label: ByLabelEnum) => {
  if (reportIds.value.length === 0) {
    createMessage.error("请选择要操作的报告");
    return;
  }

  //转为疑似
  if (label === ByLabelEnum.SUSPECT) {
    //获取选中额数据集合
    const resultList = props.findAnalysisReportDetails?.resultList!.filter(
      (item) => reportIds.value.includes(item.id)
    );
    if (resultList) {
      //如果病原体类型为耐药基因获取耐药突变，则不能转为疑似
      const suspectResultList = resultList.filter(
        (item) =>
          item.pathogenType === PathogenTypeEnum.DRUG_RESISTANCE_MUTATION ||
          item.pathogenType === PathogenTypeEnum.DRUG_RESISTANCE
      );

      if (suspectResultList.length > 0) {
        createMessage.error("耐药基因或耐药突变不能转为疑似");
        return;
      }
    }
  }

  try {
    await updateAuditResultByLabel({
      resultIds: reportIds.value,
      byLabel: label,
    });
    createMessage.success(`设置${ByLabelEnumMap[label]}成功`);

    // 清空选择
    reportIds.value = [];
    emit("refreshTaskDetail");
  } catch (error) {
    console.error("操作失败:", error);
    createMessage.error(`设置${ByLabelEnumMap[label]}失败，请重试`);
  }

  // Modal.confirm({
  //   title: "操作确认",
  //   content: `确定要将选中的${reportIds.value.length}个结果设置为${ByLabelEnumMap[label]}吗？`,
  //   okText: "确认",
  //   cancelText: "取消",
  //   async onOk() {
  //     try {
  //       await updateAuditResultByLabel({
  //         resultIds: reportIds.value,
  //         byLabel: label,
  //       });
  //       createMessage.success(`设置${ByLabelEnumMap[label]}成功`);

  //       // 清空选择
  //       reportIds.value = [];
  //       emit("refreshTaskDetail");
  //     } catch (error) {
  //       console.error("操作失败:", error);
  //       createMessage.error(`设置${ByLabelEnumMap[label]}失败，请重试`);
  //     }
  //   },
  // });
}

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