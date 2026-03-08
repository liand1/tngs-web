<template>
  <a-modal
    v-model:open="open"
    title="质控设置"
    :confirm-loading="confirmLoading"
    :width="980"
    @ok="handleOk"
    @cancel="handleCancel"
    centered
  >
    <div class="qc-setting-form">
      <!-- 动态渲染 li -->
      <div v-for="(item, index) in items" :key="index" class="li">
        <a-row>
          <a-col :span="20">
          <div class="title">
            {{ item.title }}
            <a-tooltip v-if="item.tooltip">
              <template #title>{{ item.tooltip }}</template>
              <InfoCircleOutlined fill="rgb(0 0 0 / 45%)" />
            </a-tooltip>
            <span>（{{ item.abbreviation }}）</span>
          </div>
          <div v-if="item.name == 'raw_reads' || item.name == 'pollution'" style="color: #999;display: flex; align-items: center;">
            <a-input-number
              :value="getRawReadsSettingValue(item.name, 0)"
              :min="0"
              :step="100"
              style="width: 130px"
              @change="(value) => updateRawReadsSettingValue(item.name, value, 0)"
            >
              <template #addonAfter v-if="item.addonAfter">
                {{ item.addonAfter }}
              </template>
            </a-input-number>
            <span style="margin: 0px 4px;">到</span>
            <a-input-number
              :value="getRawReadsSettingValue(item.name, 1)"
              :min="0"
              :step="100"
              style="width: 130px"
              @change="(value) => updateRawReadsSettingValue(item.name, value, 1)"
            >
              <template #addonAfter v-if="item.addonAfter">
                {{ item.addonAfter }}
              </template>
            </a-input-number>
            <span style="margin: 0px 4px;">之间</span>
          </div>
          <div v-else>
          <a-input-number
            :value="getSettingValue(item.name)"
            :min="0"
            v-if="!(item.name == 'water_pollution' || item.name == 'out_sex')"
            :precision="2"
            style="width: 130px"
            @change="(value) => updateSettingValue(item.name, value)"
          >
            <template #addonAfter v-if="item.addonAfter">
              {{ item.addonAfter }}
            </template>
          </a-input-number>
          </div>
          <div class="description">{{ item.description }}</div>
          </a-col>
          <a-col :span="4" style="display: flex; flex-direction: column; justify-content: space-around;">
            <div style="width: 100%; display: flex; justify-content: flex-end;">
              <a-switch @change="(checked) => statusChange(item.name, checked)" :checked="item.status == 1 ? true : false" checked-children="开" un-checked-children="关" />
            </div>
            <div style="width: 100%; margin-top: 4px; min-height: 26px; display: flex; justify-content: flex-end;">
              <a-switch @change="(checked) => displayChange(item.name, checked)" size="small" :checked="item.display == 1 ? true : false"  />
            </div>
            <div class="description">将[不合格]显示为[预警]</div>
          </a-col>
        </a-row>
      </div>
    </div>

    <div class="newsfooter">
      <a-button danger @click="defaultsettings"> 恢复默认设置 </a-button>
    </div>
  </a-modal>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { useMessage } from "@/hooks/web/useMessage";
import {
  findNewestBatchCode,
  QcSettingsModel,
  updateBatchQcSettings,
} from "@/api/lims/qcsettings";
import { QcSettingsStatusEnum, QcTypeEnum } from "@/enums/customEnum";
const { createMessage } = useMessage();

// 模态框状态
const open = ref(false);
const confirmLoading = ref(false);

// 表单项数据
const items = ref([
  {
    name: "raw_reads",
    title: "单个样本序列数",
    abbreviation: "raw_reads",
    description: "小于左框内输入值判断为“不合格”，大于右框内输入值判断为“合格”；在两输入框之间的值判断为“预警”",
    tooltip:
      "单个样本序列数大于500000(0.5M)判定为合格。推荐单个样本序列数大于1000000(1M)",
    status: 0,
    display: 0,
  },
  {
    name: "water_pollution",
    title: "水污染质控",
    abbreviation: "阴控质检",
    description: "无需预设，以检出结果为准，可设置为不启用",
    tooltip: "",
    addonAfter: "%",
    status: 1,
    display: 0,
  },
  {
    name: "plasmid_tag_rate",
    title: "质粒(阳性)参考品物种检出率",
    abbreviation: "质粒靶标检出率",
    description: "物种任一靶标检出实为检出",
    tooltip: "大于等于输入框内设定值，则判定为“合格”",
    addonAfter: "%",
    status: 1,
    display: 0,
  },
  {
    name: "clean_qthirty",
    title: "样本Q30占比",
    abbreviation: "raw_Q30",
    description: "大于上方输入框内值则判断为“合格”",
    addonAfter: "%",
    status: 1,
    display: 0,
  },
  {
    name: "pollution",
    title: "防错标签异常率",
    abbreviation: "污染情况",
    description: "小于左框内输入值判断为“合格”，大于右框内输入值判断为“不合格”；在两输入框之间的值判断为“预警”",
    tooltip: "【其他标签】检出在该样本【全部标签】检出中的占比",
    addonAfter: "%",
    status: 1,
    display: 0,
  },

  {
    name: "map_rate",
    title: "比对率",
    abbreviation: "map_rate",
    description: `大于上方输入框内值则判断为“合格”`,
    addonAfter: "%",
    status: 1,
    display: 0,
  },
  {
    name: "adapter_rate",
    title: "接头序列占比",
    abbreviation: "adapter_rate",
    description: `大于上方输入框内值则判断为“不合格”`,
    addonAfter: "%",
    status: 1,
    display: 0,
  },
  {
    name: "out_sex",
    title: "性别检出质控",
    abbreviation: "检出性别",
    description: `无需预设，样本值与检出结果一致判断为“合格"如果样本值本身为空，则默认为“合格”`,
    tooltip: "",
    addonAfter: "%",
    status: 1,
    display: 0,
  },
  // 添加更多表单项...
]);

//默认值
const defaultsettingValue = function (): QcSettingsModel[] {
  return [
    {
      id: 2,
      name: "raw_reads",
      value: "200000-500000",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
    {
      id: 8,
      name: "water_pollution",
      value: "-",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
    {
      id: 7,
      name: "pollution",
      value: "5-20",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
    {
      id: 3,
      name: "map_rate",
      value: "2",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
    {
      id: 4,
      name: "adapter_rate",
      value: "0.1",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
    {
      id: 5,
      name: "plasmid_tag_rate",
      value: "95",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
    {
      id: 6,
      name: "clean_qthirty",
      value: "85",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
    {
      id: 9,
      name: "out_sex",
      value: "-",
      status: QcSettingsStatusEnum.ENABLED,
      display: QcSettingsStatusEnum.DISABLED,
    },
  ];
};

// 表单值，使用数组存储每个输入框的值
const formValues = ref<QcSettingsModel[]>(defaultsettingValue());

/**
 * 获取指定名称的设置值
 * @param name 设置名称
 * @returns 设置值（数值类型）
 */
const getSettingValue = (name: string): number => {
  const setting = formValues.value.find((obj) => obj.name === name);
  if (setting && setting.value) {
    if(name == 'raw_reads') {
      let values = setting.value.split("-");
      if(values.length > 1) {

      }
    } else {
      return parseFloat(setting.value);
    }
  }
  return 0;
};

/**
 * 获取指定名称的设置值
 * @param name 设置名称
 * @returns 设置值（数值类型）
 */
const getRawReadsSettingValue = (name: string, index: number): number => {
  const setting = formValues.value.find((obj) => obj.name === name);
  if (setting && setting.value) {
    if(name == 'raw_reads' || name == 'pollution') {
      let values = setting.value.split("-");
      if(values.length > 1) {
        return parseFloat(values[index]);
      } else {
        return parseFloat(values[0]);
      }
    } else {
      return parseFloat(setting.value);
    }
  }
  return 0;
};

/**
 * 更新指定名称的设置值
 * @param name 设置名称
 * @param value 新的设置值
 */
const updateSettingValue = (name: string, value: number): void => {
  
  const index = formValues.value.findIndex((obj) => obj.name === name);
  if (index !== -1) {
    formValues.value[index].value = String(value);
  }
};

const updateRawReadsSettingValue = (name: string, value: number, idx: number): void => {
  const index = formValues.value.findIndex((obj) => obj.name === name);
  if (index !== -1) {
    let values = formValues.value[index].value.split("-");
    if(idx == 0) {
      formValues.value[index].value = String(value) + "-" + values[1];
    } else {
      formValues.value[index].value = values[0] + "-" + String(value);
    }
  }
};

const statusChange = (name: string, checked: Boolean): void => {
  const index = formValues.value.findIndex((obj) => obj.name === name);
  if (index !== -1) {
    formValues.value[index].status = checked ? 1 : 0;
  }

  const index2 = items.value.findIndex((obj) => obj.name === name);
  if (index2 !== -1) {
    items.value[index2].status = checked ? 1 : 0;
  }
}

const displayChange = (name: string, checked: Boolean): void => {
  const index = formValues.value.findIndex((obj) => obj.name === name);
  if (index !== -1) {
    formValues.value[index].display = checked ? 1 : 0;
  }

  const index2 = items.value.findIndex((obj) => obj.name === name);
  if (index2 !== -1) {
    items.value[index2].display = checked ? 1 : 0;
  }
}

// 打开模态框方法
const showModal = () => {
  getQcSettingsList();
  open.value = true;
};

// 确定按钮逻辑
const handleOk = async () => {
  confirmLoading.value = true;

  try {
    // 调用服务端接口 updateQcSetting
    await updateBatchQcSettings(formValues.value); // 将所有表单项的值传递给接口
    createMessage.success("质控设置保存成功");
    open.value = false;
  } catch (error) {
    createMessage.error("保存失败，请重试");
  } finally {
    confirmLoading.value = false;
  }
};

onMounted(() => {
  getQcSettingsList();
});

const getQcSettingsList = async () => {
  const res = await findNewestBatchCode(QcTypeEnum.ANALYSIS_TASK);
  if (res.length > 0) {
    formValues.value = res;
    for(let i = 0; i < formValues.value.length; i++) {
      let name = formValues.value[i].name;
      const index2 = items.value.findIndex((obj) => obj.name === name);
      if (index2 !== -1) {
        items.value[index2].status =formValues.value[i].status;
        items.value[index2].display =formValues.value[i].display;
      }
    }
  }
};

// 取消按钮逻辑
const handleCancel = () => {
  open.value = false;
};

// 暴露外部接口
defineExpose({
  showModal,
});

const defaultsettings = () => {
  formValues.value = defaultsettingValue();
  for(let i = 0; i < formValues.value.length; i++) {
    let name = formValues.value[i].name;
    const index2 = items.value.findIndex((obj) => obj.name === name);
    if (index2 !== -1) {
      items.value[index2].status =formValues.value[i].status;
      items.value[index2].display =formValues.value[i].display;
    }
  }
  createMessage.success("已恢复默认设置");
};
</script>
<style lang="less" scoped>
.qc-setting-form {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  margin: 12px 48px;

  .li {
    width: calc(100% - 32px);

    .title {
      margin-bottom: 8px;
    }
  }
}

.title {
  span {
    color: rgb(0 0 0 / 45%);
  }
}

.description {
  font-size: 13px;
  line-height: 20px;
  color: rgb(0 0 0 / 45%);
}

.newsfooter {
  position: absolute;
  bottom: 8px;
  left: 8px;
}
</style>