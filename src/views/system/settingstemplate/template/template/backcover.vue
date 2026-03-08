<template>
  <template v-if="type === 1 || type === 2">
    <div
      class="template-container"
      :style="{
        width: '100%',
        height: '100%',
        lineHeight: '1.5',
      }"
    >
      <img :src="backCover?.fileList[0]" style="width: 100%; height: 100%" />
      <div style="position: absolute; right: 100px; bottom: 100px; left: 100px">
        <img v-if="qrCode?.fileList && qrCode?.fileList.length > 0 && qrCode?.fileList[0]" :src="qrCode?.fileList[0]" style="width: 150px; height: 150px" />
        <p v-if=" unitName?.value" style="margin: 30px 0 0; font-size: 24px; color: #FFF">
          {{ unitName?.value }}
        </p>
        <p v-if=" unitEnglishName?.value" style="margin: 0; font-size: 14px; color: #FFF">
          {{ unitEnglishName?.value }}
        </p>
        <p v-if=" address?.value" style="margin: 20px 0 0; font-size: 16px; color: #fff">
          地址：{{ address?.value }}
        </p>
        <p v-if=" website?.value" style="margin: 0; font-size: 16px; color: #fff">
          官方网站：{{ website?.value }}
        </p>
        <p v-if=" freeServiceHotline?.value" style="margin: 20px 0 0; font-size: 24px; color: #FFF">
          免费服务热线：{{ freeServiceHotline?.value }}
        </p>
      </div>
    </div>
  </template>
  <template v-if="type === 3">
    <div
      class="template-container"
      :style="{
        width: '100%',
        height: '100%',
        lineHeight: '1.5',
      }"
    >
      <img :src="backCover?.fileList[0]" style="width: 100%; height: 100%" />
    </div>
  </template>
</template>

<script setup lang="ts">
import { inputDomeModel } from "@/views/system/settingstemplatedetail/index.data";
import { ref } from "vue";

const props = defineProps({
  itemsData: {
    type: Array<inputDomeModel>,
    required: true,
  },
  type: {
    type: Number,
    required: true,
  },
});

const backCover = ref(props.itemsData.find((item) => item.fields === "tail"));

//单位名称
const unitName = ref(
  props.itemsData.find((item) => item.fields === "unitName")
);
//单位英文名
const unitEnglishName = ref(
  props.itemsData.find((item) => item.fields === "unitEnglishName")
);
//二维码
const qrCode = ref(props.itemsData.find((item) => item.fields === "qrCode"));
//地址
const address = ref(props.itemsData.find((item) => item.fields === "address"));
//官网
const website = ref(props.itemsData.find((item) => item.fields === "website"));
//免费服务热线
const freeServiceHotline = ref(
  props.itemsData.find((item) => item.fields === "freeServiceHotline")
);
</script>

