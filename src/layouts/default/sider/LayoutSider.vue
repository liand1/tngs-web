<script lang="ts" setup>
import type { CSSProperties } from "vue";
import { computed, h, ref, unref } from "vue";

import { Layout } from "ant-design-vue";
import LayoutMenu from "../menu/index.vue";
import { useDragLine, useSiderEvent, useTrigger } from "./useLayoutSider";
import DragBar from "./DragBar.vue";
import LayoutTrigger from "@/layouts/default/trigger/index.vue";

import { MenuModeEnum, MenuSplitTyeEnum } from "@/enums/menuEnum";

import { useMenuSetting } from "@/hooks/setting/useMenuSetting";
import { useHeaderSetting } from "@/hooks/setting/useHeaderSetting";
import { useAppInject } from "@/hooks/web/useAppInject";
import { useDesign } from "@/hooks/web/useDesign";

defineOptions({ name: "LayoutSideBar" });

const Sider = Layout.Sider;

const dragBarRef = ref<ElRef>(null);
const sideRef = ref<ElRef>(null);

const {
  getCollapsed,
  getMenuWidth,
  getSplit,
  getMenuTheme,
  getRealWidth,
  getMenuHidden,
  getMenuFixed,
  getIsMixMode,
} = useMenuSetting();

const { getHeaderTheme } = useHeaderSetting();

const { prefixCls } = useDesign("layout-sideBar");

const { getIsMobile } = useAppInject();

const { getTriggerAttr, getShowTrigger } = useTrigger(getIsMobile);

useDragLine(sideRef, dragBarRef);

const { getCollapsedWidth, onBreakpointChange } = useSiderEvent();

const getMode = computed(() => {
  return unref(getSplit) ? MenuModeEnum.INLINE : null;
});

const getSplitType = computed(() => {
  return unref(getSplit) ? MenuSplitTyeEnum.LEFT : MenuSplitTyeEnum.NONE;
});

const showClassSideBarRef = computed(() => {
  return unref(getSplit) ? !unref(getMenuHidden) : true;
});

const getSiderClass = computed(() => {
  return [
    prefixCls,
    {
      [`${prefixCls}--fixed`]: unref(getMenuFixed),
      [`${prefixCls}--mix`]: unref(getIsMixMode) && !unref(getIsMobile),
    },
  ];
});

const getHiddenDomStyle = computed((): CSSProperties => {
  const width = `${unref(getRealWidth)}px`;
  return {
    width,
    overflow: "hidden",
    flex: `0 0 ${width}`,
    maxWidth: width,
    minWidth: width,
    transition: "all 0.2s",
    background: "#f5f5f5",
    borderRight: "1px solid #eee"
  };
});

// 在此处使用计算量可能会导致sider异常
// andv 更新后，如果trigger插槽可用，则此处代码可废弃
const getTrigger = h(LayoutTrigger);
</script>

<template>
  <div
    v-if="getMenuFixed && !getIsMobile"
    v-show="showClassSideBarRef"
    :style="getHiddenDomStyle"
  />

  <Sider
    v-show="showClassSideBarRef"
    :class="getSiderClass"
    class="flex-1"
    ref="sideRef"
    breakpoint="lg"
    collapsible
    :width="getMenuWidth"
    :collapsed="getCollapsed"
    :collapsed-width="getCollapsedWidth"
    :theme="getMenuTheme"
    :trigger="getTrigger"
    v-bind="getTriggerAttr"
    @breakpoint="onBreakpointChange"
  >
    <template v-if="getShowTrigger" #trigger>
      <LayoutTrigger />
    </template>
    <LayoutMenu
      :theme="getMenuTheme"
      :menu-mode="getMode"
      :split-type="getSplitType"
    />
    <DragBar ref="dragBarRef" />

    <div class="flex layoutrigger">
      <LayoutTrigger
        :theme="getHeaderTheme"
        :sider="false"
        class="layoutriggerbox"
      />
    </div>
  </Sider>
</template>

<style lang="less">
@prefix-cls: ~"@{namespace}-layout-sideBar";

.@{prefix-cls} {
  @siderBottom: 40px;

  z-index: @layout-sider-fixed-z-index;

  &--fixed {
    position: fixed !important;
    top: 0;
    left: 0;
    height: calc(100% - @siderBottom);
  }

  &--mix {
    top: @header-height - 1;
    height: calc(100% - @header-height - @siderBottom);
    background: #f5f5f5 !important;
    border-right: 1px solid #eee;
  }

  &.ant-layout-sider-dark {
    background-color: @sider-dark-bg-color;

    .ant-layout-sider-trigger {
      color: darken(@white, 25%);
      background-color: @trigger-dark-bg-color;

      &:hover {
        color: @white;
        background-color: @trigger-dark-hover-bg-color;
      }
    }
  }

  &.ant-layout-sider-light {
    background-color: @sider-dark-bg-color;

    .ant-layout-sider-trigger {
      color: darken(@white, 25%);
      background-color: @trigger-dark-bg-color;

      &:hover {
        color: @white;
        background-color: @trigger-dark-hover-bg-color;
      }
    }
  }

  .layoutrigger {
    bottom: 0;
    left: 0;
    height: @siderBottom;
    background: "#f5f5f5";
    border-top: 1px solid #f0f0f0;
    
    .layoutriggerbox {
      padding-left: 16px;
      line-height: @siderBottom;
      cursor: pointer;
    }
  }

  &:not(.ant-layout-sider-dark) {
    // box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);

    .ant-layout-sider-trigger {
      border-top: 1px solid var(--border-color);
    }
  }

  .ant-layout-sider-zero-width-trigger {
    top: 40%;
    z-index: 10;
  }

  & .ant-layout-sider-trigger {
    height: 36px;
    line-height: 36px;
  }
}
</style>
