<template>
  <div>
    <div class="title">
      <h2>配置签名</h2>
      <a-button type="primary" @click="openCreateModal">
        <template #icon><PlusOutlined /></template>
        添加签名
      </a-button>
    </div>
    <a-card title="签名列表" class="settings-template">
      <a-spin :spinning="loading">
        <a-table :columns="columns" :data-source="signList" >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'operation'">
              <a-button type="link" class="btn-class" @click="handleEdit(record)">
                编辑
              </a-button>
              <a-divider
                type="vertical"
                class="action-divider"
              />
              <a-popconfirm ok-text="确定"
                  title="您确定删除该签名码?"
                    cancel-text="取消"
                    placement="topRight"
                    @confirm="confirmDelete(record)">
              <a-button type="link" class="btn-class">
                删除
              </a-button>
              </a-popconfirm>
            </template>

            <template v-if="column.key === 'imageUrl'">
              <a @click="showImage(record.imageUrl)">查看</a>
            </template>

            <template v-if="column.key === 'createTime'">
              {{ formatTime(record.createTime) }}
            </template>

            <template v-if="column.key === 'signType'">
              {{ record.signType == 1 ? `检测者` : record.signType == 2 ? '一审人员' : '二审人员' }}
            </template>
          </template>
        </a-table>
      </a-spin>
    </a-card>

    <!-- 创建签名 -->
    <CreateSignModal
      ref="crRef"
      @success="loadTemplateSign()"
    />

    <a-modal v-model:open="openImage" title="签名图片" >
      <div class="modalImage">
      <a-image
        :width="200"
        :src="`${imageUrl}`"
        :preview="false"
      />
      </div>
      <template #footer>
        <div>
          <a-button key="back" type="primary" ghost @click="handleCancel" gh>关闭</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useGo } from "@/hooks/web/usePage";
import { PlusOutlined } from '@ant-design/icons-vue'

import CreateSignModal from "./create/CreateSignModal.vue";
import {
  listAllSign,
  deleteReportSign,
} from "@/api/lims/report-sign";

const templateOpen = ref(false);

const crRef = ref<typeof CreateSignModal>();

// 加载状态
const loading = ref(false);

const openImage = ref<boolean>(false);

const imageUrl = ref<string>();
// 模版列表
const signList = ref<DataItem[]>([]);


import type { TableColumnsType } from 'ant-design-vue';

const columns: TableColumnsType = [
  { title: '职责人员', width: 160, dataIndex: 'signType', key: 'signType',},
  { title: '姓名', width: 160, dataIndex: 'signName', key: 'signName', },
  { title: '签字图片', width: 140, dataIndex: 'imageUrl', key: 'imageUrl' },
  { title: '创建人', width: 160,  dataIndex: 'creator', key: 'creator' },
  { title: '创建时间', width: 200,  dataIndex: 'createTime', key: 'createTime' },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 140,
  },
];

interface DataItem {
  signType: string;
  signName: string;
  imageUrl: string;
  creator: string;
  createTimes: string;
}

// const data: DataItem[] = [
//   {
//     signType: '1',
//     signName: 'John Brown',
//     imageUrl: "",
//     creator: 'New York Park',
//     createTimes: 'New York Park',
//   },
//   {
//     signType: '2',
//     signName: 'Jim Green',
//     imageUrl: "",
//     creator: 'London Park',
//     createTimes: 'London Park',
//   },
// ];

// 加载模版数据
const loadTemplateSign = async () => {
  loading.value = true;

  const res = await listAllSign();

  signList.value = res;

  loading.value = false;
};

const go = useGo();
// 编辑模版
const handleEdit = (data: any) => {
  crRef?.value.showModal(data)
};

// 删除模板
const confirmDelete = async (item: any) => {
  try {
    await deleteReportSign(item.id);
    message.success(
      `成功删除签名: ${item.signName}`
    );
    await loadTemplateSign();
  } catch (error) {
    console.log(error);
    // message.error("删除失败");
  } 

};

const openCreateModal = () => {
  crRef.value?.showModal();
}

const showImage = (url: string) => {
  openImage.value = true;
  imageUrl.value = url;
}

const handleCancel = () => {
  openImage.value = false;
}

// 格式化时间戳为可读的日期时间
function formatTime(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString();
}

// 组件挂载后加载数据
onMounted(async () => {
  await loadTemplateSign();
});
</script>

<style scoped lang="less">
.settings-template {
  margin: 0 12px;
  border: none;
}

.title {
  margin: 0 24px 20px 24px;
  display: flex;
  justify-content: space-between;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  h3 {
    font-size: 16px;
  }
}

.template-list {
  margin-right: 20px;

  :deep(.ant-list-item) {
    padding: 16px 24px;
    margin-bottom: 16px;
    background-color: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.template-row {
  width: 100%;
}

.adaptive-col {
  flex: 1;
  min-width: 0; /* 重要：允许内容在flex容器中换行 */
  word-break: break-word;
  padding-right: 16px;
}

.template-info {
  .template-title {
    margin-bottom: 8px;
    font-size: 16px;
    font-weight: 500;
    color: rgb(0 0 0 / 85%);

    .subHospital {
      font-size: 14px;
      color: rgb(0 0 0 / 45%);
    }
  }

  .template-desc {
    font-size: 14px;
    color: rgb(0 0 0 / 65%);

  }
}

.template-time {
  padding-right: 24px;
  font-size: 14px;
  color: rgb(0 0 0 / 45%);
  text-align: right;
}

.template-status {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  span {
    margin-right: 8px;
    color: rgb(0 0 0 / 65%);
  }
}

.template-action {
  text-align: center;
}

.btn-class {
  margin-left: 0px;
  padding: 8px 4px;
}

.modalImage {
  display: flex;
  justify-content: center;
}
</style>