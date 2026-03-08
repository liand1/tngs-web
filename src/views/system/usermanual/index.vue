<template>
  <div>
    <div class="doc-container">
      <div class="title">
        <h2>用户使用手册</h2>
        <div>
          <a-button type="primary" @click="handleCreateItem">新建文档</a-button>
        </div>
      </div>

      <a-row class="content">
        <a-col :style="{ width: '300px' }">
          <a-card title="用户手册" :loading="loading">
            <a-list :data-source="pageList">
              <template #renderItem="{ item }">
                <a-list-item class="listitem" :class="{ 'active-item': selectId === item.id }"
                  @click="handleSelectItem(item.id)"><span>{{ item.title }}</span></a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
        <a-col :style="{ marginLeft: '20px', flex: 1 }">
          <a-card :title="currentDocument?.title || '请选择文档'" :loading="loading">
            <template #extra>
              <a-button danger style="margin-right: 10px" @click="handleEditItem"
                :disabled="!selectId || selectId === -1" v-if="roles.includes('super_admin')">
                编辑文档
              </a-button>
              <a-button @click="handleDeleteItem" :disabled="!selectId || selectId === -1" v-if="roles.includes('super_admin')">
                删除文档
              </a-button>
            </template>

            <div class="ql-container ql-snow" v-if="currentDocument" style="border: none">
              <div ref="qlEditorRef" v-html="currentDocument.content" class="ql-editor"></div>
            </div>
            <a-empty v-else description="请选择左侧文档" />
          </a-card>
        </a-col>
      </a-row>
    </div>

    <UserManualSettingsModal @register="registerModal" @refresh="getDocCenterPageList" @cancel="closeModal" />

    <vue-easy-lightbox :visible="visibleRef" :imgs="imgsRef" :index="indexRef" @hide="onHide"></vue-easy-lightbox>
  </div>
</template>

<script setup lang="ts">
import { getDocCenterPage, deleteDocCenter } from "@/api/lims/doccenter";
import { DocCenterRespVO } from "@/api/lims/doccenter/model";
import { DocStatusEnum } from "@/enums/customEnum";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import UserManualSettingsModal from "./component/UserManualSettingsModal/index.vue";
import { Modal, message } from "ant-design-vue";
import { useModal } from '@/components/Modal'
import { useUserStore } from '@/store/modules/user'
const route = useRoute();
const userStore = useUserStore()
const docId = computed(() => {
  // 支持路由参数和查询参数两种方式
  return route.params.id ? Number(route.params.id) :
    route.query.id ? Number(route.query.id) : -1;
});
const roles = computed(() => userStore.getUserInfo?.roles)

const qlEditorRef = ref<HTMLElement>();

const selectId = ref(docId.value);

const pageList = ref<DocCenterRespVO[]>([]);
const userManualSettingsModalRef = ref();

const visibleRef = ref(false)
const indexRef = ref(0) // default 0
const imgsRef = ref<string[]>([])

const loading = ref(false);

const [registerModal, { closeModal, setModalProps, openModal }] = useModal();

const onHide = () => (visibleRef.value = false)
const onShow = () => {
  visibleRef.value = true
}

// 计算当前选中的文档
const currentDocument = computed(() => {
  return pageList.value.find((item) => item.id === selectId.value);
});

watch(currentDocument, async (newVal) => {
  if (newVal) {
    await nextTick();
    qlEditorRef.value?.querySelectorAll("img").forEach((img, idx) => {
      img.addEventListener("click", () => {
        imgsRef.value = newVal.content.match(/<img[^>]+src="([^">]+)"/g)?.map((match) => match.replace(/<img[^>]+src="([^">]+)"/, "$1")) || [];
        indexRef.value = idx;
        onShow();
      });
    });
  }
});

onMounted(async () => {
  getDocCenterPageList();
});

const getDocCenterPageList = async () => {
  loading.value = true;
  try {
    const res = await getDocCenterPage({
      pageNo: 1,
      pageSize: 100,
      // type: DocTypeEnum.USER_MANUAL, // 只获取使用手册类型的文档
      status: DocStatusEnum.NORMAL, // 只获取正常状态的文档
    });

    pageList.value = res.list; // API直接返回数组
    if (
      (!selectId.value || selectId.value === -1 || !currentDocument.value) &&
      pageList.value.length > 0
    ) {
      selectId.value = pageList.value[0].id;
    }
  } finally {
    loading.value = false;
  }
};

const handleSelectItem = (id: number) => {
  selectId.value = id;
};

// 创建新文档
const handleCreateItem = () => {
  openModal(true, {
    type: "create",
  });
};

// 编辑当前文档
const handleEditItem = () => {
  if (currentDocument.value) {
    openModal(true, {
      type: "update",
      record: currentDocument.value,
    });
  }
};

// 删除当前文档
const handleDeleteItem = () => {
  if (!currentDocument.value) {
    message.warning("请先选择要删除的文档");
    return;
  }

  Modal.confirm({
    title: "删除确认",
    content: `确定要删除文档"${currentDocument.value.title}"吗？此操作不可恢复！`,
    okText: "确认删除",
    okType: "danger",
    cancelText: "取消",
    async onOk() {
      try {
        await deleteDocCenter(currentDocument.value!.id);
        message.success("文档删除成功");
        // 删除成功后刷新列表
        getDocCenterPageList();
        // 重置选中状态
        selectId.value = -1;
      } catch (error) {
        console.error("删除文档失败:", error);
        message.error("删除文档失败，请重试");
      }
    },
  });
};
</script>

<style scoped lang="less">
.doc-container {
  margin: 0 16px;
}

.ant-btn-link {
  padding: 0;
}

.title {
  display: flex;
  justify-content: space-between;
  margin: 0 0 16px;

  h2 {
    font-size: 20px;
    font-weight: bold;
  }

  h3 {
    font-size: 16px;
  }
}

.content {
  justify-content: space-between;
}

.listitem {
  padding: 0 4px;
  line-height: 40px;
  cursor: pointer;
  border: none;
  border-radius: 4px;

  &:hover {
    background-color: #f0f0f0;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.active-item {
  background-color: #ffdcdc !important;
}

.ql-editor {
  :deep(img) {
    cursor: pointer;
  }
}
</style>