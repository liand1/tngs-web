<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import {
  ReportTemplateUpdateReqVO,
  ReportTemplateCreateReqVO,
} from "@/api/lims/report-template/model";
import {
  ExcavateDeeplyEnumMap,
} from "@/enums/customEnum";
import {
  updateIp,
} from "@/api/infra/ipsetting";
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

const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// 表单验证规则
const rules = {
  ip: [{ required: true, message: "请输入IP地址", trigger: "blur" },
    { pattern: ipRegex, message: '请输入有效的IP地址' },
  ],
  
};

// 表单数据
const formData = reactive<{ip:string}>({
  ip: "",
});

// 恢复默认设置
const resetDefaultSettings = () => {
  formData.ip = "";
};

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

const go = useGo();


// 确定按钮逻辑
const handleOk = async () => {

  try {
    // 表单验证
    await formRef.value?.validate();

    confirmLoading.value = true;

    // 调用服务端接口
    await updateIp(formData);
    message.success("IP更新成功");

    open.value = false;
  } catch (error: any) {
    if (error?.errorFields) {
      message.error(error.errorFields[0].errors[0]);
    } else {
      message.error("提交失败");
      console.error(error);
    }
  } finally {
    confirmLoading.value = false;
  }
};

onMounted(async () => {

  const hostname = window.location.hostname;
  formData.ip = hostname;
})

//setSelectSoc
</script>

<template>
    <a-spin :spinning="spinning">
    <a-form ref="formRef" :model="formData" :rules="rules" class="form-layout" :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }">
      <!-- 送检单位 -->
      <a-form-item label="ip地址" name="ip" help="如果一体机IP地址有变更，请输入新的IP地址">
        <a-input v-model:value="formData.ip" placeholder="请输入IP地址" style="width: 100%" />
      </a-form-item>

      <a-form-item style="text-align: center;">
        <a-button type="primary" @click="handleOk" :loading="confirmLoading">提交</a-button>
      </a-form-item>
    </a-form>
    </a-spin>
</template>



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
