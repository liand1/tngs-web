<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Card } from "ant-design-vue";
import { getDocCenterPage } from "@/api/lims/doccenter";
import { DocCenterRespVO } from "@/api/lims/doccenter/model";
import { DocStatusEnum, DocTypeEnum } from "@/enums/customEnum";
import { useRouter } from "vue-router";

const router = useRouter();

// 加载状态
const loading = ref(true);

// 文档列表
const docList = ref<DocCenterRespVO[]>([]);

// 获取文档列表
async function loadDocuments() {
  loading.value = true;

  try {
    const res = await getDocCenterPage({
      pageNo: 1,
      pageSize: 6, // 限制显示6条
      status: DocStatusEnum.NORMAL, // 只获取正常状态的文档
      type: DocTypeEnum.USER_MANUAL, // 只获取使用手册类型
    });

    // API可能直接返回数组或包含list属性的对象
    docList.value = Array.isArray(res) ? res : res.list || [];
  } catch (error) {
    console.error("获取文档列表失败:", error);
  } finally {
    loading.value = false;
  }
}

// 跳转到文档详情页面
function handleDocClick(doc: DocCenterRespVO) {
  router.push({
    path: "/system/usermanual",
    query: { id: doc.id },
  });
}

// 前往文档中心
function goToDocCenter() {
  router.push("/system/usermanual");
}

// 组件挂载后加载数据
onMounted(() => {
  loadDocuments();
});
</script>

<template>
  <Card title="文档中心" :bordered="false" class="doc-center-card">
    <template #extra>
      <a-button
        type="link"
        style="color: rgb(153 153 153 / 100%)"
        @click="goToDocCenter"
        >更多</a-button
      >
    </template>

    <div v-if="loading" class="loading-container">
      <a-spin />
    </div>

    <a-list v-else class="doc-list" :data-source="docList" :pagination="false">
      <template #renderItem="{ item }">
        <a-list-item @click="handleDocClick(item)">
          <div class="doc-item">
            <span class="doc-title">{{ item.title }}</span>
          </div>
        </a-list-item>
      </template>
      <template #empty>
        <a-empty description="暂无文档" />
      </template>
    </a-list>
  </Card>
</template>

<style lang="less" scoped>
.doc-center-card {
  :deep(.ant-card-body) {
    padding: 12px 24px;
    overflow-y: auto;
  }

  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .doc-list {
    .doc-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 12px 0;
      cursor: pointer;

      &:hover {
        span {
          color: #e61f42;
        }
      }

      .doc-title {
        overflow: hidden;
        color: rgb(0 0 0 / 85%);
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: color 0.3s;
      }
    }

    :deep(.ant-list-item) {
      width: 100%;
      height: 36px;
      padding: 0;
      line-height: 36px;
      border-bottom: none;
    }
  }
}
</style>
