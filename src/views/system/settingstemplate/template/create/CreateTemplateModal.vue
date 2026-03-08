<template>
  <a-modal v-model:open="open" :title="formData.id ? '编辑报告模板基础信息' : '创建新的报告模板'" :confirm-loading="confirmLoading" :width="740" @ok="handleOk"
    :showCancelBtn="true" :okText="formData.id ? '确定' :'创建模板'" @cancel="handleCancel" centered>
    <a-spin :spinning="spinning">
    <a-form ref="formRef" :model="formData" :rules="rules" class="form-layout" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">

      <!-- 检测项目 -->
      <a-form-item label="检测项目" name="copyType" help="请选择检测项目,用于输出正确的模板报告">
        <a-select
          v-model:value="formData.copyType"
        >
          <a-select-option
            :value="1"
          >
            tNGS一步法呼吸道
          </a-select-option>
          <a-select-option
            :value="2"
          >
            tNGS一步法结核
          </a-select-option>
        </a-select>
      </a-form-item>

      <!-- 送检单位 -->
      <a-form-item label="送检单位" name="subHospital" help="请输入送检单位,用于上传后的样本正确匹配到该模板;在模板配置中必须唯一">
        <a-input v-model:value="formData.subHospital" placeholder="请输入送检单位" style="width: 100%" />
      </a-form-item>

      <!-- 模板名称 -->
      <a-form-item label="模板名称" name="name">
        <a-input v-model:value="formData.name" placeholder="请输入模板名称" style="width: 100%" />
      </a-form-item>

      <!-- 模板复制对象 -->
      <!-- <a-form-item label="模板复制对象" name="copyType" help="模板创建成功后,其配置内容将按照您以上的选择创建。如不了解配置内容，可先查看默认的两套内置模板的区别">
        <a-radio-group v-model:value="formData.copyType">
          <a-radio :value="1">按简单报告模板创建</a-radio>
          <a-radio :value="2">按自定义报告模板创建</a-radio>
        </a-radio-group>
      </a-form-item> -->

      <!-- 备注 -->
      <a-form-item label="备注信息" name="remark">
        <a-textarea show-count :maxlength="100" v-model:value="formData.remark" placeholder="请输入备注信息之后将显示在列表，辅助快速区分" style="width: 100%" />
      </a-form-item>

    </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { message } from "ant-design-vue";
import {
  ReportTemplateUpdateReqVO,
  ReportTemplateCreateReqVO,
} from "@/api/lims/report-template/model";
import {
  ExcavateDeeplyEnumMap,
} from "@/enums/customEnum";
import {
  createReportTemplate,
  getReportTemplate,
} from "@/api/lims/report-template";
import type { FormInstance } from "ant-design-vue";
import { FileItem } from "@/views/filemanager/component/FileList/useFileList";
import { manualUploadSocFiles } from "@/api/lims/soc-data";
import { useGo } from "@/hooks/web/usePage";

const spinning = ref<Boolean>(false);
const formRef = ref<FormInstance>();
const selectOptions = ref<{ label: string; value: number }[]>([]);

for (const key in ExcavateDeeplyEnumMap) {
  selectOptions.value.push({
    label: ExcavateDeeplyEnumMap[Number(key)],
    value: Number(key),
  });
}


// 表单验证规则
const rules = {
  copyType: [{ required: true, message: "请选择检测项目", trigger: "change" }],
  subHospital: [{ required: true, message: "请输入送检单位", trigger: "blur" }],
  name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
};

// 表单数据
const formData = reactive<ReportTemplateCreateReqVO>({
  subHospital: "",
  name: "",
  copyType: undefined,
  type: 3,
  remark: "",
});

// 恢复默认设置
const resetDefaultSettings = () => {
  formData.subHospital = "";
  formData.name = "";
  formData.copyType = undefined;
  formData.remark = ""
};

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

const go = useGo();

// 打开模态框方法
const showModal = async (templateData: ReportTemplateUpdateReqVO) => {
  open.value = true;

  if (!templateData) {
    // 清空数据
    resetDefaultSettings();

    // 通知SelectSampleModal清空数据
    emit("update-template-data", {
      sampleData: [],
    });
    emit("update-template-selection", -1); // 使用-1表示清空所有选中状态

    return;
  } else {
    spinning.value = true;
    templateData = await getReportTemplate(templateData.id || 0);
    spinning.value = false;
    formData.subHospital = templateData.subHospital;
    formData.name = templateData.name;
    formData.copyType = templateData.copyType;
    formData.remark = templateData.remark;
    formData.id = templateData.id;
  }
};

// 确定按钮逻辑
const handleOk = async () => {

  try {
    // 表单验证
    await formRef.value?.validate();

    confirmLoading.value = true;

    // 调用服务端接口
    formData.type = 3;
    await createReportTemplate(formData);
    if(formData.id) {
      message.success("模板修改成功");
    } else {
      message.success("模板创建成功");
    }

    emit("success", true);
    open.value = false;
  } catch (error: any) {
    if (error?.errorFields) {
      message.error(error.errorFields[0].errors[0]);
    } else {
      message.error("创建失败，请重试");
      console.error(error);
    }
  } finally {
    confirmLoading.value = false;
  }
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
  margin: 24px 48px;

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
      margin-bottom: 0;
    }
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
