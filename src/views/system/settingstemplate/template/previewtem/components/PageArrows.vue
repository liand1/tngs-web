<template>
  <div class="page-arrows-container">
    <!-- 左侧翻页箭头 -->
    <div
      v-if="currentPage > 1 && show"
      class="page-arrow page-arrow-left"
      @click="prevPage"
    >
      <left-outlined />
    </div>
    
    <!-- 右侧翻页箭头 -->
    <div
      v-if="currentPage < totalPages && show"
      class="page-arrow page-arrow-right"
      @click="nextPage"
    >
      <right-outlined />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
import { LeftOutlined, RightOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  // 是否显示翻页箭头
  show: {
    type: Boolean,
    default: true
  },
  // 当前页码
  currentPage: {
    type: Number,
    required: true
  },
  // 总页数
  totalPages: {
    type: Number,
    required: true
  },
  // 箭头的尺寸
  size: {
    type: Number,
    default: 32
  },
  // 箭头位置 - 距离边缘的距离(px)
  edgeDistance: {
    type: Number,
    default: 10
  },
  // 箭头图标的大小
  iconSize: {
    type: Number,
    default: 20
  }
});

const emit = defineEmits(['prev-page', 'next-page', 'page-change']);

// 上一页
const prevPage = () => {
  if (props.currentPage > 1) {
    emit('prev-page');
    emit('page-change', props.currentPage - 1);
  }
};

// 下一页
const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('next-page');
    emit('page-change', props.currentPage + 1);
  }
};

defineExpose({
  prevPage,
  nextPage
});
</script>

<style lang="less" scoped>
.page-arrows-container {
  position: absolute;
  inset: 0; /* 替代 top/right/bottom/left */
  z-index: 10;
  pointer-events: none; // 允许点击穿透到下层元素
}

.page-arrow {
  position: absolute;
  top: 50%;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('`${props.size}px`');
  height: v-bind('`${props.size}px`');
  font-size: v-bind('`${props.iconSize}px`');
  color: rgb(0 0 0 / 50%);
  pointer-events: auto; // 恢复箭头的点击事件
  cursor: pointer;
  background-color: rgb(255 255 255 / 80%);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  transition: all 0.2s;
  transform: translateY(-50%);

  &:hover {
    color: rgb(0 0 0 / 80%);
    background-color: #fff;
    box-shadow: 0 4px 12px rgb(0 0 0 / 20%);
  }

  &.page-arrow-left {
    left: v-bind('`${props.edgeDistance}px`');
  }

  &.page-arrow-right {
    right: v-bind('`${props.edgeDistance}px`');
  }
}
</style> 