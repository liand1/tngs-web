<script lang="ts" setup>
import { columns, searchFormSchema } from "./selectsoc.data";

// import { IconEnum } from "@/enums/appEnum";
import { BasicTable, useTable } from "@/components/Table";
import { getSoc, getSocPage } from "@/api/lims/soc";
import { ref } from "vue";
import { GetSocPageModel } from "@/views/lims/soc/model";

defineOptions({ name: "SelectSoc" });

const props = defineProps<{
  socId: string;
}>();
let selectedRows: GetSocPageModel[] = [];
const getInitSocPage = async (obj: any) => {
  if (props.socId) {
    const socData = await getSoc(Number(props.socId));
    selectedRows = [socData];
  }

  const res = await getSocPage(
    Object.assign(obj, {
      socId: props.socId,
    })
  );
  return res;
};

const [registerTable, {}] = useTable({
  title: "芯片数据",
  api: getInitSocPage,
  columns,
  showIndexColumn: false,
  formConfig: {
    labelWidth: 120,
    schemas: searchFormSchema,
    rowProps: {
      gutter: [0, 20],
    },
  },
  useSearchForm: true,
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
    size: false,
    // 是否显示字段调整按钮
    setting: false,
    // 是否显示全屏按钮
    fullScreen: false,
    //是否显示搜搜按钮
    form: false,
  },
});

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);
//选中的数据
const selectedRowKeys = ref<string[]>([]);

// 打开模态框方法
const showModal = () => {
  open.value = true;
};

const rowSelection = ref({
  fixed: true,
  selectedRowKeys: selectedRowKeys.value,
  onChange: (selectedRowKeysValues: string[], selectedRows: any[]) => {
    selectedRowKeys.value = selectedRows; // 更新选中状态
    selectedRows = selectedRows;
    console.log(
      `selectedRowKeys: ${selectedRowKeysValues}`,
      "selectedRows: ",
      selectedRows
    );
  },
});

// 定义emit事件类型
const emit = defineEmits<{
  (event: "setSelectSoc", payload: GetSocPageModel[]): void;
}>();

// 确定按钮逻辑
const handleOk = async () => {
  emit("setSelectSoc", selectedRows);
  open.value = false;
};

defineExpose({
  showModal,
});

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
};
</script>
<template>
  <a-modal
    v-model:open="open"
    title="选择芯片数据"
    :confirm-loading="confirmLoading"
    :width="1200"
    @ok="handleOk"
    @cancel="handleCancel"
    centered
  >
    <BasicTable
      :scroll="{ x: 1300, y: 500 }"
      @register="registerTable"
      :pagination="{ pageSize: 50 }"
      :row-selection="rowSelection"
      bordered
    >
    </BasicTable>
  </a-modal>
</template>
