<script lang="ts" setup>
import { computed } from "vue";
// import { Avatar } from "ant-design-vue";
import { useUserStore } from "@/store/modules/user";
// import headerImg from "@/assets/images/header.jpg";
import { ReadOutlined } from "@ant-design/icons-vue";
import { useGo } from "@/hooks/web/usePage";

const userStore = useUserStore();
const userinfo = computed(() => userStore.getUserInfo);


const go = useGo();
const openGuide = () => {
  go("/system/usermanual");
};
</script>

<template>
  <div class="lg:flex" style="margin-bottom: 12px">
    <!-- <Avatar
      :src="userinfo.user.avatar || headerImg"
      :size="72"
      class="!mx-auto !block"
    /> -->
    <div class="mt-2 flex flex-col justify-center md:ml-6 md:mt-0">
      <h1 class="text-md md:text-lg">
        Hi 欢迎回来，{{ userinfo.user.nickname }}
      </h1>
      <span class="text-secondary" @click="openGuide">
        欢迎使用 圣湘生物 tNGS一步法分析系统，使用过程中遇到问题您可以
        <ReadOutlined class="icon-secondary" /><b>打开引导</b>
      </span>
    </div>
    <!-- <div class="mt-4 flex flex-1 justify-end md:mt-0">
      <div class="flex flex-col justify-center text-right">
        <span class="text-secondary"> 待办 </span>
        <span class="text-2xl">2/10</span>
      </div>

      <div class="mx-12 flex flex-col justify-center text-right md:mx-16">
        <span class="text-secondary"> 项目 </span>
        <span class="text-2xl">8</span>
      </div>
      <div class="mr-4 flex flex-col justify-center text-right md:mr-10">
        <span class="text-secondary"> 团队 </span>
        <span class="text-2xl">300</span>
      </div>
    </div> -->
  </div>
</template>


<style lang="less" scoped>
.text-secondary {
  .icon-secondary {
    margin-right: 4px;
  }

  b {
    font-weight: normal;
    text-decoration-line: underline;
    cursor: pointer;
  }
}
</style>