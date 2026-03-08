<script lang="ts" setup>
import { computed, unref } from "vue";
import { LoginStateEnum, useLoginState } from "./useLogin";
import { useI18n } from "@/hooks/web/useI18n";

const { t } = useI18n();

const { getLoginState } = useLoginState();

const getFormTitle = computed(() => {
  const titleObj = {
    [LoginStateEnum.RESET_PASSWORD]: t("sys.login.forgetFormTitle"),
    [LoginStateEnum.LOGIN]: "欢迎使用👋圣湘测序分析系统",
    [LoginStateEnum.REGISTER]: t("sys.login.signUpFormTitle"),
    [LoginStateEnum.MOBILE]: t("sys.login.mobileSignInFormTitle"),
    [LoginStateEnum.QR_CODE]: t("sys.login.qrSignInFormTitle"),
  };
  return titleObj[unref(getLoginState)];
});
</script>

<template>
  <h2 class="enter-x text-center text-2xl font-bold title">
    <div v-if="getLoginState === LoginStateEnum.LOGIN">
      欢迎使用👋<span>圣湘测序分析系统</span>

      <b>请输入您的帐户信息以开始使用</b>
    </div>
    <div v-else>
      {{ getFormTitle }}
    </div>
  </h2>
</template>

<style lang="less" scoped>
.title {
  font-size: 32px;
  font-weight: bold;
  line-height: 45px;
  text-align: left;

  span {
    display: block;
  }

  b {
    display: block;
    margin-top: 8px;
    margin-bottom: 32px;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: rgb(0 0 0 / 45%);
    letter-spacing: 0%;
    vertical-align: middle;
  }
}
</style>
