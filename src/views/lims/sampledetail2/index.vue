<template>
  <div>
    <!-- 顶部的任务详情 -->
    <PageHeader
      ref="headerRef"
      :taskDetail="taskDetail"
      @refreshTaskDetail="refreshTaskDetail"
    />

    <!-- 分析结果报告 -->
    <ReportResult
      ref="rrRef"
      :taskDetail="taskDetail"
      :findAnalysisReportDetails="findAnalysisReportDetails"
      :showTitle="true"
      :highlightKeyInfo="highlightKeyInfo"
      :activeKey="activeKey"
      @setThatReport="setThatReport"
      @refreshTaskDetail="refreshTaskDetail"
      @updateSampleSuccess="updateSampleSuccess"
      @highlightChange="highlightChange"
      @tabChange="tabChange"
    />

    <!-- 操作日志 -->
    <SampleLog :bizId="sampleId" ref="sampleLogRef" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getSampleBatch } from "@/api/lims/sample-batch"; // 假设接口路径
import PageHeader from "./components/pageheader/index.vue";
import ReportResult from "./components/reportresult/index.vue";
import SampleLog from "./components/samplelog/index.vue";
import { getSample } from "@/api/lims/sample";
import { mitt } from '@/utils/mitt'
const route = useRoute();
const taskIds = route.params.id as string; // 从路由中获取任务ID
const sampleIdParam = route.params.sampleId as string;
const loading = ref(true);
const sampleLogRef = ref<typeof SampleLog>();
const rrRef = ref<typeof ReportResult>();
const sampleBatchCode = ref(taskIds);
const highlightKeyInfo = ref<Boolean>(true);
const activeKey = ref<string>("1");
const sampleId = ref<string>(sampleIdParam || "");

const sampleEmitter = mitt();

//当前选中的样本数据
const taskDetail = ref<any>({});
//当前选中的样本数据
const thatReport = ref<any>({});

const findAnalysisReportDetails = ref<any>({});

// 方法一：使用ref直接引用模板中的组件（推荐）
// const batchDownloadRef = ref<InstanceType<typeof BatchDownload>>();

// const batchDownloadFunctionObj: any = {};

// 方法二：如果确实需要动态创建组件
onMounted(async () => {
  await refreshTaskDetail(true);
});

const refreshTaskDetail = async (isfirst: boolean = false) => {
  try {
    const res = await getSampleBatch(sampleBatchCode.value);
    // debugger;
    taskDetail.value = res;

    // 如果有报告列表且不为空，设置第一个报告为当前选中报告
    if (isfirst) {
      if(sampleId.value) {
        let idx = res.sampleDOS.findIndex(item => item.id == sampleId.value);
        thatReport.value = res?.sampleDOS[idx];
        sampleLogRef.value?.setSampleCode(res.batchCode, sampleId.value);
      } else {
        thatReport.value = res?.sampleDOS?.[0] || {};

        if (
          taskDetail.value.sampleDOS &&
          taskDetail.value.sampleDOS.length > 0 &&
          taskDetail.value.sampleDOS[0].id
        ) {
          sampleId.value = taskDetail.value.sampleDOS[0].id;
          sampleLogRef.value?.setSampleCode(res.batchCode, sampleId.value);
        }
      }
    }
    if (res.sampleDOS && res.sampleDOS.length > 0) {
      await setThatReport(thatReport.value || res.sampleDOS[0]);
    } else {
      await setThatReport({});
    }

    rrRef.value?.setTaskDetil(taskDetail.value);

    loading.value = false;
  } catch (error) {
    console.error("获取任务详情失败:", error);
    loading.value = false;
  }
};

//调整当前选中的样本数据
const setThatReport = async (sample) => {
  if (sample && sample.id) {
    thatReport.value = sample;
    console.log("选中的样本:", sample);
    // 这里可以更新其他UI组件或处理报告详情数据
    rrRef.value?.setSelectIndex(sample.id);
    
    sampleLogRef.value?.setSampleCode(sample.batchCode);
    try {
      // 获取选中报告的详细信息
      const sampleDetail = await getSample(
        thatReport.value.id
      );

      // 样本详情
      findAnalysisReportDetails.value = sampleDetail;
      console.log("样本详情:", sampleDetail);

      

      sampleLogRef.value?.setSampleCode(sample.batchCode, sample.id);
    } catch (error) {
      console.error("获取样本详情失败:", error);
    }
  } else {
    findAnalysisReportDetails.value = {};
  }
};

const updateSampleSuccess = async (sampleData) => {
  let sampleDOS = taskDetail.value.sampleDOS;
  if(sampleDOS && sampleDOS.length > 0) {
    let idx = sampleDOS.findIndex(item => item.id == sampleData.id);
    if(idx > -1) {
      sampleDOS[idx].examineeName = sampleData.examinee.name;
    }
  }
  // taskDetail.value.sampleDOS = sampleDOS;
  // findAnalysisReportDetails.value.examineeName = sampleData.examinee.name;
  // findAnalysisReportDetails.value.examinee.name = sampleData.examinee.name;
  // 获取选中报告的详细信息
  const sampleDetail = await getSample(
    thatReport.value.id
  );

  // 样本详情
  findAnalysisReportDetails.value = sampleDetail;
}

const highlightChange = (value:Boolean) => {
  highlightKeyInfo.value = value;
}

const tabChange = (value:string) => {
  activeKey.value = value;
}

onMounted(() => {
  sampleEmitter.on('sample-update-success', (sampleData) => {
    console.log('sampleData', sampleData);
  })
});

</script>




<style lang="less" scoped>
.download-pdf-tips {
  position: fixed;
  top: 8px;
  left: 50%;
  z-index: 1001;
  transform: translateX(-50%);
}
</style>