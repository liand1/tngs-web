<script lang="ts" setup>
import { defineComponent, ref, unref } from "vue";
import { createFormSchema, updateFormSchema } from "./sample.data";
import { useI18n } from "@/hooks/web/useI18n";
import { useMessage } from "@/hooks/web/useMessage";
import { BasicForm, useForm } from "@/components/Form";
import { BasicModal, useModalInner } from "@/components/Modal";
import { mitt } from '@/utils/mitt'
import {
  createSample,
  findNewestBatchCode,
  getSample,
  updateSample,
} from "@/api/lims/sample";
import {
  handleCreateUpdateSelectSchemas,
  batchOptions,
  handleCreateToExcelImportData,
  handleInitFormData,
  fetchDictData
} from ".";
import { getI5Code, getI7Code } from "@/api/system/dict/custom";
defineOptions({ name: "SampleModal" });

const emit = defineEmits(["success", "register"]);

const { t } = useI18n();
const { createMessage } = useMessage();
const isUpdate = ref(true);
const initFormData = ref(true);

const props = defineProps<{
  type?: number;
}>();

const sampleEmitter = mitt()

const [registerForm, { setFieldsValue, resetFields, resetSchema, validate }] =
  useForm({
    labelWidth: 120,
    baseColProps: { span: 8 },
    schemas: handleCreateUpdateSelectSchemas(
      createFormSchema,
      i7SerialChange,
      i5SerialChange,
      checkTypeChange,
      props.type || 0
    ),
    showActionButtonGroup: false,
    actionColOptions: { span: 23 },
    layout: "vertical",
    rowProps: {
      gutter: [40, 0],
    },
  });

const [registerModal, { setModalProps, closeModal }] = useModalInner(
  async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;
    if (unref(isUpdate)) {
      resetSchema(
        handleCreateUpdateSelectSchemas(
          updateFormSchema,
          i7SerialChange,
          i5SerialChange,
          checkTypeChange,
          props.type || 0
        )
      );
      
      const res = await getSample(data.record.id);
      const i5CodeOptions = await getI5Code()
      const i7CodeOptions = await getI7Code()

      res.i5Serial = i5CodeOptions.list.filter(item => item.label === res.i5Code)[0]?.value
      res.i7Serial = i7CodeOptions.list.filter(item => item.label === res.i7Code)[0]?.value
      res.sampleType = res.sampleType.toString();
      res.checkType = res.checkType.toString();
      if(res.checkReagent) {
        res.checkReagent = res.checkReagent.toString();
      }
      initFormData.value = true;
      setFieldsValue({ ...res });
    } else {
      if(data && data.batchCode) {
        await fetchDictData();
        setFieldsValue({ batchCode: data.batchCode });
      }
    }
  }
);


function serialToCode(serial: string, options: any[]) {
  return options.find(item => item.value === serial)?.label;
}

async function i7SerialChange(value: string, option: any) {
  // option存在代表的不是默认赋值，是选中下拉后的处理
  if (option) {
    setFieldsValue({ i7Serial: value });
    return
  }

  //首次赋值 编辑的时候需要处理
  if (isUpdate) {
    const i7CodeOptions = await getI7Code()
    return i7CodeOptions.list.filter(item => item.label === value)[0]?.value
  }

}

async function i5SerialChange(value: string, option: any) {
  // option存在代表的不是默认赋值，是选中下拉后的处理
  if (option) {
    setFieldsValue({ i5Serial: value });
    return
  }

  //首次赋值 编辑的时候需要处理
  if (isUpdate) {
    const i5CodeOptions = await getI5Code()
    return i5CodeOptions.list.filter(item => item.label === value)[0]?.value
  }

}

async function checkTypeChange(value: string, option: any) {
  console.log(value, option, initFormData);
  if (initFormData.value === false) {
    setFieldsValue({ checkReagent: null });
  } 
  initFormData.value = false;
}

async function handleSubmit() {

  try {
    const values = await validate();
    const i5CodeOptions = await getI5Code()
    const i7CodeOptions = await getI7Code()
    values.i7Code = serialToCode(values.i7Serial, i7CodeOptions.list);
    values.i5Code = serialToCode(values.i5Serial, i5CodeOptions.list);
    // 将 collectDate 转换为时间戳
    if (values.collectDate) {
      values.collectDate = new Date(values.collectDate).getTime();
    }

    if (values.samplingDate) {
      values.samplingDate = new Date(values.samplingDate).getTime();
    }

    setModalProps({ confirmLoading: true });
    if (unref(isUpdate)) {
      await updateSample(values);
      // sampleEmitter.emit('sample-update-success', values);
    } else {
      await createSample(handleCreateToExcelImportData(values));
    }

    closeModal();
    emit("success", values);
    createMessage.success(t("common.saveSuccessText"));
  } finally {
    setModalProps({ confirmLoading: false });
  }
}

//创建下一个批次样本
async function handleCreateNextBatch() {
  try {
    const values = await validate();
    const i5CodeOptions = await getI5Code()
    const i7CodeOptions = await getI7Code()
    values.i7Code = serialToCode(values.i7Serial, i7CodeOptions.list);
    values.i5Code = serialToCode(values.i5Serial, i5CodeOptions.list);

    if (values.collectDate) {
      values.collectDate = new Date(values.collectDate).getTime();
    }

    if (values.samplingDate) {
      values.samplingDate = new Date(values.samplingDate).getTime();
    }

    const nextBatch = await handleAddBatch(values, "batchCode");
    setModalProps({ confirmLoading: true });
    if (unref(isUpdate)) {
      await updateSample(values);
    } else {
      await createSample(handleCreateToExcelImportData(values));

      setFieldsValue(
        Object.assign(
          handleInitFormData([
            // "batchCode",
            // "failSafeTag",
            // "sampleType",
            // "checkType",
            // "i7Code",
            // "i5Code",
            // "subHospital",
            // "subRoom",
            // "subDoctor",
            // "samplingDate",
            // "getLrBatch",
            // "putLrBatch",
            // "onDeviceLr",
            // "getTechnician",
            // "putTechnician",
          ]),
          {
            batchCode: nextBatch,
          }
        )
      );
    }

    emit("success");
    createMessage.success(t("common.saveSuccessText"));
  } finally {
    setModalProps({ confirmLoading: false });
  }
}

//保存并新增下一个同批次样本
async function handleSubmitNewsNextBatch() {
  try {
    const values = await validate();
    const oldi5Code = values.i5Code
    const oldi7Code = values.i7Code
    const i5CodeOptions = await getI5Code()
    const i7CodeOptions = await getI7Code()
    values.i7Code = serialToCode(values.i7Serial, i7CodeOptions.list);
    values.i5Code = serialToCode(values.i5Serial, i5CodeOptions.list);
    // 将 collectDate 转换为时间戳
    if (values.collectDate) {
      values.collectDate = new Date(values.collectDate).getTime();
    }

    if (values.samplingDate) {
      values.samplingDate = new Date(values.samplingDate).getTime();
    }
    setModalProps({ confirmLoading: true });
    if (unref(isUpdate)) {
      await updateSample(values);
      values.i7Code = oldi7Code
      values.i5Code = oldi5Code
    } else {
      await createSample(handleCreateToExcelImportData(values));

      values.i7Code = oldi7Code
      values.i5Code = oldi5Code
      setFieldsValue(
        handleInitFormData([
          "batchCode",
          "failSafeTag",
          "sampleType",
          "checkType",
          "i7Code",
          "i5Code",
          "i5Serial",
          "i7Serial",
          "subHospital",
          "subRoom",
          "subDoctor",
          "samplingDate",
          "getLrBatch",
          "putLrBatch",
          "onDeviceLr",
          "getTechnician",
          "putTechnician",
        ])
      );
    }



    emit("success");
    createMessage.success(t("common.saveSuccessText"));

    // 创建下一个批次样本
  } finally {
    setModalProps({ confirmLoading: false });
  }
}

function updateSubmitFn() {
  return isUpdate.value ? handleSubmit() : handleSubmitNewsNextBatch();
}

//自定义下拉框
const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes;
  },
});

//获取新增批次
const handleAddBatch = async (model: any, field: any): Promise<string> => {
  //model[field]
  const res = await findNewestBatchCode();
  console.log("新增批次", res);
  model[field] = res;
  batchOptions.value.unshift({
    label: res,
    value: res,
  });
  return "";
};
</script>
<!-- defaultFullscreen -->
<template>
  <BasicModal v-bind="$attrs" :title="isUpdate ? '编辑样本' : '新增样本'" @register="registerModal" @ok="updateSubmitFn"
    :okText="isUpdate ? '保存编辑' : '保存并新增下一个同批次样本'" :draggable="false" :defaultFullscreen="true">
    <template #centerFooter>
      <a-button danger v-auth="['lims:sample:export']" @click="handleSubmit" style="margin: 0 16px" v-if="!isUpdate">
        保存并返回样本列表
      </a-button>
    </template>

    <template #appendFooter>
      <a-button danger v-auth="['lims:sample:export']" @click="handleCreateNextBatch" style="margin-left: 100px"
        v-if="!isUpdate">
        创建下一个批次样本
      </a-button>
    </template>

    <BasicForm @register="registerForm">
      <template #batchCodeDropdownRender="{ field, model }">
        <a-select v-model:value="model[field]" placeholder="请选择">
          <!-- 最下方拓展菜单——添加选项 -->
          <template #dropdownRender="{ menuNode: menu }">
            <div>
              <a-space class="slectspace" @click="handleAddBatch(model, field)">
                <div class="selectadd">+ 新增批次</div>
              </a-space>
              <a-divider style="margin: 4px 0" />

              <v-nodes :vnodes="menu" />
            </div>
          </template>
          <a-select-option v-for="(item, index) in batchOptions" :key="index" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </template>
    </BasicForm>
  </BasicModal>
</template>


<style lang="less" scoped>
.slectspace {
  width: 100%;
  padding: 4px 8px;

  &:hover {
    background-color: rgb(0 0 0 / 4%);
  }

  .selectadd {
    width: 100%;
    font-size: 14px;
    line-height: 22px;
    color: rgb(24 144 255 / 100%);
    vertical-align: middle;
    cursor: pointer;
  }
}
</style>