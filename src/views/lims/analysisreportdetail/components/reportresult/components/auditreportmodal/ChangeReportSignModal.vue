<!-- v-model:open="open" -->

<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="`更换${formState.signType == '1' ? '检测员' : formState.signType == '2' ? '一审人员' : '二审人员'}签名`" 
    :confirm-loading="confirmLoading"
    @ok="handleOk()"
    okText="确认更换"
    @cancel="handleCancel"
    :minHeight="220"
    :width="600"
    :canFullscreen="false"
    centered
  >

    <div class="audit-report-form">
      <a-form
        :model="formState"
        :rulesRef="rulesRef"
        name="basic"
        autocomplete="off"
        :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }"
      >
        <a-form-item :label="`${formState.signType == '1' ? '检测员' : formState.signType == '2' ? '一审人员' : '二审人员'}`" name="reportSignId" required >
          <a-select v-model:value="formState.reportSignId" >
            <a-select-option v-for="(item) in signList" :key="item.id" :value="item.id">{{ item.signName }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-row>
          <a-col :span="4"></a-col>
          <a-col :span="18"><a-checkbox v-model:checked="formState.changeAll" style="margin-right: 8px;"/>同批次未审核样本均更换为以上选择</a-col>
        </a-row>
        <a-row style="margin-top: 8px;">
          <a-col :span="4"></a-col>
          <a-col :span="18">
            <div class="label">勾选该选项后，同一个批次下未经审核的样本，均会将签名更换为以上选择，该选择不影响报告模版内的默认签名配置。</div>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRaw } from "vue";
import { BasicModal, useModal } from "@/components/Modal";
import { useMessage } from "@/hooks/web/useMessage";
import { Form } from "ant-design-vue";
import {
  AnalysisReportAuditRespVO,
  ReoirtSignVO
} from "@/api/lims/analysistask/model";
import { listAllSign } from "@/api/lims/report-sign";
import { changeSign } from "@/api/lims/analysisreport";
import { useUserStore } from "@/store/modules/user";

const useForm = Form.useForm;
const [register, { closeModal, openModal }] = useModal();
// 定义emit事件类型
const emit = defineEmits<{
  (event: "setTaskName", payload: string): void;
  (event: "refreshTaskDetail"): void;
  (event: "uploadTaskeport"): void;
  (event: "refreshReportDetail", payload: ReoirtSignVO): void;
}>();
const { createMessage } = useMessage();
// 模态框状态

const confirmLoading = ref(false);


const reports = ref<AnalysisReportAuditRespVO>();
const signList = ref<any>();

const userStore = useUserStore();

const userId = computed(() => userStore.getUserInfo.user.id);

// 打开模态框方法
const showModal = async (
  report: AnalysisReportAuditRespVO,
  signType: string,
  reportSignId: number,
) => {
  formState.reportSignId = reportSignId;
  formState.reportId = report.id;
  formState.taskId = report.taskId;
  formState.signType = signType;
  reports.value = report;
  listAllSign().then(result => {
    signList.value = result.filter(item => item.signType == signType);
  });
  openModal();
};

const formState = reactive<{reportSignId: number, changeAll: boolean, reportId: number, taskId: number, signType: string}>({
  reportSignId: 0,
  changeAll: false,
  reportId: 0,
  taskId: 0,
  signType: ""
});

const rulesRef = reactive({
  reportSignId: [
    {
      required: true,
      message: `${formState.signType == '1' ? '检测员' : formState.signType == '2' ? '一审人员' : '二审人员'}不能为空!`,
    },
  ],
});

const { validate } = useForm(formState, rulesRef);

// 声明服务端接口方法（待实现）
const updateQcSetting = async () => {
  let obj = await changeSign({
    taskId: reports!.value!.taskId,
    reportId: reports!.value!.id,
    reportSignId: formState.reportSignId,
    signType: formState.signType,
    changeAll: formState.changeAll,
  });
  return obj;
};

// 确定按钮逻辑
const handleOk = async () => {
  confirmLoading.value = true;
  try {
    validate()
      .then(async () => {
        console.log(toRaw(formState));

        let data = await updateQcSetting();

        createMessage.success("签名变更成功");
        closeModal();
        emit("refreshReportDetail", data);
      })
      .catch((err) => {
        console.log(err);
        createMessage.error("签名变更失败，请重试");
      });
  } catch (error) {
    createMessage.error("签名变更失败，请重试");
  } finally {
    confirmLoading.value = false;
  }
};

// 取消按钮逻辑
const handleCancel = () => {
  closeModal();
};

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
    color: rgb(0 0 0 / 45%);
    font-weight: normal;
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