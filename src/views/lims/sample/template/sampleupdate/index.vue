
<template>
  <a-modal
    v-model:open="open"
    :confirm-loading="confirmLoading"
    :width="800"
    @ok="handleOk"
    title="批量导入样本"
    :showCancelBtn="true"
    okText="确定导入"
    @cancel="handleCancel"
    centered
  >
    <!-- <ImpExcel @success="handleSampleImport">
          <a-button danger v-auth="['lims:sample:export']"
            >批量导入样本</a-button
          >
        </ImpExcel> -->
    <a-form ref="formRef" :model="formData" class="form-layout">
      <!-- 任务名称 -->
      <a-form-item label="批次编号：" name="taskName">
        <a-input
          v-model:value="formData.batchCode"
          placeholder="请输入任务名称"
          style="width: 100%"
          disabled
        />
        <p class="tip">样本[批次编号]由系统生成</p>
      </a-form-item>

      <!-- 芯片数据 -->
      <a-form-item label="上传样本：" name="chipData">
        <template v-if="formData.fileList && formData.fileList.length > 0">
          <div style="display: flex; align-items: center">
            <ImpExcel @success="updateExec">
              <a-button
                :icon="h(UploadOutlined)"
                class="button-box"
                style="margin-left: 10px"
                >上传文件</a-button
              >
            </ImpExcel>
          </div>
          <div class="selectfile-box">
            <div
              class="selectfile"
              v-for="item in formData.fileList"
              :key="item.name"
            >
              <span class="selectfileleft">
                <PaperClipOutlined />
                <b>{{ item.name }}</b>
              </span>
              <DeleteOutlined class="outicons" @click="handleDelete(item.id)" />
            </div>
          </div>
          <p class="tip">上传格式仅支持.xlsx,.xls格式的Excel文件</p>
        </template>
        <UploadDragger ref="dragerUploadRef" v-else @success="updateExec"></UploadDragger>
        
      </a-form-item>

      <div style="position: absolute; bottom: 8px; left: 8px; margin: 0">
        <a-button danger @click="handleDownloadTemplate">
          下载样本模板
        </a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import { message } from "ant-design-vue";
import {
  UploadOutlined,
  DeleteOutlined,
  PaperClipOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
import { ImpExcel, ImportExcelResult } from "@/components/Excel";
import { createBatch, findNewestBatchCode } from "@/api/lims/sample";
import { handleSampleImport } from "./index";
import { SampleDataModel } from "../../model";
import UploadDragger from "./uploadDragger.vue";
import { downloadReport, downLoadUrl } from "@/utils/custom";
// 表单数据
const formData = reactive<{
  batchCode: string;
  fileList: {
    id: number;
    name: string;
    files: SampleDataModel[];
  }[];
}>({
  batchCode: "",
  fileList: [],
});

const dragerUploadRef = ref<typeof UploadDragger>();
// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);
// const handleChange = (info: UploadChangeParam) => {
//   if (info.file.status !== "uploading") {
//     console.log(info.file, info.fileList);
//   }
//   if (info.file.status === "done") {
//     message.success(`${info.file.name} file uploaded successfully`);
//   } else if (info.file.status === "error") {
//     message.error(`${info.file.name} file upload failed.`);
//   }
// };
const emit = defineEmits(["success", "register"]);

// const fileList = ref([]);
// const headers = {
//   authorization: "authorization-text",
// };

// 打开模态框方法
const showModal = async () => {
  open.value = true;
  formData.batchCode = await findNewestBatchCode();
};

// 确定按钮逻辑
const handleOk = async () => {
  if(formData.fileList.length == 0) {
    message.error("请选择上传样本文件");
    return;
  }
  confirmLoading.value = true;

  try {
    // console.log("formData", formData);
    const submitData = formData.fileList.map((item) => item.files).flat();
    const sampleBatchDO = await createBatch({
      batchCode: formData.batchCode,
      list: submitData,
    });
    //清空formData
    formData.fileList = [];
    formData.batchCode = "";

    message.success("样本导入成功");

    open.value = false;
    emit("success", sampleBatchDO);
  } catch (error) {
    console.log(error);
    message.error("样本导入失败");
  } finally {
    confirmLoading.value = false;
  }
};

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
};

let fileListId = 0;
const updateExec = async (importData: ImportExcelResult) => {
  const submitData = await handleSampleImport(importData.excelData);
  if (submitData.length > 0) {
    formData.fileList = [
      {
        name: importData.fileName,
        files: submitData,
        id: fileListId++,
      },
    ];
  } else {
    dragerUploadRef.value?.clearFileList();
  }
};

const handleDelete = (id: number) => {
  formData.fileList = formData.fileList.filter((item) => item.id !== id);
};

const handleDownloadTemplate = () => {
  // const url = `${
  //   import.meta.env.VITE_GLOB_BASE_URL
  // }/admin-api/infra/file/29/get/dc5caf60cbb07d7538dc0ec4de495aa0344f6193c25464d67faf98bcef97abff.xlsx`;
  const url = '/public/resource/xlsx/sampleTemplate.xlsx'
  // downloadReport(url, "样本模板");
  downLoadUrl(url, "样本模板");
};

// 暴露外部接口
defineExpose({
  showModal,
});

//setSelectSoc
</script>

<style lang="less" scoped>
.create-box {
  padding: 20px;
}

.form-layout {
  margin: 40px 120px;

  .tip {
    margin-top: 5px;
    line-height: 22px;
    color: rgb(0 0 0 / 45%);
  }

  .selectfile-box {
    margin: 10px 0 0 10px;
  }

  .selectfile {
    @height: 20px;

    position: relative;
    width: 400px;
    height: @height;
    padding: 0 10px 0 5px;
    margin-top: 8px;
    line-height: @height;
    border-radius: 4px;

    &:hover {
      background-color: rgb(250 250 250 / 100%);
    }

    b {
      font-weight: normal;
      color: #1890ff;
    }

    .selectfileleft {
      b {
        position: absolute;
        inset: 0 60px 0 25px;
        display: block;
        overflow: hidden; /* 隐藏超出的内容 */
        text-overflow: ellipsis; /* 用省略号表示被隐藏的部分 */
        white-space: nowrap; /* 不换行 */
      }
    }

    .outicons {
      display: block;
      float: right;
      margin-left: 20px;
      line-height: @height;
      color: #888;
      cursor: pointer;

      &:hover {
        color: #f24660;
      }
    }
  }

  .takeparam {
    align-items: flex-end;

    :deep(.ant-row) {
      align-items: flex-end;
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
}

.download-btn {
  color: #1890ff;

  :deep(span) {
    text-decoration: underline;
  }
}
</style>
