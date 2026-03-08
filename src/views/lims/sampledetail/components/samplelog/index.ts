import { TableColumnsType } from "ant-design-vue";
import { LogItem } from "./model";
import { useRender } from "@/components/Table";




// 表格列配置
export const columns: TableColumnsType<LogItem> = [
  {
    title: "操作时间",
    dataIndex: "createTime",
    key: "createTime",
    customRender: ({ text }) => {
      return useRender.renderDate(text)
    },
  },
  {
    title: "操作人",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "操作",
    dataIndex: "subType",
    key: "subType",
  },
  {
    title: "事件描述",
    dataIndex: "action",
    key: "action",
  },
];