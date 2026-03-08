<!-- WAITING = 0, // 待审核
CHECKING = 1, // 审核中
PASSED = 2, // 已通过
REJECTED = 3, // 未通过 -->
<template>
  <div>
    <div class="components-page-header-demo-responsive">
      <a-page-header>
        <template #extra>
          <a-button v-auth="['lims:sample:create']" @click="handleCreate(taskDetail.batchCode)">
            为当前批次添加样本
          </a-button>
          <a-button key="4" type="primary" @click="createTaskModalNoData(taskDetail.batchCode)">
            为当前批次创建分析
          </a-button>
        </template>
        <template #title>
          <div><ArrowLeftOutlined @click="back()"/><span>样本批次编号:{{ taskDetail.batchCode }}</span></div>
        </template>
        <div class="content">
          <div class="main">
            <a-descriptions
              size="default"
              :column="4"
              class="descriptions_content"
            >
              <!-- 替换为动态渲染 -->
              <a-descriptions-item label="批次编号">{{
                taskDetail.batchCode
              }}</a-descriptions-item>
              <a-descriptions-item label="任务创建人员">{{
                taskDetail.creatorName
              }}</a-descriptions-item>
              <a-descriptions-item label="创建时间">
                {{
                  taskDetail.createTime
                    ? useRender.renderDate(taskDetail.createTime)
                    : "-"
                }}</a-descriptions-item
              >
              <a-descriptions-item label="创建来源">
                {{ CreateTypeEnumMap[taskDetail.createType] }}
              </a-descriptions-item>
              <!-- <a-descriptions-item label="检测项目">{{
                taskDetail.testProject
              }}</a-descriptions-item> -->

              <a-descriptions-item label="分析状态">
                <span v-if="taskDetail.analysisStatus == 1">{{ SampleAnalysisStatus[taskDetail.analysisStatus] }}</span>
                <span style="color: #FA9614;" v-if="taskDetail.analysisStatus == 2">{{ SampleAnalysisStatus[taskDetail.analysisStatus] }}</span>
                <span style="color: #52C41A;" v-if="taskDetail.analysisStatus == 3">{{ SampleAnalysisStatus[taskDetail.analysisStatus] }}</span>
              </a-descriptions-item>
              <a-descriptions-item label="对应分析任务名称" class="analysis-progress">
                {{
                  taskDetail.taskName
                }}
              </a-descriptions-item>
              <a-descriptions-item label="患者样本数">
                {{ taskDetail.patientSampleCount }}
              </a-descriptions-item>
              <a-descriptions-item label="水控样本数">{{
                taskDetail.waterSampleCount
              }}</a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </a-page-header>
    </div>


    <!-- 创建分析任务 -->
    <CreateTaskModal
      ref="crRef"
      @open-sample-modal="selectSampleModal"
      @open-soc-modal="selectSocModal"
      @open-file-manager="openFileManager"
      @update-sample-selection="updateSampleSelection"
      @update-sample-data="updateSampleData"
      @success="createSuccess()"
    />

    <!-- 选择样本 -->
    <SelectSampleModal
      ref="ssRef"
      @setSelectSample="setSelectSample"
      @update-selection="updateSampleSelection"
      :sampleId="Number(0)"
      :socId="Number(0)"
      :taskId="Number(0)"
    />

    <!-- 选择芯片 -->
    <SelectSocModal ref="scRef" @setSelectSoc="setSelectSoc" :socId="0" />

    <!-- 文件管理器 -->
    <FileManagerModal ref="fmRef" @select-folder="handleSelectFolder" />


    <SampleModal @register="registerModal" @success="createSuccess()" :type="1"/>
  </div>
</template>


<script setup lang="ts">
import {
  CreateTypeEnumMap,
  SampleAnalysisStatus,
  CheckStatusEnum,
  AuditGetTypeEnum,
  TaskStatusEnum,
} from "@/enums/customEnum";
import { customTaskDetail, timelineData } from "./index";
import { useRender } from "@/components/Table";
import { computed, ref, watch } from "vue";
import { useModal } from "@/components/Modal";
import { DownloadOutlined, ArrowLeftOutlined } from "@ant-design/icons-vue";
import CreateTaskModal from "@/views/lims/analysistask/components/createTask/CreateTaskModal.vue";
import SelectSampleModal from "@/views/lims/analysistask/components/selectsample/SelectSampleModal.vue";
import SelectSocModal from "@/views/lims/analysistask/components/selectsoc/SelectSocModal.vue";
import FileManagerModal from "@/views/filemanager/filemanagermdal.vue";
import SampleModal from "@/views/lims/sample/SampleModal.vue";
import { findMatchingSampleList } from "@/api/lims/sample";
import { SampleSocRespVO } from "@/api/lims/sample/model";
import { FileItem } from "@/views/filemanager/component/FileList/useFileList";

// const filteredReports = ref<any>([]);

// const router = useRouter();
const pop = defineProps<{
  taskDetail: any;
}>();

import { useUserStore } from "@/store/modules/user";
import message from "@/components/FormDesign/src/utils/message";
import { downLoadUrl } from "@/utils/custom";
import { useGo, useBack } from '@/hooks/web/usePage'

const [registerModal, { openModal }] = useModal();
const crRef = ref<typeof CreateTaskModal>();

const ssRef = ref<typeof SelectSampleModal>();

const scRef = ref<typeof SelectSocModal>();

const fmRef = ref<typeof FileManagerModal>();
const userStore = useUserStore();

const userId = computed(() => userStore.getUserInfo.user.id);

// console.log(pop.taskDetail);

const go = useGo()
const back = useBack();

const uploadAnalysisResultTable = async () => {
  // try {
  //   downloadAnalysisTaskExcel(props.taskDetail.id);

  // }
  try {
    await downLoadUrl(pop.taskDetail.resultFileUrl, pop.taskDetail.name + "分析结果表.xlsx");
    message.success("下载分析结果表成功");
  } catch (e) {
    message.error("下载分析结果表失败");
  }
};

// const showDrawer = () => {
//   apdRef?.value?.showDrawer();
// };

const setTaskName = (name: string) => {
  pop.taskDetail.name = name;
};
// 定义emit事件类型
const emit = defineEmits<{
  (event: "refreshTaskDetail"): void;
}>();

const createTaskModalNoData = async (batchCode: string) => {
  crRef?.value?.showModal();
  try {
    const res = await findMatchingSampleList(batchCode);
    setSelectSample(res);
  } catch (error) {

  }
}

const setSelectSample = (data: any) => {
  crRef?.value?.setSelectSample(data);
}

function handleCreate(batchCode: string) {
  openModal(true, { isUpdate: false, batchCode });
}

const createSuccess = () => {
  emit("refreshTaskDetail");
}

function selectSampleModal() {
  ssRef?.value?.showModal();
}

function selectSocModal() {
  scRef?.value?.showModal();
}

// 打开文件管理器
function openFileManager() {
  fmRef?.value?.showModal();
}

// 更新样本选择状态
function updateSampleSelection(id: number) {
  // 更新SelectSampleModal中的选中状态
  ssRef?.value?.updateSelection(id);
}

// 更新样本文件数据
function updateSampleData(data: { sampleData: SampleSocRespVO[] }) {
  // 更新SelectSampleModal中的样本数据
  ssRef?.value?.updateSampleData(data);
}

function setSelectSoc(data: any) {
  crRef?.value?.setSelectSoc(data);
}

// 处理文件选择
function handleSelectFolder(files: FileItem[]) {
  crRef?.value?.setSelectedFiles(files);
}

watch(pop.taskDetail, (newValue) => {
  console.log(newValue);
});

defineExpose({
  setTaskName,
  // setTaskDetil,
});
</script>

<style lang="less" scoped>
.components-page-header-demo-responsive {
  @green: #52c41a;
  @red: #ff4d4f;

  .extra {
    padding: 24px 0 0;
    text-align: right;

    .taskStatusSpan {
      display: block;
      font-size: 20px;
      font-weight: bold;
    }
  }

  tr:last-child td {
    padding-bottom: 0;
  }

  .content {
    display: flex;
  }

  .ant-statistic-content {
    font-size: 20px;
    line-height: 28px;
  }

  .descriptions_content {
    padding: 24px;
  }

  :deep(.analysis-progress) {
    .ant-progress-line {
      position: relative;
      top: 4px;
      width: auto;
    }
  }

  .analysisProgress {
    font-weight: normal;
    color: #1890ff;
    cursor: pointer;
  }
}

.under {
  cursor: auto;
  background-color: rgb(255 220 220 / 100%) !important;
}

.analysisreport-green {
  color: #52c41a;
}

.analysisreport-red {
  color: #FF4D4F;
}
</style>