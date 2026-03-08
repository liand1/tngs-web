<script lang="ts" setup>
import { passwordSchema } from "./data";
import { useI18n } from "@/hooks/web/useI18n";
import { BasicForm, useForm } from "@/components/Form";
import { useModalInner } from "@/components/Modal";
import { updateUserPwdApi } from "@/api/base/profile";
import message from "@/components/FormDesign/src/utils/message";
import { useUserStore } from '@/store/modules/user'
defineOptions({ name: "PasswordModal" });

const emit = defineEmits(["success", "register"]);
const { t } = useI18n();
const userStore = useUserStore()

const [registerForm, { resetFields, validate }] = useForm({
  labelWidth: 120,
  baseColProps: { span: 24 },
  schemas: passwordSchema,
  actionColOptions: { span: 23 },
  submitButtonOptions: {
    text: "确定",
    className:
      "center-button css-dev-only-do-not-override-gn67dq ant-btn ant-btn-primary mr-2",
  },
});

const [, { setModalProps, closeModal }] = useModalInner(() => {
  resetFields();
  setModalProps({ confirmLoading: false });
});

async function handleSubmit() {
  try {
    const values = await validate();
    await updateUserPwdApi(values.oldPassword, values.newPassword);
    emit("success");
    message.success('密码修改成功！');
    userStore.logout(true)
  } finally {
    // setModalProps({ confirmLoading: false });
  }
}
</script>

<template>
  <div>
    <div class="title">
      <h2>修改该账号密码</h2>
      <h3>修改成功后会自动退出当前登录！</h3>
    </div>
    <a-card title="修改密码" class="acrd">
      <div class="form-container">
        <BasicForm @register="registerForm" @submit="handleSubmit" />
      </div>
    </a-card>
  </div>
</template>

<style lang="less" scoped>
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

.acrd {
  margin-right: 20px;

  .form-container {
    align-items: center;
    width: 500px;
    margin: 0 auto;
  }

  :deep(.ant-card-body) {
    padding: 56px 24px;
  }

  :deep(.ant-form-item-control-input-content) {
    &:has(.center-button) {
      padding-right: 103px;
    }
  }
}
</style>
