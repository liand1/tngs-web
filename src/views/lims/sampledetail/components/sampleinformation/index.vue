<template>
  <div class="sample_information_box">
    <h2 class="title">样本信息详情</h2>
    <div class="sample-information">
      <!-- <a-row class="header-row">
        <a-col style="width: 100%">
          <div class="info-item" style="align-items: center">
            <span class="label">样本创建信息</span>
          </div>
        </a-col>
      </a-row> -->

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
              <span
                class="value"
                style="
                  box-sizing: border-box;
                  min-height: 28px;
                  line-height: 28px;
                "
                >{{ getNestedValue(sampleData, field.key) }}</span
              >
            </div>
          </a-col>
        </a-row>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref } from "vue";
import { fields } from "./index";
import { getI5Code, getI7Code } from "@/api/system/dict/custom";
import { DictDataVO } from "@/api/system/dict/types";
import { SexEnum, SexEnumMap, SampleCheckReagent } from "@/enums/customEnum";
import { getValueByPath } from "@/utils/custom";

const i5CodeOptions = ref<DictDataVO[]>([]);
const i7CodeOptions = ref<DictDataVO[]>([]);

onBeforeMount(async () => {
  i5CodeOptions.value = (await getI5Code()).list;
  i7CodeOptions.value = (await getI7Code()).list;
});

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

const props = defineProps({
  sampleId: {
    type: String,
    default: "",
  },
  record: {
    type: Object,
    required: true,
  },
});

const chunkedFields = Array.from(
  { length: Math.ceil(fields.length / 4) },
  (_, i) => fields.slice(i * 4, i * 4 + 4)
);

const sampleData = computed(() => {
  return props.record;
});
// getI5Code()
// getI7Code()
// 处理嵌套属性访问，例如：'a.b' 转换为 访问 obj['a']['b']
const getNestedValue = (obj: any, path: string) => {
  if (!path) return "";

  if (path === "checkReagent") {
    return SampleCheckReagent[obj['checkReagent']];
  }

  // 对i7Serial进行特殊处理
  if (path === "i7Serial") {
    const i7Code = i7CodeOptions.value.find(
      (item) => item.label === obj["i7Code"]
    );
    return i7Code?.value;
  }

  if (path === "i5Serial") {
    const i5Code = i5CodeOptions.value.find(
      (item) => item.label === obj["i5Code"]
    );
    return i5Code?.value;
  }

  //性别单独处理
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

  return getValueByPath(obj, path);
};
</script>



<style lang="less" scoped>
.sample_information_box {
  margin: 0 20px 16px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 8px;

  & > .title {
    height: 56px;
    padding: 0 20px;
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    line-height: 56px;
    color: rgb(0 0 0 / 85%);
    border-bottom: 1px solid rgb(0 0 0 / 6%);
  }
}

.sample-information {
  margin: 24px;
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