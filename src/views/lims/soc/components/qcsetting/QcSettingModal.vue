<template>
  <a-modal
    v-model:open="open"
    title="质控设置"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="qc-setting-form">
      <!-- Q30(%) 输入框 -->
      <div class="form-item">
        <label>{{qcSettingsList.name}}大于：</label>
        <div>
          <a-slider
            id="test"
            v-model:value="qcSettingsList.value"
            :marks="marks"
          />
          <!-- <a-input-number
            v-model:value="qcSettingsList.value"
            :min="0"
            :max="100"
            :precision="2"
            style="width: 100px"
          /> -->
          <div class="description">大于上方输入框内值则判断为“合格”</div>
        </div>
      </div>

      <!-- 提示信息 -->
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useMessage } from "@/hooks/web/useMessage";
import {
  findNewestBatchCode,
  QcSettingsModel,
  updateQcSettings,
} from "@/api/lims/qcsettings";
import { QcSettingsStatusEnum, QcTypeEnum } from "@/enums/customEnum";
const { createMessage } = useMessage();
// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);
const marks = ref({
  0: "0",
  35: "35",
  70: "70",
  100: "100",
});
// 表单数据

const qcSettingsList = ref<QcSettingsModel>({
  id: 0,
  type: QcTypeEnum.CHIP,
  name: "Q30(%)",
  value: "85",
  status: QcSettingsStatusEnum.ENABLED,
});

onMounted(() => {
  getQcSettingsList();
});

const getQcSettingsList = async () => {
  const res = await findNewestBatchCode(QcTypeEnum.CHIP);
  if (res.length > 0) {
    qcSettingsList.value = res[0];
  }
};

// 打开模态框方法
const showModal = () => {
  getQcSettingsList();
  open.value = true;
};

// 确定按钮逻辑
const handleOk = async () => {
  confirmLoading.value = true;

  try {
    // 调用服务端接口 updateQcSetting
    await updateQcSettings(qcSettingsList.value);
    createMessage.success("质控设置保存成功");
    open.value = false;
  } catch (error) {
    createMessage.error("保存失败，请重试");
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
</script>

<style lang="less" scoped>
.qc-setting-form {
  display: flex;
  flex-direction: column;
  margin: 48px 0;
}

.form-item {
  display: flex;
  justify-content: center;
}

.form-item label {
  line-height: 30px;
}

.description {
  font-size: 12px;
  line-height: 20px;
  color: rgb(0 0 0 / 45%);
}
</style>