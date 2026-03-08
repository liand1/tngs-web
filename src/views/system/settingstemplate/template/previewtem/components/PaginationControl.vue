<template>
  <div>
    <!-- 仅保留页面顶部的控制按钮 -->
    <div class="pagination-controls" v-if="show">
      <a-button type="primary" :disabled="currentPage <= 1" @click="prevPage">
        上一页
      </a-button>
      <span class="page-indicator">{{ currentPage }} / {{ totalPages }}</span>
      <a-button
        type="primary"
        :disabled="currentPage >= totalPages"
        @click="nextPage"
      >
        下一页
      </a-button>
      <div class="page-info" v-if="showPageInfo">
        第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  // 是否显示分页控制
  show: {
    type: Boolean,
    default: true,
  },
  // 当前页码
  currentPage: {
    type: Number,
    required: true,
  },
  // 总页数
  totalPages: {
    type: Number,
    required: true,
  },
  // 是否在页面底部显示页码信息
  showPageInfo: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits(["prev-page", "next-page", "page-change"]);

// 上一页
const prevPage = () => {
  if (props.currentPage > 1) {
    emit("prev-page");
    emit("page-change", props.currentPage - 1);
  }
};

// 下一页
const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit("next-page");
    emit("page-change", props.currentPage + 1);
  }
};

defineExpose({
  prevPage,
  nextPage
});
</script>

<style lang="less" scoped>
.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 10px;
  margin-bottom: 0;

  .page-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    height: 32px; /* 与按钮高度一致 */
    margin: 0 20px;
    font-size: 14px;
    color: #666;
  }

  .ant-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 80px;
    margin: 0 5px;
  }

  .page-info {
    display: inline-flex;
    align-items: center;
    height: 32px; /* 与按钮高度一致 */
    margin-left: 20px;
    font-size: 12px;
    color: #8c8c8c;
  }
}
</style> 