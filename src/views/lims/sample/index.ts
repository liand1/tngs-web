import { ExcelData } from "@/components/Excel";
import { BasicColumn } from "@/components/Table";
import type { SampleDataModel } from "./model";
import { CheckTypeEnum, SampleStatusEnum, SampleTypeEnum, SexEnum, SourceTypeEnum, SampleCheckReagent } from "@/enums/customEnum";
import { defHttp } from '@/utils/http/axios';
import { useMessage } from '@/hooks/web/useMessage';
import { getSamplePage, getSampleBatchPage, createBatch } from "@/api/lims/sample";
import { ref } from "vue";
import { getCheckType, getCreateType, getSampleType, getGender, getI5Code, getI7Code, getSampleStatus } from "@/api/system/dict/custom";
import { FormSchema, useForm } from "@/components/Form";




// 根据接口返回的类型 调整columns和searchFormSchema里面的dataIndex字段名// 字典数据
export const createTypeOptions = ref<any[]>([]);
export const sampleTypeOptions = ref<any[]>([]);
export const checkTypeOptions = ref<any[]>([]);
export const genderOptions = ref<any[]>([]);
export const i5CodeOptions = ref<any[]>([]);
export const i7CodeOptions = ref<any[]>([]);
// 批次列表数据
export const batchOptions = ref<any[]>([]);
export const sampleStatusOptions = ref<any[]>([]);


const fetchDictDataIsRun = ref(false);
// 获取字典数据
export const fetchDictData = async () => {
  if (fetchDictDataIsRun.value) return;
  fetchDictDataIsRun.value = true;
  try {
    const [createTypeRes, sampleTypeRes, checkTypeRes, genderRes, i5CodeRes, i7CodeRes, batchRes, sampleStatusRes] = await Promise.all([
      getCreateType(),
      getSampleType(),
      getCheckType(),
      getGender(),
      getI5Code(),
      getI7Code(),
      fetchBatchData(),
      getSampleStatus()
    ]);


    // 创建来源
    createTypeOptions.value = [{
      label: "全部",
      value: null
    }, ...createTypeRes.list.filter(item => item.value !== "0")];

    // 样本类型


    sampleTypeOptions.value = sampleTypeRes.list;


    

    checkTypeOptions.value = checkTypeRes.list;
    genderOptions.value = genderRes.list;
    i5CodeOptions.value = i5CodeRes.list;
    i7CodeOptions.value = i7CodeRes.list;
    sampleStatusOptions.value = sampleStatusRes.list;


    console.log(i5CodeRes);
  } catch (error) {
    console.error('获取字典数据失败:', error);
  }
};

const fetchBatchDataIsRun = ref(false);
// 获取批次列表数据
export const fetchBatchData = async () => {
  if (fetchBatchDataIsRun.value) return;
  fetchBatchDataIsRun.value = true;
  try {
    const res = await getSampleBatchPage();
    batchOptions.value = res.map(item => ({
      label: item,
      value: item
    }));
  } catch (error) {
    console.error('获取批次列表失败:', error);
  }
};

// 处理schemas中的Select组件配置
export const handleSelectSchemas = (schemas: FormSchema[], checkTypeChange: any) => {
  return schemas.map((schema) => {
    // 处理批次编号字段
    if (schema.field === "batchCode") {
      return {
        ...schema,
        componentProps: {
          options: batchOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
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
    // 处理样本类型字段
    if (schema.field === "sampleType") {
      return {
        ...schema,
        componentProps: {
          options: sampleTypeOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    // 处理检测项目字段
    if (schema.field === "checkType") {
      return {
        ...schema,
        componentProps: {
          options: checkTypeOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
          onChange: checkTypeChange
        },
      };
    }
    return schema;
  });
};


export const handleCreateUpdateSelectSchemas = (schemas: FormSchema[], i7SerialChange: any, i5SerialChange: any, checkTypeChange: any, type: number) => {

  return handleSelectSchemas(schemas, checkTypeChange).map((schema) => {
    if(type == 2) {
      // 处理批次字段
      if (schema.field === "batchCode" || schema.field === 'sourceCode' || schema.field === 'sampleCode'
        || schema.field === 'failSafeTag' || schema.field === 'checkType' || schema.field === 'waterControl'
        || schema.field === 'i7Code' || schema.field === 'i7Serial' || schema.field === 'i5Code'
        || schema.field === 'i5Serial' || schema.field === 'sampleVolume' || schema.field === 'checkReagent'
      ) {
        schema.dynamicDisabled = true;
      }
    } else {
      // if(type == 3) {
      //   if (schema.field === "batchCode" ) {
      //     schema.dynamicDisabled = true;
      //   }
      // } else {
        if (schema.field === "batchCode" || schema.field === 'sourceCode' || schema.field === 'sampleCode'
          || schema.field === 'failSafeTag' || schema.field === 'checkType' || schema.field === 'waterControl'
          || schema.field === 'i7Code' || schema.field === 'i5Code'
          || schema.field === 'sampleVolume' || schema.field === 'checkReagent'
        ) {
          schema.dynamicDisabled = false;
        }
      // }
    }
    // // 处理检测试剂字段
    // if( schema.field === 'checkReagent') {
    //   // let checkReagentOptions = <any>[];
    //   // for(let key in SampleCheckReagent) {
    //   //   checkReagentOptions.push({'label': SampleCheckReagent[key], 'value': key});
    //   // }
    //   return {
    //     ...schema,
    //     componentProps: ({ formModel }) => {
    //       // 根据分类动态生成产品选项
    //       const checkType = formModel.checkType
    //       let options = <any>[];
    //       if (checkType == '1') {
    //         options = [
    //           { label: 'v1.0', value: 'v1.0' },
    //           { label: 'v1.5', value: 'v1.5' }
    //         ]
    //       } else if (checkType == '2') {
    //         options = [
    //           { label: 'v1.2', value: 'v1.2' },
    //           { label: 'v1.3', value: 'v1.3' },
    //         ]
    //       }
    //       return {
    //         options,
    //         disabled: checkType == undefined ? true : false,
    //         placeholder: checkType ? '请选择检测试剂' : '请先选择检测项目'
    //       }
    //     },
    //   };
    // }
    // 处理性别字段
    if (schema.field === "sex") {
      return {
        ...schema,
        componentProps: {
          options: genderOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
        },
      };
    }
    // 处理 i5 编号字段
    if (schema.field === "i5Code") {
      return {
        ...schema,
        componentProps: {
          placeholder: '请输入I5编号',
          options: i5CodeOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
          onChange: i5SerialChange
        },
      };
    }
    // 处理 i7 编号字段
    if (schema.field === "i7Code") {
      return {
        ...schema,
        componentProps: {
          placeholder: '请输入I7编号',
          options: i7CodeOptions,
          showSearch: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
          onChange: i7SerialChange,
        },
      };
    }
    return schema;
  });
};



// vo转成dto
export function handleCreateToExcelImportData(data: any): SampleDataModel {
  
  return {
    batchCode: data.batchCode ?? '',
    sourceCode: data.sourceCode ?? '',
    sampleCode: data.sampleCode ?? '',
    failSafeTag: data.failSafeTag ?? '',
    sampleType: data.sampleType ?? SampleTypeEnum.OTHER,
    checkType: data.checkType ?? CheckTypeEnum.OTHER,
    checkReagent: data.checkReagent ?? '',
    waterControl: data.waterControl ?? '',
    i7Code: data.i7Code ?? '',
    i5Code: data.i5Code ?? '',
    sampleVolume: Number(data.sampleVolume) ?? 0,
    samplingDate: Number(data.samplingDate) ?? 0,
    collectDate: Number(data.collectDate) ?? 0,
    subHospital: data.subHospital ?? '',
    subRoom: data.subRoom ?? '',
    subDoctor: data.subDoctor ?? '',
    createType: SourceTypeEnum.IMPORT_CREATION,
    sampleStatus: SampleStatusEnum.UNANALYZED,
    examineeName: data.name ?? '',
    remark: data.remark ?? '',
    clinicalResult: {
      crp: Number(data.crp) ?? 0,
      pct: Number(data.pct) ?? 0,
      wbc: Number(data.wbc) ?? 0,
      onDeviceLr: data.onDeviceLr ?? '',
      gr: Number(data.gr) ?? 0,
      diagnosis: data.diagnosis ?? '',
      putLrBatch: data.putLrBatch ?? '',
      getTechnician: data.getTechnician ?? '',
      getLrBatch: data.getLrBatch ?? '',
      libraryConc: Number(data.libraryConc) ?? 0,
      nucleicAcidConc: Number(data.nucleicAcidConc) ?? 0,
      result: data.result ?? '',
      focusPathogen: data.focusPathogen ?? '',
      lym: Number(data.lym) ?? 0,
      putTechnician: data.putTechnician ?? '',

    },
    examinee: {
      patientNumber: data.patientNumber ?? '',
      name: data.name ?? '',
      age: Number(data.age) ?? 0,
      bed: data.bed ?? '',
      sex: data.sex ?? SexEnum.UNKNOWN,
      phone: data.phone ?? '',
    }
  };
}

/**
 * 初始化表单数据
 * @param formKeys 需要排除重置的字段
 * @returns 
 */

export function handleInitFormData(formKeys: string[]) {
  const initialValues = {
    // 基本信息
    batchCode: '',
    sourceCode: '',
    sampleCode: '',
    failSafeTag: '',
    sampleType: undefined,
    checkType: undefined,
    checkReagent: undefined,
    waterControl: '',
    i7Code: '',
    i5Code: '',
    i5Serial:'',
    i7Serial:'',
    sampleVolume: undefined,

    // 受检人信息
    name: '',
    sex: undefined,
    age: undefined,
    patientNumber: '',
    bed: '',
    phone: '',

    // 送检信息
    subHospital: '',
    subRoom: '',
    subDoctor: '',
    samplingDate: '',
    collectDate: '',
    diagnosis: '',
    result: '',

    // 化验数据
    wbc: undefined,
    lym: undefined,
    gr: undefined,
    crp: undefined,
    pct: undefined,
    focusPathogen: '',
    nucleicAcidConc: undefined,
    libraryConc: undefined,
    getLrBatch: '',
    putLrBatch: '',
    onDeviceLr: '',
    getTechnician: '',
    putTechnician: '',
    remark: '',

    // 额外状态信息
    createType: SourceTypeEnum.MANUAL_CREATION,
    sampleStatus: SampleStatusEnum.UNANALYZED,
  };

  // 过滤掉不需要重置的字段
  const result: Record<string, any> = {};
  Object.keys(initialValues).forEach((key) => {
    if (!formKeys.includes(key)) {
      result[key] = (initialValues as any)[key];
    }
  });

  return result;
}
