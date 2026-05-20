<template>
  <a-layout class="layout">
    <a-layout-header class="header">
      <div class="header-content">
        <span class="-enter-x logo-image">
          <AppLogo :always-show-title="true" :show-title="false" />
        </span>
        <a-button @click="handleLoginOut" class="logout-button"
          >退出登录</a-button
        >
      </div>
    </a-layout-header>
    <a-layout-content class="content">
      <a-row class="card-row" :gutter="80">
        <template v-for="(item, index) in externalLinks">
          <a-col :key="index" v-if="!item.hidden" :span="4" >
            <a
              rel="noopener noreferrer"
              class="card-link"
              @click="handleCardClick(item)"
            >
              <div class="card-content">
                <div :class="['icon-wrapper', item.iconClass]">
                  <img :src="`${item.iconSrc}`" v-if="item.iconSrc?.startsWith('http')"/>
                  <img :src="`/public/resource/img/${item.iconSrc}.png`" v-else/>
                </div>
                <a-typography-text class="card-title">{{
                  item.title
                }}</a-typography-text>
              </div>
            </a>
          </a-col>
        </template>
      </a-row>
    </a-layout-content>
  </a-layout>

  <div class="login-background absolute left-0 top-0 size-full"></div>

  <DisplaySettingsModal
    ref="displaySettingsModalRef"
    @setExternalLinks="setExternalLinks"
  />
</template>

<script lang="ts" setup>
import { AppLogo } from "@/components/Application";
// import "@/assets/svg/new-tngs-icon.svg";
// import "@/assets/svg/old-tngs-icon.svg";
// import "@/assets/svg/mngs-icon.svg";
// import "@/assets/svg/more-icon.svg";
import DisplaySettingsModal from "./components/displaysetting.vue";
import { useUserStore } from "@/store/modules/user";
import { onMounted, ref } from "vue";
import { ExternalLink } from "./components/data";
import {
  getDictDataPageToDictType,
  updateDictData,
  // updateDictData,
} from "@/api/system/dict/data";
import { DictDataVO } from "@/api/system/dict/types";
import { getUserInfo } from "@/api/base/user";
const userStore = useUserStore();
const displaySettingsModalRef =
  ref<InstanceType<typeof DisplaySettingsModal>>();
const externalLinks = ref<ExternalLink[]>([]);
const canSaveSettings = ref(false);

const dictData = ref<DictDataVO>();
const getCreateType = async () => {
  const res = await getDictDataPageToDictType("sub_system_settings");
  return res;
};

function parseSubSystemSettingsValue(value?: string): ExternalLink[] | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (parsed && typeof parsed === "object" && "title" in parsed) {
      return [parsed as ExternalLink];
    }
  } catch {
    // Normal dictionary text, not a navigation JSON config.
  }

  return null;
}

function parseSubSystemSettings(record: DictDataVO): ExternalLink[] | null {
  return (
    parseSubSystemSettingsValue(record.label) ||
    parseSubSystemSettingsValue(record.value) ||
    parseSubSystemSettingsValue(record.remark)
  );
}

function createLinksFromDictRows(list: DictDataVO[]): ExternalLink[] {
  return list
    .filter((item) => Number(item.status) === 0)
    .map((item) => ({
      id: item.sort || item.id,
      title: item.label,
      url: item.value,
      iconClass: item.cssClass,
      iconSrc: item.cssClass,
      hidden: false,
      isSwitch: true,
    }))
    .filter((item) => !!item.title);
}

onMounted(async () => {
  const res = await getCreateType();

  if (res.list.length > 0) {
    const parsedRecord = res.list
      .map((item) => ({ item, settings: parseSubSystemSettings(item) }))
      .find(({ settings }) => settings);

    const settingRecord = parsedRecord?.item || res.list[0];
    let subSystemSettings = parsedRecord?.settings || createLinksFromDictRows(res.list);
    canSaveSettings.value = !!parsedRecord;
    if (!subSystemSettings.length) {
      console.warn("sub_system_settings dictionary data is empty.", res.list);
      return;
    }

    dictData.value = settingRecord;
    
    const isAdmin = await isAdminUser();
    //只有adminuser用户才能操作更多按钮
    if (!isAdmin) {
      subSystemSettings = subSystemSettings.filter((item) => item.id !== 4);
    } else {
      let moreId = subSystemSettings.findIndex(item => item.id === 4);
      if(moreId > -1) {
        let more = subSystemSettings.splice(moreId, 1);
        subSystemSettings.push(...more);
      }
    }

    externalLinks.value = subSystemSettings;
    console.log(externalLinks.value);

    displaySettingsModalRef.value?.setData(externalLinks.value);
  }
});

// 判断是否是adminuser
async function isAdminUser() {
  try {
    const res = await getUserInfo();
    if (res.user.id === 1) {
      return true;
    }
  } catch (error) {
    console.warn("Failed to get current user info.", error);
  }

  return false;
}

//updateDictData

//sub_system_settings

// {
//   id: 1,
//   url: "/dashboard",
//   iconClass: "new-tngs-icon",
//   iconSrc: newTngsIcon,
//   title: "tNGS一步法病原检测(新)",
//   hidden: false,
//   isSwitch: false,
// },
// {
//   id: 2,
//   url: "",
//   iconClass: "old-tngs-icon",
//   iconSrc: oldTngsIcon,
//   title: "tNGS病原检测(旧)",
//   hidden: false,
//   isSwitch: true,
// },
// {
//   id: 3,
//   url: "",
//   iconClass: "mngs-icon",
//   iconSrc: mngsIcon,
//   title: "mNGS病原检测",
//   hidden: false,
//   isSwitch: true,
// },
// {
//   id: 4,
//   url: "",
//   iconClass: "more-icon",
//   iconSrc: moreIcon,
//   title: "更多",
//   hidden: false,
//   isSwitch: true,
// },

const setExternalLinks = (newVal: ExternalLink[]) => {
  externalLinks.value = newVal;
  let moreId = externalLinks.value.findIndex(item => item.id === 4);
  if(moreId > -1) {
    let more = externalLinks.value.splice(moreId, 1);
    externalLinks.value.push(...more);
  }
  if (canSaveSettings.value && dictData.value) {
    dictData.value.label = JSON.stringify(newVal);
    updateDictData(dictData.value);
  }
};

function handleCardClick(item: any) {
  if (item.id === 4) {
    displaySettingsModalRef.value?.setData(externalLinks.value);
    displaySettingsModalRef.value?.show();
    return;
  }
  if (item.id === 1) {
    window.location.href = item.url;
  } else {
    window.open(item.url, "_blank");
  }
}

//  login out
function handleLoginOut() {
  userStore.confirmLoginOut();
}
</script>

<style scoped lang="less">
.logo-image {
  :deep(img) {
    width: 137px;
  }
}

.layout {
  min-height: 100vh;
  background: none; /* Match Figma background */
}

.header {
  display: flex;
  align-items: center;
  height: 80px; /* Adjust height based on Figma */
  padding: 0 50px;
  background: none; /* White header background */
  border-bottom: 1px solid none; /* Add a subtle border */
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between; /* Distribute items */
  width: 100%;
}

.title {
  margin-bottom: 0 !important;
  font-size: 40px;
  font-weight: 400;
  line-height: normal;
  color: #1890ff;
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.system-card {
  text-align: center;
  border-radius: 2px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  min-width: 140px;
  padding: 20px 12px;
  cursor: pointer;
}

@icon_size: 114px;

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: @icon_size;
  height: @icon_size;
  margin-bottom: 10px;
  border-radius: 16px;
}

.icon-wrapper img {
  width: @icon_size;
  height: @icon_size;
  border-radius: 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 0%;
}

.checkbox-section {
  margin-top: 48px;
}

.checkbox-card {
  padding: 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
}

.checkbox-header {
  width: 100%;
  margin-bottom: 4px;
}

.header-col {
  font-size: 10px;
  line-height: 22px;
  color: rgb(0 0 0 / 45%);
  text-align: left;
}

.drag-handle {
  display: flex;
  align-items: center;
  height: 100%;
  padding-top: 2px;
  cursor: grab;
}

.drag-icon-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
}

.ant-checkbox-wrapper {
  font-size: 14px; /* Match Figma label font size */
}

/* Add styles for checked state if needed, based on Figma */

/* .ant-checkbox-checked .ant-checkbox-inner { ... } */

.navigation-page-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #f0f2f5;
}

.settings-table {
  width: 240px; /* Set width directly for non-positioned table */
  margin: 20px auto; /* Example margin for visibility */
  overflow: hidden; /* Ensure border-radius clips content */
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgb(0 0 0 / 10%);
}

.header-text {
  /* Additional styling for header text if needed */
}
</style>
