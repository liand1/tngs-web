<template>
  <div>
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
            <div class="info-item">
              <span class="value" style="min-height: 28px">{{
                getNestedValue(findAnalysisReportDetails, field.key)
              }}</span>
            </div>
          </a-col>
        </a-row>
      </a-row>
    </div>
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
  SexEnumMap,
  SampleTypeEnumMap,
  CheckTypeEnumMap,
  SampleStatusEnumMap,
  SourceTypeEnumMap,
  SexEnum,
} from "@/enums/customEnum";
import { onBeforeMount, ref } from "vue";
import { getI5Code, getI7Code } from "@/api/system/dict/custom";
import { getValueByPath } from "@/utils/custom";

defineProps<ExperimentalInformationProps>();

const i7CodeOptions = ref<DictDataVO[]>([]);
const i5CodeOptions = ref<DictDataVO[]>([]);

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
  "sample.examinee.sex": SexEnumMap,
  "sample.sampleType": SampleTypeEnumMap,
  "sample.checkType": CheckTypeEnumMap,
  "sample.status": SampleStatusEnumMap,
  "sample.createType": SourceTypeEnumMap,
};

const numberType = [
  "sample.sampleVolume",
  "sample.examinee.age",
  "sample.clinicalResult.wbc",
  "sample.clinicalResult.lym",
  "sample.clinicalResult.gr",
  "sample.clinicalResult.crp",
  "sample.clinicalResult.pct",
  "sample.clinicalResult.libraryConc",
  "sample.clinicalResult.nucleicAcidConc",
];

// 处理嵌套属性访问，例如：'a.b' 转换为 访问 obj['a']['b']
const getNestedValue = (obj: any, path: string) => {
  if (!obj || !path) return "";

  // 对i7Serial进行特殊处理
  if (path === "sample.i7Serial") {
    const i7Code = i7CodeOptions.value.find(
      (item) => item.label === obj["sample"]["i7Code"]
    );
    return i7Code?.value;
  }

  if (path === "sample.i5Serial") {
    const i5Code = i5CodeOptions.value.find(
      (item) => item.label === obj["sample"]["i5Code"]
    );
    return i5Code?.value;
  }

  if (path === "sample.examinee.sex") {
    const sex = getValueByPath(obj, path);
    if (!sex || sex == SexEnum.UNKNOWN) {
      return "-";
    }
    return SexEnumMap[sex];
  }

  //性别单独处理
  if (path === "sample.examinee.sex") {
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
    return value === 0 ? "-" : new Date(value).toLocaleString();
  }

  return getValueByPath(obj, path);
};
</script>

<style lang="less" scoped>
.samplename {
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