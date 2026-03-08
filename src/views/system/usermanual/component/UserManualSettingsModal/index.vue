<template>
  <BasicModal :title="modalTitle" :width="1000" :footer="null" @register="registerModal" v-bind="$attrs"
    @cancel="handleCancel" destroyOnClose wrapClassName="user-manual-settings-modal">
    <UserManualSettings class="user-manual-settings" ref="userManualSettingsRef" @save="handleSave"
      @cancel="handleCancel" />
  </BasicModal>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import UserManualSettings from '@/views/system/usermanualsettings/index.vue';
import { createDocCenter, updateDocCenter } from '@/api/lims/doccenter';
import { DocCenterVO, UpdateDocCenterReqVO } from '@/api/lims/doccenter/model';
import { DocTypeEnum, DocStatusEnum } from '@/enums/customEnum';
import { BasicModal, useModalInner } from '@/components/Modal'
// 模态框可见状态


// 编辑状态：create-新建，update-编辑
const mode = ref<'create' | 'update'>('create');

// 当前编辑的文档
const currentDoc = ref<Partial<DocCenterVO>>({});

// 用户手册设置组件引用
const userManualSettingsRef = ref();

const [registerModal, { setModalProps }] = useModalInner(async (data: any) => {
  showModal(data.type, data.record)
})

// 模态框标题
const modalTitle = computed(() => (mode.value === 'create' ? '新建文档' : '编辑文档'));
const emit = defineEmits(['refresh', 'cancel']);

/**
 * 显示模态框
 * @param type 操作类型：create-新建，update-编辑
 * @param record 编辑时的文档记录
 */
const showModal = async (type: 'create' | 'update' = 'create', record?: DocCenterVO) => {
  mode.value = type;
  currentDoc.value = type === 'update' && record ? { ...record } : {};


  // 等待组件挂载完成后初始化数据
  await nextTick();
  if (userManualSettingsRef.value) {
    if (type === 'update' && record) {
      // 编辑模式，传递已有文档数据
      userManualSettingsRef.value.initFormData({
        id: record.id,
        title: record.title,
        content: record.content,
        type: record.type,
        status: record.status,
        isEdit: true // 标记为编辑模式
      });
    } else {
      // 创建模式
      userManualSettingsRef.value.openEditDialog({
        title: '',
        content: '',
        type: DocTypeEnum.USER_MANUAL,
        status: DocStatusEnum.NORMAL,
        isEdit: false // 标记为创建模式
      });
    }
  }
};

/**
 * 处理保存
 * @param formData 表单数据
 */
const handleSave = async (formData: any) => {
  try {
    // 使用表单传递的isUpdate标志来判断是新增还是更新
    const isUpdate = formData.isUpdate;
    const api = isUpdate ? updateDocCenter : createDocCenter;

    // 构建符合UpdateDocCenterReqVO模型的请求数据
    const requestData: UpdateDocCenterReqVO = {
      id: isUpdate ? currentDoc.value.id : undefined,
      title: formData.title,
      content: formData.content,
      type: formData.type,
      status: formData.status
    };

    // 调用API保存数据
    await api(requestData);

    message.success(`${isUpdate ? '更新' : '创建'}文档成功`);


    // 触发刷新事件
    emit('refresh');
  } catch (error) {
    console.error('保存文档失败:', error);
    message.error(`${formData.isUpdate ? '更新' : '创建'}文档失败`);
  }
};

/**
 * 处理取消
 */
const handleCancel = () => {
  emit('cancel');
};


// 对外暴露方法
defineExpose({
  showModal,
});
</script>

<style scoped lang="less">
.editor-container {
  margin: 20px 0;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}


.user-manual-settings {
  margin: 16px 32px;
}
</style>

<style lang="less">
.user-manual-settings-modal {
  .scrollbar__view {
    &>div {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>