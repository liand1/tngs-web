<template>
  <a-modal v-model:open="open" :title="formData.id ? '编辑签名' : '添加签名'" :confirm-loading="confirmLoading" :width="740" @ok="handleOk"
    :showCancelBtn="true" :okText="formData.id ? '确定' :'确定'" @cancel="handleCancel" centered>
    <a-spin :spinning="spinning">
    <a-form ref="formRef" :model="formData" :rules="rules" class="form-layout" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">

      <!-- 送检单位 -->
      <a-form-item label="职责人员" name="signType">
        <a-select v-model:value="formData.signType" placeholder="请选择" style="width: 100%" >
          <a-select-option value="1">检测者</a-select-option>
          <a-select-option value="2">一审人员</a-select-option>
          <a-select-option value="3">二审人员</a-select-option>
        </a-select>
      </a-form-item>

      <!-- 模板名称 -->
      <a-form-item label="人员姓名" name="signName">
        <a-input v-model:value="formData.signName" placeholder="请输入" style="width: 100%" :maxLength="20"/>
      </a-form-item>

      <!-- 模板复制对象 -->
      <!-- <a-form-item label="模板复制对象" name="copyType" help="模板创建成功后,其配置内容将按照您以上的选择创建。如不了解配置内容，可先查看默认的两套内置模板的区别">
        <a-radio-group v-model:value="formData.copyType">
          <a-radio :value="1">按简单报告模板创建</a-radio>
          <a-radio :value="2">按自定义报告模板创建</a-radio>
        </a-radio-group>
      </a-form-item> -->

      <!-- 备注 -->
      <a-form-item label="人员签名图片" name="imageUrl">
        <div class="upload-wrapper">
          <div class="upload-box">
            <FileUpload
              v-model:value="formData.imageUrl"
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
            上传图片宽高比为2:1,分辨率不小于640*320,文件大小需小于5MB,保存视觉元素居中
          </div>
        </div>
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
import {
  createReportSign,
  getReportSign,
} from "@/api/lims/report-sign";
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
  signType: [{ required: true, message: "请选择职责人员", trigger: "blur" }],
  signName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  imageUrl: [{ required: true, message: "请上传签名图片", trigger: "blur" }],
};

// 表单数据
const formData = reactive<any>({
  id: null,
  signType: "",
  signName: "",
  imageUrl: undefined,
  remark: "",
});

// 恢复默认设置
const resetDefaultSettings = () => {
  formData.id = null;
  formData.signType = "";
  formData.signName = "";
  formData.imageUrl = undefined;
};

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

const go = useGo();

// 打开模态框方法
const showModal = async (signData: any) => {
  open.value = true;

  if (!signData) {
    // 清空数据
    resetDefaultSettings();

    // 通知SelectSampleModal清空数据
    emit("update-sign-data", {
      sampleData: [],
    });
    emit("update-sign-selection", -1); // 使用-1表示清空所有选中状态

    return;
  } else {
    spinning.value = true;
    signData = await getReportSign(signData.id || 0);
    spinning.value = false;
    formData.imageUrl = signData.imageUrl;
    formData.signName = signData.signName;
    formData.signType = signData.signType;
    formData.remark = signData.remark;
    formData.id = signData.id;
  }
};

// 确定按钮逻辑
const handleOk = async () => {

  try {
    // 表单验证
    await formRef.value?.validate();

    confirmLoading.value = true;

    // 调用服务端接口
    await createReportSign(formData);
    if(formData.id) {
      message.success("签名修改成功");
    } else {
      message.success("签名创建成功");
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
      formData.imageUrl = "";
    }, 0);
  }

  return isSuccess;
}

const handleChange = async (url: string) => {
  formData.imageUrl = url;
  await nextTick();
  if (formRef.value) {
    formRef.value.validateFields(['imageUrl']);
  }
}

// 暴露外部接口
defineExpose({
  showModal,
});

// 定义自定义事件
const emit = defineEmits([
  "update-sign-selection",
  "update-sign-data",
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
