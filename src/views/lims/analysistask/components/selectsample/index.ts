import { useRender } from "@/components/Table";
import { TableColumnsType } from "ant-design-vue";
import { CheckTypeEnumMap, SampleStatusEnumMap, SampleTypeEnumMap, SourceTypeEnumMap, SampleCheckReagent } from "@/enums/customEnum";
import { formatToDateTime } from "@/utils/dateUtil";

export const columns: TableColumnsType = [
  // {
  //   title: '样本ID',
  //   dataIndex: 'id',
  //   width: 80,

  // },
  {
    title: '样本原编号',
    dataIndex: 'sourceCode',
    width: 130,
  },
  {
    title: '样本编号',
    dataIndex: 'sampleCode',
    width: 180,
  },
  {
    title: '芯片数据文件',
    dataIndex: 'socDataFileName',
    width: 400,
  },

  {
    title: "来源",
    dataIndex: "createType",
    width: 130,
    customRender: ({ text }) => {
      return SourceTypeEnumMap[text]
    }
  },
  {
    title: "防错标签",
    dataIndex: "failSafeTag",
    width: 130,
  },
  {
    title: '样本类型',
    dataIndex: 'sampleType',
    width: 150,
    customRender: ({ text }) => {
      return SampleTypeEnumMap[text];
    }
  },
  {
    title: '检测项目',
    dataIndex: 'checkType',
    width: 150,
    customRender: ({ text }) => {
      return CheckTypeEnumMap[text];
    }
  },
  {
    title: '检测试剂',
    dataIndex: 'checkReagent',
    width: 150,
    customRender: ({ text }) => {
      return text ? SampleCheckReagent[text] : '';
    }
  },
  {
    title: '样本状态',
    dataIndex: 'sampleStatus',
    width: 100,
    customRender: ({ text }) => {
      return SampleStatusEnumMap[text];
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    customRender: ({ text }) => {
      return text ? formatToDateTime(text) : '-';
    }
  }
];