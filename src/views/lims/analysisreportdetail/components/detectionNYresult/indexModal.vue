<script lang="ts" setup>
import { ref, unref } from "vue";
import { updateFormSchema } from "./index.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { BasicForm, useForm } from "@/components/Form";
import { BasicModal, useModalInner } from "@/components/Modal";
import { updateCopyAnalysisGeneResult } from "@/api/lims/analysisgeneresult";
import {
  AnalysisReportAuditRespVO,
} from "@/api/lims/analysistask/model";

defineOptions({ name: "DetectionNYResultModal" });

const emit = defineEmits(["success", "register"]);
defineProps<{
  report?: AnalysisReportAuditRespVO;
}>();

const { t } = useI18n();
const { createMessage } = useMessage();
const isUpdate = ref(true);
const originalRecord = ref<any | null>(null);

const [registerForm, { setFieldsValue, resetFields, validate }] = useForm({
  baseColProps: { span: 8 },
  schemas: updateFormSchema,
  showActionButtonGroup: false,
  actionColOptions: { span: 24 },
  layout: "vertical",
  rowProps: {
    gutter: [40, 0],
  },
});

const [registerModal, { setModalProps, closeModal }] = useModalInner(
  async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate) && data.record) {
      originalRecord.value = data.record;
      setFieldsValue({ ...data.record });
    }
  }
);

async function handleSubmit() {
  try {
    const values = await validate();
    setModalProps({ confirmLoading: true });

    if (unref(isUpdate) && originalRecord.value) {
      await updateCopyAnalysisGeneResult({
        ...originalRecord.value,
        ...values,
      });
    }

    closeModal();
    emit("success");
    createMessage.success(t("common.saveSuccessText"));
  } catch (error) {
    console.error("提交失败:", error);
    createMessage.error("保存失败，请重试");
  } finally {
    setModalProps({ confirmLoading: false });
  }
}
</script>
<template>
  <BasicModal
    v-bind="$attrs"
    :title="t('action.edit')"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>