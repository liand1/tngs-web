<template>
  <a-modal
    v-model:open="open"
    title="选择样本"
    :confirm-loading="confirmLoading"
    :width="1000"
    @ok="handleOk"
    @cancel="handleCancel"
    centered
  >
    <div class="sample-data-container">
      <!-- <a-input-search
        placeholder="请输入批次编号"
        style="width: 200px; margin-bottom: 16px"
        @search="onSearch"
      /> -->

      <a-row :wrap="false">
        <a-col flex="none">
          <div class="title">批次编号</div>
          <div class="list-container">
            <div
              v-for="(batchCode, index) in listData"
              :key="index"
              :class="{ 'active-item': batchCode === selectBatchCode }"
              @click="handleItemClick(batchCode)"
            >
              {{ batchCode }}
            </div>
          </div>
        </a-col>
        <a-col flex="auto" style="padding-left: 24px">
          <div class="titleWrapper">
          <div class="title">样本数据</div>
          <div class="title">
            <!-- <a-checkbox :checked="appendSampleFlag" @change="appendChange">追加至样本数据</a-checkbox> -->
          </div>
          </div>
          <a-table
            :scroll="{ x: 1300, y: 500 }"
            :dataSource="data"
            :columns="columns"
            :pagination="false"
            rowKey="id"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            bordered
          >
          </a-table>
        </a-col>
      </a-row>

      <div class="total-count">共 {{ total }} 条</div>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { findMatchingSampleList, getSampleBatchPage } from "@/api/lims/sample";
import { columns } from "./index";
import { SampleSocRespVO } from "@/api/lims/sample/model";
import { message } from "ant-design-vue";
const props = defineProps<{
  sampleId: number;
  socId: number;
  taskId: number;
}>();
//当前选中的批次编号
const selectBatchCode = ref("");
const appendSampleFlag = ref<boolean>(false);

const data = ref<SampleSocRespVO[]>([]);
onMounted(async () => {
  console.log(props.sampleId);
  listData.value = await getSampleBatchPage();
  await getSampleData();
});

const handleItemClick = (batchCode: string) => {
  selectBatchCode.value = batchCode;
  getSampleData();
};

const appendChange = (e:Event) => {
  appendSampleFlag.value = e.target.checked;
}

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

// 打开模态框方法
const showModal = async () => {
  await getSampleData();

  // 如果没有选中的样本，则默认勾选全部
  if (selectedRowKeys.value.length === 0 && data.value.length > 0) {
    // 设置所有样本为选中状态
    selectedRowKeys.value = data.value.map((item) => item.id);
    selectedRows.value = [...data.value];

    // 设置当前选中的批次编号
    if (data.value[0]?.batchCode) {
      selectBatchCode.value = data.value[0].batchCode;
    }
  }

  open.value = true;
};

//获取样本数据
const getSampleData = async (samplteCode?: string) => {
  const batchCode = samplteCode || selectBatchCode.value || listData.value[0];
  if (!batchCode) return;
  try {
    const res = await findMatchingSampleList(batchCode);
    data.value = res;
    total.value = res.length;
  } catch (error) {
    data.value = [];
    total.value = 0;
    // message.error("获取样本数据失败");
    console.error(error);
  }
};

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
};

//选中的数据
const selectedRowKeys = ref<(string | number)[]>([]);
const selectedRows = ref<SampleSocRespVO[]>([]);

//选中的批次编号
const onSelectChange = (
  selectedRowKey: (string | number)[],
  selectedRow: SampleSocRespVO[]
) => {
  // 如果选中的批次编号不一致，则清空选中的数据
  if (
    selectedRows.value.length > 0 &&
    selectedRow.length > 0 &&
    selectedRows.value[0].batchCode !== selectedRow[0].batchCode
  ) {
    selectedRows.value = [];
    selectedRowKeys.value = [];
  }

  // 更新选中状态
  selectedRowKeys.value = selectedRowKey;
  selectedRows.value = selectedRow;

  // 如果有选中的行，更新批次编号
  if (selectedRow.length > 0) {
    selectBatchCode.value = selectedRow[0].batchCode;
  }
};

const total = ref(0);

const onSearch = (value: string) => {
  console.log("搜索值:", value);
};

//批次编号
const listData = ref<string[]>([]);

// 暴露外部接口
defineExpose({
  showModal,
  updateSelection,
  updateSampleData,
});

// 从外部更新选中状态的方法
function updateSelection(removedId: number) {
  if (removedId === -1) {
    // 清空所有选中状态
    selectedRowKeys.value = [];
    selectedRows.value = [];
    selectBatchCode.value = "";

    // 如果有批次数据，自动选中第一个批次
    if (listData.value.length > 0) {
      selectBatchCode.value = listData.value[0];
      // 获取第一个批次的数据
      getSampleData(listData.value[0]);
    }
    return;
  }

  // 从selectedRowKeys和selectedRows中移除指定ID的项
  selectedRowKeys.value = selectedRowKeys.value.filter(
    (id) => id !== removedId
  );
  selectedRows.value = selectedRows.value.filter((row) => row.id !== removedId);
}

// 更新样本文件名
function updateSampleData(updateInfo: { sampleData: SampleSocRespVO[] }) {
  if (updateInfo.sampleData && updateInfo.sampleData.length > 0) {
    selectedRows.value = updateInfo.sampleData;
    selectedRowKeys.value = updateInfo.sampleData.map((item) => item.id);

    if (selectedRows.value.length > 0) {
      selectBatchCode.value = selectedRows.value[0].batchCode;
    }
  }
}

// 定义emit事件类型
const emit = defineEmits<{
  (event: "setSelectSample", payload: SampleSocRespVO[], appendFlag: boolean): void;
}>();

// 确定按钮逻辑
const handleOk = async () => {
  if (selectedRows.value.length > 0) {
    emit("setSelectSample", selectedRows.value, appendSampleFlag.value);
    open.value = false;
    appendSampleFlag.value = false;
  } else {
    message.warning("请选择样本");
  }
};
</script>
<style lang="less" scoped>
.sample-data-container {
  padding: 16px;

  .title {
    margin: 8px 0 8px;
  }

  .titleWrapper {
    display: flex;
    justify-content: space-between;
  }
}

.total-count {
  margin-top: 16px;
  text-align: right;
}

.highlight-row {
  background-color: #ffecec !important;
}

.list-container {
  display: flex;
  flex-direction: column;
  max-height: 550px;
  overflow-y: auto;
  border: 1px solid #ddd;

  & > div {
    padding: 10px 24px;
    cursor: pointer;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  .active-item {
    background-color: #ffdcdc !important; /* 高亮背景色 */
  }
}
</style>