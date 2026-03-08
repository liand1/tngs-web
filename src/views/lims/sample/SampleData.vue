<script lang="ts" setup>
import SampleModal from "./SampleModal.vue";
import { columns, searchFormSchema } from "./sample.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { useModal } from "@/components/Modal";
import { IconEnum } from "@/enums/appEnum";
import { BasicTable, TableAction, useTable } from "@/components/Table";
import { deleteSample, deleteSamples, getSamplePage } from "@/api/lims/sample";
import { getSampleBatchId } from "@/api/lims/sample-batch";
import {
  checkTypeOptions,
  createTypeOptions,
  fetchDictData,
  handleSelectSchemas,
  sampleTypeOptions,
} from "./index";
import { SampleCheckReagent } from "@/enums/customEnum";
import { useGo } from "@/hooks/web/usePage";

import SampleUpdateModal from "./template/sampleupdate/index.vue";

import { onMounted, ref } from "vue";

const suRef = ref<InstanceType<typeof SampleUpdateModal>>();

const go = useGo();
defineOptions({ name: "Sample" });

const { t } = useI18n();
const { createMessage, createConfirm } = useMessage();
const [registerModal, { openModal }] = useModal();

// 在组件挂载时获取字典数据
onMounted(() => {
  fetchDictData();
});

const [registerTable, { reload }] = useTable({
  title: "样本管理",
  api: getSamplePage,
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
    // 处理样本类型字段
    if (col.dataIndex === "sampleType") {
      return {
        ...col,
        customRender: ({ text }) => {
          const option = sampleTypeOptions.value.find(
            (opt) => opt.value === text.toString()
          );
          return option ? option.label : text;
        },
      };
    }
    // 处理检测项目字段
    if (col.dataIndex === "checkType") {
      return {
        ...col,
        customRender: ({ text }) => {
          const option = checkTypeOptions.value.find(
            (opt) => opt.value === text.toString()
          );
          return option ? option.label : text;
        },
      };
    }
    // 处理检测项目字段
    if (col.dataIndex === "checkReagent") {
      return {
        ...col,
        customRender: ({ text }) => {
          return text ? SampleCheckReagent[text] : '';
        },
      };
    }
    return col;
  }),

  showIndexColumn: false,
  formConfig: {
    labelWidth: 120,
    schemas: handleSelectSchemas(searchFormSchema, () => {}),
    rowProps: {
      gutter: [0, 20],
    },
    actionColOptions: {
      span: 6, // 占满整行
      style: { textAlign: "right", marginBottom: "10px" }, // 按钮右对齐，底部添加间距
    },
    // 显示展开/收起按钮
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
    redo: false,
    size: true,
    setting: true,
    fullScreen: false,
    form: false,
  },
});
const sampleIds = ref<number[]>([]);

const rowSelection = ref({
  checkStrictly: false,
  onChange: (_: (string | number)[], selectedRows: any[]) => {
    sampleIds.value = selectedRows.map((item) => item.id);
    console.log(sampleIds.value);
  },
});

//批量上传样本
function handleUpdate() {
  suRef.value?.showModal();
}

function handleCreate() {
  openModal(true, { isUpdate: false });
}

function handleEdit(record: Recordable) {
  openModal(true, { record, isUpdate: true });
}

const handleDetail = async (record: Recordable) => {
  // const id = await getSampleBatchId(record.batchCode);
  go({
    name: "SampleDetailToid",
    params: {
      sampleId: record.id,
      id: record.batchCode,
    },
  });
}

async function handleDelete(record: Recordable) {
  await deleteSample(record.id);
  createMessage.success(t("common.delSuccessText"));
  reload();
}

async function handleDeletes() {
  createConfirm({
    title: '批量删除',
    content: `是否确认删除共计 ${sampleIds.value.length} 条样本数据？`,
    iconType: 'warning',
    onOk: async () => {

      try {
        const res = await deleteSamples(sampleIds.value);
        if (res.code !== 1003001005 && res.code !== 1003001006) {
          createMessage.success(t("common.delSuccessText"));
          reload();
          sampleIds.value = [];

        }
      } catch (error) {

      }


    },
    onCancel: () => {

    }
  })
}





</script>
<template>
  <div>
    <BasicTable @register="registerTable" :pagination="{ pageSize: 50 }" :row-selection="rowSelection">
      <template #toolbar>
        <a-button danger v-auth="['lims:sample:export']" @click="handleDeletes"
          :disabled="sampleIds.length === 0">批量删除样本</a-button>
        <!-- <a-button danger v-auth="['lims:sample:export']" @click="handleUpdate">批量导入样本</a-button> -->

        <!-- <a-button type="primary" v-auth="['lims:sample:create']" :preIcon="IconEnum.ADD" @click="handleCreate">
          新增样本
        </a-button> -->
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              // icon: IconEnum.EDIT,
              label: '查看',
              auth: 'lims:sample:update',
              onClick: handleDetail.bind(null, record),
            },
            // {
            //   // icon: IconEnum.EDIT,
            //   label: '编辑',
            //   auth: 'lims:sample:update',
            //   onClick: handleEdit.bind(null, record),
            // },
            {
              // icon: IconEnum.DELETE,
              danger: true,
              label: t('action.delete'),
              auth: 'lims:sample:delete',
              popConfirm: {
                title: t('common.delMessage'),
                placement: 'left',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]" />
        </template>
      </template>
    </BasicTable>
    <SampleModal @register="registerModal" @success="reload()" :type="1"/>

    <SampleUpdateModal ref="suRef" @success="reload()"/>
  </div>
</template>
