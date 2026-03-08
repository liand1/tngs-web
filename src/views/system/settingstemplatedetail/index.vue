<template>
  <div>
    <a-spin :spinning="loading">
      <div class="title">
        <div class="title-left">
          <h2>{{ templateModel.name }}配置</h2>
          <h3>{{ templateModel.remark }}</h3>
        </div>
        <div class="title-right">
          <a-space>
            <span class="status-text">状态：</span>
            <a-switch
              style="width: 70px"
              v-model:checked="currentStatus"
              checked-children="已启用"
              un-checked-children="未启用"
              :disabled="templateModel.type == 1 || templateModel.type == 2"
              @change="handleTemplateStatus"
            />
            <!-- <a-button
              type="primary"
              :disabled="!currentStatus"
              @click="handleSetDefault"
            >
              设为默认模板
            </a-button> -->
            <a-popconfirm v-if="templateModel.type == 3" ok-text="确定"
                    cancel-text="取消"
                    placement="bottomRight"
                    @confirm="confirmEdit(templateModel)">
                    <template #title>
                    <div>您确定修改报告模板吗?</div>
                    <div>修改后将按照修改的内容关联样本</div>
                  </template>
            <a-button>
            <template #icon><EditOutlined /></template>
              编辑模板基础信息
            </a-button>
            </a-popconfirm>
          </a-space>
        </div>
      </div>
      <a-card title="配置内容" class="content-card">
        <div class="template-container">
          <a-form
            :model="formData"
            name="templateForm"
            layout="horizontal"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
            @finish="handleSubmit"
            class="centered-form"
            :rules="formRules"
            ref="formRef"
          >
            <template v-for="(formItem, key) in itemsData" :key="key">
              <a-form-item
                :label="`${formItem.label}:`"
                :name="`a${key}`"
                :class="
                  formItem.type === 'uploadImg' ? 'form-item-with-upload' : ''
                "
                :help="formItem.type === 'uploadImg' ? `` : `${formItem.desc}`"
              >
                <!-- 输入控件 -->
                <a-input
                  v-if="formItem.type === 'input'"
                  v-model:value="formData[`a${key}`]"
                  placeholder="请输入"
                  @input="handleInputChange($event, key, `a${key}`)"
                />

                <!-- 下来框select -->
                <a-select v-if="formItem.type === 'select'"
                v-model:value="formData[`a${key}`]"
                placeholder="请选择"
                @change="handleSelectChange($event, key, formItem.fields)"
                >
                  <template v-if="formItem.fields == 'sign'">
                    <a-select-option v-for="item in signData" :key="item.id" :value="item.id">{{ item.signName }}</a-select-option>
                  </template>
                  <template v-else-if="formItem.fields == 'firstSign'">
                    <a-select-option v-for="item in firstSignData" :key="item.id" :value="item.id">{{ item.signName }}</a-select-option>
                  </template>
                  <template v-else-if="formItem.fields == 'secondSign'">
                    <a-select-option v-for="item in secondSignData" :key="item.id" :value="item.id">{{ item.signName }}</a-select-option>
                  </template>
                </a-select>

                <!-- 上传控件 -->
                <div
                  v-else-if="formItem.type === 'uploadImg'"
                  class="upload-wrapper"
                >
                  <div class="upload-box">
                    <FileUpload
                      v-model:value="formData[`a${key}`]"
                      file-type="image"
                      :maxCount="1"
                      @change="handleChange($event, key, `a${key}`)"
                      :beforeUpload="
                        (file) =>
                          beforeUpload(file, key, `a${key}`, formItem.fields)
                      "
                    />
                  </div>
                  <div class="upload-desc">
                    {{ formItem.desc ?? "" }}
                  </div>
                </div>
              </a-form-item>
            </template>

            <a-form-item :wrapper-col="{ span: 24 }">
              <div class="form-actions">
                <a-button @click="handleCancel">退出编辑</a-button>
                <a-button
                  type="primary"
                  html-type="submit"
                  :loading="submitting"
                  >保存配置</a-button
                >
              </div>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
    </a-spin>

    <!-- 创建模板 -->
    <CreateTemplateModal
      ref="crRef"
      @success="updateTemplateSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";

import { inputDomeModel } from "./index.data";
import { useGo } from "@/hooks/web/usePage";
import { EditOutlined } from '@ant-design/icons-vue'
import {
  getReportTemplate,
  updateReportTemplate,
  setDefaultTemplate,
} from "@/api/lims/report-template";
import {
  listAllSign
} from '@/api/lims/report-sign';
import { ReportTemplateBaseVO } from "@/api/lims/report-template/model";

import FileUpload from "@/components/Form/src/components/FileUpload.vue";
import CreateTemplateModal from "../settingstemplate/template/create/CreateTemplateModal.vue";

const go = useGo();

// 加载状态
const loading = ref(false);
// 提交状态
const submitting = ref(false);

const route = useRoute();

const templateId = route.params.id as string;

const formRef = ref();

const formData = ref<any>({});

const itemsData = ref<inputDomeModel[]>([]);

const formRules = ref<Record<string, any>>({});

const templateModel = ref<ReportTemplateBaseVO>({});

const currentStatus = ref(false);

const signData = ref<any>([]);

const firstSignData = ref<any>([]);

const secondSignData = ref<any>([]);

const crRef = ref<typeof CreateTemplateModal>();
// 更改当前模版状态
const handleTemplateStatus = async (checked: boolean) => {
  try {
    const statusText = checked ? "已启用" : "未启用";
    templateModel.value.status = checked ? 1 : 0;
    await setDefaultTemplate(Number(templateId));
    // await updateReportTemplate(templateModel.value);

    // currentStatus.value = !checked;

    message.success(`成功${statusText}当前模板`);
  } catch (e) {
    currentStatus.value = !checked;
    templateModel.value.status = checked ? 0 : 1;
    message.error("更新失败");
  }

  // // 模拟API请求
  // setTimeout(() => {
  //   message.success(`成功${statusText}当前模板`);
  // }, 300);
};

const listAllSignLast = async () => {
  let data = await listAllSign();
  signData.value = data.filter(item => item.signType == 1);
  firstSignData.value = data.filter(item => item.signType == 2);
  secondSignData.value = data.filter(item => item.signType == 3);
}

onMounted(() => {
  fetchData();
  listAllSignLast();
});

//初始化数据
const fetchData = async () => {
  loading.value = true;

  const res = await getReportTemplate(Number(templateId));

  templateModel.value = res;

  itemsData.value = JSON.parse(res.content!);

  currentStatus.value = templateModel.value.status === 1;

  if (!itemsData.value) {
    itemsData.value = [];
  }

  formData.value = itemsData.value.reduce((acc, item, currentIndex) => {
    acc[`a${currentIndex}`] =
      item.type === "uploadImg" ? item.fileList : item.value;

    return acc;
  }, {});

  // 生成表单验证规则
  formRules.value = Object.entries(itemsData.value).reduce(
    (rules, [key, item]) => {
      rules[`a${key}`] = [
        {
          required: item.required,
          message:
            item.type === "input" || item.type === "select"
              ? `请填写${item.label}`
              : `请上传${item.label}`,
        },
      ];
      return rules;
    },
    {} as Record<string, any>
  );

  loading.value = false;
}

// 处理输入框变更
const handleInputChange = (event: InputEvent, key: number, _: string) => {
  itemsData.value[key].value = (event.target as HTMLInputElement).value;
};

//处理select变更
const handleSelectChange = (value: string, key: number, fields: string,  ) => {
  itemsData.value[key].value = value;
  let item = [];
  if(fields == 'sign') {
    item = signData.value.filter(o => o.id == value);
  } else if(fields == 'firstSign') {
    item = firstSignData.value.filter(o => o.id == value);
  } else if(fields == 'secondSign') {
    item = secondSignData.value.filter(o => o.id == value);
  }
  itemsData.value[key].fileList = item && item.length > 0 ? [item[0]?.imageUrl] : [];
}

// 处理图片变更
const handleChange = async (url: string, key: number, name: string) => {
  itemsData.value[key].fileList = [url];
  await nextTick();
  if (key !== -1 && formRef.value) {
    formRef.value.validateFields([name]);
  }
};

// 上传前校验
const beforeUpload = (file: any, key: number, name: string, fields: string) => {
  const isJpgOrPng =
    file.type === "image/jpeg" ||
    file.type === "image/jpg" ||
    file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("您只能上传JPG/PNG格式的图片!");
  }

  //是否超过最大大小
  let exceedsMaxSize = false;
  if (fields === "cover" || fields === "tail") {
    const isLt10M = file.size / 1024 / 1024 <= 10;
    if (!isLt10M) {
      exceedsMaxSize = true;
      message.error("图片必须小于10MB!");
    }
  } else {
    const isLt1M = file.size / 1024 / 1024 <= 1;
    if (!isLt1M) {
      exceedsMaxSize = true;
      message.error("图片必须小于1MB!");
    }
  }

  const isSuccess = isJpgOrPng && !exceedsMaxSize;

  if (!isSuccess) {
    setTimeout(() => {
      itemsData.value[key].fileList = [];
      formData.value[name] = [];
    }, 0);
  }

  return isSuccess;
};

// 取消
const handleCancel = () => {
  // 直接跳转到模板列表页
  go("/system/template");
};

// 提交表单
const handleSubmit = async () => {
  submitting.value = true;
  try {
    await formRef.value.validate();
    // 模拟API请求
    templateModel.value.content = JSON.stringify(itemsData.value);

    await updateReportTemplate(templateModel.value);

    message.success("保存模板配置成功");

    handleCancel();
  } catch (e) {
    message.error("保存模板配置失败");
  } finally {
    submitting.value = false;
  }
};

// 设置为默认模板
const handleSetDefault = async () => {
  try {
    await setDefaultTemplate(Number(templateId));
    // message.success("设置默认模板成功");
  } catch (e) {
    // message.error("设置默认模板失败");
  }
};

//跳转至编辑基础信息弹框
const confirmEdit = async (data:ReportTemplateBaseVO) => {
  crRef.value?.showModal(data);
}

//编辑模板成功事件
const updateTemplateSuccess = (refreshFlag: Boolean) => {
  if(refreshFlag) {
    fetchData();
  }
}
</script>

<style scoped lang="less">
.content-card {
  margin: 20px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 24px;
  margin: 0 0 20px 24px;

  .title-left {
    flex: 1;
    h2 {
      margin-bottom: 0;
      font-size: 20px;
      font-weight: bold;
    }

    h3 {
      margin-top: 8px;
      font-size: 16px;
      font-weight: normal;
      color: rgb(0 0 0 / 65%);
    }
  }

  .title-right {
    .status-text {
      color: rgb(0 0 0 / 65%);
    }
  }
}

.template-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.template-container {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.centered-form {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.ant-form-item-label) {
  text-align: right;

  label {
    color: #333;
  }
}

:deep(.ant-form-item-control-input) {
  display: flex;
  justify-content: center;
}

.form-item-with-upload {
  margin-bottom: 30px;
}

.upload-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  .upload-box {
    margin-right: 20px;

    :deep(& > div) {
      width: 110px;
      height: 110px;
      overflow: hidden;
    }
  }

  .upload-desc {
    flex: auto;
    max-width: 300px;
    margin-top: 8px;
    font-size: 14px;
    color: rgb(0 0 0 / 45%);
  }
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
}

:deep(.ant-upload-select) {
  width: 104px !important;
  height: 104px !important;
  margin-right: 0;
  margin-bottom: 0;
}

.form-instruction {
  margin-bottom: 20px;
  text-align: center;
}

.upload-tip {
  margin: 0;
  font-size: 14px;
  color: #666;
}
</style>