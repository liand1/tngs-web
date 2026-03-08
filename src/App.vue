<script lang="ts" setup>
import "dayjs/locale/zh-cn";

import { App, ConfigProvider } from "ant-design-vue";
import { storeToRefs } from "pinia";

import { computed } from "vue";
import { AppProvider } from "@/components/Application";
import { useTitle } from "@/hooks/web/useTitle";
import { useLocale } from "@/locales/useLocale";
import { useAppStore } from "@/store/modules/app";

// support Multi-language
const { getAntdLocale } = useLocale();
const appStore = useAppStore();
const { themeConfig } = storeToRefs(appStore);

const componentSize = computed(() => appStore.getComponentSize);

// Listening to page changes and dynamically changing site titles
useTitle();
</script>

<template>
  <ConfigProvider
    :locale="getAntdLocale"
    :theme="themeConfig"
    :component-size="componentSize"
  >
    <App class="h-full w-full">
      <AppProvider>
        <RouterView />
      </AppProvider>
    </App>
  </ConfigProvider>

  <div id="preview-pdf-container-batch" style="position: absolute; left: -99999px">

  </div>

</template>

<style>
/* 引入自定义字体 */
@font-face {
  font-family: SourceHanSansSCBold;
  font-style: normal;
  font-weight: normal;
  src: url("/fonts/SourceHanSansSC-Bold.ttf") format("truetype");
  font-display: swap;
}

@font-face {
  font-family: SourceHanSansSCMedium;
  font-style: normal;
  font-weight: bold;
  src: url("/fonts/SourceHanSansSC-Medium.ttf") format("truetype");
  font-display: swap;
}

@font-face {
  font-family: SourceHanSansSCRegular;
  font-style: normal;
  font-weight: normal;
  src: url("/fonts/SourceHanSansSC-Regular.ttf") format("truetype");
  font-display: swap;
}


/* 设置全局字体 */
body * {
  /* font-family: WeRuiHeiTi !important; */

  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", SourceHanSansSCMedium,  Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.modal-icon-success {
  color: #52C41A !important;
}
</style>
