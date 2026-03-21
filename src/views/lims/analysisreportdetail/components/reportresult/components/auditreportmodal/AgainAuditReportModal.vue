<!-- v-model:open="open" -->

<template>
  <template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="重出报告审核"
    :confirm-loading="confirmLoading"
    @ok="handleOk(3)"
    okText="确认重出报告"
    @cancel="handleCancel"
    :minHeight="220"
    :width="860"
    :canFullscreen="false"
    centered
  >
    <!-- <template #centerFooter>
      <a-button key="2" danger class="under" @click="handleOk(4)"
        >审核不通过</a-button
      >
    </template> -->

    <template #footer>
      <div style="display: flex; justify-content: space-between;">
        <div>
          <a-button key="2" danger class="under" @click="showChangeReportSignModal(analysisReportDetails?.reportCheckSign.id, analysisReportDetails?.reportOneSign.id, analysisReportDetails?.reportTwoSign.id)"
            >更换报告签名</a-button
          >
        </div>
        <div>
          <a-button key="1" class="under" @click="handleCancel()"
            >取消</a-button
          >
          <a-button key="2" type="primary" class="under" @click="handleOk(3)"
            >确认重出报告</a-button
          >
        </div>
      </div>
    </template>

    <div class="audit-report-form">
      <a-form
        :model="formState"
        :rulesRef="rulesRef"
        name="basic"
        layout="vertical"
        autocomplete="off"
      >
        <a-form-item label="编号" name="taskcode" required>
          <a-input v-model:value="formState.taskcode" disabled />
        </a-form-item>

        <a-row style="padding-top: 8px; padding-bottom: 32px;">
          <a-col :span="8">
            <div style="display: flex">
              <div class="label"><span>检测员签名: </span>{{ analysisReportDetails?.reportCheckSign.signName }}</div>
            </div>
            <div class="image"><img :src="analysisReportDetails?.reportCheckSign.imageUrl" /></div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex">
              <div class="label"><span>一审人员签名: </span>{{ analysisReportDetails?.reportOneSign.signName }}</div>
            </div>
            <div class="image"><img :src="analysisReportDetails?.reportOneSign.imageUrl" /></div>
          </a-col>
          <a-col :span="8">
            <div style="display: flex">
              <div class="label"><span>二审人员签名: </span>{{ analysisReportDetails?.reportTwoSign.signName }}</div>
            </div>
            <div class="image"><img :src="analysisReportDetails?.reportTwoSign.imageUrl" /></div>
          </a-col>
        </a-row>

        <a-form-item label="审核备注" name="remark">
          <a-textarea v-model:value="formState.remark" />
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>

  <ChangeReportSignModal
      ref="armRef"
      @refreshReportDetail="refreshReportDetail"
    />
  </template>

</template>

<script setup lang="ts">
import { computed, reactive, ref, toRaw } from "vue";
import { BasicModal, useModal } from "@/components/Modal";
import { useMessage } from "@/hooks/web/useMessage";
import { FormState } from "./model";
import { Form } from "ant-design-vue";
import {
  AnalysisReportAuditRespVO,
  AnalysisTaskAuditRespVO,
} from "@/api/lims/analysistask/model";
import { FindAnalysisReportDetailsModel } from "@/views/lims/analysistaskdetail/model";

import { auditAgainReport } from "@/api/lims/analysisreport";
import { useUserStore } from "@/store/modules/user";
import ChangeReportSignModal from "./ChangeReportSignModal.vue";

const useForm = Form.useForm;
const [register, { closeModal, openModal }] = useModal();
// 定义emit事件类型
const emit = defineEmits<{
  (event: "setTaskName", payload: string): void;
  (event: "refreshTaskDetail"): void;
  (event: "auditSuccess"): void;
}>();
const { createMessage } = useMessage();
// 模态框状态

const confirmLoading = ref(false);

const taskDetails = ref<AnalysisTaskAuditRespVO>();

const reports = ref<AnalysisReportAuditRespVO>();

const analysisReportDetails = ref<FindAnalysisReportDetailsModel>();
const armRef = ref<typeof ChangeReportSignModal>();
const userStore = useUserStore();

const userId = computed(() => userStore.getUserInfo.user.id);

// 打开模态框方法
const showModal = (
  report: AnalysisReportAuditRespVO,
  taskDetail: AnalysisTaskAuditRespVO,
  findAnalysisReportDetails:  FindAnalysisReportDetailsModel,
) => {
  formState.taskcode = report.sampleCode;
  reports.value = report;
  taskDetails.value = taskDetail;
  analysisReportDetails.value = findAnalysisReportDetails;
  openModal();
};

const formState = reactive<FormState>({
  taskcode: "",
  remark: "",
});

const rulesRef = reactive({
  taskcode: [
    {
      required: true,
      message: "编号不能为空!",
    },
  ],
});

const { validate } = useForm(formState, rulesRef);

// 声明服务端接口方法（待实现）
const updateQcSetting = async (type: number) => {
  let auditStatus = type;

  await auditAgainReport({
    taskId: reports!.value!.taskId,
    sampleId: reports!.value!.sampleId,
    reportId: reports!.value!.id,
    action: formState.remark,
    auditStatus,
  });
  if (auditStatus === 3) {
    emit("auditSuccess");
  }
};

// 确定按钮逻辑
const handleOk = async (type: number) => {
  confirmLoading.value = true;
  try {
    validate()
      .then(async () => {
        // console.log(toRaw(formState));

        await updateQcSetting(type);

        createMessage.success("审核成功");
        closeModal();
        emit("refreshTaskDetail");
        formState.remark = "";
      })
      .catch((err) => {
        console.log(err);
        createMessage.error("审核失败，请重试");
      });
  } catch (error) {
    createMessage.error("审核失败，请重试");
  } finally {
    confirmLoading.value = false;
  }
};

// 取消按钮逻辑
const handleCancel = () => {
  closeModal();
};

const showChangeReportSignModal = (checkSignId: number, oneSignId: number, twoSignId: number) => {
  armRef?.value?.showModal(analysisReportDetails.value, checkSignId, oneSignId, twoSignId, taskDetails.value);
};

const refreshReportDetail = (data:[]) => {
  let checkeSign = data.find(item => item.signType == "1");
  analysisReportDetails.value.checkSignId = checkeSign.id;
  analysisReportDetails.value.reportCheckSign = checkeSign;
  let oneSign = data.find(item => item.signType == "2");
  analysisReportDetails.value.oneSignId = oneSign.id;
  analysisReportDetails.value.reportOneSign = oneSign;
  let twoSign = data.find(item => item.signType == "3");
  analysisReportDetails.value.twoSignId = twoSign.id;
  analysisReportDetails.value.reportTwoSign = twoSign;
}

// 暴露外部接口
defineExpose({
  showModal,
});
</script>

<style lang="less" scoped>
.audit-report-form {
  display: flex;
  flex-direction: column;
  margin: 48px;
}
.label {
  span {
    color: rgb(0 0 0 / 45%);
    font-weight: normal;
  }
}
.link {
  a {
    margin-left: 8px;
    font-weight: normal;
  }
}
.image {
  margin-top: 8px;
  img {
    width: 120px;
    height: 60px;
  }
}
</style>