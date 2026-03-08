<script lang="ts" setup>
import { ref, watch } from "vue";
import { resultTypeOptions } from "./data";
import { ResultType } from "../model";

// 定义组件属性
const props = defineProps<{
  resultType: string;
}>();

// 定义组件事件
const emit = defineEmits<{
  (e: "update:resultType", value: ResultType): void;
}>();

// 当前选中的结果类型，默认为阳性
const currentResultType = ref(props.resultType || "positive");



// 切换结果类型
const handleResultTypeChange = (value: ResultType) => {
  currentResultType.value = value;
  emit("update:resultType", value);
};

// 监听父组件传入的 resultType 变化（用于重置等操作）
watch(
  () => props.resultType,
  (newValue) => {
    if (newValue !== currentResultType.value) {
      currentResultType.value = newValue;
    }
  }
);
</script>

<template>
  <div class="result-type-selector">
    <a-segmented
      v-model:value="currentResultType"
      :options="resultTypeOptions"
      @change="handleResultTypeChange"
    />
  </div>
</template>

<style scoped lang="less">
.result-type-selector {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
}
</style> 