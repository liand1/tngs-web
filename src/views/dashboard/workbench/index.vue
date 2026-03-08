<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import WorkbenchHeader from './components/WorkbenchHeader.vue'
import ProjectCard from './components/ProjectCard.vue'
import QuickNav from './components/QuickNav.vue'
import DynamicInfo from './components/DynamicInfo.vue'
import SaleRadar from './components/SaleRadar.vue'
import { PageWrapper } from '@/components/Page'
import UnanalyzedSoc from './components/UnanalyzedSoc.vue'
import workbenchBg from '@/assets/images/workbenchbg.png'

const loading = ref(true)

// 设置工作台背景
function setWorkbenchBg() {
  // 获取根元素
  const root = document.documentElement;
  // 动态设置CSS变量
  root.style.setProperty('--workbench-bg', `url(${workbenchBg})`);
}

onMounted(() => {
  // 组件挂载后设置背景
  setWorkbenchBg();
  
  // 模拟加载
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <PageWrapper class="workbench-page">
    <template #headerContent>
      <WorkbenchHeader />
    </template>
    <div class="lg:flex project-card-container">
      <div class="enter-y w-full !mr-4 lg:w-7/10">
        <ProjectCard :loading="loading" class="enter-y" />
        <DynamicInfo :loading="loading" class="enter-y !my-4" />
        <UnanalyzedSoc :loading="loading" class="enter-y"  />
      </div>
      <div class="enter-y w-full lg:w-3/10">
        <QuickNav :loading="loading" class="enter-y" />

        <SaleRadar :loading="loading" class="enter-y my-4" />
      </div>
     
    </div>
  </PageWrapper>
</template>

<style lang="less" scoped>
.workbench-page {
  :deep(.ant-page-header){
    height: 108px;
    margin:0 12px 1rem  !important;
    color: #fff;
    background-image: var(--workbench-bg);
    background-repeat: no-repeat;
    background-position: right center;
    background-size: cover;

    .text-secondary{
      color: #fff !important;
    }

    .ant-page-header-content{
      padding:0;
    }
  }


  :deep(.shengxiang-page-wrapper-content) {
    margin: 12px !important;
  }


}
</style>