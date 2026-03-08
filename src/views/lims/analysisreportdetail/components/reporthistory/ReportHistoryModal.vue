<template>
  <a-modal v-model:open="open" title="历史检出" :width="940">
    <a-spin :spinning="loading">
      <div class="display-box">
        <div class="total">共{{ resData.length }}条历史检出</div>
        <a-descriptions size="small" :labelStyle="{color: 'raba(255,255,255, 0.85)', fontWeight: 'normal', fontFamily: 'WeRuiHeiTi important'}" 
          :contentStyle="{color: 'raba(255,255,255, 1)', fontWeight: 'normal', fontFamily: 'WeRuiHeiTi important'}"
          :column="4" :title="`${index + 1}.${item.sampleRespVO?.examinee?.name}&nbsp;&nbsp;${item.sampleRespVO.sampleCode}&nbsp;&nbsp;${formatTime(item.finisTime)}`" layout="vertical" bordered v-for="(item, index) in resData" :key="index">
          <a-descriptions-item label="送检单位">{{ item.sampleRespVO.subHospital }}</a-descriptions-item>
          <a-descriptions-item label="姓名">{{ item.sampleRespVO.examinee.name }}</a-descriptions-item>
          <a-descriptions-item label="性别">{{item.sampleRespVO?.examinee?.sex == 0 ? '未知' : (item.sampleRespVO?.examinee?.sex == 1 ? '男' : '女')}}</a-descriptions-item>
          <a-descriptions-item label="年龄">{{ item.sampleRespVO?.examinee?.age }}</a-descriptions-item>
          <a-descriptions-item label="检测项目">{{ CheckTypeEnumMap[item.sampleRespVO.checkType] }}</a-descriptions-item>
          <a-descriptions-item label="样本类型">{{ SampleTypeEnumMap[item.sampleRespVO.sampleType] }}</a-descriptions-item>
          <a-descriptions-item label="sample编号">{{ item.sampleRespVO.sampleCode }}</a-descriptions-item>
          <a-descriptions-item label="检出时间">{{ formatTime(item.finisTime)}}</a-descriptions-item>
          <a-descriptions-item label="疑似病原体" :span="4" class="pathogen">
            <span>病原体名称:</span>
            <template v-for="(childItem) in item.resultRespVOList" :key="childItem.id">
              <span v-if="childItem.initialByLabel == 2">
                {{ childItem.pathogenCnSname }}({{ childItem.levellingReads }}),
              </span>
            </template>
          </a-descriptions-item>
          <a-descriptions-item label="主报告" :span="4" class="pathogen">
            <span>病原体名称:</span>
            <template v-for="(childItem) in item.resultRespVOList" :key="childItem.id">
              <span v-if="childItem.initialByLabel == 1">
                {{ childItem.pathogenCnSname }}({{ childItem.levellingReads }}),
              </span>
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-spin>
    <template #footer>
      <div style="display: flex; justify-content: center;">
        <a-button key="back" type="primary" ghost @click="handleCancel" gh>关闭</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import {
  AnalysisReportHistoryReqVO,
} from "@/api/lims/analysisreport/model";
import {
  listHistoryReport,
} from "@/api/lims/analysisreport";
import { useGo } from "@/hooks/web/usePage";
import { SampleTypeEnumMap, CheckTypeEnumMap } from '@/enums/customEnum';


const formData = reactive<AnalysisReportHistoryReqVO>({
  examineeName: "",
  phone: "",
  sampleId: 0,
  reportId: 0,
});

let resData = reactive([]);

// 模态框状态
const open = ref(false);
const loading = ref(false);

const go = useGo();

// 打开模态框方法
const showModal = async (data: AnalysisReportHistoryReqVO) => {
  open.value = true;
  formData.examineeName = data.examineeName;
  formData.phone = data.phone;
  formData.sampleId = data.sampleId;
  formData.reportId = data.reportId;

  loading.value = true;
  const params = {examineeName: data.examineeName, phone: data.phone, sampleId: data.sampleId, reportId: data.reportId};
  console.log("请求参数",  params);
  listHistoryReport(params).then(res => {
    console.log("历史检出结果", res);
    resData = res;
  }).finally(() => {
    loading.value = false;
  })
};

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
  
};
// 格式化时间戳为可读的日期时间
function formatTime(timestamp?: number): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString();
}


// 暴露外部接口
defineExpose({
  showModal,
});

// 定义自定义事件
const emit = defineEmits([
  "update-template-data",
  "success",
]);

//setSelectSoc
</script>

<style lang="less" scoped>
.display-box {
  padding: 24px;
  display: flex;
  flex-direction: column;

  .total {
    color: #bfbfbf;
    margin-bottom: 8px;
  }

  .pathogen span{
      margin-right: 8px;
      color: raba(255,255,255, 1);
      font-weight: normal;
      font-family: 'WeRuiHeiTi important';
  }
}
</style>
