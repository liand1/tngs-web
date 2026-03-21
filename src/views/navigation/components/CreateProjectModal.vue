<template>
  <a-modal v-model:open="open" :title="formData.id ? '编辑应用' : '添加新的应用'" :confirm-loading="confirmLoading" :width="740" @ok="handleOk"
    :showCancelBtn="true" :okText="formData.id ? '保存编辑' :'保存创建'" @cancel="handleCancel" centered>
    <a-spin :spinning="spinning">
    <a-form ref="formRef" :model="formData" :rules="rules" class="form-layout" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">

      <!-- 应用名称 -->
      <a-form-item label="应用名称" name="title" help="">
        <a-input v-model:value="formData.title" placeholder="请输入" style="width: 100%" />
      </a-form-item>

      <!-- 备注 -->
      <a-form-item label="应用logo" name="iconSrc">
        <div class="upload-wrapper">
          <div class="upload-box">
            <FileUpload
              v-model:value="formData.iconSrc"
              file-type="image"
              :maxCount="1"
              @change="handleChange($event)"
              :beforeUpload="
                (file) =>
                  beforeUpload(file)
              "
            />
          </div>
          <div class="upload-desc">
            上传图片请保持为正方形分辨率不小于640*640，文件大小需小于5MB，保持视觉元素居中。
          </div>
        </div>
      </a-form-item>

      <!-- 应用链接 -->
      <a-form-item label="应用链接" name="url">
        <a-input v-model:value="formData.url" placeholder="请输入" style="width: 100%" />
      </a-form-item>

    </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { message } from "ant-design-vue";
import {
  ExcavateDeeplyEnumMap,
} from "@/enums/customEnum";
import type { FormInstance } from "ant-design-vue";
import { FileItem } from "@/views/filemanager/component/FileList/useFileList";
import { manualUploadSocFiles } from "@/api/lims/soc-data";
import FileUpload from "@/components/Form/src/components/FileUpload.vue";
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
  title: [{ required: true, message: "请输入应用名称", trigger: "change" }],
  url: [{ required: true, message: "请输入应用链接", trigger: "blur" }],
  iconSrc: [{ required: true, message: "请上传应用logo", trigger: "blur" }],
};

// 表单数据
const formData = reactive<any>({
  title: "",
  url: "",
  iconSrc: undefined,
  remark: "",
  id: null,
  type: 2,
});

// 恢复默认设置
const resetDefaultSettings = () => {
  formData.title = "";
  formData.url = "";
  formData.iconSrc = undefined;
  formData.type = 2;
  formData.id = null;
};

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

const go = useGo();

// 打开模态框方法
const showModal = async (projectData: any) => {
  open.value = true;
  if (!projectData) {
    // 清空数据
    resetDefaultSettings();
    return;
  } else {
    formData.iconSrc = projectData.type == 2 ? projectData.iconSrc : `/public/resource/img/${projectData.iconSrc}.png`;
    formData.url = projectData.url;
    formData.title = projectData.title;
    formData.id = projectData.id;
    formData.type = projectData.type;
  }
};

// 确定按钮逻辑
const handleOk = async () => {

  try {
    // 表单验证
    await formRef.value?.validate();

    confirmLoading.value = true;
    
    formData.hidden = false;
    formData.visible = true;
    formData.pinned = false;
    formData.isSwitch = true;
    emit("success", {...formData});
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

const beforeUpload = (file: any) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("您只能上传JPG/PNG格式的图片!");
  }
  //是否超过最大大小
  let exceedsMaxSize = false;
  const isLt1M = file.size / 1024 / 1024 <= 5;
  if (!isLt1M) {
    exceedsMaxSize = true;
    message.error("图片必须小于5MB!");
  }
  const isSuccess = isJpgOrPng && !exceedsMaxSize;

  if (!isSuccess) {
    setTimeout(() => {
      formData.iconSrc = "";
    }, 0);
  }

  return isSuccess;
}

const handleChange = async (url: string) => {
  formData.iconSrc = url;
  await nextTick();
  if (formRef.value) {
    formRef.value.validateFields(['iconSrc']);
  }
}

// 暴露外部接口
defineExpose({
  showModal,
});

// 定义自定义事件
const emit = defineEmits([
  "update-project-selection",
  "update-project-data",
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

.upload-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .upload-box {
    margin-right: 20px;

    :deep(& > div) {
      width: 110px;
      height: 110px;
      overflow: hidden;
    }
  }

  .upload-desc {
    flex: auto;
    max-width: 300px;
    margin-top: 8px;
    font-size: 14px;
    color: rgb(0 0 0 / 45%);
  }
}
</style>
