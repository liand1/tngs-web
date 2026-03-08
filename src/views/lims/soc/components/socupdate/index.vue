<template>
  <div>
    <a-modal
      v-model:open="open"
      :confirm-loading="confirmLoading"
      :width="1000"
      @ok="handleOk"
      title="上传芯片数据"
      :showCancelBtn="true"
      okText="确定上传"
      @cancel="handleCancel"
      centered
    >
      <!-- <ImpExcel @success="handleSampleImport">
          <a-button danger v-auth="['lims:sample:export']"
            >批量导入样本</a-button
          >
        </ImpExcel> -->
      <a-form
        ref="formRef"
        :model="formData"
        :label-col="labelCol"
        class="form-layout"
      >
        <!-- 芯片编号 -->
        <a-form-item label="芯片名称：" name="socCode">
          <a-input
            v-model:value="formData.socCode"
            placeholder="请输入芯片名称"
            style="width: 100%"
            disabled
          />
          <p class="tip">芯片名称由系统生成</p>
        </a-form-item>

        <!-- 芯片数据 -->
        <a-form-item label="上传芯片数据：" name="chipData">
          <div style="display: flex; align-items: center">
            <a-button
              :icon="h(UploadOutlined)"
              class="button-box"
              @click="handleSelectFile"
            >
              选择文件夹
            </a-button>
          </div>
          <div class="selectfile-box">
            <div
              class="selectfile"
              v-for="item in formData.folders"
              :key="item.id"
            >
              <a-tooltip placement="topLeft">
                <template #title>
                  <span>{{ item.path }}</span>
                </template>
                <span class="selectfileleft">
                  <b
                    :style="{
                      color: item.isDirectory ? '#1890ff' : 'red',
                    }"
                    >{{ item.path }}</b
                  >
                </span>
              </a-tooltip>

              <DeleteOutlined class="outicons" @click="handleDelete(item.id)" />
            </div>
          </div>
          <p class="tip">请选择包含芯片数据的文件夹</p>
        </a-form-item>

        <!-- <div style="position: absolute; bottom: 8px; left: 8px; margin: 0">
          <a-button danger> 下载芯片数据模板 </a-button>
        </div> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from "vue";
import { message } from "ant-design-vue";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { FileItem } from "@/views/filemanager/component/FileList/useFileList";
import { manualUploadSocFiles } from "@/api/lims/soc-data";
import { findNewestSocCode } from "@/api/lims/soc";
import { UploadTypeEnum } from "@/enums/customEnum";

interface FormData {
  socCode: string;
  folders: FileItem[];
}

// 表单数据
const formData = reactive<FormData>({
  socCode: "",
  folders: [],
});

const labelCol = {
  style: { width: "180px" },
};

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

// 触发父组件的文件选择器
const emits = defineEmits([
  "open-file-manager",
  "add-folder",
  "update:folders",
  "success",
]);

const handleSelectFile = () => {
  emits("open-file-manager");
};

// 打开模态框方法
const showModal = async () => {
  open.value = true;
  try {
    // 获取批次号等初始化数据
    const batchCode = await findNewestSocCode();
    formData.socCode = batchCode;
  } catch (error) {
    console.error("获取初始数据失败", error);
  }
};

// 确定按钮逻辑
const handleOk = async () => {
  confirmLoading.value = true;

  try {
    // 表单验证
    if (!formData.socCode) {
      message.error("请输入芯片编号");
      confirmLoading.value = false;
      return;
    }

    if (formData.folders.length === 0) {
      message.error("请选择芯片数据文件夹");
      confirmLoading.value = false;
      return;
    }

    if (!formData.folders[0].isDirectory) {
      message.error("请选择包含芯片数据的文件夹");
      confirmLoading.value = false;
      return;
    }

    // TODO: 调用接口上传数据
    console.log("提交数据", formData);
    await manualUploadSocFiles({
      sourcePath: formData.folders[0].path,
      socName: formData.socCode,
      operateType: UploadTypeEnum.ADD_SOC,
    });

    emits("success");
    message.success("芯片数据上传成功");
    open.value = false;
    // 重置表单
    formData.socCode = "";
    formData.folders = [];
  } catch (error) {
    message.error("上传失败，请重试");
  } finally {
    confirmLoading.value = false;
  }
};

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
  // 重置表单
  formData.socCode = "";
  formData.folders = [];
};

// 删除已选择的文件夹
const handleDelete = (id: string) => {
  formData.folders = formData.folders.filter((item) => item.id !== id);
};

// 添加文件夹
const addFolder = (file: FileItem[]) => {
  if (file.length > 0) {
    formData.folders = file;
  }
};

// 暴露外部接口
defineExpose({
  showModal,
  addFolder,
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
        inset: 0 60px 0 3px;
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
