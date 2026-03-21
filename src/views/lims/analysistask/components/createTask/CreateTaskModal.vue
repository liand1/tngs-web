<template>
  <a-modal v-model:open="open" title="创建分析任务" :confirm-loading="confirmLoading" :width="1300" @ok="handleOk"
    :showCancelBtn="true" okText="创建分析" @cancel="handleCancel" centered>
    <a-form ref="formRef" :model="formData" :rules="rules" class="form-layout">
      <!-- 任务名称 -->
      <a-form-item label="任务名称：" name="name">
        <a-input v-model:value="formData.name" placeholder="请输入任务名称" style="width: 100%" />
      </a-form-item>

      

      <!-- 样本数据 -->
      <a-form-item label="样本数据：" name="sampleIds" :rules="[{ required: true, message: '请选择样本数据' }]">
        <div style="display: flex; align-items: center">
          <a-button :icon="h(ZoomInOutlined)" @click="handleSelectSample" class="button-box">
            选择本系统样本
          </a-button>
          <a-button :icon="h(UploadOutlined)" class="button-box" style="margin-left: 10px"
            :disabled="missingSocData.length <= 0" @click="handleSelectFile">
            补充芯片数据文件
          </a-button>
        </div>
        <div class="selectfile">
          <a-spin :spinning="confirmLoading">
            <a-table :columns="columns" :data-source="data" bordered :scroll="{ y: 300 }" :min-height="300"
              :pagination="false">
              <template #socStatus="{ record }">
                <span :style="{
                  color:
                    !!record.socDataFileName &&
                      record.socDataFileName.trim().length > 0
                      ? '#52C41A'
                      : '#FF4D4F',
                }">{{
                    !!record.socDataFileName &&
                      record.socDataFileName.trim().length > 0
                      ? "匹配成功"
                      : "缺失"
                  }}</span>
              </template>
              <template #checkType="{ record }">
                <span>{{ AnalysisTaskTypeEnumMap[record.checkType] }}</span>
              </template>
              <template #checkReagent="{ record }">
                <span>{{ SampleCheckReagent[record.checkReagent] }}</span>
              </template>
              <template #action="{ record }">
                <DeleteOutlined style="color: #00000040" @click="handleDeleteFile(record.id)" />
              </template>
            </a-table>
          </a-spin>
        </div>
      </a-form-item>

      <!-- 任务类型 -->
      <a-form-item label="病原检测：" name="type">
        <a-tag color="red" v-for="(item, index) in checkTypeTags" :key="index"> {{ item.label }}({{ item.value }})</a-tag>
        <!-- 居中对齐 -->
      </a-form-item>

      <!-- 配置参数 -->
      <a-form-item label="配置参数：" class="takeparam">
        <a-row :gutter="24">
          <a-col :span="4">
            <div class="settingtitle">
              线程数
              <!-- <a-tooltip class="tp">
                <template #title>线程数介绍</template>
                <InfoCircleOutlined fill="rgb(0 0 0 / 45%)" />
              </a-tooltip> -->
            </div>
            <a-form-item name="threadCount" :rules="[{ required: true, message: '请输入线程数' }]">
              <a-input-number v-model:value="formData.threadCount" :min="1" :max="100" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <div class="settingtitle">
              任务数
              <!-- <a-tooltip class="tp">
                <template #title>任务数介绍</template>
                <InfoCircleOutlined fill="rgb(0 0 0 / 45%)" />
              </a-tooltip> -->
            </div>
            <a-form-item name="taskCount" :rules="[{ required: true, message: '请输入任务数' }]">
              <a-input-number v-model:value="formData.taskCount" :min="1" :max="100" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <div class="settingtitle">
              测序长度
              <!-- <a-tooltip class="tp">
                <template #title>测序长度介绍</template>
                <InfoCircleOutlined fill="rgb(0 0 0 / 45%)" />
              </a-tooltip> -->
            </div>
            <a-form-item name="seqLength" :rules="[{ required: true, message: '请输入测序长度' }]">
              <a-input-number disabled="true" v-model:value="formData.seqLength" :min="1" :max="1000"
                style="width: 100%" />
            </a-form-item>
          </a-col>
          <!-- <a-col :span="3">
            <div class="settingtitle">
              启用深度挖掘

            </div>
            <a-form-item name="excavateDeeply" :rules="[{ required: true, message: '请选择是否启用深度挖掘' }]">
              <a-select v-model:value="formData.excavateDeeply" style="width: 100%" :options="selectOptions">
              </a-select>
            </a-form-item>
          </a-col> -->
          <a-col :span="4">
            <div class="settingtitle">
              启用近缘区分
                <!-- <a-tooltip class="tp">
                  <template #title>启用深度挖掘介绍</template>
                  <InfoCircleOutlined fill="rgb(0 0 0 / 45%)" />
                </a-tooltip> -->
            </div>
            <a-form-item name="ckd" :rules="[{ required: true, message: '请选择是否启用近缘区分' }]">
              <a-select v-model:value="formData.ckd" style="width: 100%" :options="selectOptions">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <div class="settingtitle">
              启用株系校正
                <!-- <a-tooltip class="tp">
                  <template #title>启用深度挖掘介绍</template>
                  <InfoCircleOutlined fill="rgb(0 0 0 / 45%)" />
                </a-tooltip> -->
            </div>
            <a-form-item name="sc" :rules="[{ required: true, message: '请选择是否启用株系校正' }]">
              <a-select v-model:value="formData.sc" style="width: 100%" :options="selectOptions">
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="4">
            <a-button class="reset-btn" danger @click="resetDefaultSettings">
              恢复默认值
            </a-button>
          </a-col>
        </a-row>
      </a-form-item>


      <!-- <div style="position: absolute; bottom: 8px; left: 8px; margin: 0">
        <a-button danger @click="resetDefaultSettings"> 创建demo示例 </a-button>
      </div> -->
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, h, computed } from "vue";
import { message } from "ant-design-vue";
import {
  ZoomInOutlined,
  UploadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons-vue";
import { columns } from "./index.data";
import {
  CreateAnalysisTaskReqVO,
  RebuildAnalysisTaskReqVO,
} from "@/api/lims/analysistask/model";
import {
  AnalysisTaskTypeEnum,
  ExcavateDeeplyEnum,
  AnalysisTaskTypeEnumMap,
  ExcavateDeeplyEnumMap,
  SeqLengthEnum,
  RebuildObjectTypeEnum,
  UploadTypeEnum,
  SampleCheckReagent
} from "@/enums/customEnum";
import { SampleSocRespVO } from "@/api/lims/sample/model";
import {
  createAnalysisTask,
  rebuildAnalysisTask,
} from "@/api/lims/analysistask";
import type { FormInstance } from "ant-design-vue";
import { FileItem } from "@/views/filemanager/component/FileList/useFileList";
import { manualUploadSocFiles } from "@/api/lims/soc-data";
import { SocToCreateTaskModel } from "../../model";
import { useGo } from "@/hooks/web/usePage";

const data = ref<SampleSocRespVO[]>([]);

const formRef = ref<FormInstance>();
const selectOptions = ref<{ label: string; value: number }[]>([]);

const checkTypeTags = ref<{ label: string; value: number }[]>([]);

for (const key in ExcavateDeeplyEnumMap) {
  selectOptions.value.push({
    label: ExcavateDeeplyEnumMap[Number(key)],
    value: Number(key),
  });
}

const missingSocData = computed(() => {
  return data.value.filter(
    (item) => !item.socDataFileName || item.socDataFileName.trim().length === 0
  );
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
  type: [{ required: true, message: "任务类型不能为空", trigger: "change" }],
  sampleIds: [{ required: true, message: "请选择样本数据", trigger: "change" }],
  threadCount: [{ required: true, message: "请输入线程数", trigger: "change" }],
  taskCount: [{ required: true, message: "请输入任务数", trigger: "change" }],
  seqLength: [{ required: true, message: "请输入测序长度", trigger: "change" }],
  excavateDeeply: [
    { required: true, message: "请选择是否启用深度挖掘", trigger: "change" },
  ],
};

// 表单数据
const formData = reactive<CreateAnalysisTaskReqVO>({
  name: "",
  type: AnalysisTaskTypeEnum.ONE_STEP_TNGS_RESPIRATORY,
  threadCount: 8,
  taskCount: 8,
  seqLength: SeqLengthEnum.DEFAULT,
  excavateDeeply: ExcavateDeeplyEnum.NO,
  ckd: ExcavateDeeplyEnum.YES,
  sc: ExcavateDeeplyEnum.YES,
  sampleIds: [],
  socId: undefined,
  sampleData: [],
});

// 恢复默认设置
const resetDefaultSettings = () => {
  formData.threadCount = 8;
  formData.taskCount = 8;
  formData.seqLength = SeqLengthEnum.DEFAULT;
  formData.excavateDeeply = ExcavateDeeplyEnum.NO;
  formData.ckd = ExcavateDeeplyEnum.YES;
  formData.sc = ExcavateDeeplyEnum.YES;
};

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

const go = useGo();

// 打开模态框方法
const showModal = async (socToCreateTaskObj: SocToCreateTaskModel) => {
  open.value = true;
  // debugger;
  if (!socToCreateTaskObj) {
    // 清空数据
    formData.name = "";
    formData.type = AnalysisTaskTypeEnum.ONE_STEP_TNGS_RESPIRATORY;
    formData.threadCount = 8;
    formData.taskCount = 8;
    formData.seqLength = SeqLengthEnum.DEFAULT;
    formData.excavateDeeply = ExcavateDeeplyEnum.NO;
    formData.sampleIds = [];
    data.value = [];

    checkTypeTags.value = [];
    // 通知SelectSampleModal清空数据
    emit("update-sample-data", {
      sampleData: [],
    });
    emit("update-sample-selection", -1); // 使用-1表示清空所有选中状态
    
    return;
  }

  const rebuildAnalysisTaskReqVO: RebuildAnalysisTaskReqVO = {
    objectId: undefined,
    objectType: undefined,
  };

  if (socToCreateTaskObj.taskId && socToCreateTaskObj.taskId > 0) {
    rebuildAnalysisTaskReqVO.objectId = socToCreateTaskObj.taskId;
    rebuildAnalysisTaskReqVO.objectType = RebuildObjectTypeEnum.ANALYSIS_TASK;
  } else if (socToCreateTaskObj.socId && socToCreateTaskObj.socId > 0) {
    rebuildAnalysisTaskReqVO.objectId = socToCreateTaskObj.socId;
    rebuildAnalysisTaskReqVO.objectType = RebuildObjectTypeEnum.SOC;
  } else if (socToCreateTaskObj.sampleId && socToCreateTaskObj.sampleId > 0) {
    rebuildAnalysisTaskReqVO.objectId = socToCreateTaskObj.sampleId;
    rebuildAnalysisTaskReqVO.objectType = RebuildObjectTypeEnum.SAMPLE;
  }

  if (
    rebuildAnalysisTaskReqVO.objectId &&
    rebuildAnalysisTaskReqVO.objectType
  ) {
    const res = await rebuildAnalysisTask(rebuildAnalysisTaskReqVO);
    // debugger;
    console.log(res);
    if (res.taskInfo) {
      formData.name = res.taskInfo.name;
      formData.type = res.taskInfo.type;
      formData.threadCount = res.taskInfo.threadCount;
      formData.taskCount = res.taskInfo.taskCount;
      formData.seqLength = res.taskInfo.seqLength;
      formData.excavateDeeply = res.taskInfo.excavateDeeply;
    }

    formData.sampleIds = res.sampleSocs.map((item) => item.id);
    data.value = res.sampleSocs;

    const grouped = data.value.reduce((acc, item) => {
      // 如果当前键（category）不存在，则初始化一个空数组
      if (!acc[item.checkType]) {
        acc[item.checkType] = [];
      }
      // 将当前项推入对应的数组中
      acc[item.checkType].push(item);
      return acc;
    }, {});

    // 计算每个组的数量
    let counts = <any>[];
    Object.keys(grouped).forEach(key => {
      let item = {"label": AnalysisTaskTypeEnumMap[key], "value": grouped[key].length};
      counts.push(item);
    });
    checkTypeTags.value = counts;

    emit("update-sample-data", {
      sampleData: res.sampleSocs,
    });
  }


  // formData.sampleId = socToCreateTaskObj.sampleId;
  // formData.socId = socToCreateTaskObj.socId;
  // formData.taskId = socToCreateTaskObj.taskId;
};

// 确定按钮逻辑
const handleOk = async () => {

  try {
    // 表单验证
    await formRef.value?.validate();

    // 检查样本数据
    if (!formData.sampleIds || formData.sampleIds.length === 0) {
      message.error("请选择样本数据");
      return;
    }

    //判断是否有缺失芯片数据文件的样本
    if (missingSocData.value.length > 0) {
      message.error("选择的样本中，存在缺失芯片数据文件的样本！");
      return;
    }
    confirmLoading.value = true;

    // 调用服务端接口
    await createAnalysisTask(formData);
    message.success("分析任务创建成功");

    go("/lims/analysis-task");

    emit("success");
    open.value = false;
  } catch (error: any) {
    if (error?.errorFields) {
      message.error(error.errorFields[0].errors[0]);
    } else {
      message.error("创建失败，请重试");
      console.error(error);
    }
  } finally {
    confirmLoading.value = false;
  }
};

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
};

// 文件选择和上传逻辑
const handleSelectSample = () => {
  // 触发父组件的自定义事件
  emit("open-sample-modal");
  // message.info("选择样本功能待实现");
};

// 打开文件选择器
const handleSelectFile = () => {
  emit("open-file-manager");
};

// 设置选中的文件
const setSelectedFiles = async (files: FileItem[]) => {
  try {
    if (!files || files.length === 0) {
      message.warning("未选择任何文件或样本数据缺失");
      return;
    }
    confirmLoading.value = true;

    //  获取一个socId不为
    // 空的样本
    const sample = data.value.find((item) => item.socId);

    const res = await manualUploadSocFiles({
      socId: sample ? sample.socId : 0,
      sourcePath: files[0].path,
      operateType: UploadTypeEnum.MANUAL_UPLOAD_COMPLETE_SOC,
    });
    let isMatch = false;
    // 给data 没有socDataFileName的样本赋值
    data.value.forEach((item) => {
      if (!item.socDataFileName || item.socDataFileName.trim().length === 0) {
        const socDataFileName = res.matchingSamples[item.sampleCode];
        if (socDataFileName) {
          item.socDataFileName = socDataFileName;
          isMatch = true;
        }
      }
    });
    //有更新则通知更新，通知父组件更新SelectSampleModal中的数据
    if (isMatch) {
      emit("update-sample-data", {
        sampleData: data.value,
      });
    }
  } catch (error: any) {
    message.error("获取芯片数据失败，请重试");
    console.error(error);
  } finally {
    confirmLoading.value = false;
  }
};

//样本赋值
const setSelectSample = (sampleData: SampleSocRespVO[], appendFlag: boolean) => {
  if (!sampleData || sampleData.length === 0) {
    message.warning("未选择任何样本");
    return;
  }
  if(appendFlag) {
    let sampleIds = sampleData.map((item) => item.id);
    formData.sampleIds = formData.sampleIds?.concat(sampleIds);
  } else {
    formData.sampleIds = sampleData.map((item) => item.id);
  }

  // 如果有样本，则设置芯片ID和名称（假设所有样本使用同一个芯片）
  if (sampleData.length > 0 && sampleData[0].socId) {
    formData.socId = sampleData[0].socId;
    // 芯片名称可能需要从其他地方获取
    formData.socName = `芯片${sampleData[0].socId}`;
  }
  if(appendFlag) {
    data.value = [...data.value, ...sampleData];
  } else {
    data.value = sampleData;
  }
  // formData.sampleData = sampleData;

  const grouped = data.value.reduce((acc, item) => {
    // 如果当前键（category）不存在，则初始化一个空数组
    if (!acc[item.checkType]) {
      acc[item.checkType] = [];
    }
    // 将当前项推入对应的数组中
    acc[item.checkType].push(item);
    return acc;
  }, {});

  // 计算每个组的数量
  let counts = <any>[];
  Object.keys(grouped).forEach(key => {
    let item = {"label": AnalysisTaskTypeEnumMap[key], "value": grouped[key].length};
    counts.push(item);
  });
  checkTypeTags.value = counts;

  emit("update-sample-data", {
    sampleData: sampleData,
  });
};

const handleDeleteFile = (id: number) => {
  formData.sampleIds = formData.sampleIds?.filter((item) => item !== id);
  data.value = data.value?.filter((item) => item.id !== id);

  // 通知父组件更新SelectSampleModal中的选中状态
  emit("update-sample-selection", id);
};

// 暴露外部接口
defineExpose({
  showModal,
  setSelectSample,
  setSelectedFiles,
});

// 定义自定义事件
const emit = defineEmits([
  "open-sample-modal",
  "open-soc-modal",
  "open-file-manager",
  "update-sample-selection",
  "update-sample-data",
  "success",
]);

//setSelectSoc
</script>

<style lang="less" scoped>
.create-box {
  padding: 20px;
}

.form-layout {
  margin: 24px 120px;

  &>* {
    margin-bottom: 24px;
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
