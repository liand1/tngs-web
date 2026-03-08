<template>
  <div>
    <div class="title">
      <h2>配置报告模版</h2>
      <a-button type="primary" @click="openCreateModal">
        <template #icon><PlusOutlined /></template>
        新增模板
      </a-button>
    </div>
    <a-card title="报告模版" class="settings-template">
      <a-spin :spinning="loading">
        <a-list :data-source="templateList" class="template-list">
          <template #renderItem="{ item }">
            <a-list-item>
              <a-row class="template-row" align="middle" :gutter="16">
                <a-col class="adaptive-col">
                  <div class="template-info" style="overflow: hidden">
                    <div class="template-title">
                      <span>{{ item.name }}</span>
                      <span class="subHospital" v-if="item.type == 3">(检测项目:{{ CheckTypeEnumMap[item.copyType]}})</span>
                    </div>
                    <div class="template-desc">{{ item.remark }}</div>
                  </div>
                </a-col>
                <a-col class="template-time" style="width: 60px">
                  <a-tag v-if="item.type == 1 || item.type == 2" color="error">内置</a-tag>
                  <a-tag v-if="item.type == 3" color="processing">自定义</a-tag>
                </a-col>
                <a-col class="template-time" style="width: 260px">
                  <span
                    >最后编辑时间:{{
                      useRender.renderDate(item.createTime)
                    }}</span
                  >
                </a-col>
                <a-col class="template-status" style="width: 140px">
                  <span>状态：</span>
                  <a-switch
                    style="width: 70px"
                    :checked="item.status === 1"
                    :checked-children="item.status === 1 ? '已启用' : '未启用'"
                    :un-checked-children="
                      item.status === 1 ? '已启用' : '未启用'
                    "
                    :disabled="item.type == 1 || item.type == 2"
                    @change="(checked) => handleStatusChange(item, checked)"
                  />
                </a-col>
                <a-col style="width: 220px">
                  <a-row class="template-action" style="width: 220px; display: flex; justify-content: flex-end;">
                    <a-col class="template-action" style="width: 70px">
                      <a-button type="primary" @click="handleEdit(item)"
                        >编辑</a-button
                      >
                    </a-col>
                    <a-col class="template-action" style="width: 70px">
                      <a-button type="primary" @click="handlePreview(item)"
                        >预览</a-button
                      >
                    </a-col>
                    <a-col v-if="item.type == 3" class="template-action" style="width: 70px">
                      <a-popconfirm title="您确定删除该报告模板?"
                        ok-text="删除"
                        cancel-text="取消"
                        placement="bottomRight"
                        @confirm="confirmDelete(item)">
                        <a-button>删除</a-button>
                      </a-popconfirm>
                    </a-col>
                  </a-row>
                </a-col>
              </a-row>
            </a-list-item>
          </template>
        </a-list>
      </a-spin>
    </a-card>

    <!-- <PdfMergeDemo /> -->

    <ServerPreview ref="serverPreviewRef" :taskId="0" :sampleId="0" />

    <a-modal
      wrap-class-name="full-modal"
      v-model:open="templateOpen"
      :footer="null"
      :keyboard="true"
      width="794px"
    >
      <!-- <TemplateList ref="templateListRef" /> -->
    </a-modal>

    <!-- 创建模板 -->
    <CreateTemplateModal
      ref="crRef"
      @success="loadTemplateData()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { useGo } from "@/hooks/web/usePage";
import { PlusOutlined } from '@ant-design/icons-vue'

import ServerPreview from "./template/serverpreview/index.vue";
import CreateTemplateModal from "./template/create/CreateTemplateModal.vue";
import {
  getReportTemplatePage,
  setDefaultTemplate,
  deleteReportTemplate,
} from "@/api/lims/report-template";
import { ReportTemplateBaseVO } from "@/api/lims/report-template/model";
import { useRender } from "@/components/Table";
import { CheckTypeEnumMap } from '@/enums/customEnum';
// import { invoicePdf } from "@/api/lims/pdf";

// import TemplateList from "./template.vue";

const templateOpen = ref(false);

const crRef = ref<typeof CreateTemplateModal>();

// import PdfMergeDemo from "./template/previewtem/demo/PdfMergeDemo.vue";

const serverPreviewRef = ref<InstanceType<typeof ServerPreview>>();
// 加载状态
const loading = ref(false);

// 模版列表
const templateList = ref<ReportTemplateBaseVO[]>([]);

// 加载模版数据
const loadTemplateData = async () => {
  loading.value = true;

  const res = await getReportTemplatePage({
    pageNo: 1,
    pageSize: 100,
  });

  templateList.value = res.list;

  loading.value = false;
};

// 更改模版状态
const handleStatusChange = async (
  item: ReportTemplateBaseVO,
  checked: boolean
) => {
  // 更新状态
  const newStatus = checked ? 1 : 0;

  // 模拟API请求
  loading.value = true;
  // 更新本地数据
  const targetItem = templateList.value.find((t) => t.id === item.id);
  try {
    if (targetItem) {
      targetItem.status = newStatus;
      // targetItem.content = JSON.stringify(templateList_1);
      // await updateReportTemplate(targetItem!);
      await setDefaultTemplate(targetItem.id!);

      await loadTemplateData();
    }

    message.success(
      `成功${newStatus === 1 ? "启用" : "禁用"}模板: ${item.name}`
    );
  } catch (error) {
    targetItem!.status = !checked ? 1 : 0;
    message.error("更新失败");
  } finally {
    loading.value = false;
  }
};
const go = useGo();
// 编辑模版
const handleEdit = (item: ReportTemplateBaseVO) => {
  // message.info(`正在编辑模板: ${item.id}`);
  go("/system/template/detail/" + item.id);
};

// 预览模版
const handlePreview = (item: ReportTemplateBaseVO) => {
  serverPreviewRef.value?.showModal(item.id!, 0, 0);

  // serverPreviewRef.value?.downloadPdf({
  //   // taskId: 29,
  //   // sampleId: 60,
  //   // reportId: 212,
  //   taskId: 1,
  //   sampleId: 3,
  //   reportId: 3,
  // });
};

// 删除模板
const confirmDelete = async (item: ReportTemplateBaseVO) => {
  try {
    await deleteReportTemplate(item.id);
    message.success(
      `成功删除模板: ${item.name}`
    );
    await loadTemplateData();
  } catch (error) {
    message.error("删除失败");
  } 

};

const openCreateModal = () => {
  crRef.value?.showModal();
}

// 组件挂载后加载数据
onMounted(async () => {
  await loadTemplateData();

  //自动打印PDF
  // setTimeout(() => {
  //   previewRef.value?.updatePDF(74,538);
  // }, 500);
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
</style>