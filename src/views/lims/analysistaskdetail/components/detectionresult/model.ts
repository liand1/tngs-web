import { BasicColumn } from "@/components/Table";
import { ByLabelEnumMap, PathogenTypeEnumMap, virulenceTypeEnumMap } from "@/enums/customEnum";
import { scientificToPower } from "@/utils/custom";
import { isNumber } from "@/utils/is";

/**
 * 检测结果列定义
 */
export const columns: BasicColumn[] = [
  {
    title: "样本编号",
    dataIndex: "sampleCode",
    key: "sampleCode",


  },
  {
    title: "报告区域",
    dataIndex: "byLabel",
    key: "byLabel",

    slots: {
      customRender: 'byLabel'
    }
  },
  {
    title: "初始报告区域",
    dataIndex: "initialByLabel",
    key: "initialByLabel",

    slots: {
      customRender: 'initialByLabel'
    }
  },
  {
    title: "病原体中文名",
    dataIndex: "pathogenCnSname",
    key: "pathogenCnSname",
  },
  // {
  //   title: "株系/血清型",
  //   dataIndex: "strain",
  //   key: "strain",

  // },
  {
    title: "病原体类型",
    dataIndex: "pathogenType",
    key: "pathogenType",
  },
  {
    title: "reads",
    dataIndex: "reads",
    key: "reads",

  },
  {
    title: "均一化reads(突变频率%)",
    dataIndex: "levellingReads",
    key: "levellingReads",
    width: 200,
    slots: {
      customRender: 'levellingReads'
    },
    // customRender: ({ text }) => {
    //   //右括号去掉
    //   if (!isNaN(text)) {
    //     return Number(text) <= 1 ? 1 : Number(text)
    //   }

    //   const reads = text.slice(0, text.indexOf('('))
    //   const mutationRate = text.slice(text.indexOf('('))
    //   return Number(reads) > 1 ? `${reads}(${mutationRate})` : `1${mutationRate}`
    // }
  },
  {
    title: "致病性分类 ",
    dataIndex: "virulenceType",
    key: "virulenceType",
    customRender: ({ text }) => {
      return text == 0 ? '-' : virulenceTypeEnumMap[text]
    }
  },
  {
    title: "水控均一化reads",
    dataIndex: "waterControlRpm",
    key: "waterControlRpm",
  },

  {
    title: "背景均一化reads数",
    dataIndex: "backgroundReads",
    key: "backgroundReads",
  },

  {
    title: "同批最大检出RPM",
    dataIndex: "batchMaxOutRpm",
    key: "batchMaxOutRpm",
  },
  {
    title: "病原体英文名",
    dataIndex: "pathogenEnSname",
    key: "pathogenEnSname",

  },
  {
    title: "中文属名",
    dataIndex: "pathogenCnGname",
    key: "pathogenCnGname",

  },
  {
    title: "英文属名",
    dataIndex: "pathogenEnGname",
    key: "pathogenEnGname",

  },

  {
    title: "微生物估测浓度等级",
    dataIndex: "forecastConc",
    key: "forecastConc",
    // customRender: ({ text }) => {
    //   return text ? scientificToPower(text) : ''
    // }
  },
  {
    title: "相关亚型",
    dataIndex: "subtype",
    key: "subtype",
  },
  {
    title: "相关病原体",
    dataIndex: "subPathogen",
    key: "subPathogen",
  },
  {
    title: "多引物情况",
    dataIndex: "multiprimer",
    key: "multiprimer",

  },
  {
    title: "该病原同批检出数量",
    dataIndex: "sameBatchOuts",
    key: "sameBatchOuts",
  },
  // {
  //   title: "病原体注释 ",
  //   dataIndex: "pathogenComments",
  //   key: "pathogenComments",
  //   width: 500
  // },
];



// 导出统一枚举映射
export const byLabelMap = ByLabelEnumMap;
export const pathogenTypeMap = PathogenTypeEnumMap; 