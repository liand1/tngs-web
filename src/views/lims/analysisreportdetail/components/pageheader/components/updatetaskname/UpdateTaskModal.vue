<template>
  <a-modal
    v-model:open="open"
    title="编辑任务名称"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="qc-setting-form">
      <!-- Q30(%) 输入框 -->
      <div class="form-item">
        <label>任务名称</label>
        <div>
          <a-input
            v-model:value="taskname"
            :precision="2"
           
          />
        </div>
      </div>

      <!-- 提示信息 -->
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useMessage } from "@/hooks/web/useMessage";

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

// 打开模态框方法
const showModal = (name: string) => {
  taskname.value = name;
  open.value = true;
};

// 确定按钮逻辑
const handleOk = async () => {
  confirmLoading.value = true;
  try {
    emit("setTaskName", taskname.value);
    // 调用服务端接口 updateQcSetting
    // await updateQcSetting({ taskname: taskname.value });
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

// 声明服务端接口方法（待实现）
// const updateQcSetting = async (data: { taskname: string }) => {
//   // 这里应实现接口调用，示例：
//   // return $api.updateQcSetting(data).then(() => {
//   //   message.success('保存成功')
//   // })
//   console.log("接口调用待实现", data);
// };
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