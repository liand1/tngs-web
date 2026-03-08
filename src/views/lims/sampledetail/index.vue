<template>
  <div>
    <a-row class="sample-detail-title">
      <a-col span="16"
        ><b>样本详情</b><span>样本批次编号:{{ record.batchCode }}</span>
      </a-col>
      <a-col span="8" style="text-align: right">
        <a-button style="margin-right: 10px" @click="updateSampleData"
          >编辑样本</a-button
        >
      </a-col>
    </a-row>

    <SampleInformtion ref="sifRef" :sampleId="sampleId" :record="record" />

    <SampleLog :bizId="sampleId" ref="sampleLogRef" />

    <SampleModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>



<script lang="ts" setup>
import { useRoute } from "vue-router";
import SampleInformtion from "./components/sampleinformation/index.vue";
import SampleLog from "./components/samplelog/index.vue";
import SampleModal from "../sample/SampleModal.vue";
import { useModal } from "@/components/Modal";
import { onMounted, ref } from "vue";
import { getSample } from "@/api/lims/sample";
import {
  createTypeOptions,
  fetchDictData,
  sampleTypeOptions,
  checkTypeOptions,
  i5CodeOptions,
  i7CodeOptions,
  sampleStatusOptions,
} from "../sample";
import { useRender } from "@/components/Table/src/hooks/useRender";

const route = useRoute();
const sampleId = route.params.id as string; // 从路由中获取任务ID
console.log("sampleId", sampleId);

const emit = defineEmits(["success", "register"]);

const sifRef = ref<typeof SampleInformtion>();

const sampleLogRef = ref<typeof SampleLog>();

const [registerModal, { openModal }] = useModal();

const record = ref<any>({});
// 在组件挂载时获取字典数据
onMounted(async () => {
  // 获取弹窗字典数据
  await fetchDictData();
  // 获取样本详情数据
  await getSampleData();
});
//获取样本详情数据
const getSampleData = async () => {
  const res = await getSample(Number(sampleId));

  // 将13位时间戳转换为标准时间格式
  if (res.createTime) {
    const timestamp =
      typeof res.createTime === "number"
        ? res.createTime
        : Number(res.createTime);
    if (!isNaN(timestamp)) {
      res.createTime = useRender.renderDate(res.createTime);
    }
  }
  res.createType = createTypeOptions.value.find(
    (item) => item.value === res.createType?.toString()
  )?.label;
  res.sampleType = sampleTypeOptions.value.find(
    (item) => item.value === res.sampleType?.toString()
  )?.label;
  res.checkType = checkTypeOptions.value.find(
    (item) => item.value === res.checkType?.toString()
  )?.label;

  res.i5Code = i5CodeOptions.value.find(
    (item) =>
      item.value === res.i5Code?.toString() ||
      item.label === res.i5Code?.toString()
  )?.label;
  res.i7Code = i7CodeOptions.value.find(
    (item) =>
      item.value === res.i7Code?.toString() ||
      item.label === res.i7Code?.toString()
  )?.label;
  res.sampleStatus = sampleStatusOptions.value.find(
    (item) => item.value === res.sampleStatus?.toString()
  )?.label;

  res.collectDate = useRender.renderDate(res.collectDate, "YYYY-MM-DD");
  res.samplingDate = useRender.renderDate(res.samplingDate, "YYYY-MM-DD");

  record.value = res;

  sampleLogRef.value?.setSampleCode(record.value.batchCode);
};

const handleSuccess = async () => {
  getSampleData();
};

const updateSampleData = () => {
  openModal(true, { record, isUpdate: true });
};
</script>

<style lang="less" scoped>
.sample-detail-title {
  height: 40px;
  margin: 0 20px 32px;
  line-height: 40px;

  b {
    margin-right: 12px;
    font-size: 20px;
  }

  span {
    color: rgb(0 0 0 / 45%);
  }
}
</style>