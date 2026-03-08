import { getCallStatus, getCreateType, getQcStatus } from "@/api/system/dict/custom";
import { ref } from "vue";
import { FormSchema } from "@/components/Form";

export const createTypeOptions = ref<any[]>([]);
export const qcStatusOptions = ref<any[]>([]);
export const callStatusOptions = ref<any[]>([]);
const fetchDictDataIsRun = ref(false);
// 获取字典数据
export const fetchDictData = async () => {
  if (fetchDictDataIsRun.value) return;
  fetchDictDataIsRun.value = true;
  try {
    const [createTypeRes, qcStatusRes, callStatusRes] = await Promise.all([
      getCreateType(),
      getQcStatus(),
      getCallStatus(),
    ]);

    createTypeOptions.value = [{
      label: "全部",
      value: null
    }, ...createTypeRes.list.filter(item => item.value !== "0")];
    qcStatusOptions.value = [{
      label: "全部",
      value: null
    }, ...qcStatusRes.list.filter(item => item.value !== "0")];




    callStatusOptions.value = callStatusRes.list;
  } catch (error) {
    console.error('获取字典数据失败:', error);
  }
};

// 处理schemas中的Select组件配置
export const handleSelectSchemas = (schemas: FormSchema[]) => {
  return schemas.map((schema) => {
    // 处理创建来源字段
    if (schema.field === "createType") {
      return {
        ...schema,
        componentProps: {
          options: createTypeOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    // 处理质控结果字段
    if (schema.field === "qcStatus") {
      return {
        ...schema,
        componentProps: {
          options: qcStatusOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    return schema;
  });
};