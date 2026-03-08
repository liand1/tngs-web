<template>
  <div class="autoplay-control" v-if="show">
    <a-switch
      v-model:checked="autoplayActive"
      checked-children="自动播放"
      un-checked-children="手动翻页"
      @change="handleAutoplayChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { createAutoplayController } from '../index';

const props = defineProps({
  // 是否显示自动播放控制
  show: {
    type: Boolean,
    default: true
  },
  // 自动播放间隔（毫秒）
  interval: {
    type: Number,
    default: 5000
  },
  // 总页数
  totalPages: {
    type: Number,
    required: true
  },
  // 当前页码
  currentPage: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['next-page', 'page-change', 'autoplay-change']);

// 自动播放状态
const autoplayActive = ref(false);

// 点击下一页的函数引用
const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('next-page');
    emit('page-change', props.currentPage + 1);
  } else {
    // 如果是最后一页，回到第一页
    emit('page-change', 1);
  }
};

// 创建自动播放控制器
const autoplayController = createAutoplayController(nextPage, props.interval);

// 处理自动播放状态变化
const handleAutoplayChange = (value: boolean) => {
  if (value) {
    startAutoplay();
  } else {
    stopAutoplay();
  }
  emit('autoplay-change', value);
};

// 开始自动播放
const startAutoplay = () => {
  autoplayController.start();
};

// 停止自动播放
const stopAutoplay = () => {
  autoplayController.stop();
};

// 监听interval属性变化
watch(() => props.interval, (newInterval) => {
  // 重新创建控制器
  stopAutoplay();
  const tempController = createAutoplayController(nextPage, newInterval);
  Object.assign(autoplayController, tempController);
  
  // 如果当前正在自动播放，则重新启动
  if (autoplayActive.value) {
    startAutoplay();
  }
});

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  stopAutoplay();
});

defineExpose({
  startAutoplay,
  stopAutoplay,
  isAutoplayActive: () => autoplayActive.value,
  setAutoplay: (status: boolean) => {
    autoplayActive.value = status;
    handleAutoplayChange(status);
  }
});
</script>

<style lang="less" scoped>
.autoplay-control {
  display: inline-flex;
  align-items: center;
  height: 100%;
  margin-left: 20px;
}
</style> 