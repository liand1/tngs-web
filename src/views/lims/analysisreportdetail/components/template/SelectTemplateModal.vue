<template>
  <a-modal v-model:open="open" title="修改报告模板" :confirm-loading="confirmLoading" :width="600" @ok="handleOk"
    :showCancelBtn="true" okText="确认修改模板" @cancel="handleCancel" centered>
    <a-form ref="formRef" :model="formData" :rules="rules" class="form-layout">
      
      <!-- 任务类型 -->
      <a-form-item label="选择报告模板" name="id" help="注意：选中的模板是当前已生成报告的模板,切换后将按照您选择的新模板输出报告">
        <a-radio-group v-model:value="formData.id">
          <a-radio style="display: flex" v-for="(item) in selectOptions" :key="item.value" :value="item.value">{{ item.label }}</a-radio>
        </a-radio-group>
      </a-form-item>

    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import {
  ReportTemplateCreateReqVO,
} from "@/api/lims/report-template/model";
import {
  listAllEnabled,
} from "@/api/lims/report-template";
import type { FormInstance } from "ant-design-vue";
import { auditAgainReport } from "@/api/lims/analysisreport";
const formRef = ref<FormInstance>();
const selectOptions = ref<{ label: string; value: number }[]>([]);

// 表单验证规则
const rules = {
  id: [{ required: true, message: "必须选择一个模板", trigger: "change" }],
};

// 表单数据
const formData = reactive<{id:number, reportId:number}>({
  id: 0,
  reportId: 0,
});

const currReportId = ref<number>(0);
const currTemplateId = ref<number>(0);

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

// 打开模态框方法
const showModal = async (id:number, reportId:number, checkType:number) => {
  open.value = true;
  currReportId.value = reportId;
  currTemplateId.value = id;
  formData.id = id || 0;
  formData.reportId = reportId;
  selectOptions.value = [];
  listAllEnabled(checkType).then(res => {
    res.forEach((item) => {
      selectOptions.value.push({
        label: item.type == 1 || item.type == 2 ? `[内置]${item.name}` : `${item.name}`,
        value: item.id
      });
    })
  })
};

// 确定按钮逻辑
const handleOk = async () => {
  if(!formData.id) {
    message.error("请先选择一个模板");
    return;
  }
  // if(currTemplateId.value === formData.id) {
  //   message.error("您没有切换模板,无法重新生成报告");
  //   return;
  // }
  // confirmLoading.value = true;
  // auditAgainReport(currReportId.value).then(() => {
    emit("update-template-selection", formData.id, formData.reportId);
    open.value = false;
    formData.id = 0;
    formData.reportId = 0;
  // }).finally(() => {
    // confirmLoading.value = false;
  // })
};

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
};

// 暴露外部接口
defineExpose({
  showModal,
});

// 定义自定义事件
const emit = defineEmits([
  "update-template-selection",
  "update-template-data",
  "success",
]);

//setSelectSoc
</script>

<style lang="less" scoped>
.create-box {
  padding: 20px;
}

.form-layout {
  margin: 24px 80px;

  &>* {
    margin-bottom: 48px;
  }

  .selectfile-box {
    margin: 10px 0 0;
  }

  .selectfile {
    margin-top: 8px;
  }

  .takeparam {
    // align-items: flex-end;

    :deep(.ant-row) {
      .ant-col {
        &:first-child {
          label {
            margin-top: 20px;
          }
        }
      }
    }

    :deep(.ant-form-item) {
      margin-bottom: 0px;
    }
  }

  :deep(.ant-radio-wrapper) {
    padding: 4px 0px 12px 0px;
  }

  .settingtitle {
    color: rgb(0 0 0 / 45%);

    .tp {
      margin-left: 5px;
    }
  }

  .reset-btn {
    margin-top: 21px;
  }
}
</style>
