<template>
  <div>
    <div class="title">
      <h2>系统版本</h2>
    </div>
    <a-card title="版本更新列表" style="margin: 0 12px">
      <a-table
        :columns="myColumns"
        :data-source="versionList"
        :loading="loading"
        :pagination="false"
        bordered
        @change="handleTableChange"
        >
        <template #bodyCell="{ column, record }" v-if="isShowSocSetting">
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="goEdit(record)">编辑</a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <UpdateVersionModal 
      ref="crRef"
      @success="loadVersionData()"></UpdateVersionModal>
  </div>
</template>

<script setup lang="ts">
import { getSystemVersionPage } from "@/api/lims/systemversion";
import { SystemVersionRespVO } from "@/api/lims/systemversion/model";
import { ref, onMounted, reactive } from "vue";
import { columns } from './index.data'
import { getUserInfo } from "@/api/base/user";
import {
  UserRoleEnum,
} from "@/enums/customEnum";
import UpdateVersionModal from "./UpdateVersionModal.vue";

const crRef = ref<typeof UpdateVersionModal>();
// 版本列表数据
const versionList = ref<SystemVersionRespVO[]>([]);
const loading = ref(false);
const myColumns = ref<any>([]);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSizeOptions: ["10", "20", "50", "100"],
});

// 处理表格变化（分页、排序、筛选）
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loadVersionData();
};

// 加载版本数据
const loadVersionData = async () => {
  loading.value = true;

  const res = await getSystemVersionPage({
    pageNo: 1,
    pageSize: 100,
  });

  versionList.value = res.list;

  loading.value = false;
  // 真实项目中应该调用API
  // getVersionList({
  //   page: pagination.current,
  //   pageSize: pagination.pageSize,
  // }).then(res => {
  //   versionList.value = res.data.list;
  //   pagination.total = res.data.total;
  //   loading.value = false;
  // }).catch(() => {
  //   loading.value = false;
  // });
};

const goEdit = (data: SystemVersionRespVO) => {
  crRef.value?.showModal(data);
}

const isShowSocSetting = ref(false);
async function getUserInfos() {
  const res = await getUserInfo();
  console.log(res);
  if (res.roles.includes(UserRoleEnum.SUPER_ADMIN)) {
    myColumns.value.push({
        title: "编辑",
        dataIndex: "action",
        key: "action",
        width: 80,
      })
    isShowSocSetting.value = true;
  }
}


// 组件挂载后加载数据
onMounted(() => {
  myColumns.value.push(...columns);
  loadVersionData();
  getUserInfos();
});
</script>

<style scoped lang="less">
.ant-btn-link {
  padding: 0;
}

.title {
  margin: 0 0 20px 24px;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  h3 {
    font-size: 16px;
  }
}
</style>