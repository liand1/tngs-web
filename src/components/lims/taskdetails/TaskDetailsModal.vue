<template>
  <a-drawer
    v-model:open="open"
    :title="`${data.title}`"
    :confirm-loading="confirmLoading"
    :width="660"
    :footer="null"
    centered
  >
    <div class="task-details">
      <!-- 动态渲染 li -->
      <div v-for="(item, index) in objData.list" :key="index" class="li">
        <div class="title">{{ qcSettingsNameEnum[item.qcSettingsName] }}</div>

        <div class="status-box">
          <div class="result">
            <div>检出结果值：</div>
            <span>{{ item.checkValue == null || item.checkValue == undefined ? '-' : item.checkValue}}</span>
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
            <span style="color: rgb(0 0 0 / 45%)">判断标准值：
              <!-- {{ item.qcValue }}
              {{
                item.qcSettingsName === "out_sex" ||
                item.qcSettingsName === "raw_reads"
                  ? ""
                  : "%"
              }} -->
              {{  renderQcValue(item) }}
              </span>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>


<script setup lang="ts">
import { ref } from "vue";
import type { TaskDetailData } from "./model"; // 假设已将接口提取到公共类型文件
import { QcReportListResultVO } from "@/api/lims/qcreport/model";
import { QcStatusEnum } from "@/enums/customEnum";
import { useRender } from "@/components/Table";
const props = defineProps<{
  data: TaskDetailData;
}>();

const objData = ref<TaskDetailData>({
  title: "",
  list: [],
});

objData.value = props.data;

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

// 打开模态框方法
const showModal = (title: string, qcReportList: QcReportListResultVO) => {
  objData.value.title = title;
  objData.value.list = qcReportList;
  open.value = true;
};

const qcSettingsNameEnum = {
  raw_reads: "单个样本序列数",
  pollution: "防错标签正常率",
  map_rate: "比对率",
  adapter_rate: "接头序列占比",
  plasmid_tag_rate: "质粒(阳性)参考品物种检出率",
  clean_qthirty: "样本Q30占比",
  out_sex: "检出性别",
  water_pollution: "水控污染",
};

const renderQcValue = (item) => {
  let r = item.qcValue;
  let unit = '';
  if(item.qcSettingsName == 'pollution') {
    let qcValues = item.qcValue.split("-");
    if(qcValues.length == 2) {
      r = `${qcValues[0]}% - ${qcValues[1]}%`
    } else {
      r = `${qcValues[0]}%`
    }
  } else {
    if(item.qcSettingsName === "out_sex") {
      r = `（来源于样本）：${item.qcValue}`;
    }
    if(item.qcSettingsName === 'water_pollution') {
      r = '阴控靶标检出和样本80%一致视为污染';
    }
    unit = item.qcSettingsName === "out_sex" ||
      item.qcSettingsName === "raw_reads" || item.qcSettingsName === 'water_pollution'
      ? ""
      : "%"
  }
  
  return `${r}${unit}`
}

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
  margin: 0px 16px;

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
      max-width: 306px;
      color: rgb(0 0 0 / 85%);

      span {
        font-size: 13px;
      }
    }

    .timestamp {
      font-size: 13px;
      color: rgb(0 0 0 / 45%);
    }

    .status {
      &.text-success {
        color: #52C41A; /* 合格 */
      }

      &.text-danger {
        color: #FF4D4F; /* 不合格 */
      }

      &.text-warning {
        color: #FA9614; /* 预警 */
      }
    }

    .text-danger {
      color: #FF4D4F;
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
  margin-top: 8px;
  

  & > .result {
    position: relative;
    width: 100%;
    padding-right: 60px;
    font-size: 13px;

    & > div{
      position: absolute;
      top:0;
      left:0;
      
    }
  }

  & > .status {
    position: absolute;
    top: 0;
    right: 0;
  }

  span {
    display: block;
    padding-left:84px;
    font-weight: bold;
    color: #1890ff;
  }
}
</style>