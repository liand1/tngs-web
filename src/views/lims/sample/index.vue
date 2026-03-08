<script lang="ts" setup>
import SampleModal from "./SampleModal.vue";
import { columns, searchFormSchema } from "./index.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { useModal } from "@/components/Modal";
import { IconEnum } from "@/enums/appEnum";
import { BasicTable, TableAction, useTable } from "@/components/Table";
import { getSampleBatchPage, deleteSampleBatch, updateAnalysisStatus } from '@/api/lims/sample-batch';
import {
  checkTypeOptions,
  createTypeOptions,
  fetchDictData,
  handleSelectSchemas,
  sampleTypeOptions,
} from "./index";
import { SampleChipStatus, SampleAnalysisStatus } from "@/enums/customEnum";
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
  title: "批次列表",
  api: getSampleBatchPage,
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
    //处理分析状态
    // if (col.dataIndex === "chipStatus") {
    //   return {
    //     ...col,
    //     customRender: ({ text }) => {
    //       return text ? SampleChipStatus[text] : '';
    //     },
    //   };
    // }
    return col;
  }),

  showIndexColumn: false,
  formConfig: {
    labelWidth: 80,
    schemas: handleSelectSchemas(searchFormSchema, () => {}),
    rowProps: {
      gutter: [0, 20],
    },
    actionColOptions: {
      span: 3, // 占满整行
      style: { textAlign: "right", marginBottom: "10px" }, // 按钮右对齐，底部添加间距
    },
    // 显示展开/收起按钮
    showAdvancedButton: false,
  },
  useSearchForm: true,

  showTableSetting: false,
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

//批量上传样本
function handleUpdate() {
  suRef.value?.showModal();
}

function handleCreate() {
  openModal(true, { isUpdate: false });
}

const handleEdit = async (record: Recordable) => {
  if(record.analysisStatus == 1) {
    await updateAnalysisStatus(record.id, 2);
  } else if(record.analysisStatus == 2) {
    await updateAnalysisStatus(record.id, 1);
  }
  reload();
}

function handleDetail(record: Recordable) {
  go({
    name: "SampleDetailToid",
    params: {
      id: record.batchCode,
      sampleId: 0,
    },
  });
}

async function handleDelete(record: Recordable) {
  createConfirm({
    title: '删除样本批次',
    content: `是否确认删除该批次与批次下共计 ${record.sampleCount} 条样本数据吗？`,
    iconType: 'warning',
    onOk: async () => {

      try {
        const res = await deleteSampleBatch(record.id);
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

const completeAdd = async (sampleBatchDO) => {
  console.log('sampleBatchDO:', sampleBatchDO);
  //已关联
  if(sampleBatchDO.chipStatus == 1) {
    createConfirm({
      title: '系统检测到对应芯片数据',
      content: `系统检测到对应芯片文件，【是/否】立即开始分析认为？`,
      iconType: 'success',
      okText: '是，立即开始',
      cancelText: '否，稍后手动创建',
      onOk: async () => {
        await updateAnalysisStatus(sampleBatchDO.id, 2);
        reload();
      },
      onCancel: () => {
        reload();
      }
    });
  } else {
    createConfirm({
      title: '系统未检测到对应芯片数据',
      content: `系统将持续检测下机数据，检测到对应芯片文件下机后【是/否】自动开始任务？`,
      iconType: 'warning',
      okText: '是，执行自动分析',
      cancelText: '否，稍后手动创建',
      onOk: async () => {
        await updateAnalysisStatus(sampleBatchDO.id, 2);
        reload();
      },
      onCancel: () => {
        reload();
      }
    });
  }
  
  
}


</script>
<template>
  <div>
    <BasicTable @register="registerTable" :pagination="{ pageSize: 50 }">
      <template #toolbar>
        <!-- <a-button danger v-auth="['lims:sample:export']" @click="handleDeletes"
          :disabled="sampleIds.length === 0">批量删除样本</a-button> -->
        <a-button danger v-auth="['lims:sample:export']" @click="handleUpdate">批量导入</a-button>

        <a-button type="primary" v-auth="['lims:sample:create']" :preIcon="IconEnum.ADD" @click="handleCreate">
          新增批次
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              // icon: IconEnum.EDIT,
              label: '查看详情',
              auth: 'lims:sample:update',
              onClick: handleDetail.bind(null, record),
            },
            
          ]" :dropDownActions="record.analysisStatus == 1 || record.analysisStatus == 2 ? [
            {
              label: `${record.analysisStatus == 1 ? '执行自动分析' : record.analysisStatus == 2 ? '取消自动分析' : ''}`,
              auth: 'lims:sample:update',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: `删除`,
              auth: 'lims:sample:update',
              onClick: handleDelete.bind(null, record),
            },
          ] : [{
              label: `删除`,
              auth: 'lims:sample:update',
              onClick: handleDelete.bind(null, record),
            }]" />
        </template>
        <template v-if="column.key === 'analysisStatus'">
          <span v-if="record.analysisStatus == 1">{{ SampleAnalysisStatus[record.analysisStatus] }}</span>
          <span style="color: #FA9614;" v-if="record.analysisStatus == 2">{{ SampleAnalysisStatus[record.analysisStatus] }}</span>
          <span style="color: #52C41A;" v-if="record.analysisStatus == 3">{{ SampleAnalysisStatus[record.analysisStatus] }}</span>
        </template>
        <template v-if="column.key === 'chipStatus'">
          <span v-if="record.chipStatus == 0">{{ SampleChipStatus[record.chipStatus] }}</span>
          <span style="color: #1890FF" v-if="record.chipStatus == 1">{{ SampleChipStatus[record.chipStatus] }}</span>
        </template>
      </template>
    </BasicTable>
    <SampleModal @register="registerModal" @success="reload()" :type="1"/>

    <SampleUpdateModal ref="suRef" @success="completeAdd"/>
  </div>
</template>
