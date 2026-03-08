<template>
  <a-modal
    v-model:open="open"
    :title="name + ' 质控详情'"
    :confirm-loading="confirmLoading"
    :width="700"
    :footer="false"
  >
    <div class="task-details">
      <!-- 动态渲染 li -->
      <div v-for="(item, index) in data" :key="index" class="li">
        <div class="title">{{ item.qcSettingsName }}</div>

        <div class="status-box">
          <div class="result">
            <div>检出结果值：</div>
            <span>{{ item.checkValue }}%</span>
          </div>

          <div
            class="status"
            :class="{
              'text-success': item.qcStatus === QcStatusEnum.PASS,
              'text-danger': item.qcStatus === QcStatusEnum.FAIL,
              'text-warning': item.qcStatus === QcStatusEnum.WARNING,
            }"
          >
            {{ item.qcStatus === QcStatusEnum.PASS ? "合格" : (item.qcStatus === QcStatusEnum.FAIL ? "不合格" :
              (item.qcStatus === QcStatusEnum.WARNING ? "预警" : "-") )}}
          </div>

        </div>

        <div class="time-box">
          <div class="timestamp">
            质控时间：{{ useRender.renderDate(item.createTime) }}
          </div>
          <div class="standard">
            <span style="color: rgb(0 0 0 / 45%)">判断标准值：</span
            >{{ item.qcValue }}
            <template v-if="item.qcSettingsName !== 'out_sex'"> % </template>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
</template>


<script setup lang="ts">
import { ref } from "vue";

import { QcTypeEnum, QcStatusEnum } from "@/enums/customEnum";
import { findQcReportByObjectId } from "@/api/lims/qcreport";
import { QcReportListResultVO } from "@/api/lims/qcreport/model";
import { useRender } from "@/components/Table";

// 数据源
const data = ref<QcReportListResultVO>([]);
const name = ref<string>("");

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

// 打开模态框方法
const showModal = async (id: number, newname: string) => {
  data.value = await findQcReportByObjectId(id, QcTypeEnum.CHIP, 1);
  name.value = newname;
  open.value = true;
};

// 暴露外部接口
defineExpose({
  showModal,
});
</script>


<style lang="less" scoped>
.task-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 36px 56px;

  .li {
    display: flex;
    flex-direction: column;
    padding-bottom: 4px;
    border-bottom: 1px solid #e8e8e8;

    .title {
      font-weight: bold;
    }

    .standard {
      display: flex;
      gap: 8px;
      align-items: center;
      max-width: 264px;
      color: rgb(0 0 0 / 45%);
    }

    .timestamp {
      font-size: 12px;
      color: rgb(0 0 0 / 45%);
    }

    .status {
      color: red; /* 默认不合格 */
      &.text-success {
        color: green; /* 合格 */
      }

      &.text-danger {
        color: red; /* 不合格 */
      }

      &.text-warning {
        color: #FA9614; /* 预警 */
      }
    }

    .text-danger {
      color: red;
    }
  }
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

.time-box {
  display: flex;
  justify-content: space-between;
}

.status-box {
  position: relative;
  margin-bottom: 8px;

  & > .result {
    position: relative;
    width: 100%;
    padding-right: 60px;

    & > div {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  & > .status {
    position: absolute;
    top: 0;
    right: 0;
  }

  span {
    display: block;
    padding-left: 84px;
    font-weight: bold;
    color: #1890ff;
  }
}
</style>