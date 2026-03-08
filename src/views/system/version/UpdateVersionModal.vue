<template>
  <a-modal v-model:open="open" :title="formData.id ? '编辑更新内容' : '编辑更新内容'" :confirm-loading="confirmLoading" :width="740" @ok="handleOk"
    :showCancelBtn="true" :okText="formData.id ? '确定' :'确定'" @cancel="handleCancel" centered>
    <a-spin :spinning="spinning">
    <a-form ref="formRef" :model="formData" :rules="rules" class="form-layout" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">

      <!-- 版本名称 -->
      <a-form-item label="版本号" name="versionNumber">
        <a-input v-model:value="formData.versionNumber" placeholder="请输入版本号" style="width: 100%" />
      </a-form-item>

      <!-- 更新内容 -->
      <a-form-item label="更新内容" name="updateContent">
        <a-textarea show-count :maxlength="1000" :auto-size="{ minRows: 5, maxRows: 8 }"
          v-model:value="formData.updateContent" placeholder="请输入更新内容" style="width: 100%" />
      </a-form-item>

    </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { message } from "ant-design-vue";
import {
  ExcavateDeeplyEnumMap,
} from "@/enums/customEnum";
import {
  SystemVersionBaseVO
} from "@/api/lims/systemversion/model";
import {
  updateSystemVersion,
} from "@/api/lims/systemversion";
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
  content: [{ required: true, message: "请输入更新内容", trigger: "blur" }],
};

// 表单数据
const formData = reactive<SystemVersionBaseVO>({
  updateContent: "",
  id: 0,
  versionNumber: "",
  deletedTime: ""
});

// 恢复默认设置
const resetDefaultSettings = () => {
  formData.updateContent = "";
  formData.id = 0;
  formData.versionNumber = "";
};

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

const go = useGo();

// 打开模态框方法
const showModal = async (updateVersionData: SystemVersionBaseVO) => {
  open.value = true;

  if (!updateVersionData) {
    // 清空数据
    resetDefaultSettings();
    return;
  } else {
    formData.updateContent = updateVersionData.updateContent;
    formData.id = updateVersionData.id;
    formData.versionNumber = updateVersionData.versionNumber;
  }
};

// 确定按钮逻辑
const handleOk = async () => {

  try {
    // 表单验证
    await formRef.value?.validate();

    confirmLoading.value = true;

    // 调用服务端接口
    await updateSystemVersion(formData);
    message.success("更新内容修改成功");
    
    emit("success", true);
    open.value = false;
  } catch (error: any) {
    if (error?.errorFields) {
      message.error(error.errorFields[0].errors[0]);
    } else {
      message.error("更新失败，请重试");
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
