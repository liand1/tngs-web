<template>
  <a-modal
    v-model:open="open"
    title="编辑任务名称"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="qc-setting-form">
      <div class="form-item">
        <label>任务名称</label>
        <div>
          <a-input v-model:value="taskname" :precision="2" />
        </div>
      </div>

      <!-- 提示信息 -->
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessage } from "@/hooks/web/useMessage";
import { updateAnalysisTaskName } from "@/api/lims/analysistask";

// 定义emit事件类型
const emit = defineEmits<{
  (event: "setTaskName", payload: string): void;
}>();
const { createMessage } = useMessage();
// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

// 表单数据
const taskname = ref<string>(""); // 默认值为85
const taskid = ref<number>(0);

// 打开模态框方法
const showModal = (id: number, name: string) => {
  taskname.value = name;
  taskid.value = id;
  open.value = true;
};

// 确定按钮逻辑
const handleOk = async () => {
  confirmLoading.value = true;
  try {
    emit("setTaskName", taskname.value);
    // 调用服务端接口 updateQcSetting
    const res = await updateAnalysisTaskName(taskid.value, taskname.value);
    if (res) {
      createMessage.success("任务名称更新成功");
    } else {
      createMessage.error("任务名称更新失败");
    }
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
  margin-right: 10px;
  line-height: 30px;
}
</style>