<script lang="ts" setup>
import LoginForm from "./LoginForm.vue";
import { AppLogo } from "@/components/Application";

import { useDesign } from "@/hooks/web/useDesign";

defineProps({
  sessionTimeout: {
    type: Boolean,
  },
});

const { prefixCls } = useDesign("login");
</script>

<template>
  <div
    :class="prefixCls"
    class="relative h-full min-h-full w-full overflow-hidden px-4"
  >
    <span class="-enter-x">
      <AppLogo :always-show-title="true" :show-title="false" />
    </span>

    <div class="relative mx-auto h-full py-2 container sm:px-10">
      <div class="h-full flex">
        <div
          class="h-full w-full flex py-5 xl:my-0 xl:h-auto xl:w-12/12 xl:py-0"
        >
          <!-- eslint-disable max-len -->
          <div
            :class="`${prefixCls}-form`"
            class="enter-x relative mx-auto my-auto"
          >
            <LoginForm />

            <div class="flex justify-center items-center btn-copyright">
              Copyright © 2025 圣湘生物科技股份有限公司
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="login-background absolute left-0 top-0 size-full"></div>
</template>

<style lang="less">
@prefix-cls: ~"@{namespace}-login";
@logo-prefix-cls: ~"@{namespace}-app-logo";
@countdown-prefix-cls: ~"@{namespace}-countdown-input";
@dark-bg: #293146;

html[data-theme="dark"] {
  .@{prefix-cls} {
    background-color: @dark-bg;

    &::before {
      background-image: url("@/assets/svg/login-bg-dark.svg");
    }

    .ant-input,
    .ant-input-password {
      background-color: #232a3b;
    }

    .ant-btn:not(.ant-btn-link, .ant-btn-primary) {
      border: 1px solid #4a5569;
    }

    &-form {
      background: transparent !important;
    }

    .app-iconify {
      color: #fff;
    }
  }

  input.fix-auto-fill,
  .fix-auto-fill input {
    -webkit-text-fill-color: #c9d1d9 !important;
    box-shadow: inherit !important;
  }
}

.@{prefix-cls} {
  .@{logo-prefix-cls} {
    position: absolute;
    top: 12px;

    &__title {
      font-size: 16px;
      color: #fff;
    }

    img {
      width: 137px;
    }
  }

  .container {
    .@{logo-prefix-cls} {
      display: flex;
      width: 60%;
      height: 80px;

      &__title {
        font-size: 24px;
        color: #fff;
      }

      img {
        width: 48px;
      }
    }
  }

  &-sign-in-way {
    .anticon {
      font-size: 22px;
      color: #888;
      cursor: pointer;
    }
  }

  input:not([type="checkbox"]) {
    // min-width: 3px;
  }

  .@{countdown-prefix-cls} input {
    min-width: unset;
  }

  .ant-divider-inner-text {
    font-size: 12px;
  }

  .@{prefix-cls}-form{
    width:600px;
    padding: 80px 120px;
    background-color: #fff;
    border-radius: 24px;
    box-shadow: 0 4px 48px 0 rgb(105 18 18 / 12%);
  }

  .btn-copyright{
    position: absolute;
    right: 0;
    bottom: 24px;
    left: 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;
    color: rgb(0 0 0 / 45%);
    text-align: center;
    letter-spacing: 0%;
    vertical-align: middle;
    }
}





</style>
