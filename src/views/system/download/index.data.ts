import { useRender } from "@/components/Table";


// 表格列定义
export const columns = [
  {
    title: "来源",
    dataIndex: "source",
    key: "source",
    width: 120,
  },
  {
    title: "任务名称",
    dataIndex: "taskName",
    key: "taskName",
    width: 200,
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    width: 180,
    customRender: ({ text }) => {
      return useRender.renderDate(text);
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    width: 80,
  },
];