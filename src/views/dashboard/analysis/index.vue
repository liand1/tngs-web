<script lang="ts" setup>
import GrowCard from "./components/growcard/GrowCard.vue";

import CheckTypeStatistics from "./components/checkTypeStatistics.vue";
import SampleStatics from "./components/sampleStatistics.vue";
import PositiveRate from "./components/positiveRate.vue";
import PathogenStatistics from "./components/pathogenStatistics.vue";
import BgPathogenStatistics from "./components/bgPathogenStatistics.vue";
import WolfPack from "./components/wolfpack.vue";
</script>

<template>
  <div style="padding: 0 12px 12px">
    <GrowCard class="enter-y" />
    <CheckTypeStatistics />
    <SampleStatics />
    <PositiveRate />
    <PathogenStatistics />
    <BgPathogenStatistics />
    <WolfPack />
  </div>
</template>

<style lang="less" scoped>
.pathogen-container {
  display: flex;
  gap: 16px;
  width: 100%;
  margin-top: 16px;

  @media (max-width: 1200px) {
    flex-direction: column;

    & > div {
      width: 100%;
    }
  }

  & > div {
    flex: 1;
  }
}
</style>
