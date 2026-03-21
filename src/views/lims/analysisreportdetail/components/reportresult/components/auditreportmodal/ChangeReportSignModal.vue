<!-- v-model:open="open" -->

<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="`更换签名`" 
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
        <a-form-item label="检测员" name="checkSignId" required >
          <a-select v-model:value="formState.checkSignId" style="width: 60%;" @change="(v) => checkCheckSignChange(v)">
            <a-select-option v-for="(item) in signList?.filter(o => o.signType == '1')" :key="item.id" :value="item.id">{{ item.signName }}</a-select-option>
          </a-select>
          <span class="image" v-if="checkSignIdImageUrl"><img :src="checkSignIdImageUrl" /></span>
        </a-form-item>
        <a-form-item label="一审人员" name="oneSignId" required >
          <a-select v-model:value="formState.oneSignId" style="width: 60%;" @change="(v) => checkOneSignChange(v)">
            <a-select-option v-for="(item) in signList?.filter(o => o.signType == '2')" :key="item.id" :value="item.id">{{ item.signName }}</a-select-option>
          </a-select>
          <span class="image" v-if="oneSignIdImageUrl"><img :src="oneSignIdImageUrl" /></span>
        </a-form-item>
        <a-form-item label="二审人员" name="twoSignId" required >
          <a-select v-model:value="formState.twoSignId" :disabled="!isTwoAuditor" style="width: 60%;" @change="(v) => checkTwoSignChange(v)">
            <a-select-option v-for="(item) in signList?.filter(o => o.signType == '3')" :key="item.id" :value="item.id">{{ item.signName }}</a-select-option>
          </a-select>
          <span class="image" v-if="twoSignIdImageUrl"><img :src="twoSignIdImageUrl" /></span>
        </a-form-item>

        <a-row>
          <a-col :span="4"></a-col>
          <a-col :span="18"><a-checkbox v-model:checked="formState.changeAll" style="margin-right: 8px;"/>同批次未审核样本均更换为以上选择</a-col>
        </a-row>
        <a-row style="margin-top: 8px;">
          <a-col :span="4"></a-col>
          <a-col :span="18">
            <div class="label">勾选该选项后，同一个批次下未经二审通过的样本，均会更换为以上选择，该选择不影响报告模版内的默认签名配置。</div>
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
  ReoirtSignVO,
  AnalysisTaskAuditRespVO
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
  (event: "refreshReportDetail", payload: []): void;
}>();
const { createMessage } = useMessage();
// 模态框状态

const confirmLoading = ref(false);

const taskDetails = ref<AnalysisTaskAuditRespVO>();
const reports = ref<AnalysisReportAuditRespVO>();
const signList = ref<any>();
const checkSignIdImageUrl = ref<string>();
const oneSignIdImageUrl = ref<string>();
const twoSignIdImageUrl = ref<string>();

const userStore = useUserStore();

const userId = computed(() => userStore.getUserInfo.user.id);

// 打开模态框方法
const showModal = async (
  report: AnalysisReportAuditRespVO,
  checkSignId: number,
  oneSignId: number,
  twoSignId: number,
  taskDetail:  AnalysisTaskAuditRespVO,
) => {
  formState.checkSignId = checkSignId;
  formState.oneSignId = oneSignId;
  formState.twoSignId = twoSignId;
  formState.reportId = report.id;
  formState.taskId = report.taskId;
  reports.value = report;
  taskDetails.value = taskDetail;

  listAllSign().then(result => {
    signList.value = result;
    let checkSign = result.find(item => item.id == checkSignId);
    if(!checkSign) {
      checkSign = result.find(item => item.signType == '1');
    }
    checkSignIdImageUrl.value = checkSign?.imageUrl;
    let oneSign = result.find(item => item.id == oneSignId);
    if(!oneSign) {
      oneSign = result.find(item => item.signType == '2');
    }
    oneSignIdImageUrl.value = oneSign?.imageUrl;
    let twoSign = result.find(item => item.id == twoSignId);
    if(!twoSign) {
      twoSign = result.find(item => item.signType == '3');
    }
    twoSignIdImageUrl.value = twoSign?.imageUrl;
  });
  openModal();
};

const formState = reactive<{checkSignId: number, oneSignId: number, twoSignId: number, changeAll: boolean, reportId: number, taskId: number}>({
  checkSignId: 0,
  oneSignId: 0,
  twoSignId: 0,
  changeAll: false,
  reportId: 0,
  taskId: 0,
});

const rulesRef = reactive({
  checkSignId: [
    {
      required: true,
      message: `检测员不能为空!`,
    },
  ],
  oneSignId: [
    {
      required: true,
      message: `一审人员不能为空!`,
    },
  ],
  twoSignId: [
    {
      required: true,
      message: `二审人员不能为空!`,
    },
  ],
});

const { validate } = useForm(formState, rulesRef);

// 声明服务端接口方法（待实现）
const changeSignSetting = async () => {
  let obj = await changeSign({
    taskId: reports!.value!.taskId,
    reportId: reports!.value!.id,
    checkSignId: formState.checkSignId,
    oneSignId: formState.oneSignId,
    twoSignId: formState.twoSignId,
    changeAll: formState.changeAll,
  });
  return obj;
};

const checkCheckSignChange = (v: number) => {
  formState.checkSignId = v;
  let sign = signList?.value.find(item => item.id == v);
  checkSignIdImageUrl.value = sign.imageUrl;
}

const checkOneSignChange = (v: number) => {
  formState.oneSignId = v;
  let sign = signList?.value.find(item => item.id == v);
  oneSignIdImageUrl.value = sign.imageUrl;
}

const checkTwoSignChange = (v: number) => {
  formState.twoSignId = v;
  let sign = signList?.value.find(item => item.id == v);
  twoSignIdImageUrl.value = sign.imageUrl;
}

// 确定按钮逻辑
const handleOk = async () => {
  confirmLoading.value = true;
  try {
    validate()
      .then(async () => {
        console.log(toRaw(formState));

        let data = await changeSignSetting();

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

//是否是一审人
const isOneAuditor = computed(() => {
  console.log("taskDetails", taskDetails, "taskDetails.oneAuditorId", taskDetails.value.oneAuditorId, "userId.value", userId.value );
  return taskDetails.value.oneAuditorId === userId.value;
});

//是否是二审人
const isTwoAuditor = computed(() => {
  return taskDetails.value.twoAuditorId === userId.value;
});

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
  margin-left: 32px;
  img {
    width: 80px;
    height: 40px;
  }
}
</style>