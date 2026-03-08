<template>
  <div>
    <div class="title">
      <div class="samplename">
        <div style="min-width: 180px; margin-right: 8px">
        {{ findAnalysisReportDetails?.examineeName }} - [{{
          report?.sampleCode
        }}]
        </div>
        <div>
          <a-button type="primary" ghost @click="preSample">上一个样本</a-button>
          <a-button type="primary" ghost style="margin-left: 4px;" @click="nextSample">下一个样本</a-button>
        </div>
      </div>
      <div class="title">
        <a-checkbox :checked="highlightKeyInfo" @change="highlightChange">高亮重点信息</a-checkbox>
        <a-button @click="editSample(findAnalysisReportDetails?.id || 0)" :loading="confirmEditLoading">编辑样本</a-button>
      </div>
    </div>
    
    <div class="experimental-information">
      <a-row class="header-row">
        <a-col style="width: 100%">
          <div class="info-item" style="align-items: center">
            <span class="label">样本信息</span>
          </div>
        </a-col>
      </a-row>

      <a-row
        v-for="(rowFields, rowIndex) in chunkedFields"
        :key="rowIndex"
        class="rows"
      >
        <!-- 标题行（Label）添加背景色 -->
        <a-row class="header-row">
          <a-col
            v-for="(field, colIndex) in rowFields"
            :key="`label-${rowIndex}-${colIndex}`"
            :span="6"
          >
            <div class="info-item">
              <span class="label">{{ field.label }}</span>
            </div>
          </a-col>
        </a-row>

        <!-- Value行保持原样 -->
        <a-row class="value-row">
          <a-col
            v-for="(field, colIndex) in rowFields"
            :key="`value-${rowIndex}-${colIndex}`"
            :span="6"
          >
            <div class="info-item" :class="{ 'light': highlightKeyInfo && lightField.indexOf(field.key) > -1 }">
              <span class="value" style="min-height: 28px">{{
                getNestedValue(findAnalysisReportDetails, field.key)
              }}</span>
            </div>
          </a-col>
        </a-row>
      </a-row>
    </div>

    <SampleModal @register="registerModal" :type="1" @success="updateSampleSuccess"/>
  </div>
</template>

<script lang="ts" setup>
import { DictDataVO } from "@/api/system/dict/types";
import {
  fields,
  timeFields,
  EnumMappings,
  ExperimentalInformationProps,
} from "./model";
import {
  fetchDictData,
} from "@/views/lims/sample/index";
import {
  SexEnumMap,
  SampleTypeEnumMap,
  CheckTypeEnumMap,
  SampleStatusEnumMap,
  SourceTypeEnumMap,
  SexEnum,
  SampleCheckReagent,
} from "@/enums/customEnum";
import SampleModal from "@/views/lims/sample/SampleModal.vue";
import { onBeforeMount, ref } from "vue";
import { getI5Code, getI7Code } from "@/api/system/dict/custom";
import { getValueByPath } from "@/utils/custom";
import { useModal } from "@/components/Modal";

const [registerModal, { openModal }] = useModal();
const confirmEditLoading = ref<Boolean>(false);

defineProps<ExperimentalInformationProps>();

const i7CodeOptions = ref<DictDataVO[]>([]);
const i5CodeOptions = ref<DictDataVO[]>([]);

const lightField = ["sampleCode", "sampleType", "examinee.name", "subHospital"];

onBeforeMount(async () => {
  i5CodeOptions.value = (await getI5Code()).list;
  i7CodeOptions.value = (await getI7Code()).list;
});

const chunkedFields = Array.from(
  { length: Math.ceil(fields.length / 4) },
  (_, i) => fields.slice(i * 4, i * 4 + 4)
);

// 枚举值到中文文本的映射
const enumMappings: EnumMappings = {
  "examinee.sex": SexEnumMap,
  "sampleType": SampleTypeEnumMap,
  "checkType": CheckTypeEnumMap,
  "status": SampleStatusEnumMap,
  "createType": SourceTypeEnumMap,
};

const numberType = [
  "sampleVolume",
  "examinee.age",
  "clinicalResult.wbc",
  "clinicalResult.lym",
  "clinicalResult.gr",
  "clinicalResult.crp",
  "clinicalResult.pct",
  "clinicalResult.libraryConc",
  "clinicalResult.nucleicAcidConc",
];

const emit = defineEmits<{
  (e: "preSample"): void;
  (e: "nextSample"): void;
  (e: "updateSampleSuccess", value: any): void;
  (e: "highlightChange", value: Boolean): void;
}>();

// 处理嵌套属性访问，例如：'a.b' 转换为 访问 obj['a']['b']
const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return "";

  if (path === "checkReagent") {
    return SampleCheckReagent[obj?.checkReagent];
  }

  // 对i7Serial进行特殊处理
  if (path === "i7Serial") {
    
    const i7Code = i7CodeOptions.value.find(
      (item) => item.label === obj.i7Code
    );
    return i7Code?.value;
  }

  if (path === "i5Serial") {
    const i5Code = i5CodeOptions.value.find(
      (item) => item.label === obj.i5Code
    );
    return i5Code?.value;
  }

  if (path === "examinee.sex") {
    const sex = getValueByPath(obj, path);
    if (!sex || sex == SexEnum.UNKNOWN) {
      return "-";
    }
    return SexEnumMap[sex];
  }

  // 1. 处理数字类型
  if (numberType.includes(path)) {
    const value = getValueByPath(obj, path);
    return value == 0 ? "-" : value;
  }

  // 2. 处理枚举值 - 转换为中文显示
  if (Object.keys(enumMappings).includes(path)) {
    const value = getValueByPath(obj, path);
    return enumMappings[path][value];
  }

  // 3. 处理时间戳 - 转换为日期时间字符串
  if (timeFields.includes(path)) {
    const value = getValueByPath(obj, path);
    return value === 0 || !value ? "-" : new Date(value).toLocaleString();
  }

  return getValueByPath(obj, path);
};

const preSample = () => {
  emit("preSample");
}

const nextSample = () => {
  emit("nextSample");
}

const editSample = async (id:number) => {
  confirmEditLoading.value = true;
  fetchDictData().then(() => {
    openModal(true, {record: {id}, isUpdate: true} );
  }).finally(() => {
    confirmEditLoading.value = false;
  })
}

const updateSampleSuccess = (sampleData) => {
  emit("updateSampleSuccess", sampleData);
}

const highlightChange = (e:Event) => {
  emit("highlightChange", e?.target?.checked);
}

</script>

<style lang="less" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.samplename {
  display: flex;
  font-size: 16px;
  font-weight: bold;
  line-height: 64px;
}

.experimental-information {
  border: 1px solid #f0f0f0;
  border-bottom: none;
  border-radius: 4px;

  .info-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 24px;
    line-height: 28px;
    background-color: inherit; /* 确保子元素继承背景色 */

    // .label {
    //   margin-bottom: 4px;
    // }

    .value {
      word-break: break-all;
    }
    
  }

  .light {
    background-color: #FEF371;
  }

  /* 新增背景色样式 */
  .header-row {
    background-color: #fafafa; /* 可自定义颜色 */
    border-bottom: 1px solid #f0f0f0;

    :deep(.ant-col) {
      border-right: 1px solid #f0f0f0;

      &:last-child {
        border-right: none;
      }
    }

    :deep(.info-item) {
      background-color: #fafafa;
    }
  }

  .value-row {
    border-bottom: 1px solid #f0f0f0;

    :deep(.ant-col) {
      border-right: 1px solid #f0f0f0;

      &:last-child {
        border-right: none;
      }
    }
  }

  .rows {
    width: 100%;

    :deep(.ant-row) {
      width: 100%;
    }
  }
}
</style>