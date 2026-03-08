<script lang="ts" setup>
import { ref, unref } from 'vue'
import { createFormSchema, updateFormSchema } from './analysisTask.data'
import { useI18n } from '@/hooks/web/useI18n'
import { useMessage } from '@/hooks/web/useMessage'
import { BasicForm, useForm } from '@/components/Form'
import { BasicModal, useModalInner } from '@/components/Modal'
import { createAnalysisTask, getAnalysisTask, updateAnalysisTask } from '@/api/lims/analysistask'
import { handleSelectSchemas } from './index'
import { CreateAnalysisTaskReqVO } from '@/api/lims/analysistask/model'

defineOptions({ name: 'AnalysisTaskModal' })

const emit = defineEmits(['success', 'register'])

const { t } = useI18n()
const { createMessage } = useMessage()
const isUpdate = ref(true)

const [registerForm, { setFieldsValue, resetFields, resetSchema, validate }] = useForm({
  labelWidth: 120,
  baseColProps: { span: 24 },
  schemas: handleSelectSchemas(createFormSchema),
  showActionButtonGroup: false,
  actionColOptions: { span: 23 },
})

const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
  resetFields()
  setModalProps({ confirmLoading: false })
  isUpdate.value = !!data?.isUpdate
  if (unref(isUpdate)) {
    resetSchema(handleSelectSchemas(updateFormSchema))
    const res = await getAnalysisTask(data.record.id)
    setFieldsValue({ ...res })
  }
})

async function handleSubmit() {
  try {
    const values = await validate()
    setModalProps({ confirmLoading: true })
    if (unref(isUpdate))
      await updateAnalysisTask(values)
    else
      await createAnalysisTask(values as CreateAnalysisTaskReqVO)

    closeModal()
    emit('success')
    createMessage.success(t('common.saveSuccessText'))
  } finally {
    setModalProps({ confirmLoading: false })
  }
}
</script>
<template>
  <BasicModal v-bind="$attrs" :title="isUpdate ? t('action.edit') : t('action.create')" @register="registerModal" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>