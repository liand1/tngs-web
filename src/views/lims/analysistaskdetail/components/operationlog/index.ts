import { TableColumnsType } from "ant-design-vue";

import { useRender } from "@/components/Table";


// 定义表格列
export const columns: TableColumnsType = [
  {
    title: "操作时间",
    dataIndex: "createTime",
    key: "createTime",
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
    width: 150,
  },
  {
    title: "操作人",
    dataIndex: "userName",
    key: "userName",
    width: 150,
  },
  {
    title: "操作",
    dataIndex: "subType",
    key: "subType",
    width: 150,
  },
  {
    title: "操作结果",
    dataIndex: "success",
    key: "success",
    slots: {
      customRender: "success",
    },
    width: 200,
  },
  {
    title: "事件描述",
    dataIndex: "action",
    key: "action",
    width: 200,
  },
  {
    title: "备注",
    dataIndex: "extra",
    key: "extra",
  },
];
