import { useRender } from "@/components/Table";


// 表格列定义
export const columns = [
  {
    title: "序号",
    dataIndex: "id",
    key: "id",
    width: 80,
  },
  {
    title: "版本号",
    dataIndex: "versionNumber",
    key: "versionNumber",
    width: 120,
  },
  {
    title: "更新时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: "更新内容",
    dataIndex: "updateContent",
    key: "updateContent",
  },
];