<template>
  <div class="arc_box">
    <a-list
      class="listbox"
      size="small"
      :data-source="taskDetail.sampleDOS"
      :bordered="false"
      :split="false"
      ref="myListRef"
    >
      <template #renderItem="{ item }">
        <a-list-item
          class="listitem"
          :class="{ 'active-item': selectIndex === item.id }"
        >
          <a-row :wrap="false" class="listitem-row">
            <a-col
              class="leftcol"
              @click="handleItemClick(item.id)"
            >
              <!-- <FileOutlined style="margin-right: 8px" /> -->
              <a-tooltip>
                <template #title>
                  {{ item.sampleCode }}
                </template>
                <span class="samplename" style="padding-left: 2px">{{
                  item.sampleCode
                }}</span>
              </a-tooltip>
            </a-col>

            <a-col class="examineeName" @click="handleItemClick(item.id)">
              {{ item.examineeName || '&nbsp;' }}
            </a-col>

            <a-col class="rightcol audit">
              <a-popconfirm title="您确定删除该样本?"
                ok-text="删除"
                cancel-text="取消"
                @confirm="confirmDelete(item.id)">
              <DeleteOutlined />
              </a-popconfirm>
            </a-col>

          </a-row>
        </a-list-item>
      </template>
      <template #header>
        <a-row :wrap="false">
          <a-col class="leftcol" style="padding-left: 2px">样本编号</a-col>

          <a-col class="examineeName">姓名</a-col>

          <a-col class="rightcol audit"></a-col>
        </a-row>
      </template>
    </a-list>
  </div>

</template>

<script setup lang="ts">
import {
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { defineProps, defineEmits, ref, watch, nextTick } from "vue";
import { deleteSample } from "@/api/lims/sample";

const myListRef = ref(null)
// 定义 props，接收 treeData
const props = defineProps<{
  taskDetail: any;
}>();
// 定义 emit，用于向父组件发送事件
const emit = defineEmits<{
  (event: "click-node", node: any): void;
  (event: "delete-sample-success", id: number): void;
}>();

//当前选中的批次编号
const selectIndex = ref(-1);

const getSelectIndex = () => {
  return selectIndex.value;
};

const setSelectIndex = (index:number) => {
  selectIndex.value = index;
  // nextTick(() => {
  //   const item = myListRef?.value.querySelector(`#${index}`); // 获取具体项的 DOM 元素
  //   if (item) {
  //     item.scrollIntoView({ behavior: 'smooth', block: 'center' }); // 平滑滚动到该项
  //   }
  // });
};

const handleItemClick = (index: number) => {
  if (selectIndex.value === index) {
    return;
  }
  selectIndex.value = index;
  emit("click-node", index);
};

const confirmDelete = async (sampleId: number) => {
  await deleteSample(sampleId);
  emit("delete-sample-success", sampleId);
}

watch(
  () => props.taskDetail,
  (newtaskDetail) => {
    console.log("analysisresultcatalog index page", newtaskDetail);
    if (selectIndex.value === -1 && newtaskDetail!.sampleDOS!.length > 0) {
      selectIndex.value = newtaskDetail!.sampleDOS![0].id;
      emit("click-node", newtaskDetail!.sampleDOS![0].id);
    }
  }
);

defineExpose({
  getSelectIndex,
  setSelectIndex,
});
</script>

<style lang="less" scoped>
.arc_box {
  width: 280px;

  .title {
    height: 48px;
    margin: 0;
    font-size: 16px;
    line-height: 48px;
  }

  .listbox {
    padding: 8px;
    background-color: #fafafa;
    border: 1px solid #0000001a;
    border-radius: 4px;

    :deep(.ant-list-items) {
      max-height: 742px;
      overflow-y: auto;
      padding-top: 8px;
      padding-bottom: 12px;
    }
    :deep(.ant-list-item) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }

  .listitem {
    // padding: 4px 2px;
    border-radius: 4px;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  .listitem-row {
    width: 100%;
  }

  .rightcol {
    align-content: center;
    width: 60px;
    // margin-left: 16px;
    text-align: center;
  }

  .audit {
    width: 40px;
  }

  .samplename {
    position: absolute;
    right: 0;
    left: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 120px;
  }

  .leftcol {
    // padding: 4px;
    cursor: pointer;
    border-radius: 4px;
    text-align: left;
    width: 120px;
    // &:hover {
    //   background-color: #f0f0f0;
    // }
  }

  .examineeName {
    cursor: pointer;
    border-radius: 4px;
    text-align: left;
    width: 80px;
  }

  .active-item {
    background-color: #ffdcdc !important; /* 高亮背景色 */
  }
}
</style>